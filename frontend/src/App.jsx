import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Container, Box } from "@mui/material";
import { AnimatePresence } from "framer-motion";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Play from "./pages/Play";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Header />
      <Container
        component="main"
        sx={{
          flex: 1,
          py: { xs: 2, sm: 4 },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/play" element={<Play />} />
            <Route path="/play/:id" element={<Play />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Container>
      <Footer />
    </Box>
  );
}

export default App;
