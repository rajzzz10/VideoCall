import React from 'react';
import { AppBar, Button, Container, Box } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ background: 'transparent', boxShadow: 'none', py: 2 }}>
      <Container maxWidth="xl">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: { xs: 'center', sm: 'flex-end' },
          gap: { xs: 1, sm: 2 },
          flexWrap: 'wrap'
        }}>
          <Button 
            variant="outlined" 
            color="primary"
            sx={{ 
              borderColor: '#4CC9F0',
              color: '#4CC9F0',
              '&:hover': { borderColor: '#4CC9F0', background: 'rgba(76, 201, 240, 0.1)' },
              minWidth: { xs: '120px', sm: 'auto' }
            }}
          >
            Join as Guest
          </Button>
          <Button 
            variant="outlined"
            sx={{ 
              borderColor: '#F72585',
              color: '#F72585',
              '&:hover': { borderColor: '#F72585', background: 'rgba(247, 37, 133, 0.1)' },
              minWidth: { xs: '120px', sm: 'auto' }
            }}
          >
            Sign In
          </Button>
          <Button 
            variant="contained"
            sx={{ 
              bgcolor: '#4361EE',
              '&:hover': { bgcolor: '#3730A3' },
              minWidth: { xs: '120px', sm: 'auto' }
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;