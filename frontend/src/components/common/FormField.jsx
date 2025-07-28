import React from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

/**
 * Reusable Form Field Component
 * Provides consistent styling and validation display for form inputs
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Field label
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.name - Field name
 * @param {string} props.value - Field value
 * @param {function} props.onChange - Change handler
 * @param {function} props.onBlur - Blur handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Whether field is required
 * @param {boolean} props.disabled - Whether field is disabled
 * @param {Array} props.errors - Array of error messages
 * @param {string} props.helpText - Help text to display
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} FormField component
 */
const FormField = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    errors = [],
    helpText,
    icon,
    className = ''
}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const hasErrors = errors.length > 0;
    const isPasswordField = type === 'password';
    const inputType = isPasswordField && showPassword ? 'text' : type;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className={`mb-4 ${className}`}>
            {/* Label */}
            {label && (
                <label 
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Input Container */}
            <div className="relative">
                {/* Left Icon */}
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <div className="h-5 w-5 text-gray-400">
                            {icon}
                        </div>
                    </div>
                )}

                {/* Input Field */}
                <input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                    className={`
                        block w-full px-3 py-2 border rounded-md shadow-sm
                        placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2
                        ${icon ? 'pl-10' : ''}
                        ${isPasswordField ? 'pr-10' : ''}
                        ${hasErrors 
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }
                        ${disabled 
                            ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                            : 'bg-white text-gray-900'
                        }
                    `}
                />

                {/* Password Toggle */}
                {isPasswordField && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                    </button>
                )}
            </div>

            {/* Error Messages */}
            {hasErrors && (
                <div className="mt-2">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Help Text */}
            {helpText && !hasErrors && (
                <p className="mt-2 text-sm text-gray-500">
                    {helpText}
                </p>
            )}
        </div>
    );
};

/**
 * Textarea Field Component
 * Similar to FormField but for multi-line text input
 */
export const TextareaField = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    required = false,
    disabled = false,
    errors = [],
    helpText,
    rows = 4,
    className = ''
}) => {
    const hasErrors = errors.length > 0;

    return (
        <div className={`mb-4 ${className}`}>
            {/* Label */}
            {label && (
                <label 
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Textarea */}
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                required={required}
                disabled={disabled}
                rows={rows}
                className={`
                    block w-full px-3 py-2 border rounded-md shadow-sm
                    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2
                    resize-vertical
                    ${hasErrors 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    ${disabled 
                        ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                        : 'bg-white text-gray-900'
                    }
                `}
            />

            {/* Error Messages */}
            {hasErrors && (
                <div className="mt-2">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Help Text */}
            {helpText && !hasErrors && (
                <p className="mt-2 text-sm text-gray-500">
                    {helpText}
                </p>
            )}
        </div>
    );
};

/**
 * Select Field Component
 * Dropdown select field with consistent styling
 */
export const SelectField = ({
    label,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder = 'Select an option',
    required = false,
    disabled = false,
    errors = [],
    helpText,
    className = ''
}) => {
    const hasErrors = errors.length > 0;

    return (
        <div className={`mb-4 ${className}`}>
            {/* Label */}
            {label && (
                <label 
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Select */}
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                required={required}
                disabled={disabled}
                className={`
                    block w-full px-3 py-2 border rounded-md shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${hasErrors 
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }
                    ${disabled 
                        ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
                        : 'bg-white text-gray-900'
                    }
                `}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Error Messages */}
            {hasErrors && (
                <div className="mt-2">
                    {errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                            <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Help Text */}
            {helpText && !hasErrors && (
                <p className="mt-2 text-sm text-gray-500">
                    {helpText}
                </p>
            )}
        </div>
    );
};

export default FormField;
