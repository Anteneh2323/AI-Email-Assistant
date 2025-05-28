import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    category_id: '',
    tags: '',
    is_public: 0,
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleOpenDialog = (template = null) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData({
        name: template.name,
        subject: template.subject,
        content: template.content,
        category_id: template.category_id || '',
        tags: template.tags || '',
        is_public: template.is_public,
      });
    } else {
      setSelectedTemplate(null);
      setFormData({
        name: '',
        subject: '',
        content: '',
        category_id: '',
        tags: '',
        is_public: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleOpenCategoryDialog = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description || '',
      });
    } else {
      setSelectedCategory(null);
      setCategoryForm({
        name: '',
        description: '',
      });
    }
    setOpenCategoryDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTemplate(null);
  };

  const handleCloseCategoryDialog = () => {
    setOpenCategoryDialog(false);
    setSelectedCategory(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedTemplate
        ? `http://localhost:8000/api/templates/${selectedTemplate.id}`
        : 'http://localhost:8000/api/templates';
      const method = selectedTemplate ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTemplates();
        handleCloseDialog();
      } else {
        console.error('Error saving template');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedCategory
        ? `http://localhost:8000/api/categories/${selectedCategory.id}`
        : 'http://localhost:8000/api/categories';
      const method = selectedCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryForm),
      });

      if (response.ok) {
        fetchCategories();
        handleCloseCategoryDialog();
      } else {
        console.error('Error saving category');
      }
    } catch (error) {
      console.error('Error:', error);
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
        } else {
          console.error('Error deleting template');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          fetchCategories();
        } else {
          console.error('Error deleting category');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Email Templates</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenCategoryDialog()}
            sx={{ mr: 2 }}
          >
            Add Category
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Template
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{template.name}</Typography>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(template)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(template.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  {template.subject}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {template.content}
                </Typography>
                {template.category && (
                  <Chip
                    label={template.category.name}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                )}
                {template.tags &&
                  template.tags.split(',').map((tag) => (
                    <Chip
                      key={tag}
                      label={tag.trim()}
                      size="small"
                      sx={{ mr: 1, mt: 1 }}
                    />
                  ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Template Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTemplate ? 'Edit Template' : 'Add New Template'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
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
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                label="Category"
              >
                <MenuItem value="">None</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tags (comma-separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              margin="normal"
              helperText="Enter tags separated by commas"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Visibility</InputLabel>
              <Select
                value={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.value })}
                label="Visibility"
              >
                <MenuItem value={0}>Private</MenuItem>
                <MenuItem value={1}>Public</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedTemplate ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={handleCloseCategoryDialog}>
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCategorySubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={categoryForm.description}
              onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
              margin="normal"
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog}>Cancel</Button>
          <Button onClick={handleCategorySubmit} variant="contained">
            {selectedCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmailTemplates; 