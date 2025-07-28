import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Statistics Card Component
 * Displays a statistic with icon, label, and value in a consistent format
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.label - Label text for the statistic
 * @param {string|number} props.value - Value to display
 * @param {string} props.iconBgColor - Background color for icon container
 * @param {string} props.iconColor - Color for the icon
 * @param {string} props.bgColor - Background color for the card
 * @param {boolean} props.animated - Whether to animate the card
 * @param {Object} props.animationDelay - Animation delay for staggered effects
 * @param {function} props.onClick - Click handler for the card
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} StatsCard component
 */
const StatsCard = ({
    icon,
    label,
    value,
    iconBgColor = 'bg-blue-100',
    iconColor = 'text-blue-600',
    bgColor = 'bg-white',
    animated = false,
    animationDelay = 0,
    onClick = null,
    className = ''
}) => {
    const cardContent = (
        <div className={`${bgColor} p-6 rounded-lg shadow ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}>
            <div className="flex items-center">
                <div className={`p-2 ${iconBgColor} rounded-lg`}>
                    <div className={`w-6 h-6 ${iconColor}`}>
                        {icon}
                    </div>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                        {label}
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );

    if (animated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: animationDelay }}
                onClick={onClick}
            >
                {cardContent}
            </motion.div>
        );
    }

    return (
        <div onClick={onClick}>
            {cardContent}
        </div>
    );
};

/**
 * Stats Grid Component
 * Renders a grid of statistics cards with consistent spacing
 * 
 * @param {Object} props - Component props
 * @param {Array} props.stats - Array of stat objects
 * @param {number} props.columns - Number of columns in grid (1-6)
 * @param {boolean} props.animated - Whether to animate cards
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} StatsGrid component
 */
export const StatsGrid = ({ 
    stats = [], 
    columns = 4, 
    animated = false, 
    className = '' 
}) => {
    const gridColsClass = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
        6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
    };

    return (
        <div className={`grid ${gridColsClass[columns]} gap-6 ${className}`}>
            {stats.map((stat, index) => (
                <StatsCard
                    key={stat.id || index}
                    icon={stat.icon}
                    label={stat.label}
                    value={stat.value}
                    iconBgColor={stat.iconBgColor}
                    iconColor={stat.iconColor}
                    bgColor={stat.bgColor}
                    animated={animated}
                    animationDelay={animated ? index * 0.1 : 0}
                    onClick={stat.onClick}
                    className={stat.className}
                />
            ))}
        </div>
    );
};

/**
 * Predefined stat configurations for common use cases
 */
export const STAT_CONFIGS = {
    PENDING: {
        iconBgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-600'
    },
    APPROVED: {
        iconBgColor: 'bg-green-100',
        iconColor: 'text-green-600'
    },
    REJECTED: {
        iconBgColor: 'bg-red-100',
        iconColor: 'text-red-600'
    },
    TOTAL: {
        iconBgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
    },
    SUCCESS: {
        iconBgColor: 'bg-emerald-100',
        iconColor: 'text-emerald-600'
    },
    WARNING: {
        iconBgColor: 'bg-amber-100',
        iconColor: 'text-amber-600'
    },
    INFO: {
        iconBgColor: 'bg-cyan-100',
        iconColor: 'text-cyan-600'
    }
};

export default StatsCard;
