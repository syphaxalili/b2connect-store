import { Box, Container, Paper } from '@mui/material';
import logoB2connect from '../../assets/logoB2connect.webp';

const AuthFormContainer = ({ children, maxWidth = 'sm' }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4
      }}
    >
      <Container maxWidth={maxWidth}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            maxWidth: '100%',
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <img 
              src={logoB2connect} 
              alt="B2CONNECT Logo" 
              style={{ maxWidth: '200px', height: 'auto' }}
            />
          </Box>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthFormContainer;