import {categories} from "../../data/courses.js";
import {useState} from "react";
import CourseDetails from "../Course-detail.jsx";

function Home({
    isLoggedIn,
    currentUser,
    setMyCourses,
    myCourses,
    courses,
    coursesError,
    selectedCourseId,
    setSelectedCourseId,
    progressByCourse,
    setProgressByCourse,
}) {
    const [category, setCategory] = useState(null)
    const [search, setsearch] = useState("")

    const filteredCourses = category === "All" ? courses : courses.filter(course => course.category === category);
    const searchedResults = search ? courses.filter(course => course.title.toLowerCase().includes(search.toLowerCase())) : [];
    const clickedCourse = courses.find(course => course.id === selectedCourseId)

    return (
        <nav>
            {clickedCourse ? (
                <CourseDetails
                    course={clickedCourse}
                    isLoggedIn={isLoggedIn}
                    currentUser={currentUser}
                    setMyCourses={setMyCourses}
                    myCourses={myCourses}
                    progressByCourse={progressByCourse}
                    setProgressByCourse={setProgressByCourse}
                    onBack={() => setSelectedCourseId(null)}
                />
            ) : (
                <div>
                    <div className="home">
                        <h1 className="intro">Learn Build Become</h1>
                        <p style={{ fontSize: "25px" }} className="description">Learn practical skills from expert-led courses and build projects that prepare you for the real world</p>
                    </div>
                    <div className="search-container">
                        <div className="search">
                            <input className="input" type="text" placeholder="Search for courses..." value={search} onChange={(e)=> setsearch(e.target.value)}/>
                        </div>
                        <div className="results">
                            {searchedResults.map(course => (
                                <div key={course.id}>
                                    <button onClick={() => {
                                        setSelectedCourseId(course.id)
                                        setsearch("")
                                    }}>{course.title}</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {coursesError && <p className="message">Could not load courses from the backend. Make sure FastAPI is running.</p>}
                    {!coursesError && courses.length === 0 && <p className="message">Loading courses...</p>}

                    <div className="categories">
                        <div className="category">
                            {categories.map((item) => (
                                <button key={item} style={{ color: "white" }} onClick={() => setCategory(category === item ? null : item)}>
                                    {item}{category === item ? " ▼" : " ►"}
                                </button>
                            ))}
                        </div>

                        <div className="courses">
                            {category === null ? (
                                <p className="message" style={{ color: "white" }}> ◀︎Please select a category to view courses or<br /> Search Courses</p>
                            ) : (
                                filteredCourses.map(course => (
                                    <div key={course.id}>
                                        <button style={{ color: "yellow" }} onClick={() => setSelectedCourseId(course.id)}>{course.title}</button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Home
