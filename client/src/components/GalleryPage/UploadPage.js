import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createGalleryItem } from '../../redux/store/gallerySlice.js';
import { Button, TextField, MenuItem, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const gallery = useSelector((state) => state.gallery);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [type, setType] = useState('photo');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('description', description);

        dispatch(createGalleryItem(formData)).then((result) => {
            if (result.type === 'gallery/createGalleryItem/fulfilled') {
                navigate('/gallery'); // Redirect to the gallery page after successful upload
            }
        });

        setFile(null);
        setDescription('');
    };

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full max-w-5xl p-4">
                <div className="text-center mb-8">
                    <Typography variant="h4" component="h1">Upload Gallery Item</Typography>
                </div>
                <div className="mb-8">
                    <TextField
                        select
                        label="Type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="photo">Photo</MenuItem>
                        <MenuItem value="video">Video</MenuItem>
                    </TextField>
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*,video/*"
                        style={{ display: 'block', margin: '20px 0' }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUpload}
                        disabled={!file}
                    >
                        Upload
                    </Button>
                    {gallery.status === 'loading' && (
                        <div className="flex justify-center items-center mt-4">
                            <CircularProgress />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
