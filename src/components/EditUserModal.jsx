import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useTheme } from '../context/ThemeContext';
import { X } from 'lucide-react';
import toast from 'react-hot-toast'; // Add toast for error and success notifications
import axiosInstance from '../utils/axiosInstance'; // Import axios instance for API requests

function EditUserModal({ isOpen, onClose, onEdit, userData }) {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    group: '',
    status: ''
  });

  const [loading, setLoading] = useState(false); // Loading state for form submission
  const [loadingGroups, setLoadingGroups] = useState(true); // Loading state for groups
  const [error, setError] = useState(''); // Error state to display error messages
  const [groups, setGroups] = useState([]); // State for groups fetched from the API
  const statuses = ["Active", "Inactive", "Suspended"];

  // Fetch groups from API when modal is opened
  useEffect(() => {
    if (isOpen) {
      // Set form data to user data if provided
      if (userData) {
        setFormData({
          name: userData.name,
          email: userData.email,
          group: userData.group,
          status: userData.status
        });
      }

      // Fetch the groups from the API
      const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
          const response = await axiosInstance.get('/groups');  // Replace with actual API endpoint
          setGroups(response.data);  // Set the fetched groups
        } catch (error) {
          setError(error.response?.data?.message || 'Failed to fetch groups');
        } finally {
          setLoadingGroups(false);
        }
      };

      fetchGroups();  // Call the fetchGroups function when the modal is opened
    }
  }, [isOpen, userData]);  // Trigger the effect when modal is opened or userData changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true); // Start loading state
    setError(''); // Clear any previous error

    // Validation checks before sending the data
    if (!formData.name || !formData.email || !formData.group || !formData.status) {
      toast.error('Please fill out all fields');
      setLoading(false);
      return;
    }

    // Email validation (simple regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Send the PUT request to update the user
      const response = await axiosInstance.put(`/users/${userData.id}`, formData);
      onEdit(response.data); // Update the user data in the parent component
      toast.success('User updated successfully');
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('API Error:', error.response?.data); // Log detailed error response
      setError(error.response?.data?.message || 'Failed to update user');
      toast.error(error.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false); // End loading state
    }
  };

  // Handle input change for form data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full max-w-md transform overflow-hidden rounded-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} p-6 text-left align-middle shadow-xl transition-all`}>
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">Edit User</Dialog.Title>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Error message display */}
                {error && (
                  <div className="text-red-500 text-sm mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Group</label>
                    {loadingGroups ? (
                      <div className="text-sm text-gray-500">Loading groups...</div>
                    ) : (
                      <select
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        required
                        className={`w-full rounded-md border p-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                      >
                        <option value="">Select group</option>
                        {groups.map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name}  {/* Assuming each group has 'id' and 'name' properties */}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-sm font-medium">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      required
                      className={`w-full rounded-md border p-2 ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    >
                      <option value="">Select status</option>
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={`bg-blue-600 hover:bg-blue-700 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditUserModal;
