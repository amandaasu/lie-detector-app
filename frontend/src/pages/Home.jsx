import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Grid, Card, CardContent, CardActions, Container, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useAppContext } from "../context/AppContext";

const MotionBox = motion(Box);

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getLeaderboard } = useAppContext();

  const topPlayers = getLeaderboard().slice(0, 3);

  const features = [
    {
      title: "Create Statements",
      description: "Submit two true statements and one false statement about yourself. Can others spot your lie?",
      icon: <AddCircleOutlineIcon fontSize="large" />,
      color: theme.palette.primary.main,
      link: "/create",
    },
    {
      title: "Play the Game",
      description: "Test your intuition by guessing which statements from other players are lies.",
      icon: <SportsEsportsIcon fontSize="large" />,
      color: theme.palette.secondary.main,
      link: "/play",
    },
    // {
    //   title: "Compete for Points",
    //   description: "Earn points for correct guesses and climb the leaderboard.",
    //   icon: <EmojiEventsIcon fontSize="large" />,
    //   color: theme.palette.accent.main,
    //   link: "/leaderboard",
    // },
  ];

  return (
    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
      <Box
        sx={{
          pt: { xs: 4, md: 8 },
          pb: { xs: 6, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            component="h1"
            variant="h2"
            color="text.primary"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Two Truths and a Lie
          </Typography>

          <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Create your own set of statements or test your intuition by guessing which statements from others are lies. Have fun!
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              gap: 2,
              mb: { xs: 6, md: 8 },
            }}
          >
            <Button component={RouterLink} to="/create" variant="contained" color="primary" size="large" startIcon={<AddCircleOutlineIcon />}>
              Create Statements
            </Button>
            <Button component={RouterLink} to="/play" variant="outlined" color="primary" size="large" startIcon={<SportsEsportsIcon />}>
              Play Game
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: 4, backgroundColor: "background.paper" }}>
        <Container maxWidth="lg">
          <Typography component="h2" variant="h4" align="center" color="text.primary" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
            How It Works
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  component={motion.div}
                  whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0,0,0,0.1)" }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderTop: `4px solid ${feature.color}`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                        color: feature.color,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography gutterBottom variant="h5" component="h3" align="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: "center" }}>
                    <Button component={RouterLink} to={feature.link} size="small" sx={{ color: feature.color }}>
                      Try it now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 6, display: "none" }}>
        <Container maxWidth="md">
          <Typography component="h2" variant="h4" align="center" color="text.primary" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Top Players
          </Typography>

          <Typography variant="body1" align="center" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Can you make it to the top of our leaderboard?
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {topPlayers.map((player, index) => (
              <Grid item xs={12} sm={4} key={player.id}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  sx={{
                    textAlign: "center",
                    borderRadius: 3,
                    position: "relative",
                    overflow: "visible",
                    bgcolor: index === 0 ? "rgba(255, 215, 0, 0.08)" : "background.paper",
                  }}
                >
                  {index === 0 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -20,
                        left: "50%",
                        transform: "translateX(-50%)",
                        bgcolor: "warning.main",
                        color: "white",
                        borderRadius: 12,
                        px: 2,
                        py: 0.5,
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      }}
                    >
                      Top Player
                    </Box>
                  )}
                  <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                      {player.username}
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight={600}>
                      {player.score}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      points
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={RouterLink}
              to="/leaderboard"
              variant="outlined"
              color="primary"
            >
              View Full Leaderboard
            </Button>
          </Box> */}
        </Container>
      </Box>
    </MotionBox>
  );
};

export default Home;
