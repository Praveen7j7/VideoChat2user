import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
// import Peer from 'simple-peer';
// Use CDN if local import fails
const Peer = window.SimplePeer || window.Peer ;//|| require('simple-peer')

const SocketContext = createContext();

const socket = io('http://localhost:7000');
// const socket = io('https://warm-wildwood-81069.herokuapp.com');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    console.log('window.crypto available:', !!window.crypto);
    console.log('crypto.getRandomValues available:', !!window.crypto?.getRandomValues);
    console.log('Secure context:', window.isSecureContext);
    console.log('global defined:', !!window.global);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        console.log('Media stream obtained:', !!currentStream);
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);
      });

    socket.on('me', (id) => {
      console.log('Received socket ID:', id);
      setMe(id);
    });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      console.log('Received call from:', from, callerName);
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      socket.off('me');
      socket.off('callUser');
    };
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    try {
      console.log('Creating Peer in answerCall, initiator: false, stream:', !!stream);
      const peer = new Peer({ initiator: false, trickle: false, stream });
      console.log('Peer created successfully in answerCall:', peer);
      peer.on('signal', (data) => {
        console.log('Emitting answerCall signal:', data);
        socket.emit('answerCall', { signal: data, to: call.from });
      });
      peer.on('stream', (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });
      peer.on('error', (err) => {
        console.error('Peer error (answerCall):', err);
      });
      peer.signal(call.signal);
      connectionRef.current = peer;
    } catch (err) {
      console.error('Error creating Peer in answerCall:', err);
    }
  };

  const callUser = (id) => {
    try {
      console.log('Creating Peer in callUser, initiator: true, stream:', !!stream);
      const peer = new Peer({ initiator: true, trickle: false, stream });
      console.log('Peer created successfully in callUser:', peer);
      peer.on('signal', (data) => {
        console.log('Emitting callUser signal:', data);
        socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
      });
      peer.on('stream', (currentStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }
      });
      peer.on('error', (err) => {
        console.error('Peer error (callUser):', err);
      });
      socket.on('callAccepted', (signal) => {
        console.log('Received callAccepted signal:', signal);
        setCallAccepted(true);
        peer.signal(signal);
      });
      connectionRef.current = peer;
    } catch (err) {
      console.error('Error creating Peer in callUser:', err);
    }
  };

  const leaveCall = () => {
    setCallEnded(true);
    setCallAccepted(false);
    if (connectionRef.current) {
      connectionRef.current.destroy();
      connectionRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };