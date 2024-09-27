import React, { useEffect, useState } from 'react';
import AxiosInstance from '../Axios';
import { Box, Button, TextField, List, ListItem, ListItemText, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types'; 

const CommentSection = ({ clientId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await AxiosInstance.get(`/api/v1/clients/${clientId}/comments/list/`);
        setComments(response.data);
      } catch (error) {
        setError('Error fetching comments');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [clientId]);

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      const response = await AxiosInstance.post(`/api/v1/clients/${clientId}/comments/`, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await AxiosInstance.delete(`/api/v1/client/comments/${commentId}/`);
      setComments(comments.filter(comment => comment.id !== commentId));
      handleCloseMenu();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleMenuClick = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  if (loading) return <Typography>Loading comments...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box mt={3}>
      <Typography variant="h6" gutterBottom>Commentaires</Typography>
      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText 
              primary={comment.content} 
            />
            <IconButton onClick={(event) => handleMenuClick(event, comment)}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={() => handleDeleteComment(selectedComment.id)}>Supprimer</MenuItem>
              <MenuItem>Modifier</MenuItem>
            </Menu>
          </ListItem>
        ))}
      </List>
      <Box mt={2} display="flex" alignItems="center">
        <TextField
          label="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          startIcon={<SendIcon />}
          style={{ marginLeft: '10px' }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

CommentSection.propTypes = {
  clientId: PropTypes.number.isRequired, 
};

export default CommentSection;
