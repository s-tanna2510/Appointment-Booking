import { Fragment, useEffect, useState } from "react"
import "../style/signup_login.css";
import { Link } from "react-router-dom";
import { createRoot } from "react-dom/client";


export default function Appointments(){
    const [appointmentsData,setappointmentsData]=useState([]);
    const [status,setStatus] = useState({});
    const [mode,setMode] = useState(localStorage.getItem("mode") || "Light");

    useEffect(()=>{  
        getappointmentsData(); 

        const toggle_mode = () => { 
          setMode(localStorage.getItem("mode"))  
        };

        window.addEventListener("mode-change", toggle_mode);
        return () => {
          window.removeEventListener("mode-change", toggle_mode)
        };
     },[]);

    function statuschange(id){
        setStatus(prev => ({...prev,[id]: "Visited"}));
        // document.getElementsByClassName("statusbutton").style.bgcolor = "visited";
    }

    async function getappointmentsData(){
        let result = await fetch("http://localhost:3533/appointments",{ 
            cache: "no-store", credentials: "include"
            
        })//Force fresh data (disable cache)
        result = await result.json();
        console.log(result);

        if(result.success)
        {  setappointmentsData(result.result);  }
    }

    async function deleteAppointment(id){
        
        let appointment_delete = await fetch(`http://localhost:3533/appointments/${id}`,{
            method:'DELETE',
            credentials : "include"
            })
        appointment_delete = await appointment_delete.json();
        console.log(appointment_delete);

        if(appointment_delete.success)
        { 
            alert("Are you sure for delete?....");
            getappointmentsData();  
        }
    }

    return(
        <div className="appointmentData">
           <h3 className={`title ${mode === "Dark"?"dark":""}`}>Patients Appointments</h3>
           <ul className="list-appointment">
                <li className="header-appointment">S.No</li>
                <li className="header-appointment">Name</li>
                <li className="header-appointment">Doctor Name</li>
                
                <li className="header-appointment">Speciality</li>
                <li className="header-appointment" >Appointment Date</li>
                <li className="header-appointment">Appointment Day</li>
                <li className="header-appointment">Time</li>
                <li className="header-appointment">Reason</li>
                <li className="header-appointment">Status</li>
                <li className="header-appointment">Action</li>

                {
                    appointmentsData && appointmentsData.map((item,index)=>(
                        <Fragment key={item._id}>
                
                            <li className={`item-appointment`}><b>{index+1}</b></li>
                            <li className="item-appointment">{item.name}</li>
                            <li className="item-appointment">{item.doctor}</li>
                            <li className="item-appointment">{item.speciality}</li>
                            <li className="item-appointment">{item.date}</li>
                            <li className="item-appointment">{item.day}</li>
                            <li className="item-appointment">{item.time}</li>
                            <li className="item-appointment">{item.reason}</li>
                            <li className="item-appointment"><button onClick={()=>statuschange(item._id)}
                             className={`statusbutton ${status[item._id] === "Visited" ? "visited" : ""}`}>{status[item._id] || "Pending"}</button></li>
                            <li className="item-appointment action">
                                <button onClick={()=>deleteAppointment(item._id)} className="deletebutton">Delete</button>
                                <Link to={`update/${item._id}`} className="updatebutton">Update</Link>
                            </li>

                        </Fragment>
                    ))
                }
           </ul>
        </div>
    )
}

// createRoot(document.getElementsByClassName("statusbutton").innerHTML = "visited").render(<statuschange/>);

// import { useState } from "react"

// export default function Appointments(){
//     const [appointmentData,setappointmentData] = useState({});

//     async function bookAppointment(event){
//         event.preventDefault();
//         console.log(appointmentData);

//         let result = await fetch("http://localhost:3533/book_appointment",{
//             method : 'POST',
//             body : JSON.stringify(appointmentData),
//             headers : {
//                 'Content-Type':'application/json'
//             }
//         })

//         result = await result.json();
//         if(result.success)
//         {   console.log("user appointment booked");  }
//     }

//     return(
//         <form onSubmit={bookAppointment}>
//             <h3>Book Appointment</h3>
//             <label>Your Name</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,name:event.target.value})}
//             type="text" placeholder="Enter Name" required></input>

//             <label>Contact No.</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,email:event.target.value})}
//             type="text" placeholder="Enter Email" required></input>

//             <label>Address</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,address:event.target.value})}
//             type="text" placeholder="Enter Address" required></input>

//             <label>Speciality</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,speciality:event.target.value})}
//             type="text" placeholder="select Speciality" required></input>

//             {/* <label>Doctor Name</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,doctor:event.target.value})}
//             type="text" placeholder="Doctor name" required></input>

//             <label>Appointment Date</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,date:event.target.value})}
//             type="date" placeholder="select date" required></input>

//             <label>Appointment Day</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,day:event.target.value})}
//             type="day" placeholder="select day" required></input>

//             <label>Appointment Time</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,time:event.target.value})}
//             type="time" placeholder="select time" required></input>

//             <label>Reason for Appointment</label>
//             <input onChange={(event)=>setappointmentData({...appointmentData,reason:event.target.value})}
//             type="text" placeholder="Enter Reason" required></input> */}

//             <button className="signupb">Book Appointment</button>
//         </form>
//     )
// }