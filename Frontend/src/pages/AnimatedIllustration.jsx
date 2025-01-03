import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import image1 from '../assets/HeroImg.jpeg'

const AnimatedIllustration = () => {
  return (
    <Box 
      sx={{ 
        flex: '0 0 50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: { xs: '100%', md: '50%' },
        mt: { xs: 4, md: 0 }
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: '500px' }}
      >
        <motion.div
          animate={{ 
            y: ['-5px', '5px', '-5px'],
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            component="img"
            src={image1}
            alt="Video Call Illustration"
            sx={{
              width: '100%',
              height: 'auto',
              maxWidth: { xs: '300px', sm: '400px', md: '450px' },
              display: 'block',
              margin: '0 auto',
              filter: 'drop-shadow(0px 10px 20px rgba(0, 0, 0, 0.25))'
            }}
          />
        </motion.div>
      </motion.div>
    </Box>
  );
};

export default AnimatedIllustration;