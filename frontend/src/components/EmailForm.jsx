import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
} from '@mui/material';

function EmailForm({ onSubmit, loading }) {
  const [emailData, setEmailData] = useState({
    content: '',
    tone: 'professional',
    length: 'medium',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(emailData);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={6}
          label="Email Content"
          name="content"
          value={emailData.content}
          onChange={handleChange}
          required
          margin="normal"
          placeholder="Enter your email content here..."
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Tone</InputLabel>
            <Select
              name="tone"
              value={emailData.tone}
              onChange={handleChange}
              label="Tone"
            >
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="formal">Formal</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Length</InputLabel>
            <Select
              name="length"
              value={emailData.length}
              onChange={handleChange}
              label="Length"
            >
              <MenuItem value="short">Short</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="long">Long</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading}
          sx={{ mt: 3 }}
        >
          {loading ? 'Processing...' : 'Improve Email'}
        </Button>
      </form>
    </Paper>
  );
}

export default EmailForm; 