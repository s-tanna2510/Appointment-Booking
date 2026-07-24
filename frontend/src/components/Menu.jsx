import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
export default function Menu(){

    const [Login,setLogin]=useState(localStorage.getItem('login'));
    const [mode ,setMode] = useState(localStorage.getItem("mode") || "Light");  
    const navigate = useNavigate();

    useEffect(()=>{
        const forshowlinkbeforerefreash = ()=>{
            setLogin(localStorage.getItem('login'));
        }

        window.addEventListener("localstorage-change",forshowlinkbeforerefreash)
        return ()=>{
            window.removeEventListener("localstorage-change",forshowlinkbeforerefreash)
        }
    },[]);//use Effect listen for costom event dispachevent

    useEffect(() => {
        document.body.className = mode === "Dark" ? "dark" : "";
    }, [mode]);

    function changeMode(){

        const toggle_mode = (mode  === "Dark"? "Light" : "Dark");
        setMode(toggle_mode);
        localStorage.setItem("mode",toggle_mode);
        window.dispatchEvent(new Event('mode-change'));
    }

    function handleLogout(){
        localStorage.removeItem('login');
        setLogin(null);
        navigate("/login");
        // <Navigate to={"/login"} replace />;
    }

    return(
        <nav className="menu">   
        <div className="appointment">Appointments</div> 

            <div className="menulink">
                <Link to="/login" className="link">Login</Link>
                <Link to="/signup" className="link">SignUp</Link>
                <Link to="/doctors" className="link">Doctors</Link>

                {
                    Login?
                    <>
                        <Link to="/appointments" className="link">Appointments</Link>
                        <Link to="/book_appointments" className="link-book">Book Appointment</Link>
                        <button onClick={handleLogout} className="logout">Logout</button>
                        <button onClick={changeMode} className={`mode ${mode === "Dark" ? "dark":""}`}>{mode==="Dark"? (<><i class="fa-solid fa-sun"></i> Light </>) : (<>  <i class="fa-solid fa-moon"></i> Dark </>)}</button>
                    </>:null
            
                }
            </div> 
        </nav>
    )
}








