import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemText, ListItemIcon, Avatar, Container, useScrollTrigger, Slide } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import { useAppContext } from "../../context/AppContext";

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAppContext();

  const navLinks = [
    { text: "Home", path: "/", icon: <HomeIcon /> },
    { text: "Create", path: "/create", icon: <AddIcon /> },
    { text: "Play", path: "/play", icon: <SportsEsportsIcon /> },
    // { text: 'Leaderboard', path: '/leaderboard', icon: <LeaderboardIcon /> },
    // { text: 'Profile', path: '/profile', icon: <PersonIcon /> }
  ];

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
        }}
      >
        <Avatar
          sx={{
            bgcolor: "primary.main",
            width: 40,
            height: 40,
            mr: 2,
          }}
        >
          {currentUser.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {currentUser.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Score: {currentUser.score}
          </Typography>
        </Box>
      </Box>

      <List>
        {navLinks.map((link) => (
          <ListItem
            button
            key={link.text}
            component={RouterLink}
            to={link.path}
            sx={{
              bgcolor: isActive(link.path) ? "rgba(37, 99, 235, 0.08)" : "transparent",
              "&:hover": {
                bgcolor: isActive(link.path) ? "rgba(37, 99, 235, 0.12)" : "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(link.path) ? "primary.main" : "text.secondary",
                minWidth: 40,
              }}
            >
              {link.icon}
            </ListItemIcon>
            <ListItemText
              primary={link.text}
              primaryTypographyProps={{
                color: isActive(link.path) ? "primary.main" : "text.primary",
                fontWeight: isActive(link.path) ? 500 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              2 Truths 1 Lie
            </Typography>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {navLinks.map((link) => (
                <Button
                  key={link.text}
                  component={RouterLink}
                  to={link.path}
                  color={isActive(link.path) ? "primary" : "inherit"}
                  sx={{
                    mx: 0.5,
                    fontWeight: isActive(link.path) ? 500 : 400,
                  }}
                  startIcon={link.icon}
                >
                  {link.text}
                </Button>
              ))}
            </Box>

            {/* Mobile Navigation */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton size="large" aria-label="open drawer" edge="end" onClick={toggleDrawer(true)} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawer}
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
