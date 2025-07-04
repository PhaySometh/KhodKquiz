import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Button({
    to = 'signup',
    label = 'See more',
    bgColor = 'bg-orange-400',
    textColor = 'text-white',
    icon: Icon = ChevronRight, // Default icon is ChevronRight
    showIcon = true,
}) {
    const buttonClasses = `group relative inline-flex items-center justify-center ${bgColor} ${textColor} transition-all duration-300 px-5 py-2.5 clip-angle overflow-hidden font-semibold`;

    return (
        <Link to={`/${to}`} className={buttonClasses}>
            <span
                className={`transition-all duration-300 ${
                    showIcon ? 'group-hover:pr-6' : ''
                }`}
            >
                {label}
            </span>

            {showIcon && (
                <span className="absolute right-4 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out">
                    <Icon size={20} />
                </span>
            )}
        </Link>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    label: PropTypes.string,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
    icon: PropTypes.elementType,
    showIcon: PropTypes.bool,
};