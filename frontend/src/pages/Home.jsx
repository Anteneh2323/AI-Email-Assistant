import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import EmailForm from '../components/EmailForm';
import EmailResult from '../components/EmailResult';

function Home() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (emailData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/process-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Failed to process email');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          AI Email Assistant
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Improve your emails with AI-powered suggestions
        </Typography>
        
        <EmailForm onSubmit={handleSubmit} loading={loading} />
        
        {error && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}

        {result && <EmailResult result={result} />}
      </Box>
    </Container>
  );
}

export default Home; 