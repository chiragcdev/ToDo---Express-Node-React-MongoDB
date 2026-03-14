import express from 'express';
import cors from 'cors';
import { connection } from './dbconfig.js';
import { ObjectId } from 'mongodb';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// Middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: false }));

// Middleware to parse cookies
app.use(cookieParser());

// Post = Route to handle user registration
app.post("/signup", async (req, resp) => {
    const userData = req.body;
    //console.log(userData);
    if (userData.email && userData.password) {
        const db = await connection();
        const collection = await db.collection('users'); 
        const result = await collection.insertOne(userData);
        if (result) {
            jwt.sign(userData, 'Google', { expiresIn: '5d'}, (error, token) => {
                resp.send({
                    message: "User registered successfully",
                    success: true,
                    token: token
                });
            })
        } else {
            resp.send ({
                message: "Failed to register user",
                success: false
            })
        }        
    }
});


app.post("/login", async (req, resp) => {
    const userData = req.body;
    if (userData.email && userData.password) {
        const db = await connection();
        const collection = await db.collection('users'); 
        const user = await collection.findOne({ email: userData.email, password: userData.password });
        if (user) {
            jwt.sign(userData, 'Google', { expiresIn: '5d'}, (error, token) => {
                resp.send({
                    message: "User logged in successfully",
                    success: true,
                    token: token
                })
            })
        } else {
            resp.send ({
                message: "Invalid email or password",
                success: false
            })
        }
    } else {
        resp.send ({
            message: "Email and password are required",
            success: false
        })
    }
});



// Post = Route to handle adding a new todo item
app.post('/add-task', verifyJWTToken, async (req, resp) => {
    const db = await connection();
    const collection = await db.collection('todo'); 
    const result = await collection.insertOne(req.body);
    if (result) {
        resp.send ({
            message: "Todo item added successfully",
            success: true,
            data: result
        })
    } else {
        resp.send ({
            message: "Failed to add todo item",
            success: false
        })
    }
});

// Get = Route to handle fetching all todo items
app.get('/tasks', verifyJWTToken, async (req, resp) => {
    const db = await connection();  
    const collection = await db.collection('todo'); 
    const result = await collection.find().toArray();
    if (result) {
        resp.send ({
            message: "Todo items fetched successfully",
            success: true,
            result: result
        })
    } else {
        resp.send ({
            message: "Failed to fetch todo items",
            success: false
        })
    }
});




// Delete = Route to handle deleting a todo item by ID
app.delete('/delete/:id', verifyJWTToken, async (req, resp) => {
    const db = await connection();
    const id = req.params.id;
    const collection = await db.collection('todo'); 
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result) {
        resp.send ({
            message: "Todo item deleted successfully",
            success: true,
            result: result
        })
    } else {
        resp.send ({
            message: "Failed to delete todo item",
            success: false
        })
    }
});

// Delete = Route to handle deleting multiple todo items by IDs
app.delete('/delete-multiple', verifyJWTToken, async (req, resp) => {
    const db = await connection();
    const { ids } = req.body;
    const deleteTasksIds = ids.map((item) => new ObjectId(item));
    const collection = await db.collection('todo');
    const result = await collection.deleteMany({ _id: { $in: deleteTasksIds } });
    if (result) {
        resp.send ({
            message: "Todo items deleted successfully",
            success: true,
            result: result
        })
    } else {
        resp.send ({
            message: "Failed to delete todo items",
            success: false
        })
    }
});

// Get = Route to handle fetching a single todo item by ID (Update Request)
app.get('/task/:id', verifyJWTToken, async (req, resp) => {
    const db = await connection();
    const collection = await db.collection('todo'); 
    const id = req.params.id;
    const result = await collection.findOne({ _id: new ObjectId(id) });
    if (result) {
        resp.send ({
            message: "Todo items fetched successfully",
            success: true,
            result: result
        })
    } else {
        resp.send ({
            message: "Failed to fetch todo items",
            success: false
        })
    }
});


// Put = Route to handle updating a todo item by ID
app.put('/update-task', verifyJWTToken, async (req, resp) => {
    const db = await connection();
    const collection = await db.collection('todo'); 
    const {_id, ...fields} = req.body;
    const update = { $set: fields };
    const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);
    if (result) {
        resp.send ({
            message: "Todo item updated successfully",
            success: true,
            result: result
        })
    } else {
        resp.send ({
            message: "Failed to update todo item",
            success: false
        })
    }
});


// Middleware function to verify JWT token for Cookie-based authentication
// function verifyJWTToken(req, resp, next) {
//     console.log("Cookies:", req.cookies);
//     const token = req.cookies?.token; // Get token from cookies
//     if (!token) {
//         return resp.status(401).json({
//             success: false,
//             message: "No token provided"
//         });
//     }
//     jwt.verify(token, 'Google', (error, decoded) => {
//         if (error) {
//             return resp.status(401).json({
//                 success: false,
//                 message: "Invalid or expired token"
//             });
//         }
//         req.user = decoded;   // attach decoded payload
//         console.log("Decoded JWT:", decoded);
//         next();
//     });
// }

function verifyJWTToken(req, resp, next) {
    //  console.log("verifyJWTToken ", req.cookies['token']);
    const token = req.cookies['token'];
    jwt.verify(token, 'Google', (error, decoded) => {
        if(error){
            return resp.send({
                msg:"invalid token",
                success:false
            })
        }
         next()
    })  
}

app.listen(3200);