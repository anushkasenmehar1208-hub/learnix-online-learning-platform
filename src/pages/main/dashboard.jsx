import { useMemo } from "react"

function Dashboard({ currentUser, myCourses, progressByCourse }) {
    const totalCourses = myCourses.length

    const completedCourses = myCourses.filter((course) => {
        const progress = progressByCourse[course.id]
        return progress && progress.progress_percentage >= 100
    }).length

    const overallProgress = useMemo(() => {
        if (totalCourses === 0) return 0

        const totalProgress = myCourses.reduce((sum, course) => {
            return sum + (progressByCourse[course.id]?.progress_percentage || 0)
        }, 0)

        return Math.round(totalProgress / totalCourses)
    }, [myCourses, progressByCourse, totalCourses])

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Student Dashboard</h1>
                <p>
                    Welcome back, {currentUser?.name || "Student"} 👋
                </p>
            </div>

            <div className="dashboard-stats">
                <div className="dashboard-card">
                    <h3>Enrolled Courses</h3>
                    <strong>{totalCourses}</strong>
                </div>

                <div className="dashboard-card">
                    <h3>Completed Courses</h3>
                    <strong>{completedCourses}</strong>
                </div>

                <div className="dashboard-card">
                    <h3>Overall Progress</h3>
                    <strong>{overallProgress}%</strong>
                </div>
            </div>

            <div className="dashboard-courses">
                <h2>My Learning</h2>

                {myCourses.length === 0 ? (
                    <p>You haven't enrolled in any courses yet.</p>
                ) : (
                    myCourses.map((course) => {
                        const progress = progressByCourse[course.id]
                        const percentage = progress?.progress_percentage || 0

                        return (
                            <div className="dashboard-course" key={course.id}>
                                <div>
                                    <h3>{course.title}</h3>
                                    <p>{course.instructor}</p>
                                </div>

                                <div className="dashboard-progress">
                                    <div className="progress-info">
                                        <span>Progress</span>
                                        <span>{percentage}%</span>
                                    </div>

                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}

export default Dashboard