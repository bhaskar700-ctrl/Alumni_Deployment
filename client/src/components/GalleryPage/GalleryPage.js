import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGalleryItems } from '../../redux/store/gallerySlice.js';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, CircularProgress, Button } from '@mui/material';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const GalleryPage = () => {
    const dispatch = useDispatch();
    const gallery = useSelector((state) => state.gallery);

    useEffect(() => {
        dispatch(fetchGalleryItems());
    }, [dispatch]);

    if (gallery.status === 'loading') {
        return (
            <div className="flex flex-col items-center min-h-screen">
                <div className="w-full max-w-5xl p-4">
                    <div className="flex justify-center items-center">
                        <CircularProgress />
                    </div>
                </div>
            </div>
        );
    }

    if (gallery.status === 'failed') {
        return (
            <div className="flex flex-col items-center min-h-screen">
                <div className="w-full max-w-5xl p-4">
                    <div className="text-center">
                        <Typography variant="h6" color="error">
                            {gallery.error.message || "An error occurred"}
                        </Typography>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="w-full max-w-5xl p-4">
                <div className="text-center mb-8">
                    <Typography variant="h4" component="h1">Gallery</Typography>
                </div>
                <div className="mb-8">
                    <Button variant="contained" color="primary" component={Link} to="/upload-gallery">
                        Upload New Item
                    </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {gallery.items.map(item => (
                        <Card key={item._id} className="gallery-item">
                            {item.type === 'photo' ? (
                                <CardMedia
                                    component="img"
                                    alt={item.description}
                                    height="140"
                                    image={`${apiUrl}${item.url}`}
                                    title={item.description}
                                />
                            ) : (
                                <CardMedia
                                    component="video"
                                    controls
                                    height="140"
                                    src={`${apiUrl}${item.url}`}
                                    title={item.description}
                                />
                            )}
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryPage;
