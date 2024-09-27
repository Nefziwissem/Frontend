import React, { useEffect, useState } from 'react';
import AxiosInstance from '../Axios'; // Ajustez le chemin si nécessaire
import { useParams } from 'react-router-dom';
import {
  Container, Grid, Typography, Alert, Box, Button,
  IconButton, List, ListItem, ListItemText, ListItemSecondaryAction
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import FolderIcon from '@mui/icons-material/Folder';
import TodayIcon from '@mui/icons-material/Today';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import './det.css'; // Assurez-vous que le chemin est correct
import SampleImage from './helo.png';

const MarchandDetail = () => {
  const { id } = useParams(); // Récupère l'ID du marchand depuis les paramètres de la route
  const [marchand, setMarchand] = useState(null);
  const [error, setError] = useState(null);
  const [assigningFile, setAssigningFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [deletingDocument, setDeletingDocument] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // État pour l'URL de l'image

  useEffect(() => {
    const fetchMarchandDetails = async () => {
      try {
        const response = await AxiosInstance.get(`api/v1/marchands/${id}/`);
        setMarchand(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du marchand:', error);
        setError('Erreur lors de la récupération des détails du marchand. Réessayez.');
      }
    };

    fetchMarchandDetails();
  }, [id]);

  const handleAssignFile = async () => {
    setAssigningFile(true);
    try {
      await AxiosInstance.post(`api/v1/marchands/${id}/documents/assign/`, { marchandId: id });
      alert('Document attribué avec succès !');
    } catch (error) {
      alert('Erreur lors de l\'attribution du document');
      console.error(error);
    } finally {
      setAssigningFile(false);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier d\'abord.');
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('fille', selectedFile); // Assurez-vous que le nom du champ correspond à celui attendu par le backend

    try {
      const response = await AxiosInstance.post(`api/v1/marchands/${id}/upload-file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Fichier téléchargé avec succès !');
      setDocuments([...documents, response.data.file]);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
      alert('Erreur lors du téléchargement du fichier');
    } finally {
      setUploadingFile(false);
      setSelectedFile(null);
    }
  };

  const handleFileView = async (fileId) => {
    if (!fileId) {
      console.error('L\'ID du fichier est indéfini');
      return;
    }

    try {
      const response = await AxiosInstance.get(`api/v1/marchands/${id}/files/${fileId}/`);
      const imageUrl = response.data.file; // URL depuis la réponse
      setImageUrl(imageUrl); // Enregistrer l'URL dans l'état pour l'affichage
    } catch (error) {
      console.error('Erreur lors de la récupération du fichier :', error);
    }
  };

  const handleFileDelete = async (fileId) => {
    setDeletingDocument(fileId);
    try {
      await AxiosInstance.delete(`api/v1/marchands/${id}/documents/${fileId}/`);
      alert('Fichier supprimé avec succès !');
      setDocuments(documents.filter(doc => doc.id !== fileId));
    } catch (error) {
      alert('Erreur lors de la suppression du fichier');
      console.error(error);
    } finally {
      setDeletingDocument(null);
    }
  };

  if (error) return (
    <Container className="marchand-detail-container" maxWidth="md">
      <Alert severity="error">
        {error}
        <Box mt={2}>
          <Typography variant="body2" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
            Réessayer
          </Typography>
        </Box>
      </Alert>
    </Container>
  );

  return (
    <Container className="marchand-detail-container" maxWidth="md">
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} display="flex" justifyContent="center" alignItems="center">
          <img src={SampleImage} alt="Sample" className="sample-image" /> {/* Ajouter l'image ici */}
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" className='h4' gutterBottom>
            Détails du Marchand
          </Typography>
          {marchand ? (
            <>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  {/* Détails du marchand */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body1" color="textSecondary" mr={1}>
                      <strong>Nom:</strong>
                    </Typography>
                    <Typography variant="body1">{marchand.nom_marchand}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body1" color="textSecondary" mr={1}>
                      <strong>Type Machine:</strong>
                    </Typography>
                    <Typography variant="body1">{marchand.type_machine}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body1" color="textSecondary" mr={1}>
                      <strong>Quantité:</strong>
                    </Typography>
                    <Typography variant="body1">{marchand.quantite}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography variant="body1" color="textSecondary" mr={1}>
                      <strong>Emplacement:</strong>
                    </Typography>
                    <Typography variant="body1">{marchand.emplacement}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <TodayIcon color="action" />
                    <Typography variant="body1" ml={1}>
                      <strong>Date Entretien:</strong> {marchand.date_entretien ? new Date(marchand.date_entretien).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  {/* Informations complémentaires */}
                  <Box display="flex" alignItems="center" mb={1}>
                    <EmailIcon color="action" />
                    <Typography variant="body1" ml={1}>
                      <strong>Email:</strong> {marchand.email}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Box mt={3}>
                <Typography className="h4" variant="h6" gutterBottom>Documents</Typography>
                <List>
                  {documents.map((document) => (
                    <ListItem key={document.id}>
                      <ListItemText primary={document.filename} />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          className='my-ic'
                          aria-label="view"
                          onClick={() => handleFileView(document.id)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="download"
                          href={document.file}
                          download={document.filename}
                        >
                          <DownloadIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleFileDelete(document.id)}
                          disabled={deletingDocument === document.id}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Box mt={2}>
                  <input
                    accept="application/pdf,image/*"
                    style={{ display: 'none' }}
                    id="file-upload"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-upload">
                    <Button variant="contained" component="span" startIcon={<UploadFileIcon />} disabled={uploadingFile}>
                      Select File
                    </Button>
                  </label>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleFileUpload}
                    disabled={uploadingFile}
                    style={{ marginLeft: '10px' }}
                  >
                    {uploadingFile ? 'Uploading...' : 'Upload File'}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAssignFile}
                    disabled={assigningFile}
                    style={{ marginLeft: '10px' }}
                  >
                    {assigningFile ? 'Assigning...' : 'Assign File'}
                  </Button>
                </Box>
              </Box>
              {imageUrl && (
                <Box mt={3} display="flex" justifyContent="center">
                  <img src={imageUrl} alt="Document" style={{ maxWidth: '100%', height: 'auto' }} />
                </Box>
              )}
            </>
          ) : (
            <Typography variant="body1">Aucun détail disponible pour ce marchand.</Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MarchandDetail;
