import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import Select from 'react-select';
import axiosInstance from '../../utils/axiosInstance'; // Import the axios instance

const AddTrainingForm = ({ onSubmit, onCancel, isSubmitting, initialData }) => {
  // Initialize the state for employees (participants)
  const [availableProfessionals, setAvailableProfessionals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch employees from the API
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null); // Reset error state before making the request
      try {
        const response = await axiosInstance.get('/employees'); // Ensure this endpoint is correct
        console.log('API response:', response); // Check the structure of the response

        // Check if the response contains the "employees" key and it's an array
        if (response.data && Array.isArray(response.data.employees)) {
          const employees = response.data.employees.map((employee) => ({
            value: employee.email, // Use employee email or another unique identifier as the 'value'
            label: `${employee.firstname} ${employee.lastname}`, // Display name
            details: {
              type: employee.employee_type, // Add any additional details you need from the employee object
              email: employee.email, // Store email as additional information
            },
          }));
          setAvailableProfessionals(employees); // Set the employee data
        } else {
          setError('Failed to load employees. Invalid data format.');
        }
      } catch (err) {
        console.error('Error fetching employees:', err); // Log the error for debugging
        setError('Failed to load employees. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Initialize form data
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    fromDate: initialData?.startDate || '', // Ensure startDate defaults to empty string
    toDate: initialData?.endDate || '', // Ensure endDate defaults to empty string
    organiser: initialData?.organiser || '',
    participants: initialData?.participants || [], // Ensure participants is always an array
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        fromDate: initialData.startDate || '',
        toDate: initialData.endDate || '',
        organiser: initialData.organiser || '',
        participants: initialData.participants || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle multi-select changes for participants
  const handleParticipantChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      participants: selectedOptions ? selectedOptions.map(option => option.value) : [], // Ensure participants is always an array of ids
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.title || !formData.fromDate || !formData.organiser) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare submission data
      const submissionData = {
        title: formData.title,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        organiser: formData.organiser,
        participants: formData.participants, // Just the array of participant ids
      };

      // If there's initialData, it's an update, otherwise a create
      if (initialData) {
        await onSubmit({ ...submissionData, id: initialData.id }); // For edit, include the id
      } else {
        await onSubmit(submissionData); // For add, just send the data
      }

      // Reset form
      setFormData({
        title: '',
        fromDate: '',
        toDate: '',
        organiser: '',
        participants: [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formTitle = initialData ? 'Edit Training' : 'Add Training';
  const submitButtonText = initialData
    ? (isSubmitting ? 'Saving...' : 'Save Changes')
    : (isSubmitting ? 'Adding...' : 'Add Training');

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-4 space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Training Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Training Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Enter training title"
          disabled={loading}
        />
      </div>

      {/* Training Period */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            disabled={loading}
            min={formData.fromDate}
          />
        </div>
      </div>

      {/* Training Organiser */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Training Organiser <span className="text-red-500">*</span>
        </label>
        <select
          name="organiser"
          value={formData.organiser}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select Organiser</option>
          <option value="MINISPORTS">MINISPORTS</option>
          <option value="FERWAFA">FERWAFA</option>
          <option value="FERWABA">FERWABA</option>
        </select>
      </div>

      {/* Participants Multi-select */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Participants
        </label>
        <Select
          isMulti
          name="participants"
          options={availableProfessionals}
          className="basic-multi-select"
          classNamePrefix="select"
          value={formData.participants.map(id => availableProfessionals.find(p => p.value === id))}
          onChange={handleParticipantChange}
          placeholder="Select participants..."
          isDisabled={loading}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 mt-6 pt-4 border-t sticky bottom-0 bg-white">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting || loading}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default AddTrainingForm;
