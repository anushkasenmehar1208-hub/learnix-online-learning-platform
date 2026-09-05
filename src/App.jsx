import Navbar from "./pages/main/Navbar.jsx"
import Home from "./pages/main/Home.jsx"
import Footer from "./pages/main/footer.jsx"
import Dashboard from "./pages/main/dashboard.jsx"
import Authentication from "./pages/Authentication.jsx"
import { useEffect, useState } from "react"
import { getCourses, getUserCourses, getUserProgress } from "./api.js"

import "./App.css"

function App() {
    const [clicked_login, setlogin] = useState(false)
    const [myCourses, setMyCourses] = useState([])
    const [progressByCourse, setProgressByCourse] = useState({})
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [clicked_myCourses, setmyCourses] = useState(false)
    const [clicked_dashboard, setDashboard] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [courses, setCourses] = useState([])
    const [coursesError, setCoursesError] = useState("")
    const [selectedCourseId, setSelectedCourseId] = useState(null)
    const [darkMode, setDarkMode] = useState(
        () => localStorage.getItem("learnix-dark") === "true"
    )

    useEffect(() => {
        document.body.classList.toggle("dark-mode", darkMode)
        localStorage.setItem("learnix-dark", darkMode)
    }, [darkMode])

    useEffect(() => {
        getCourses()
            .then((data) => {
                setCourses(data)
                setCoursesError("")
            })
            .catch((error) => {
                setCoursesError(
                    error.message || "Could not load courses from the backend"
                )
            })
    }, [])

    useEffect(() => {
        const savedUser = localStorage.getItem("learnix-user")

        if (!savedUser) {
            return
        }

        try {
            const user = JSON.parse(savedUser)
            setCurrentUser(user)
            setisLoggedIn(true)
        } catch {
            localStorage.removeItem("learnix-user")
        }
    }, [])

    useEffect(() => {
        if (!currentUser) {
            setMyCourses([])
            setProgressByCourse({})
            return
        }

        Promise.all([
            getUserCourses(currentUser.id),
            getUserProgress(currentUser.id),
        ])
            .then(([enrolledCourses, progressList]) => {
                setMyCourses(enrolledCourses)

                const progressMap = {}

                progressList.forEach((item) => {
                    progressMap[item.course_id] = item
                })

                setProgressByCourse(progressMap)
            })
            .catch(() => {
                setMyCourses([])
                setProgressByCourse({})
            })
    }, [currentUser])

    function handleLogin(user) {
        setCurrentUser(user)
        setisLoggedIn(true)

        localStorage.setItem(
            "learnix-user",
            JSON.stringify(user)
        )

        setlogin(false)
    }

    function openCourse(courseId) {
        setSelectedCourseId(courseId)
        setmyCourses(false)
        setDashboard(false)
    }

    function goHome() {
        setSelectedCourseId(null)
        setmyCourses(false)
        setDashboard(false)
    }

    function goDashboard() {
        setSelectedCourseId(null)
        setmyCourses(false)
        setDashboard(true)
    }

    function goMyCourses() {
        setSelectedCourseId(null)
        setDashboard(false)
        setmyCourses(true)
    }

    return (
        <div>
            {!clicked_login ? (
                <div>
                    <Navbar
                        setlogin={setlogin}
                        isLoggedIn={isLoggedIn}
                        setmyCourses={goMyCourses}
                        goHome={goHome}
                        goDashboard={goDashboard}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                    />

                    <hr />

                    {clicked_dashboard ? (
                        <Dashboard
                            currentUser={currentUser}
                            myCourses={myCourses}
                            progressByCourse={progressByCourse}
                        />
                    ) : clicked_myCourses ? (
                        <div className="mycourses">
                            <div className="smallbox">
                                <h1>MY COURSES</h1>

                                {!isLoggedIn && (
                                    <p>
                                        Please login to see your enrolled
                                        courses.
                                    </p>
                                )}

                                {isLoggedIn &&
                                    myCourses.length === 0 && (
                                        <p>
                                            You have not enrolled in any
                                            courses yet.
                                        </p>
                                    )}

                                {myCourses.map((course) => (
                                    <div key={course.id}>
                                        <button
                                            onClick={() =>
                                                openCourse(course.id)
                                            }
                                        >
                                            {course.title}

                                            {progressByCourse[course.id]
                                                ? ` — ${progressByCourse[course.id].progress_percentage}%`
                                                : ""}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <hr />

                            <Home
                                isLoggedIn={isLoggedIn}
                                currentUser={currentUser}
                                setMyCourses={setMyCourses}
                                myCourses={myCourses}
                                courses={courses}
                                coursesError={coursesError}
                                selectedCourseId={selectedCourseId}
                                setSelectedCourseId={setSelectedCourseId}
                                progressByCourse={progressByCourse}
                                setProgressByCourse={
                                    setProgressByCourse
                                }
                            />
                        </div>
                    )}

                    <Footer />
                </div>
            ) : (
                <Authentication
                    setlogin={setlogin}
                    setisLoggedIn={setisLoggedIn}
                    onLogin={handleLogin}
                />
            )}
        </div>
    )
}

export default App