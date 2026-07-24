import { Fragment, useEffect, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import "../style/signup_login.css";

export default function Display_doctor()
{
    const [doctorData,setdoctorData]=useState([]);
    const navigate = useNavigate();
    const [mode, setMode] = useState(localStorage.getItem("mode")||"Light");

    useEffect(()=>{ 
        getDoctorData(); 

        const toggle_mode = () => { 
          setMode(localStorage.getItem("mode"))  
        };

        window.addEventListener("mode-change", toggle_mode);
        return () => {
          window.removeEventListener("mode-change", toggle_mode)
        };

    },[]);

    async function getDoctorData(){
      let doctors_data = await fetch("http://localhost:3533/doctors");
      doctors_data = await doctors_data.json();
      console.log(doctors_data);
      
      if(doctors_data.success)
      {
        setdoctorData(doctors_data.result);
      }
    }
    return(
        
         <div className={`doctor-container ${mode === "Dark"?"dark":""}`}>
        <h2 className={`title ${mode === "Dark"?"dark":""}`}>Available Doctors</h2>

        <div className="doctor-grid">
          {
            doctorData && doctorData.map((item,index) => (
              <Fragment key={item._id}>

                <div className={`doctor-card ${mode === "Dark"?"dark":""}`}>
                  <h3>{item.speciality}</h3>
                  <img src="https://static.vecteezy.com/system/resources/thumbnails/026/375/249/small/ai-generative-portrait-of-confident-male-doctor-in-white-coat-and-stethoscope-standing-with-arms-crossed-and-looking-at-camera-photo.jpg" alt="doctor" className="doctor-img"/>
                  <p><b>Speciality:</b> {item.name}</p>
                  <p><b>Contact:</b> {item.contact}</p>
                  <p><b>Gender:</b> {item.gender}</p>
                  <p><b>Address:</b> {item.address}</p>
                  <p><b>Available Date:</b> {item.date}</p>
                  <p><b>Time:</b> {`${item.start_time} - ${item.end_time}`}</p>
                  <button onClick={ ()=>{navigate("/book_appointments")}} className="bookbtn">Book Appointment</button>
                </div>
              </Fragment>
            ))
          }
        </div>
    </div>
    )
}