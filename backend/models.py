from datetime import datetime, timezone
import re

from pydantic import field_validator
from sqlalchemy import Column, JSON, UniqueConstraint
from sqlmodel import Field, Relationship, SQLModel


def now_utc():
    return datetime.now(timezone.utc)


class CourseBase(SQLModel):
    title: str = Field(min_length=1, max_length=200)
    category: str = Field(min_length=1, max_length=100)
    popular: bool = False
    description: str = Field(min_length=1)
    instructor: str = Field(min_length=1, max_length=100)
    duration: str = Field(min_length=1, max_length=50)
    students: int = Field(default=0, ge=0)
    rating: float = Field(default=0, ge=0, le=5)
    image: str = Field(min_length=1, max_length=50)
    lesson: int = Field(default=1, ge=1)
    what_you_will_learn: list[str] = Field(default_factory=list)


class Course(CourseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    what_you_will_learn: list[str] = Field(default_factory=list, sa_column=Column(JSON))

    enrollments: list["Enrollment"] = Relationship(back_populates="course")
    progress_records: list["CourseProgress"] = Relationship(back_populates="course")


class CourseCreate(CourseBase):
    pass


class CourseRead(CourseBase):
    id: int


class CourseUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    category: str | None = Field(default=None, min_length=1, max_length=100)
    popular: bool | None = None
    description: str | None = Field(default=None, min_length=1)
    instructor: str | None = Field(default=None, min_length=1, max_length=100)
    duration: str | None = Field(default=None, min_length=1, max_length=50)
    students: int | None = Field(default=None, ge=0)
    rating: float | None = Field(default=None, ge=0, le=5)
    image: str | None = Field(default=None, min_length=1, max_length=50)
    lesson: int | None = Field(default=None, ge=1)
    what_you_will_learn: list[str] | None = None


class UserBase(SQLModel):
    email: str = Field(min_length=5, max_length=255)
    name: str | None = Field(default=None, max_length=100)
    bio: str | None = Field(default=None, max_length=500)
    avatar_url: str | None = Field(default=None, max_length=500)

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, value):
        email = value.strip().lower()
        pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
        if not re.match(pattern, email):
            raise ValueError("Enter a valid email address")
        return email


class User(UserBase, table=True):
    __tablename__ = "users"
    __table_args__ = (UniqueConstraint("email", name="unique_user_email"),)

    id: int | None = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=now_utc)

    enrollments: list["Enrollment"] = Relationship(back_populates="user")
    progress_records: list["CourseProgress"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    pass


class UserRead(UserBase):
    id: int
    created_at: datetime


class OTPRequest(SQLModel):
    email: str = Field(min_length=5, max_length=255)
    name: str | None = Field(default=None, max_length=100)

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, value):
        return UserBase.email_must_be_valid(value)


class OTPVerify(SQLModel):
    email: str = Field(min_length=5, max_length=255)
    otp: str = Field(min_length=6, max_length=6)

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, value):
        return UserBase.email_must_be_valid(value)

    @field_validator("otp")
    @classmethod
    def otp_must_be_digits(cls, value):
        if not value.isdigit():
            raise ValueError("OTP must contain only digits")
        return value


class OTPRequestRead(SQLModel):
    message: str
    user_id: int
    is_new_user: bool
    dev_otp: str | None = None


class OTPVerifyRead(SQLModel):
    message: str
    user: UserRead


class Enrollment(SQLModel, table=True):
    __tablename__ = "enrollments"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="unique_user_course_enrollment"),
    )

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    course_id: int = Field(foreign_key="course.id")
    enrolled_at: datetime = Field(default_factory=now_utc)

    user: User = Relationship(back_populates="enrollments")
    course: Course = Relationship(back_populates="enrollments")


class EnrollmentCreate(SQLModel):
    user_id: int = Field(gt=0)


class EnrollmentRead(SQLModel):
    id: int
    user_id: int
    course_id: int
    enrolled_at: datetime


class CourseProgress(SQLModel, table=True):
    __tablename__ = "course_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "course_id", name="unique_user_course_progress"),
    )

    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    course_id: int = Field(foreign_key="course.id")
    completed_lessons: int = Field(default=0, ge=0)
    progress_percentage: float = Field(default=0, ge=0, le=100)
    updated_at: datetime = Field(default_factory=now_utc)

    user: User = Relationship(back_populates="progress_records")
    course: Course = Relationship(back_populates="progress_records")


class ProgressUpdate(SQLModel):
    completed_lessons: int = Field(ge=0)


class ProgressRead(SQLModel):
    id: int
    user_id: int
    course_id: int
    completed_lessons: int
    progress_percentage: float
    updated_at: datetime
