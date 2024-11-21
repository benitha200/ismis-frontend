import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { User, Lock, Camera, Mail, Phone, Building, MapPin } from 'lucide-react';
import axios from '../lib/axios';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    location: '',
    photo: '/profile/profile-pic.png'
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token'); // Fetch token from storage
        if (!token) {
          throw new Error('User is not logged in');
        }
  
        const response = await axios.get('/me', {
          headers: {
            Authorization: `Bearer ${token}` // Include token in request
          }
        });
  
        // Log the API response to inspect what is returned
        console.log('API Response:', response);
  
        // Extract and log user details
        const data = response.data;
        console.log('Logged-in User Details:', data); // Log user details to console
  
        // Update profileData state with the user details
        setProfileData({
          name: data.name,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          location: data.location,
          photo: data.photo || '/profile/profile-pic.png',
        });
      } catch (error) {
        console.error('Error loading user data:', error.response?.data || error.message);
        toast.error(`Failed to load user data: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadUserData();
  }, []);
  

  // Handle profile update submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });
      if (!response.ok) throw new Error('Failed to update profile');
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password update submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      if (!response.ok) throw new Error('Failed to change password');
      
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle profile photo change
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('photo', file);

      try {
        const response = await fetch(`${API_URL}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });
        if (!response.ok) throw new Error('Failed to upload photo');

        const data = await response.json();
        setProfileData(prev => ({
          ...prev,
          photo: data.photo
        }));

        toast.success('Photo updated successfully');
      } catch (error) {
        toast.error('Failed to upload photo');
      }
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-600 border-b-blue-600 border-l-gray-200 border-r-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <div className="flex space-x-8">
            <button
              className={`px-4 py-4 ${activeTab === 'profile' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Settings
            </button>
            <button
              className={`px-4 py-4 ${activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('password')}
            >
              Change Password
            </button>
          </div>
        </div>
        <div className="p-6">
          {activeTab === 'profile' ? (
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              {/* Profile Settings Form */}
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              {/* Password Settings Form */}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;