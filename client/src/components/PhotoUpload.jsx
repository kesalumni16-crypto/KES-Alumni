import { useState, useRef } from 'react';
import { FaCamera, FaUpload, FaTimes, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PhotoUpload = ({ currentPhoto, onPhotoChange, isEditing }) => {
  const [preview, setPreview] = useState(currentPhoto);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setUploading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('photo', file);

      // Upload to server
      const response = await fetch('/api/profile/upload-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Update preview and notify parent component
      setPreview(data.photoUrl);
      onPhotoChange(data.photoUrl);
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Photo Display */}
      <div className="relative">
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <FaUser className="text-gray-400 text-4xl" />
            </div>
          )}
        </div>
        
        {/* Camera Icon Overlay */}
        {isEditing && (
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition duration-300 disabled:opacity-50"
          >
            <FaCamera className="text-sm" />
          </button>
        )}
      </div>

      {/* Upload Controls */}
      {isEditing && (
        <div className="flex flex-col items-center space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-sm disabled:opacity-50"
            >
              <FaUpload className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            
            {preview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 text-sm"
              >
                <FaTimes className="mr-2" />
                Remove
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            Supported formats: JPG, PNG, GIF<br />
            Maximum size: 5MB
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;