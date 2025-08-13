import React, { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('https://video-chat-server-egmo.onrender.com/');

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState(null);
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState('');

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        if (isMounted) {
          setStream(currentStream);
          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
        }
      })
      .catch((err) => {
        // Handle error or permissions
        // Optionally set an error state here
      });

    socket.on('me', (id) => {
      if (isMounted) setMe(id);
    });

    socket.on('callUser', ({ from, name: callerName, signal }) => {
      if (isMounted) setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      isMounted = false;
      socket.off('me');
      socket.off('callUser');
    };
  }, []);

  const answerCall = useCallback(() => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  }, [call, stream]);

  const callUser = useCallback((id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  }, [me, name, stream]);

  const leaveCall = useCallback(() => {
    setCallEnded(true);

    if (connectionRef.current) {
      connectionRef.current.destroy();
    }

    // Optionally, you can clean up streams here
    window.location.reload();
  }, []);

  const contextValue = {
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
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };