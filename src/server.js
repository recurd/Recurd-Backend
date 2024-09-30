import express, { json, urlencoded } from "express"
import session from "express-session"
import dotenv from "dotenv"
dotenv.config()

import authRouter from "./routes/auth.js"
import accountRouter from "./routes/account.js"
import serviceRouter from "./routes/service/service.js"

const server = express();
const PORT = 3000;  // 0 for auto choose address

server.use(json());
server.use(urlencoded({extended:true}));

// Session
server.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // prevent race condition with parallel storing to sessions of the same user
    saveUninitialized: false, // allow newly created session to be stored
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        secret: false // true when we have HTTPS
    }
}))

server.get('/', (req, res) => {
    res.status(201).send("Hello!")
})

// Routes
server.use('/auth', authRouter)
server.use('/account', accountRouter)
server.use('/service', serviceRouter)

// 404
server.use((req, res) => {
    res.status(404).json({ "message": "Route not found" })
})

// Error handling
server.use((err, req, res, next) => {
    console.error('error', err)
    res.status(500).json({ "message": err?.message, "error": err })
})

const listener = server.listen(PORT, function(err) {
    console.log(`Listening on http://localhost:${listener.address().port}`)
})