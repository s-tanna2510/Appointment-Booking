import { useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Mainpage(){

    const navigate = useNavigate();

    useEffect(()=>{
        if(localStorage.getItem('login'))
        {
            navigate("/doctors");
        }
    });

    return(
        <div className="mainpage">
            <video src='../main_page.MOV' autoPlay loop muted className='bg_video'></video>
            <Link to="/book_appointments" className="main-book">Book Appointment</Link>
        </div>
    )
}