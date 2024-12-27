import { Server } from "socket.io"

let connections = {}
let messages = {}
let timeonline = {}

export const connectToSocket = (server) => {
    const io = new Server(server);
    io.on('connection', (socket) => {
        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = []
            }
            connections[path].push(socket.id);

            timeonline[socket.id] = new Date();

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }

            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length;++a) {
                    io.to(socket.id).emit('chat-message', messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }
        })

        socket.on("signal", (told, message) => {
            io.to(told).emit('signal', socket.id, message)
        })

        // socket.on("chat-message", (data, sender) => {
        //     const [matchingRoom , found] = Object.entries(connections).reduce(([matchingRoom,isFound],[roomKey , roomValue])=>{

        //         if (!isFound && roomValue.includes(socket.id)) {
        //            return [roomKey , true] 
        //         }

        //         return [room , isFound] ; 

        //     }, ['',false]);
        //     if (found === true) {
        //         if (messages[matchingRoom] === undefined) {
        //             messages[matchingRoom] = []
        //         }
        //         messages(matchingRoom).push({'sender':sender , 'data' : data , 'socket-id-sector' : socket.id})
        //         console.log("message");
                
        //     }
        // })

        socket.on("disconnect")
    })
    return io;
}