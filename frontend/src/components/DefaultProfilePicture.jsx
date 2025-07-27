import React from 'react';
import { User } from 'lucide-react';

/**
 * Default Profile Picture Component
 * 
 * Displays a default user avatar when no profile picture is available.
 * Used for locally registered users who haven't uploaded a custom picture.
 * 
 * @param {Object} props - Component props
 * @param {string} props.className - CSS classes for styling
 * @param {number} props.size - Size of the icon (default: 24)
 * @param {string} props.name - User's name for accessibility
 */
const DefaultProfilePicture = ({ 
    className = "w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center", 
    size = 24,
    name = "User"
}) => {
    return (
        <div className={className} aria-label={`${name}'s profile picture`}>
            <User 
                size={size} 
                className="text-gray-500"
                aria-hidden="true"
            />
        </div>
    );
};

export default DefaultProfilePicture;
