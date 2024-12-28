import { Server } from "socket.io"

let connections = {}
let messages = {}
let timeonline = {}

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['*'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        socket.on("join-call", (path) => {
            if (connections[path] === undefined) {
                connections[path] = []
            }
            //connections[path] : This stores the list of socket IDs (users) currently in the call identied by path .
            connections[path].push(socket.id); //The current user's unique socket.id is added to the list of participants in the call

            timeonline[socket.id] = new Date(); //timeonline : A dictionary that maps each user's socket.id to the time they joined the call

            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }
            //For every participant already in the call ( connections[path] ):
            //A user-joined event is emitted to their socket.
            //The new user's socket.id is sent along with the updated list of all participants( connections[path] ).

            if (messages[path] !== undefined) { //messages[path] : A dictionary where each call ( path ) stores its chat history
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit('chat-message', messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }

                //If there are any previous messages for the call:
                //The server sends each message to the new user ( socket.id ) using the chatmessage event.
                //This allows the new user to see the chat history upon joining.
            }
        })

        socket.on("signal", (told, message) => {
            io.to(told).emit('signal', socket.id, message)
        })

        socket.on("chat-message", (data, sender) => {

            //data: The actual message content (e.g., "Hello everyone!") and sender: The name or identifier of the user sending the message (e.g., "User A").

            const [matchingRoom, found] = Object.entries(connections).reduce(([matchingRoom, isFound], [roomKey, roomValue]) => {

                //Object.entries(connections):Converts the connections object into an array of [key, value] pairs.
                //reduce():This iterates over the array to find the room where the sender’s socket.id is listed.
                //matchingRoom: Keeps track of the room where the user is found.
                //isFound: A boolean (true or false) to indicate whether the user is found.
                //roomKey: The name of the room (e.g., "room123").
                //roomValue: An array of socket IDs in that room (e.g., ['userA_socket_id', 'userB_socket_id']).

                if (!isFound && roomValue.includes(socket.id)) {
                    return [roomKey, true]
                }

                return [room, isFound];

            }, ['', false]);
            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }
                messages(matchingRoom).push({ 'sender': sender, 'data': data, 'socket-id-sender': socket.id })
                console.log("message", key, ":", sender, data);
                connections[matchingRoom].forEach(element => {
                    io.to(element).emit('chat-message', data, sender, socket.id)
                });
            }
        })

        socket.on("disconnect", () => {
            var diffTime = Math.abs(timeonline[socket.id] - new Date());

            var key;

            for (const [room, person] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
                for (let a = 0; a < person.length; ++person) {
                    if (person[a] === socket.id) {
                        key = room;
                        for (let a = 0; a < connections[key].length;
                            ++a
                        ) {
                            io.to(connections[key][a].emit('user-left', socket.id))
                        }

                        var index = connections[key].indexOf(socket.id);

                        connections[key].splice(index, 1)

                        if (connections[key].length === 0) {
                            delete connections[key];
                        }
                    }
                }
            }
        })
    })
    return io;
}