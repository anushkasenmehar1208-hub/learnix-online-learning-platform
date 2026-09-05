import logo from "../../assets/logo.png"
function Footer() {
    return (
        <footer className="Footer">
            <div>
                <img src={logo} alt="Learnix Logo" />
                <h3>Learnix</h3>
            </div>
            
            <div>
                <p>Courses</p>
                <p>About</p>
                <p>Contact</p>
                <p>Privacy Policy</p>
                <p>FAQ</p>
            </div>
            <p>© 2026 Learnix. All rights reserved.</p>
        </footer>
    )
}
export default Footer;