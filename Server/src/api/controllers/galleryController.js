import Gallery from '../models/Gallery.js';

// Get all gallery items
export const getGalleryItems = async (req, res) => {
    try {
        const items = await Gallery.find();
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new gallery item
export const createGalleryItem = async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Only admins can upload gallery items.' });
        }

        const { type, description } = req.body;
        let fileUrl = null;

        if (req.file) {
            if (req.file.mimetype.startsWith('image/')) {
                fileUrl = `/uploads/images/${req.file.filename}`;
            } else if (req.file.mimetype.startsWith('video/')) {
                fileUrl = `/uploads/videos/${req.file.filename}`;
            }
        }

        if (!type || !fileUrl || !description) {
            return res.status(400).json({ message: 'Type, URL, and description are required.' });
        }

        const newItem = new Gallery({ type, url: fileUrl, description });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ message: error.message });
    }
};

// Update a gallery item
export const updateGalleryItem = async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Only admins can edit gallery items.' });
        }

        const { id } = req.params;
        const { type, description } = req.body;
        let fileUrl = req.body.url;

        if (req.file) {
            if (req.file.mimetype.startsWith('image/')) {
                fileUrl = `/uploads/images/${req.file.filename}`;
            } else if (req.file.mimetype.startsWith('video/')) {
                fileUrl = `/uploads/videos/${req.file.filename}`;
            }
        }

        if (!type || !fileUrl || !description) {
            return res.status(400).json({ message: 'Type, URL, and description are required.' });
        }

        const updatedItem = await Gallery.findByIdAndUpdate(id, { type, url: fileUrl, description }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Gallery item not found.' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ message: error.message });
    }
};

// Delete a gallery item
export const deleteGalleryItem = async (req, res) => {
    try {
        if (req.userType !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Only admins can delete gallery items.' });
        }

        const { id } = req.params;
        const deletedItem = await Gallery.findByIdAndDelete(id);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Gallery item not found.' });
        }

        res.status(200).json({ message: 'Gallery item deleted successfully.' });
    } catch (error) {
        console.error(error); // Log the error to the console
        res.status(500).json({ message: error.message });
    }
};
