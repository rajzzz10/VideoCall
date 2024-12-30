import { Button, TextField } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react'

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

    let [video, setVideo] = useState();

    let [audio, setAudio] = useState();

    let [screen, setScreen] = useState();

    let [showModal, setShowModal] = useState();

    let [screenAvailable, setScreenAvailable] = useState();

    let [messages, setMessages] = useState([]);

    let [newMessages, setNewMessages] = useState(0);

    let [askForUsername, setAskForUsername] = useState(true);

    let [username, setUsername] = useState('');

    const videoRef = useRef([]);

    let [vidoes, setVideos] = useState([])

    const getPermissions = async ()=>{
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({video : true});

            if(videoPermission){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({audio : true});

            if(audioPermission){
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false)
            }

            if(videoAvailable || audioAvailable){
                const userMediaStream = await navigator.mediaDevices.getUserMedia({video : videoAvailable , audio : audioAvailable})

                if(userMediaStream) { 
                    window.localStream = userMediaStream ; 
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = userMediaStream;
                    }
                }
            }

        } catch (error) {
            
        }
    }

    useEffect(()=>{
        getPermissions();
    },[])

    return (
        <div>
            {askForUsername === true ?
                <div>
                    <h2>Enter the lobby</h2>
                    <TextField id="outlined-basic" label="Username" value={username}  variant="outlined" onChange={(e)=>setUsername(e.target.value)}/>
                    <Button variant="contained">Join</Button>

                    <div>
                        <video ref={localVideoRef} autoPlay muted></video>
                    </div>

                </div>
                : <> </>}
        </div>
    )
}

export default VideoMeetComponent
