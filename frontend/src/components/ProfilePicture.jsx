import React from 'react';
import { User } from 'lucide-react';

const ProfilePicture = ({ 
    user, 
    size = 'md', 
    className = '' 
}) => {
    // Size configurations
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20'
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 32,
        xl: 40
    };

    // Check if user has a profile picture
    const hasProfilePicture = user?.picture && user.picture.trim() !== '';
    
    // Generate initials from username/name
    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Generate a consistent background color based on username
    const getBackgroundColor = (name) => {
        if (!name) return 'bg-gray-500';
        
        const colors = [
            'bg-red-500',
            'bg-blue-500',
            'bg-green-500',
            'bg-yellow-500',
            'bg-purple-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-teal-500',
            'bg-orange-500',
            'bg-cyan-500'
        ];
        
        const hash = name.split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
        }, 0);
        
        return colors[Math.abs(hash) % colors.length];
    };

    if (hasProfilePicture) {
        return (
            <div className={`${sizeClasses[size]} ${className} rounded-full overflow-hidden border-2 border-gray-300 flex-shrink-0`}>
                <img
                    src={user.picture}
                    alt={user.username || user.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // If image fails to load, hide it and show fallback
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                {/* Fallback content (hidden by default) */}
                <div 
                    className={`w-full h-full ${getBackgroundColor(user.username || user.name)} flex items-center justify-center text-white font-medium text-sm`}
                    style={{ display: 'none' }}
                >
                    {getInitials(user.username || user.name)}
                </div>
            </div>
        );
    }

    // Fallback: Show initials with colored background
    return (
        <div className={`${sizeClasses[size]} ${className} rounded-full ${getBackgroundColor(user.username || user.name)} flex items-center justify-center text-white font-medium border-2 border-gray-300 flex-shrink-0`}>
            <span className="text-sm">
                {getInitials(user.username || user.name)}
            </span>
        </div>
    );
};

export default ProfilePicture;
