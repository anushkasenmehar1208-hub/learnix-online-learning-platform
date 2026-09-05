import logo from "../../assets/logo.png"
import profileimage from "../../assets/profileimage.jpg"

function Navbar({
    setlogin,
    isLoggedIn,
    setmyCourses,
    goHome,
    goDashboard,
    darkMode,
    setDarkMode,
}) {
    return (
        <nav className="navbar">
            <div className="left_bar">
                <div className="left_left_bar">
                    <button onClick={goHome}>
                        <img
                            src={logo}
                            alt="Learnix logo"
                        />
                    </button>

                    <button onClick={goHome}>
                        <h2>Learnix</h2>
                    </button>
                </div>

                <div className="left_right_bar">
                    <button onClick={goHome}>
                        Home
                    </button>

                    <button onClick={goDashboard}>
                        Dashboard
                    </button>

                    <button onClick={setmyCourses}>
                        My courses
                    </button>
                </div>
            </div>

            <div className="right_bar">
                <div className="right_left_bar">
                    <button
                        className={
                            !darkMode ? "theme-active" : ""
                        }
                        onClick={() => setDarkMode(false)}
                    >
                        ☀
                    </button>

                    <button
                        className={
                            darkMode ? "theme-active" : ""
                        }
                        onClick={() => setDarkMode(true)}
                    >
                        ☽
                    </button>

                    <button>
                        🔔
                    </button>
                </div>

                <div className="right_right_bar">
                    {isLoggedIn ? (
                        <button>
                            <img
                                src={profileimage}
                                alt="Profile"
                            />
                        </button>
                    ) : (
                        <button
                            onClick={() => setlogin(true)}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar