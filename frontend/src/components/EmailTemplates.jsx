import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const EmailTemplates = ({ onSelectTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/templates');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleOpen = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        subject: template.subject,
        content: template.content
      });
    } else {
      setEditingTemplate(null);
      setFormData({ name: '', subject: '', content: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTemplate(null);
    setFormData({ name: '', subject: '', content: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTemplate
        ? `http://localhost:8000/api/templates/${editingTemplate.id}`
        : 'http://localhost:8000/api/templates';
      
      const method = editingTemplate ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTemplates();
        handleClose();
      }
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/templates/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchTemplates();
        }
      } catch (error) {
        console.error('Error deleting template:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Email Templates
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          New Template
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
        {templates.map((template) => (
          <Card key={template.id} sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {template.name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                {template.subject}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {template.content.substring(0, 100)}...
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  size="small"
                  onClick={() => onSelectTemplate(template)}
                >
                  Use Template
                </Button>
                <Box>
                  <IconButton size="small" onClick={() => handleOpen(template)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(template.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTemplate ? 'Edit Template' : 'New Template'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Template Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              margin="normal"
              required
              multiline
              rows={6}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailTemplates; 