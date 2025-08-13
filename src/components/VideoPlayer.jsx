import React, { useContext, useEffect } from 'react';
import { Grid, Typography, Paper } from '@mui/material';
import { SocketContext } from '../Context';

function VideoPlayer() {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);

  // Attach stream to myVideo ref when stream is available
  useEffect(() => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
  }, [stream, myVideo]);

  return (
    <Grid
      container
      justifyContent="center"
      sx={{
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      {stream && (
        <Paper
          sx={{
            padding: '10px',
            border: '2px solid black',
            margin: '10px',
          }}
        >
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {name || 'Names'}
            </Typography>
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{
                width: '100%',
                maxWidth: 550,
              }}
            />
          </Grid>
        </Paper>
      )}
      {callAccepted && !callEnded && (
        <Paper
          sx={{
            padding: '10px',
            border: '2px solid black',
            margin: '10px',
          }}
        >
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              {call?.name || 'Name'}
            </Typography>
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{
                width: '100%',
                maxWidth: 550,
              }}
            />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
}

export default VideoPlayer;