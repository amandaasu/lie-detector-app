import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  Avatar,
  Container
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const MotionBox = motion(Box);
const MotionTableRow = motion(TableRow);

const Leaderboard = () => {
  const { getLeaderboard, currentUser } = useAppContext();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const leaderboard = getLeaderboard();
  
  // Get user rank
  const userRank = leaderboard.findIndex(user => user.id === currentUser.id) + 1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
            Leaderboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            See who has the best intuition for spotting lies!
          </Typography>
        </Box>
        
        <Paper 
          sx={{ 
            p: 2, 
            mb: 4, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            bgcolor: 'primary.light',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'bold'
              }}
            >
              {userRank}
            </Avatar>
            <Box>
              <Typography variant="body2">Your Rank</Typography>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {currentUser.username}
              </Typography>
            </Box>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {currentUser.score} points
          </Typography>
        </Paper>
        
        <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 2, overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.default' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Rank</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Player</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Score</TableCell>
                <TableCell sx={{ fontWeight: 'bold', display: { xs: 'none', sm: 'table-cell' } }}>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaderboard
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, index) => {
                  const rank = page * rowsPerPage + index + 1;
                  const isCurrentUser = user.id === currentUser.id;
                  
                  return (
                    <MotionTableRow
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      sx={{
                        bgcolor: isCurrentUser ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                        '&:hover': {
                          bgcolor: isCurrentUser ? 'rgba(37, 99, 235, 0.12)' : 'rgba(0, 0, 0, 0.04)',
                        }
                      }}
                    >
                      <TableCell>
                        {rank <= 3 ? (
                          <Chip 
                            label={rank} 
                            size="small" 
                            color={rank === 1 ? "warning" : rank === 2 ? "secondary" : "accent"}
                            sx={{ 
                              fontWeight: 'bold',
                              minWidth: 32
                            }}
                          />
                        ) : (
                          <Typography>{rank}</Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              mr: 1, 
                              width: 32, 
                              height: 32,
                              bgcolor: isCurrentUser ? 'primary.main' : 'secondary.main',
                              fontSize: '0.875rem'
                            }}
                          >
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography>
                            {user.username} {isCurrentUser && <Chip label="You" size="small" sx={{ ml: 1 }} />}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography fontWeight={rank <= 3 ? 'bold' : 'normal'}>
                          {user.score}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        {formatDate(user.createdAt)}
                      </TableCell>
                    </MotionTableRow>
                  );
                })}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={leaderboard.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Container>
    </MotionBox>
  );
};

export default Leaderboard;