import express from "express";
import { CollectionName, connection, DoctorCollection, NCollectionName } from "./dbconfig.js";
import cors from 'cors';
import jwt, { decode } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { ObjectId } from "mongodb";

const app = express();

app.use(express.json());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(cookieParser());

function verifyJWT(req,resp,next){
    const token = req.cookies['token'];
    jwt.verify(token,"tokenkey",(error,decoded)=>{
        if(error)
        {
            return resp.json({
                message : "invalid token",
                success : false
            });
        }
        // console.log(decoded);
        next();
    })
    console.log("cookie test=",req.cookies['token']);
    
}

app.post("/signup",async (req,resp)=>{
    // const db = await connection();
    // const collection = await db.collection(CollectionName);
    // const result = await collection.insertOne(req.body);
    // // resp.send("Working.........")
    // if(result)
    // {
    //     console.log(req.body);
    //     resp.json({ message:"new data entered", success:true, result })
    // }
    // else
    // {
    //     resp.json({ message:"data not entered", success:false})
    //     // console.log("false");
    // }

    try 
    {
        const userdata = req.body;
        // if (!userdata.name?.trim() || !userdata.email?.trim() || !userdata.password?.trim() ) 
        // {
        //     return resp.status(400).json({
        //             message: "Fill all the fields",
        //             success: false
        //         });
        // }
            const db = await connection();
            const collection = await db.collection(CollectionName);
            const result = await collection.insertOne(userdata);

            if(result) {
                console.log(result);
                jwt.sign(userdata,"tokenkey",{expiresIn:"2d"},(error,token)=>
                {  
                    console.log("token="+token);//{ id: result.insertedId, email: userdata.email }
                    resp.json({ message:"new user entered", success:true, result,token });
                })
            } else {
                resp.status(500).json({ message:"user not entered", success:false });
            }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})


app.post("/login",async (req,resp)=>{
    try 
    {
        const userdata = req.body;
        const db = await connection();
        const collection = await db.collection(CollectionName);
        const result = await collection.findOne({email:userdata.email,password:userdata.password});

        if(result) {
            console.log(result);
            jwt.sign(userdata,"tokenkey",{expiresIn:"1h"},(error,token)=>
            {  
                resp.cookie("token", token, {
                    httpOnly: true, // false for token visible in application/cookie
                    secure: false,       // true in production (HTTPS)
                    sameSite: "strict",
                    maxAge: 60 * 60 * 1000
                });
                resp.json({ message:"data matched--Login Complete", success:true });
            })
            // console.log(req.body+"token="+token);
        } else {
            resp.status(500).json({ message:"data not matched", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.get("/verify",async (req,resp)=>{// for checking token and move to login
    try 
    {
        const token = req.cookies.token;
        if(!token)
        { return resp.status(401).json({success : false })}

        // console.log("logincheck");
        

        jwt.verify(token,"tokenkey",(err,token)=>{
            if(err)
            { resp.clearCookie("token");  return resp.status(401).json({message:"name",success : false }) }

            console.log("login");
            
           return  resp.json({success : true })
        })
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.put("/forget_password",verifyJWT,async (req,resp)=>{
    try {
        const db = await connection();
        const collection = await db.collection(CollectionName);

        const { email,password }= req.body;
        const updatedata = { $set :{password}}
        const existsemail = await collection.findOne({email});

        if(!existsemail)
        {
            return resp.status(400).json({ message:"Email doesn't Exists enter correct email", success:false });
        }

        const result = await collection.updateOne({email},updatedata);

        if(result.modifiedCount === 1) {
            console.log(req.body);
            resp.json({ message:"password updated", success:true, result });
        } else {
            resp.status(500).json({ message:"password not updated", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.post("/book_appointment",verifyJWT,async (req,resp)=>{
    try {
        const db = await connection();
        const collection = await db.collection(NCollectionName);
        const result = await collection.insertOne(req.body);

        if(result) {
            console.log(req.body);
            resp.json({ message:"new appointment booked", success:true, result });
        } else {
            resp.status(500).json({ message:"appointment not booked", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.get("/appointments",verifyJWT,async (req,resp)=>{
    try 
    {
        const db = await connection();
        const collection = await db.collection(NCollectionName);
        const result = await collection.find(req.body).toArray();
        
        if(result) {
            console.log(req.body);
            resp.json({ message:"get booked data appointment", success:true, result });
        } else {
            resp.status(500).json({ message:"not get booked appointment", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.delete("/appointments/:id",verifyJWT,async (req,resp)=>{
    try 
    {
        const db = await connection();
        const id = req.params.id;
        const collection = await db.collection(NCollectionName);
        const result = await collection.deleteOne({_id: new ObjectId(id)});

        if(result.deletedCount === 1) {
            console.log(req.body);
            resp.json({ message:"appointment deleted", success:true, result });
        } else {
            resp.status(500).json({ message:"appointment not deleted", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.get("/appointment/:id",verifyJWT,async (req,resp)=>{// for populate data for a appointment
    try 
    {
        const db = await connection();
        const id = req.params.id;
        const collection = await db.collection(NCollectionName);
        const result = await collection.findOne({_id: new ObjectId(id)});

        if(result) {
            // console.log(req.body);
            resp.json({ message:"populate appointment data", success:true, result });
        } else {
            resp.status(500).json({ message:"not populate appointment data", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.put("/update_appointment/:id",verifyJWT,async (req,resp)=>{// for update appointment
    try 
    {
        const db = await connection();
        const collection = await db.collection(NCollectionName);

        const id = req.params.id;
        const {_id,...fields} = req.body;
        const updatedata = {$set:fields};
        console.log(fields);
        
        const result = await collection.updateOne({_id: new ObjectId(id)},updatedata);

        if(result.modifiedCount === 1) {
            console.log(req.body);
            resp.json({ message:"appointment updated", success:true, result });
        } else {
            resp.status(500).json({ message:"appointment not updated", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})

app.get("/doctors",async (req,resp)=>{
    try 
    {
        const db = await connection();
        const collection = await db.collection(DoctorCollection);
        const result = await collection.find({}).toArray();

        if(result) {
            console.log(req.body);
            resp.json({ message:"get doctor data", success:true, result });
        } else {
            resp.status(500).json({ message:"not get doctor data", success:false });
        }
    } 
    catch(err) 
    {
        console.error(err);
        resp.status(500).json({ message:"Server error", success:false });
    }
})



app.get("/",(req,resp)=>{
    resp.send(`<h1>Main part</h1><br/>
        <a href='/login'>Go to Login</a><br/>
        <a href='/contact'>Go to contact</a>`);
})

app.listen(3533,() => console.log("Server running on 3533"));