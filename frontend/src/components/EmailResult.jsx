import React from 'react';
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';

function EmailResult({ result }) {
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Improved Email
      </Typography>
      
      <Box sx={{ 
        bgcolor: 'grey.50', 
        p: 2, 
        borderRadius: 1,
        mb: 3,
        whiteSpace: 'pre-wrap'
      }}>
        {result.improved_content}
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Suggestions
          </Typography>
          <List>
            {result.suggestions.map((suggestion, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText primary={suggestion} />
                </ListItem>
                {index < result.suggestions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Corrections
          </Typography>
          <List>
            {result.corrections.map((correction, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText primary={correction} />
                </ListItem>
                {index < result.corrections.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
    </Paper>
  );
}

export default EmailResult; 