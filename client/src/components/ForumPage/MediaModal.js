// components/ForumPage/MediaModal.js
import React from 'react';
import Modal from 'react-modal';

// You need to set the app element for accessibility reasons
Modal.setAppElement('#root');

const MediaModal = ({ isOpen, onRequestClose, mediaSrc, mediaType }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Media Modal"
            className="media-modal"
            overlayClassName="media-modal-overlay"
        >
            <button className="modal-close-button" onClick={onRequestClose}>&times;</button>
            {mediaType === 'image' ? (
                <img src={mediaSrc} alt="Media" className="w-full h-auto" />
            ) : (
                <video controls className="w-full h-auto">
                    <source src={mediaSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}
        </Modal>
    );
};

export default MediaModal;
