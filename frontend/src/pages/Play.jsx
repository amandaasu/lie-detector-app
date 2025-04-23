import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Paper, Card, CardContent, Grid, Divider, Alert, Container, CircularProgress, Chip, Tooltip, IconButton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useAppContext } from "../context/AppContext";
const API_URL = import.meta.env.VITE_API_URL;
const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

const Play = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStatementById, getRandomStatement, submitGuess, currentUser } = useAppContext();

  const [currentStatement, setCurrentStatement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [result, setResult] = useState(null);
  const [playedIds, setPlayedIds] = useState([]);
  const loadRandomStatement = async () => {
    setLoading(true);
    setResult(null);
    setSelectedIndex(null);

    try {
      const res = await fetch(API_URL + "/get-data");
      const data = await res.json();
      setCurrentStatement({
        id: data.id,
        statements: data.facts,
        username: data.userName || "Anonymous",
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to load question:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRandomStatement();
  }, []);

  const handleSelect = (index) => {
    if (result) return;
    setSelectedIndex(index);
  };

  const handleGuess = async () => {
    if (selectedIndex === null) return;

    try {
      const res = await fetch(API_URL + "/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: currentStatement.id,
          guessIndex: selectedIndex,
        }),
      });

      const resultData = await res.json();
      setResult({
        isCorrect: resultData.correct,
        message: resultData.message,
        correctAnswer: resultData.correctAnswer,
      });
    } catch (err) {
      console.error("Failed to submit guess:", err);
    }
  };

  const handleNextStatement = () => {
    // Clear the ID from the URL by navigating to the base play route
    navigate("/play");
    loadRandomStatement();
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
              Which is the lie?
            </Typography>

            {!id && (
              <Tooltip title="Get a different statement">
                <IconButton onClick={loadRandomStatement} color="primary" disabled={!!result}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Statements by: <Chip label={currentStatement.username} size="small" color="primary" />
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Select the statement you think is a lie.
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              {currentStatement.statements.map((statement, index) => (
                <Grid item xs={12} key={index}>
                  <MotionPaper
                    whileHover={!result ? { scale: 1.02 } : {}}
                    transition={{ duration: 0.2 }}
                    elevation={selectedIndex === index ? 3 : 1}
                    onClick={() => handleSelect(index)}
                    sx={{
                      p: 3,
                      cursor: result ? "default" : "pointer",
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden",
                      borderWidth: 2,
                      borderStyle: "solid",
                      bgcolor: index === selectedIndex ? "#e6eeff" : "transparent",
                      borderColor: (() => {
                        if (!result) return selectedIndex === index ? "primary.main" : "transparent";
                        if (index === currentStatement.lieIndex) return "error.main";
                        if (index === selectedIndex && selectedIndex !== currentStatement.lieIndex) return "error.main";
                        return "success.main";
                      })(),
                    }}
                  >
                    {result && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          p: 1,
                          borderBottomLeftRadius: 8,
                          bgcolor: index === result.correctAnswer ? "error.main" : "success.main",
                          color: "white",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          zIndex: 1,
                        }}
                      >
                        {index === result.correctAnswer ? "LIE" : "TRUTH"}
                      </Box>
                    )}

                    <Typography variant="body1">{statement}</Typography>
                  </MotionPaper>
                </Grid>
              ))}
            </Grid>
          </Box>

          <AnimatePresence>
            {result && (
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} sx={{ mb: 3 }}>
                <Alert severity={result.isCorrect ? "success" : "error"} variant="filled" sx={{ mb: 2 }}>
                  {result.isCorrect ? "Correct! You've identified the lie!" : "Oops! That's actually a true statement!"}
                </Alert>
              </MotionBox>
            )}
          </AnimatePresence>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            {!result ? (
              <Button variant="contained" color="primary" onClick={handleGuess} disabled={selectedIndex === null} size="large">
                Submit Guess
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNextStatement} size="large">
                Next Statement
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </MotionBox>
  );
};

export default Play;
