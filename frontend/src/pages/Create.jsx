import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper, Grid, FormControlLabel, Radio, RadioGroup, FormControl, FormLabel, Alert, Divider, Container, Stepper, Step, StepLabel, Card, CardContent } from "@mui/material";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

const MotionBox = motion(Box);
const API_URL = import.meta.env.VITE_API_URL;
const Create = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [statements, setStatements] = useState(["", "", ""]);
  const [lieIndex, setLieIndex] = useState(null);
  const [errors, setErrors] = useState([false, false, false]);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const steps = ["Write Your Statements", "Mark the Lie", "Review & Submit"];

  const handleStatementChange = (index, value) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);

    // Clear error for this field if it has content
    if (value.trim() !== "") {
      const newErrors = [...errors];
      newErrors[index] = false;
      setErrors(newErrors);
    }
  };

  const handleLieChange = (event) => {
    setLieIndex(Number(event.target.value));
  };

  const validateStatements = () => {
    const newErrors = statements.map((statement) => statement.trim() === "");
    setErrors(newErrors);
    return !newErrors.some((error) => error);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!validateStatements()) {
        setFormError("Please fill in all three statements");
        return;
      }
      setFormError("");
    } else if (activeStep === 1) {
      if (lieIndex === null) {
        setFormError("Please select which statement is the lie");
        return;
      }
      setFormError("");
    }

    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setFormError("");
  };

  const handleSubmit = () => {
    if (statements.some((s) => s.trim() === "") || lieIndex === null) {
      setFormError("Please complete all required fields");
      return;
    }

    submitEntry(statements, lieIndex);

    setSubmitted(true);
  };

  const submitEntry = async (facts, lieIndex) => {
    try {
      const response = await fetch(API_URL + "/new-entry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          facts: facts,
          id: uuidv4(),
          lieIndex: lieIndex,
        }),
      });

      const data = await response.json();
      console.log("✅ Entry submitted:", data);
    } catch (error) {
      console.error("❌ Error submitting entry:", error);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Write three statements about yourself. Two should be true, and one should be a lie. Make them interesting and challenging to guess!
            </Typography>

            {statements.map((statement, index) => (
              <TextField key={index} fullWidth multiline rows={2} label={`Statement ${index + 1}`} variant="outlined" value={statement} onChange={(e) => handleStatementChange(index, e.target.value)} error={errors[index]} helperText={errors[index] ? "This field is required" : ""} sx={{ mb: 3 }} />
            ))}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Now, select which of your statements is the lie.
            </Typography>

            <FormControl component="fieldset" sx={{ width: "100%" }}>
              <FormLabel component="legend">Select the lie:</FormLabel>
              <RadioGroup aria-label="lie" name="lie" value={lieIndex} onChange={handleLieChange}>
                {statements.map((statement, index) => (
                  <FormControlLabel
                    key={index}
                    value={index}
                    control={<Radio />}
                    label={
                      <Paper
                        elevation={lieIndex === index ? 2 : 0}
                        sx={{
                          p: 2,
                          mt: 1,
                          mb: 1,
                          width: "100%",
                          bgcolor: lieIndex === index ? "rgba(239, 68, 68, 0.1)" : "background.paper",
                          border: lieIndex === index ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <Typography variant="body1">{statement}</Typography>
                      </Paper>
                    }
                    sx={{
                      alignItems: "flex-start",
                      width: "100%",
                      mb: 1,
                      "& .MuiFormControlLabel-label": {
                        width: "100%",
                      },
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Review your statements before submitting. The lie is highlighted in red.
            </Typography>

            {statements.map((statement, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderColor: index === lieIndex ? "error.main" : "divider",
                  bgcolor: index === lieIndex ? "rgba(239, 68, 68, 0.05)" : "background.paper",
                }}
              >
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography variant="subtitle2" color={index === lieIndex ? "error" : "primary"} sx={{ fontWeight: 600, minWidth: 80 }}>
                      {index === lieIndex ? "LIE" : "TRUTH"}
                    </Typography>
                    <Typography variant="body1">{statement}</Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}

            <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
              Ready to submit? Others will try to guess which statement is the lie.
            </Typography>
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  if (submitted) {
    return (
      <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center", my: 4 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
            >
              <Alert severity="success" variant="filled" sx={{ mb: 3, fontSize: "1.1rem" }}>
                Your statements have been submitted successfully!
              </Alert>
            </motion.div>
          </Box>
        </Container>
      </MotionBox>
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
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Create Your Statements
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Stepper activeStep={activeStep} sx={{ my: 4 }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {formError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {formError}
            </Alert>
          )}

          <Box sx={{ mt: 2, mb: 4 }}>{getStepContent(activeStep)}</Box>

          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
              Back
            </Button>

            <Box>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Submit
                </Button>
              ) : (
                <Button variant="contained" color="primary" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </MotionBox>
  );
};

export default Create;
