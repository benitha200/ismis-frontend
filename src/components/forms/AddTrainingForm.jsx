import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import Select from 'react-select';

const AddTrainingForm = ({ onSubmit, onCancel, isSubmitting, initialData }) => {
  const [availableProfessionals] = useState([
    {
      value: 1,
      label: 'John Doe',
      details: {
        type: 'Player',
        federation: 'FERWAFA',
        club: 'APR FC',
      }
    },
    {
      value: 2,
      label: 'Jane Smith',
      details: {
        type: 'Staff',
        federation: 'FERWABA',
        club: 'Patriots',
      }
    }
    // ... more professionals
  ]);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    fromDate: initialData?.fromDate || '',
    toDate: initialData?.toDate || '',
    organiser: initialData?.organiser || '',
    participants: initialData?.participants || [],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        fromDate: initialData.fromDate || '',
        toDate: initialData.toDate || '',
        organiser: initialData.organiser || '',
        participants: initialData.participants || [],
      });
    }
  }, [initialData]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleParticipantChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      participants: selectedOptions ? selectedOptions.map(p => p.value) : []
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.title || !formData.fromDate || !formData.organiser) {
        throw new Error('Please fill in all required fields');
      }

      // Prepare the data to submit
      const submissionData = {
        title: formData.title,
        fromDate: formData.fromDate,
        toDate: formData.toDate,
        organiser: formData.organiser,
        participants: formData.participants,
      };

      await onSubmit(submissionData);
      
      // Reset form after submission
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
          formatOptionLabel={({ label, details }) => (
            <div className="flex justify-between items-center">
              <span>{label}</span>
              <span className="text-xs text-gray-500">
                {details.type} - {details.club}
              </span>
            </div>
          )}
        />
      </div>

      {/* Selected Participants Summary */}
      {formData.participants.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Selected Participants ({formData.participants.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {formData.participants.map((participantId) => {
              const participant = availableProfessionals.find(p => p.value === participantId);
              return (
                <div 
                  key={participant.value}
                  className="bg-white px-3 py-1 rounded-full border text-sm flex items-center gap-2"
                >
                  <span>{participant.label}</span>
                  <span className="text-xs text-gray-500">
                    {participant.details.type}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

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
          disabled={isSubmitting}
        >
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default AddTrainingForm;
