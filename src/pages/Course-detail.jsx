import {useEffect, useState} from "react"
import {enrollInCourse, getCourseProgress, updateCourseProgress} from "../api.js"

function courseDetails({
    course,
    isLoggedIn,
    currentUser,
    setMyCourses,
    myCourses,
    progressByCourse,
    setProgressByCourse,
    onBack,
}) {
    const alreadyEnrolled = myCourses.some(item => item.id === course.id)
    const [enrolled, setEnrolled] = useState(alreadyEnrolled)
    const [progress, setProgress] = useState(progressByCourse[course.id] || null)
    const [message, setMessage] = useState("")

    useEffect(() => {
        setEnrolled(alreadyEnrolled)
        setProgress(progressByCourse[course.id] || null)
        setMessage("")
    }, [alreadyEnrolled, course.id, progressByCourse])

    useEffect(() => {
        if (!currentUser || !enrolled) {
            return
        }

        getCourseProgress(currentUser.id, course.id)
            .then(setProgress)
            .catch(() => {})
    }, [currentUser, course.id, enrolled])

    async function enroll() {
        if (!isLoggedIn || !currentUser) {
            alert("please Login")
            return
        }

        if (enrolled) {
            return
        }

        try {
            await enrollInCourse(course.id, currentUser.id)
            setEnrolled(true)
            if (!alreadyEnrolled) {
                setMyCourses([...myCourses, course])
            }
            setMessage("You are enrolled in this course.")
        } catch (error) {
            alert(error.message)
        }
    }

    async function completeLesson() {
        if (!currentUser || !enrolled) {
            return
        }

        const nextLessons = Math.min((progress?.completed_lessons || 0) + 1, course.lesson)

        try {
            const updated = await updateCourseProgress(currentUser.id, course.id, nextLessons)
            setProgress(updated)
            setProgressByCourse({
                ...progressByCourse,
                [course.id]: updated,
            })
        } catch (error) {
            alert(error.message)
        }
    }

    const learnItems = course.whatYouWillLearn || []

    return (
        <nav className="box1">
            <button className="back-button" onClick={onBack}>← Back</button>
            <div className="box2">
                <div>
                    <h1>{course.image}</h1>
                </div>
                <div className="box3">
                    <div>
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                    </div>

                    <button onClick={enroll}>{!enrolled ? "Enroll" : "Enrolled"}</button>
                    {message && <p>{message}</p>}

                    <div className="box4">
                        <h2>👤instructor: {course.instructor}</h2>
                        <h2>⏲Duration:{course.duration}</h2>
                        <h2>⭐️Rating:{course.rating}</h2>
                    </div>
                </div>
            </div>

            <div className="box5">
                <div>
                    <h2>What You'll Learn</h2>
                    {learnItems.map(item => <p key={item}>✔︎{item}</p>)}
                </div>
                <div>
                    <h2>Course info</h2>
                    <p>👥{course.students} students joined</p>
                    <p>📚{course.lesson} lessons</p>
                    {enrolled && (
                        <div className="progress-box">
                            <h2>Your progress</h2>
                            <p>{progress ? `${progress.completed_lessons} / ${course.lesson} lessons` : `0 / ${course.lesson} lessons`}</p>
                            <p>{progress ? `${progress.progress_percentage}% complete` : "0% complete"}</p>
                            <button
                                onClick={completeLesson}
                                disabled={progress && progress.completed_lessons >= course.lesson}
                            >
                                Mark lesson complete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default courseDetails;
