import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';

const MotionBox = motion(Box);

const NotFound = () => {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
            mt: 4
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{ 
              fontSize: '10rem', 
              fontWeight: 700, 
              color: 'primary.light',
              lineHeight: 1,
              mb: 2
            }}
          >
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            The page you're looking for doesn't exist or has been moved.
          </Typography>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
          >
            Back to Home
          </Button>
        </Paper>
      </Container>
    </MotionBox>
  );
};

export default NotFound;