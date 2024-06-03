import React from 'react';

const Ticks = ({ readBy, currentUserId }) => {
    if (!readBy || readBy.length === 0) {
        return <span className="text-gray-500">✓✓</span>;
    }

    if (readBy.includes(currentUserId)) {
        return (
            <span className="text-blue-500">
                ✓✓
            </span>
        );
    }

    return (
        <span className="text-gray-500">
            ✓✓
        </span>
    );
};

export default Ticks;
