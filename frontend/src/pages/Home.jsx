import React, { useState } from 'react';
import { Container, Box, Typography, Paper, TextField, Button, CircularProgress, Alert } from '@mui/material';
import EmailForm from '../components/EmailForm';
import EmailResult from '../components/EmailResult';
import EmailTemplates from '../components/EmailTemplates';

const Home = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSubmit = async (emailData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/process-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ content: emailData.content }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to process email');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while processing your email');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setEmail(template.content);
    setShowTemplates(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          AI Email Assistant
        </Typography>
        
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            {showTemplates ? 'Hide Templates' : 'Show Templates'}
          </Button>
        </Box>

        {showTemplates && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <EmailTemplates onSelectTemplate={handleTemplateSelect} />
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <EmailForm
            onSubmit={handleSubmit}
            loading={loading}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {result && !loading && (
            <EmailResult result={result} />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Home; 