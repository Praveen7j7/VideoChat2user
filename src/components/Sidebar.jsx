import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@mui/material';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@mui/icons-material';
import { SocketContext } from '../Context';

function Sidebar({ children }) {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState('');

  return (
    <Container
      sx={{
        width: { xs: '80%', md: 600 },
        margin: '35px 0',
        padding: 0,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: '10px 20px',
          border: '2px solid black',
        }}
      >
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          noValidate
          autoComplete="off"
        >
          <Grid
            container
            sx={{
              width: '100%',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Grid item xs={12} md={6} sx={{ padding: 2 }}>
              <Typography gutterBottom variant="h6">
                Account Info
              </Typography>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <CopyToClipboard text={me}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<Assignment fontSize="large" />}
                  sx={{ mt: 2 }}
                >
                  Copy Your ID
                </Button>
              </CopyToClipboard>
            </Grid>
            <Grid item xs={12} md={6} sx={{ padding: 2 }}>
              <Typography gutterBottom variant="h6">
                Make a call
              </Typography>
              <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
              {callAccepted && !callEnded ? (
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<PhoneDisabled fontSize="large" />}
                  fullWidth
                  onClick={leaveCall}
                  sx={{ mt: 2 }}
                >
                  Hang Up
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Phone fontSize="large" />}
                  fullWidth
                  onClick={() => callUser(idToCall)}
                  sx={{ mt: 2 }}
                >
                  Call
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
        {children}
      </Paper>
    </Container>
  );
}

export default Sidebar;