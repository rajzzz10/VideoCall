import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';
import HeroContent from './HeroContent';
import AnimatedIllustration from './AnimatedIllustration';

const LandingPage = () => {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%',
      bgcolor: '#0A1929',
      overflow: 'hidden'
    }}>
      <Navbar />

      <Container maxWidth="xl" sx={{ 
        mt: { xs: 4, md: 8 },
        px: { xs: 2, sm: 4, md: 6 }
      }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'space-between',
          minHeight: { md: 'calc(100vh - 200px)' }
        }}>
          <HeroContent />
          <AnimatedIllustration />
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;