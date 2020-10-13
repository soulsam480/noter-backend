import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import socket from "socket.io";
import http from "http";
//todo route imports
import data from "./routes/data";
import register from "./routes/register";
import login from "./routes/login";
import token from "./routes/token";
import logout from "./routes/logout";
import getuserdata from "./routes/getuserdata"

const app = express()
const port = process.env.PORT || 4000;
app.use(cors(
    {
        origin: [
            "http://localhost:8080"
        ],
        credentials: true
    }
))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
//todo routes
app.use("/data", data)
app.use("/register", register)
app.use("/login", login)
app.use("/token", token)
app.use("/logout", logout)
app.use("/getuserdata", getuserdata)

const server = http.createServer(app);

// todo websockets
const io = socket(server, {
    path: "/socket"
})

io.on("connection", () => {
    console.log("on socket mode");
})

server.listen(port, () => {
    console.log(`app is listening on port ${port}`);

})