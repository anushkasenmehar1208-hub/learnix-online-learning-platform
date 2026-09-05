import {useState} from "react";
import {requestOtp, verifyOtp} from "../api.js";

function Login ({setlogin, setisLoggedIn, onLogin}) {
    const [email, setEmail] = useState("")
    const pattern=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [otp,setotp]=useState("")
    const [showOtp, setShowOtp] = useState(false);
    const [devOtp, setDevOtp] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(){
        if (!pattern.test(email)) {
            alert("Enter a valid email");
            return
        }

        try {
            const data = await requestOtp(email)
            setShowOtp(true)
            setDevOtp(data.dev_otp || "")
            setError("")
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    async function submit_click() {
        if (otp.length!==6){
            alert("Please enter the 6 Digit otp")
            return
        }

        try {
            const data = await verifyOtp(email, otp)
            onLogin(data.user)
            setisLoggedIn(true)
            setlogin(false)
        } catch (verifyError) {
            alert(verifyError.message || "Invalid OTP")
        }
    }

    return(
        <div className="login" >
            {!showOtp ? (
                <div>
                    <h1>Login/sign Up</h1>
                    <input type="text" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <button onClick={handleSubmit}>▶</button>
                    {error && <p>{error}</p>}
                    <p>
                        <button onClick={() => setlogin(false)}>Back to home</button>
                    </p>
                </div>
            ):(
                <div>
                    <h1>Enter your OTP</h1>
                    {devOtp ? (
                        <p>Development OTP: {devOtp}<br/>Email sending is not configured yet, so the code is shown here.</p>
                    ) : (
                        <p>Enter the 6 digit code for this login.</p>
                    )}
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="enter the 6 digit code"
                        maxLength="6"
                        value={otp}
                        onChange={(e)=>setotp(e.target.value.replace(/\D/g, ""))}
                    />
                    <button onClick={submit_click}>submit</button>
                    {error && <p>{error}</p>}
                </div>
            )}
        </div>
    );
}

export default Login;
