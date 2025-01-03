import { Badge, Button, IconButton, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import '../css/videoComponent.css';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEnd from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ScreenShareIcon from '@mui/icons-material/ScreenShare'
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'


const server_url = "http://localhost:8000"; // Backend running locally



var connections = {};



const peerConfigConnections = {
    'iceServers': [
        { 'urls': 'stun:stun.l.google.com:19302' }
    ]
}

const VideoMeetComponent = () => {
    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);

    let [audioAvailable, setAudioAvailable] = useState(true);

    let [video, setVideo] = useState([]);

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setShowModal] = useState(false);

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [message, setMessage] = useState('')

    let [newMessages, setNewMessages] = useState();

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState('');

    const videoRef = useRef([]);

    let [videos, setVideos] = useState([])

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });

            if (videoPermission) {
                setVideoAvailable(true);
            } else {
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });

            if (audioPermission) {
                setAudioAvailable(true);
            } else {
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false)
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable })

                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoRef.current) {
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        getPermissions();
    }, [])

    let getDislayMedia = () => { //If screen is true, the navigator.mediaDevices.getDisplayMedia API is used to capture the screen. This API returns a MediaStream object
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { console.log('Screen sharing stream:', stream); })
                    .catch((e) => console.log(e))
            }
        }
    }

    useEffect(() => { //Triggers getUserMedia whenever the states change (e.g., user toggles mute or camera).
        if (video !== undefined && audio !== undefined) {
            getUserMedia()
        }
    }, [audio, video])

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    }

    let getUserMediaSuccess = (stream) => { //if user mutes call then it will ensure it send only video not audio and viceversa
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) {
            console.log(e);
        }
        window.localStream = stream;
        localVideoRef.current.srcObject = stream;

        for (let id in connections) {
            if (id === socketIdRef.current) continue;

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);

            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e); }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            localVideoRef.current.srcObject = window.localStream;

            for (let id in connections) {
                connections[id].addStream(window.localStream)
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description).then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                            .catch(e => console.log(e))
                    })
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio }) //ensures that either video or audio is available and enabled by the user.
                .then(getUserMediaSuccess) //todo getUserMediaSuccess
                .then((stream) => { })
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = localVideoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop())  //If both video and audio are unavailable, it stops all existing media tracks to ensure no data is transmitted.
            } catch (error) {

            }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())  // Stop current tracks
        } catch (e) { console.log(e) }

        window.localStream = stream // Set screen-sharing stream as the local stream
        localVideoRef.current.srcObject = stream // Update the local video element

        for (let id in connections) {
            if (id === socketIdRef.current) continue

            connections[id].addStream(window.localStream) // Add screen stream to WebRTC peer connection

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)  // When sharing stops, reset the `screen` state

            try {
                let tracks = localVideoRef.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoRef.current.srcObject = window.localStream

            getUserMedia() // Revert to camera/mic stream

        })
    }


    //todo
    let gotMessageFromServer = (fromId, message) => {
        const signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === 'offer') {
                            connections[fromId].createAnswer().then((description) => {
                                connections[fromId].setLocalDescription(description)
                                    .then(() => {
                                        socketRef.current.emit('signal', fromId, JSON.stringify({ sdp: connections[fromId].localDescription }));
                                    }).catch(e => console.log('Error setting local description:', e));
                            }).catch(e => console.log('Error creating answer:', e));
                        }

                        // Process queued ICE candidates
                        if (connections[fromId].queuedCandidates) {
                            connections[fromId].queuedCandidates.forEach(candidate => {
                                connections[fromId].addIceCandidate(new RTCIceCandidate(candidate))
                                    .catch(e => console.log('Error adding queued ICE candidate:', e));
                            });
                            connections[fromId].queuedCandidates = [];
                        }
                    }).catch(e => console.log('Error setting remote description:', e));
            }

            if (signal.ice) {
                if (connections[fromId].remoteDescription) {
                    connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice))
                        .catch(e => console.log('Error adding ICE candidate:', e));
                } else {
                    // Queue the ICE candidate
                    if (!connections[fromId].queuedCandidates) {
                        connections[fromId].queuedCandidates = [];
                    }
                    connections[fromId].queuedCandidates.push(signal.ice);
                }
            }
        }
    };



    let connectToSocketServer = () => {

        socketRef.current = io.connect(server_url, { secure: false })

        socketRef.current.on('signal', gotMessageFromServer) // EX - (WebRTC Connection) STEP F6 - The other user receives Rahul’s offer and responds with their own information (called an SDP answer).

        socketRef.current.on("connect", () => {

            socketRef.current.emit('join-call', window.location.href)

            // EX - (JOINCALL)STEP F1 - When Rahul opens the meeting link, the frontend sends a "join-call" request to the server.
            //window.location.href is the meeting room URL (e.g., https://example.com/room123). It acts as the room identifier.This tells the server, "Rahul wants to join this specific meeting room."

            socketIdRef.current = socketRef.current.id

            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients) => {
                // id-new user joined
                // clients - All clients in the room
                //  EX - (JOINCALL)STEP F4 -  When Rahul joins, his socket.id is added to the clients list. Everyone in the room gets this updated list of participants. 
                clients.forEach((socketListId) => {


                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections) //It's a WebRTC object used to handle video and audio calls.Think of it as a direct communication line between two users.

                    // EX - (WebRTC Connection)STEP F1 -For every user in the room (clients), a new connection is created.
                    // socketListId is the unique socket.id of another user in the room.

                    connections[socketListId].onicecandidate = (event) => {
                        if (event.candidate !== null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }

                    connections[socketListId].onaddstream = (event) => {
                        setVideos((prevVideos) => {
                            // Check if the video already exists in the current state
                            const videoExists = prevVideos.some(video => video.socketId === socketListId);

                            if (videoExists) {
                                // Update the stream for the existing video entry
                                return prevVideos.map(video =>
                                    video.socketId === socketListId
                                        ? { ...video, stream: event.stream }
                                        : video
                                );
                            } else {
                                // Add a new video entry if it doesn't exist
                                return [
                                    ...prevVideos,
                                    {
                                        socketId: socketListId,
                                        stream: event.stream,
                                        autoPlay: true,
                                        playsinline: true,
                                    },
                                ];
                            }
                        });
                    };


                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                        //(WebRTC Connection)STEP F2 - addStream adds Rahul’s video and audio to the connection so others can see and hear him.
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream)
                    }
                })

                if (id === socketIdRef.current) { //id is userjoinedId and id2 are idInConnections
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue

                        try {
                            connections[id2].addStream(window.localStream)
                        } catch (e) { }

                        connections[id2].createOffer().then((description) => { // EX - (WebRTC Connection) STEP F3 - Rahul creates an "offer" for another user (id2).
                            connections[id2].setLocalDescription(description)
                                .then(() => {
                                    socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].LocalDescription }))
                                    //EX - (WebRTC Connection) STEP F4 -The offer is sent to the server through the "signal" event.
                                })
                                .catch(e => console.log(e));
                        })
                    }
                }
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();

        let dst = oscillator.connect(ctx.createMediaStreamDestination());

        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enables: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement('canvas'), { width, height });

        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enables: false })
    }


    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [
            ...prevMessages,
            { sender: sender, data: data }
        ]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let connect = () => {
        setAskForUsername(false);
        getMedia();
    }

    let handleVideo = () => {
        setVideo(!video)
    }

    let handleAudio = () => {
        setAudio(!audio)
    }

    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])

    let handleScreen = () => {
        setScreen(!screen)
    }

    let sendMessage = () => {
        socketRef.current.emit('chat-message', message, username);
        setMessage('');
    }

    let handleEndCall = ()=>{
        try {
            let tracks = localVideoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            window.location.href = "/" ;
        } catch (e) {
            
        }
    }

    return (
        <div>
            {askForUsername === true ?
                <div>
                    <h2>Enter the lobby</h2>
                    <TextField id="outlined-basic" label="Username" value={username} variant="outlined" onChange={(e) => setUsername(e.target.value)} />
                    <Button variant="contained" onClick={connect}>Connect</Button>

                    <div>
                        <video ref={localVideoRef} autoPlay muted></video>
                    </div>

                </div>
                : <div className='meetVideoContainer'>
                    {showModal ? (
                        <div className="chatRoom">

                            <div className="chatContainer">

                                <h1>Chat Box</h1>

                                <div className="chattingDisplay">
                                    {messages.length !== 0 ? messages.map((item, index) => {

                                        console.log(messages)
                                        return (
                                            <div style={{ marginBottom: "20px" }} key={index}>
                                                <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                                <p>{item.data}</p>
                                            </div>
                                        )
                                    }) : <p>No Messages Yet</p>}
                                </div>
                                <div className="chattingArea">
                                    <TextField value={message} onChange={e => setMessage(e.target.value)} id='outlined-basic' label='Message here' />
                                    <Button variant='contained' onClick={sendMessage}>SEND</Button>
                                </div>
                            </div>
                        </div>
                    ) : <></>}
                    <div className="buttonContainer">
                        <IconButton style={{ color: 'white' }} onClick={handleVideo}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton onClick={handleEndCall} style={{ color: 'red' }} >
                            <CallEnd />
                        </IconButton>

                        <IconButton style={{ color: 'white' }} onClick={handleAudio}>
                            {(audio === true) ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: 'white' }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <> </>}

                        <Badge badgeContent={newMessages} onChange={() => setMessages(e.target.value)} max={999} color='secondary'>
                            <IconButton onClick={() => { setShowModal(!showModal) }} style={{ color: 'white' }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>

                    <video className='meetUserVideo' ref={localVideoRef} autoPlay muted ></video>
                    <div className='conferenceView'>
                        {videos.map((video) => (
                            <div key={video.socketId} >
                                <video
                                    data-socket={video.socketId}
                                    ref={ref => {
                                        if (ref && video.stream) {
                                            ref.srcObject = video.stream
                                        }
                                    }}
                                    autoPlay
                                ></video>
                            </div>

                        ))}
                    </div>

                </div>
            }
        </div>
    )
}

export default VideoMeetComponent
