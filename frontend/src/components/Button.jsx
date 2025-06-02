import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Button({
    to = "signup",
    label = 'See more',
    bgColor = 'bg-orange-400',
    textColor = 'text-white',
}) {
    return (
        <Link to={`/${to}`}
            className={`group relative flex items-center ${bgColor} ${textColor} transition-all duration-300 px-4 py-2 clip-angle overflow-hidden`}
        >
            {/* Text Label */}
            <span className="transition-all duration-300 group-hover:pr-6">
                {label}
            </span>

            {/* Icon */}
            <span className="absolute right-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-in-out">
                <ChevronRight size={18} />
            </span>
        </Link>
    );
}

Button.propTypes = {
    to: PropTypes.string,
    label: PropTypes.string,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
};
