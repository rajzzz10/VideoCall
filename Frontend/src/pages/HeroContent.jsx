import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Features from './Features';

const HeroContent = () => {
  return (
    <Box sx={{ 
      flex: '0 0 50%',
      textAlign: { xs: 'center', md: 'left' },
      width: { xs: '100%', md: '50%' }
    }}>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem', lg: '4rem' },
            fontWeight: 'bold',
            color: '#fff',
            mb: 3,
            lineHeight: 1.2
          }}
        >
          Connect Instantly,
          <br />
          <span style={{ color: '#4CC9F0' }}>Meet Virtually</span>
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#94A3B8',
            mb: 4,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            maxWidth: { xs: '100%', md: '90%' }
          }}
        >
          Experience seamless video calls with crystal clear quality and advanced features designed for modern communication.
        </Typography>
      </motion.div>

      <Features />
    </Box>
  );
};

export default HeroContent;