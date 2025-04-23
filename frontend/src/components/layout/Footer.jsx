import { Box, Container, Typography, Link, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: { xs: 2, md: 0 } }}
          >
            © {new Date().getFullYear()} 2 Truths 1 Lie Quiz Game
          </Typography>
          
          <Stack 
            direction="row" 
            spacing={1}
            sx={{ mb: { xs: 2, md: 0 } }}
          >
            <IconButton 
              size="small"
              color="inherit"
              aria-label="GitHub"
              sx={{ color: 'text.secondary' }}
            >
              <GitHubIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              color="inherit"
              aria-label="LinkedIn"
              sx={{ color: 'text.secondary' }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small"
              color="inherit"
              aria-label="Twitter"
              sx={{ color: 'text.secondary' }}
            >
              <TwitterIcon fontSize="small" />
            </IconButton>
          </Stack>
          
          <Box>
            <Link href="#" variant="body2" color="text.secondary" sx={{ mx: 1 }}>
              Privacy
            </Link>
            <Link href="#" variant="body2" color="text.secondary" sx={{ mx: 1 }}>
              Terms
            </Link>
            <Link href="#" variant="body2" color="text.secondary" sx={{ mx: 1 }}>
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;