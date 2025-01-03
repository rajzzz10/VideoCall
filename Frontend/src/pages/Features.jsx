import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import VideocamIcon from '@mui/icons-material/Videocam';
import GroupIcon from '@mui/icons-material/Group';
import SecurityIcon from '@mui/icons-material/Security';

const Features = () => {
  const features = [
    { icon: <VideocamIcon />, text: "HD Video" },
    { icon: <GroupIcon />, text: "Group Calls" },
    { icon: <SecurityIcon />, text: "Secure" }
  ];

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' },
      gap: { xs: 3, sm: 4 }, 
      mt: { xs: 4, sm: 6 }
    }}>
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              color: '#94A3B8'
            }}
          >
            {feature.icon}
            <Typography>{feature.text}</Typography>
          </Box>
        </motion.div>
      ))}
    </Box>
  );
};

export default Features;