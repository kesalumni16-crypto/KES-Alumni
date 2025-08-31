import { useState, useRef } from 'react';
import { FaCamera, FaUpload, FaTimes, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

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

      // Create preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('photo', file);

      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Upload to server
      const response = await axios.post('https://kes-alumni-bhz1.vercel.app/api/profile/upload-photo', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.photoUrl) {
        // Update preview and notify parent component
        setPreview(response.data.photoUrl);
        onPhotoChange(response.data.photoUrl);
        toast.success('Photo uploaded successfully');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error('Failed to upload photo. Please try again.');
      // Reset preview on error
      setPreview(currentPhoto);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setUploading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Delete photo from server
      await axios.delete('https://kes-alumni-bhz1.vercel.app/api/profile/photo', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setPreview(null);
      onPhotoChange(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Photo removed successfully');
    } catch (error) {
      console.error('Photo delete error:', error);
      toast.error('Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-3 sm:space-y-4">
      {/* Photo Display */}
      <div className="relative group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={() => {
                console.error('Failed to load image:', preview);
                setPreview(null);
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <FaUser className="text-gray-400 text-2xl sm:text-4xl" />
            </div>
          )}
          
          {/* Loading overlay */}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        
        {/* Camera Icon Overlay */}
        {isEditing && (
          <button
            type="button"
            onClick={triggerFileInput}
            disabled={uploading}
            className="absolute bottom-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-300 disabled:opacity-50 group-hover:scale-110"
          >
            <FaCamera className="text-xs sm:text-sm" />
          </button>
        )}
      </div>

      {/* Upload Controls */}
      {isEditing && (
        <div className="flex flex-col items-center space-y-2 sm:space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaUpload className="mr-2" />
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            
            {preview && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={uploading}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 text-xs sm:text-sm disabled:opacity-50"
              >
                <FaTimes className="mr-2" />
                Remove
              </button>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center max-w-xs leading-relaxed">
            Supported formats: JPG, PNG, GIF<br />
            Maximum size: 5MB
          </p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;