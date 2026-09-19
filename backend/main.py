import os
import secrets
from datetime import timedelta

from fastapi import FastAPI, HTTPException, Path
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, select

from database import engine
from seed import seed_courses
from models import (
    Course,
    CourseCreate,
    CourseProgress,
    CourseRead,
    CourseUpdate,
    Enrollment,
    EnrollmentCreate,
    EnrollmentRead,
    OTPRequest,
    OTPRequestRead,
    OTPVerify,
    OTPVerifyRead,
    ProgressRead,
    ProgressUpdate,
    User,
    UserCreate,
    UserRead,
    now_utc,
)


app = FastAPI(title="Learnix API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://learnix-online-learning-platform-8u.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DEV_AUTH = os.getenv("LEARNIX_DEV_AUTH", "true").lower() == "true"
OTP_EXPIRE_MINUTES = 10
otp_store = {}


@app.on_event("startup")
def create_tables():
    SQLModel.metadata.create_all(engine)
    seed_courses()


@app.get("/")
def home():
    return {
        "message": "Learnix backend connected to PostgreSQL!"
    }


def get_course_or_404(session, course_id):
    course = session.get(Course, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


def get_user_or_404(session, user_id):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def get_user_by_email(session, email):
    return session.exec(select(User).where(User.email == email)).first()


@app.get("/courses", response_model=list[CourseRead])
def get_courses():
    with Session(engine) as session:
        return session.exec(select(Course).order_by(Course.id)).all()


@app.get("/courses/{course_id}", response_model=CourseRead)
def get_course(course_id: int = Path(gt=0)):
    with Session(engine) as session:
        return get_course_or_404(session, course_id)


@app.post("/courses", response_model=CourseRead, status_code=201)
def create_course(course: CourseCreate):
    with Session(engine) as session:
        db_course = Course.model_validate(course)
        session.add(db_course)
        session.commit()
        session.refresh(db_course)
        return db_course


@app.put("/courses/{course_id}", response_model=CourseRead)
def update_course(course_update: CourseUpdate, course_id: int = Path(gt=0)):
    with Session(engine) as session:
        db_course = get_course_or_404(session, course_id)
        course_data = course_update.model_dump(exclude_unset=True)

        for key, value in course_data.items():
            setattr(db_course, key, value)

        session.add(db_course)
        session.commit()
        session.refresh(db_course)
        return db_course


@app.delete("/courses/{course_id}")
def delete_course(course_id: int = Path(gt=0)):
    with Session(engine) as session:
        course = get_course_or_404(session, course_id)
        session.delete(course)
        session.commit()
        return {"message": "Course deleted successfully"}


@app.post("/users", response_model=UserRead, status_code=201)
def create_user(user: UserCreate):
    with Session(engine) as session:
        existing_user = get_user_by_email(session, user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="User already exists")

        db_user = User.model_validate(user)
        session.add(db_user)
        session.commit()
        session.refresh(db_user)
        return db_user


@app.get("/users/{user_id}", response_model=UserRead)
def get_user(user_id: int = Path(gt=0)):
    with Session(engine) as session:
        return get_user_or_404(session, user_id)


@app.post("/auth/request-otp", response_model=OTPRequestRead)
def request_otp(request: OTPRequest):
    with Session(engine) as session:
        user = get_user_by_email(session, request.email)
        is_new_user = user is None

        if not user:
            user = User(
                email=request.email,
                name=request.name or request.email.split("@")[0],
            )
            session.add(user)
            session.commit()
            session.refresh(user)

        code = f"{secrets.randbelow(1000000):06d}"
        otp_store[request.email] = {
            "code": code,
            "expires_at": now_utc() + timedelta(minutes=OTP_EXPIRE_MINUTES),
        }

        return {
            "message": "OTP generated for development login",
            "user_id": user.id,
            "is_new_user": is_new_user,
            "dev_otp": code if DEV_AUTH else None,
        }


@app.post("/auth/verify-otp", response_model=OTPVerifyRead)
def verify_otp(request: OTPVerify):
    otp_data = otp_store.get(request.email)
    if not otp_data:
        raise HTTPException(status_code=400, detail="Please request a new OTP")

    if otp_data["expires_at"] < now_utc():
        otp_store.pop(request.email, None)
        raise HTTPException(status_code=400, detail="OTP expired")

    if otp_data["code"] != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    otp_store.pop(request.email, None)

    with Session(engine) as session:
        user = get_user_by_email(session, request.email)
        if not user:
            user = User(email=request.email, name=request.email.split("@")[0])
            session.add(user)
            session.commit()
            session.refresh(user)

        return {
            "message": "Login successful",
            "user": user,
        }


@app.post("/courses/{course_id}/enroll", response_model=EnrollmentRead, status_code=201)
def enroll_in_course(enrollment: EnrollmentCreate, course_id: int = Path(gt=0)):
    with Session(engine) as session:
        get_course_or_404(session, course_id)
        get_user_or_404(session, enrollment.user_id)

        existing_enrollment = session.exec(
            select(Enrollment).where(
                Enrollment.user_id == enrollment.user_id,
                Enrollment.course_id == course_id,
            )
        ).first()

        if existing_enrollment:
            raise HTTPException(status_code=400, detail="User is already enrolled in this course")

        db_enrollment = Enrollment(user_id=enrollment.user_id, course_id=course_id)
        session.add(db_enrollment)

        existing_progress = session.exec(
            select(CourseProgress).where(
                CourseProgress.user_id == enrollment.user_id,
                CourseProgress.course_id == course_id,
            )
        ).first()

        if not existing_progress:
            session.add(CourseProgress(user_id=enrollment.user_id, course_id=course_id))

        session.commit()
        session.refresh(db_enrollment)
        return db_enrollment


@app.get("/users/{user_id}/courses", response_model=list[CourseRead])
def get_user_courses(user_id: int = Path(gt=0)):
    with Session(engine) as session:
        get_user_or_404(session, user_id)
        statement = (
            select(Course)
            .join(Enrollment, Enrollment.course_id == Course.id)
            .where(Enrollment.user_id == user_id)
            .order_by(Course.id)
        )
        return session.exec(statement).all()


@app.get("/users/{user_id}/progress", response_model=list[ProgressRead])
def get_user_progress(user_id: int = Path(gt=0)):
    with Session(engine) as session:
        get_user_or_404(session, user_id)
        statement = (
            select(CourseProgress)
            .where(CourseProgress.user_id == user_id)
            .order_by(CourseProgress.course_id)
        )
        return session.exec(statement).all()


@app.get("/users/{user_id}/courses/{course_id}/progress", response_model=ProgressRead)
def get_course_progress(user_id: int = Path(gt=0), course_id: int = Path(gt=0)):
    with Session(engine) as session:
        get_user_or_404(session, user_id)
        get_course_or_404(session, course_id)

        progress = session.exec(
            select(CourseProgress).where(
                CourseProgress.user_id == user_id,
                CourseProgress.course_id == course_id,
            )
        ).first()

        if not progress:
            raise HTTPException(status_code=404, detail="Course progress not found")

        return progress


@app.put("/users/{user_id}/courses/{course_id}/progress", response_model=ProgressRead)
def update_course_progress(
    progress_update: ProgressUpdate,
    user_id: int = Path(gt=0),
    course_id: int = Path(gt=0),
):
    with Session(engine) as session:
        get_user_or_404(session, user_id)
        course = get_course_or_404(session, course_id)

        enrollment = session.exec(
            select(Enrollment).where(
                Enrollment.user_id == user_id,
                Enrollment.course_id == course_id,
            )
        ).first()

        if not enrollment:
            raise HTTPException(status_code=400, detail="Enroll in the course before updating progress")

        if progress_update.completed_lessons > course.lesson:
            raise HTTPException(status_code=400, detail="Completed lessons cannot be greater than total lessons")

        progress = session.exec(
            select(CourseProgress).where(
                CourseProgress.user_id == user_id,
                CourseProgress.course_id == course_id,
            )
        ).first()

        if not progress:
            progress = CourseProgress(user_id=user_id, course_id=course_id)

        progress.completed_lessons = progress_update.completed_lessons
        total_lessons = course.lesson or 1
        progress.progress_percentage = round((progress_update.completed_lessons / total_lessons) * 100, 2)
        progress.updated_at = now_utc()

        session.add(progress)
        session.commit()
        session.refresh(progress)
        return progress
