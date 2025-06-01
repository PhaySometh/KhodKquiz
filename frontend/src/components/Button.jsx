import React from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

export default function Button({
    label = 'See more',
    bgColor = 'bg-orange-400',
    textColor = 'text-white',
}) {
    return (
        <button
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
        </button>
    );
}

Button.propTypes = {
    label: PropTypes.string,
    bgColor: PropTypes.string,
    textColor: PropTypes.string,
};
