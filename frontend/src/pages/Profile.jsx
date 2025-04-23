import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  Snackbar,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemAvatar,
  Container,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import { useAppContext } from '../context/AppContext';

const MotionBox = motion(Box);

const Profile = () => {
  const { currentUser, updateUsername, getUserStatements } = useAppContext();
  const [username, setUsername] = useState(currentUser.username);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  const userStatements = getUserStatements();
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSaveUsername = () => {
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    
    const success = updateUsername(username);
    if (success) {
      setSuccess('Username updated successfully');
      setIsEditing(false);
      setError('');
    } else {
      setError('Failed to update username');
    }
  };
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleCloseSnackbar = () => {
    setSuccess('');
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
            mb: 4
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' },
              mb: 3
            }}
          >
            <Avatar 
              sx={{ 
                width: { xs: 80, sm: 100 }, 
                height: { xs: 80, sm: 100 },
                fontSize: { xs: '2rem', sm: '2.5rem' },
                bgcolor: 'primary.main',
                mb: { xs: 2, sm: 0 },
                mr: { xs: 0, sm: 3 }
              }}
            >
              {currentUser.username.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ flex: 1 }}>
              {isEditing ? (
                <Box>
                  <TextField
                    fullWidth
                    label="Username"
                    variant="outlined"
                    value={username}
                    onChange={handleUsernameChange}
                    error={!!error}
                    helperText={error}
                    sx={{ mb: 2 }}
                  />
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSaveUsername}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(currentUser.username);
                        setError('');
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                      {currentUser.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Joined {formatDate(currentUser.createdAt)}
                    </Typography>
                  </Box>
                  
                  <IconButton
                    color="primary"
                    aria-label="edit username"
                    onClick={handleEditClick}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Total Score
                  </Typography>
                  <Typography variant="h3" component="div" color="primary.main" sx={{ fontWeight: 700 }}>
                    {currentUser.score}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    points
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Statements Created
                  </Typography>
                  <Typography variant="h3" component="div" color="secondary.main" sx={{ fontWeight: 700 }}>
                    {userStatements.length}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    submissions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography color="text.secondary" gutterBottom>
                    Play Count
                  </Typography>
                  <Typography variant="h3" component="div" color="accent.main" sx={{ fontWeight: 700 }}>
                    {userStatements.reduce((total, s) => total + s.playCount, 0)}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    times played
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
        
        <Paper 
          elevation={3} 
          sx={{ 
            borderRadius: 2,
            overflow: 'hidden' 
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="profile tabs"
              variant="fullWidth"
            >
              <Tab label="My Statements" />
              <Tab label="Stats" />
            </Tabs>
          </Box>
          
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            {tabValue === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Your Submitted Statements
                </Typography>
                
                {userStatements.length === 0 ? (
                  <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                    You haven't created any statements yet.
                  </Typography>
                ) : (
                  <List>
                    {userStatements.map((statement) => (
                      <Card 
                        key={statement.id} 
                        variant="outlined"
                        sx={{ mb: 2 }}
                      >
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Created on {formatDate(statement.createdAt)}
                          </Typography>
                          
                          {statement.statements.map((text, i) => (
                            <Box 
                              key={i}
                              sx={{ 
                                p: 1.5, 
                                mb: 1,
                                borderRadius: 1,
                                bgcolor: i === statement.lieIndex ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                border: 1,
                                borderColor: i === statement.lieIndex ? 'error.light' : 'success.light'
                              }}
                            >
                              <Typography 
                                variant="body2"
                                sx={{ 
                                  display: 'flex',
                                  alignItems: 'center'
                                }}
                              >
                                <Box 
                                  component="span"
                                  sx={{ 
                                    mr: 1,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'inline-block',
                                    bgcolor: i === statement.lieIndex ? 'error.main' : 'success.main',
                                    color: 'white'
                                  }}
                                >
                                  {i === statement.lieIndex ? 'LIE' : 'TRUTH'}
                                </Box>
                                {text}
                              </Typography>
                            </Box>
                          ))}
                          
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                            <Chip 
                              label={`Played ${statement.playCount} ${statement.playCount === 1 ? 'time' : 'times'}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </Box>
            )}
            
            {tabValue === 1 && (
              <Box sx={{ py: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Player Statistics
                </Typography>
                
                <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  Detailed statistics coming soon!
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
      
      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
    </MotionBox>
  );
};

export default Profile;