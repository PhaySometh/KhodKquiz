import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
    Camera,
    X,
    Check,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    AlertCircle,
    Upload,
} from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import toast from 'react-hot-toast';
import DefaultProfilePicture from './DefaultProfilePicture';

/**
 * Enhanced Profile Picture Upload Component
 *
 * Handles profile picture upload with cropping, positioning, and zoom functionality.
 * Includes comprehensive error handling and user experience improvements.
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - Current user object
 * @param {Function} props.onUpload - Callback function when upload is successful
 * @param {boolean} props.isUploading - Upload loading state
 */
const ProfilePictureUpload = ({ user, onUpload, isUploading = false }) => {
    const [originalImage, setOriginalImage] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [crop, setCrop] = useState({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5,
        aspect: 1, // Square aspect ratio
    });
    const [completedCrop, setCompletedCrop] = useState(null);
    const [scale, setScale] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const fileInputRef = useRef(null);
    const imageRef = useRef(null);
    const canvasRef = useRef(null);

    // File validation constants
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    // Disable body scroll when modal is open
    useEffect(() => {
        if (showUploadModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        // Cleanup on unmount
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showUploadModal]);

    const validateFile = (file) => {
        if (!file) {
            toast.error('Please select a file');
            return false;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error('Please select a valid image file (JPG, PNG, GIF)');
            return false;
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error('File size must be less than 5MB');
            return false;
        }

        return true;
    };

    // Generate cropped image canvas
    const getCroppedImg = useCallback((image, crop) => {
        const canvas = canvasRef.current;
        if (!canvas || !crop || !image) return null;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        const ctx = canvas.getContext('2d');

        // Set canvas size to desired output size
        const outputSize = 200; // 200x200 output
        canvas.width = outputSize;
        canvas.height = outputSize;

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            outputSize,
            outputSize
        );

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(null);
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                },
                'image/jpeg',
                0.9
            );
        });
    }, []);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!validateFile(file)) {
            return;
        }

        setUploadError(null);
        setIsProcessing(true);

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setOriginalImage(e.target.result);
            setShowUploadModal(true);
            setIsProcessing(false);

            // Reset crop settings
            setCrop({
                unit: '%',
                width: 90,
                height: 90,
                x: 5,
                y: 5,
                aspect: 1,
            });
            setScale(1);
        };
        reader.onerror = () => {
            setIsProcessing(false);
            toast.error('Failed to read image file');
        };
        reader.readAsDataURL(file);
    };

    const handleUpload = async () => {
        if (!originalImage || !completedCrop || !imageRef.current) return;

        setIsProcessing(true);
        setUploadError(null);

        try {
            // Generate cropped image
            const croppedImageData = await getCroppedImg(
                imageRef.current,
                completedCrop
            );

            if (!croppedImageData) {
                throw new Error('Failed to process image');
            }

            // Check final image size
            const imageSizeBytes = (croppedImageData.length * 3) / 4;
            if (imageSizeBytes > MAX_FILE_SIZE) {
                throw new Error(
                    'Processed image is too large. Please try a smaller crop area.'
                );
            }

            await onUpload(croppedImageData);
            handleCancel(); // Close modal and reset state
        } catch (error) {
            console.error('Upload failed:', error);

            // Handle specific error types
            if (
                error.message.includes('PayloadTooLargeError') ||
                error.message.includes('request entity too large')
            ) {
                setUploadError(
                    'Image is too large. Please select a smaller image or crop a smaller area.'
                );
            } else if (error.message.includes('Network Error')) {
                setUploadError(
                    'Network error. Please check your connection and try again.'
                );
            } else {
                setUploadError(
                    error.message || 'Failed to upload image. Please try again.'
                );
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        setShowUploadModal(false);
        setOriginalImage(null);
        setCompletedCrop(null);
        setScale(1);
        setUploadError(null);
        setIsProcessing(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleZoomIn = () => {
        setScale((prev) => Math.min(prev + 0.1, 3));
    };

    const handleZoomOut = () => {
        setScale((prev) => Math.max(prev - 0.1, 0.5));
    };

    const handleResetCrop = () => {
        setCrop({
            unit: '%',
            width: 90,
            height: 90,
            x: 5,
            y: 5,
            aspect: 1,
        });
        setScale(1);
    };

    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    const handleReplaceImage = () => {
        // Clear current error state
        setUploadError(null);
        // Open file dialog to select new image
        fileInputRef.current?.click();
    };

    // Determine if user has a profile picture
    const hasProfilePicture = user?.picture && user.picture.trim() !== '';
    const isGoogleUser = user?.provider === 'google';

    return (
        <>
            <div className="relative">
                {/* Profile Picture Display */}
                {hasProfilePicture ? (
                    <img
                        src={user.picture}
                        alt={user.name}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                ) : (
                    <DefaultProfilePicture
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-gray-300 flex items-center justify-center"
                        size={32}
                        name={user?.name}
                    />
                )}

                {/* Upload Button - Only show for local users */}
                {!isGoogleUser && (
                    <button
                        onClick={openFileDialog}
                        disabled={isUploading || isProcessing}
                        className="absolute bottom-0 right-0 hover:cursor-pointer bg-white text-gray-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Upload profile picture"
                    >
                        {isProcessing ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                        ) : (
                            <Camera size={16} />
                        )}
                    </button>
                )}
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Enhanced Upload Modal with Cropping */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Crop Your Profile Picture
                            </h3>

                            {/* Error Display */}
                            {uploadError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                                    <AlertCircle
                                        size={16}
                                        className="text-red-500 flex-shrink-0"
                                    />
                                    <p className="text-sm text-red-700">
                                        {uploadError}
                                    </p>
                                </div>
                            )}

                            {/* Crop Area */}
                            <div className="mb-4">
                                <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center min-h-[400px]">
                                    {originalImage && (
                                        <div className="flex items-center justify-center">
                                            <ReactCrop
                                                crop={crop}
                                                onChange={(_, percentCrop) =>
                                                    setCrop(percentCrop)
                                                }
                                                onComplete={(c) =>
                                                    setCompletedCrop(c)
                                                }
                                                aspect={1}
                                                circularCrop
                                            >
                                                <img
                                                    ref={imageRef}
                                                    src={originalImage}
                                                    alt="Crop preview"
                                                    style={{
                                                        transform: `scale(${scale})`,
                                                        maxHeight: '400px',
                                                        maxWidth: '100%',
                                                        width: 'auto',
                                                        height: 'auto',
                                                        display: 'block',
                                                    }}
                                                    onLoad={() => {
                                                        // Set initial crop when image loads
                                                        const {
                                                            width,
                                                            height,
                                                        } = imageRef.current;
                                                        const size =
                                                            Math.min(
                                                                width,
                                                                height
                                                            ) * 0.8;
                                                        const x =
                                                            (width - size) / 2;
                                                        const y =
                                                            (height - size) / 2;

                                                        setCrop({
                                                            unit: 'px',
                                                            width: size,
                                                            height: size,
                                                            x: x,
                                                            y: y,
                                                            aspect: 1,
                                                        });
                                                    }}
                                                />
                                            </ReactCrop>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="mb-6">
                                {/* Replace Image Button */}
                                <div className="flex justify-center mb-4">
                                    <button
                                        onClick={handleReplaceImage}
                                        disabled={isProcessing}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        title="Select a different image"
                                    >
                                        <Upload size={16} />
                                        Replace Image
                                    </button>
                                </div>

                                {/* Zoom and Crop Controls */}
                                <div className="flex items-center justify-center gap-4 mb-3">
                                    <button
                                        onClick={handleZoomOut}
                                        disabled={scale <= 0.5}
                                        className="p-2 border text-black border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Zoom out"
                                    >
                                        <ZoomOut size={16} />
                                    </button>

                                    <span className="text-sm text-gray-600 min-w-[60px] text-center">
                                        {Math.round(scale * 100)}%
                                    </span>

                                    <button
                                        onClick={handleZoomIn}
                                        disabled={scale >= 3}
                                        className="p-2 border text-black border-gray-300 rounded-lg hover:bg-gray-50 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Zoom in"
                                    >
                                        <ZoomIn size={16} />
                                    </button>
                                </div>

                                <p className="text-xs text-gray-500 text-center">
                                    Drag to reposition • Use zoom controls to
                                    resize • Drag corners to adjust crop area
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    disabled={isProcessing}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <X size={16} />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpload}
                                    disabled={isProcessing || !completedCrop}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Upload
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Hidden canvas for image processing */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
    );
};

export default ProfilePictureUpload;
