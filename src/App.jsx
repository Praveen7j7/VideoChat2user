import React from 'react';
import { Typography, AppBar, Box } from '@mui/material';

import VideoPlayer from './components/VideoPlayer';
import Sidebar from './components/Sidebar';
import Notifications from './components/Notifications';
import './styles.css';

function App() {
//   return (
//     <Box
//       sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         width: '100%',
//       }}
//     >
//       <AppBar
//         position="static"
//         color="inherit"
//         sx={{
//           borderRadius: 2,
//           margin: '30px 100px',
//           display: 'flex',
//           flexDirection: 'row',
//           justifyContent: 'center',
//           alignItems: 'center',
//           width: { xs: '90%', md: '600px' },
//           border: '2px solid black',
//         }}
//       >
//         <Typography variant="h2" align="center">
//           Video Chat
//         </Typography>
//       </AppBar>
//       <VideoPlayer />
//       <Sidebar>
//         <Notifications />
//       </Sidebar>
//     </Box>
//   );

return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <AppBar position="static" color="inherit" sx={{ borderRadius: 2, margin: '30px 100px', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: { xs: '90%', md: '600px' }, border: '2px solid black' }}>
        <Typography variant="h2" align="center">Video Chat</Typography>
      </AppBar>
      <VideoPlayer />
      <Sidebar>
        <Notifications />
      </Sidebar>
    </Box>
  );
}

export default App;