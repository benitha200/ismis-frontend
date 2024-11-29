import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosInstance';

const AddNationalTeamForm = ({ initialData = {}, isEditing = false, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    teamMonth: '',
    teamYear: '',
    federationId: '',
    competition: '',
    city: '',
    country: '',
    games: [
      {
        stadium: ''
      }
    ],
    ...initialData // Spread initial data to pre-fill the form if editing
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleGamesChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGames = [...formData.games];
    updatedGames[index] = { ...updatedGames[index], [name]: value };
    setFormData((prevData) => ({
      ...prevData,
      games: updatedGames
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isEditing ? `/national-teams/${formData.id}` : '/national-teams';
      const method = isEditing ? 'put' : 'post';
      const response = await axiosInstance[method](endpoint, formData);
      console.log('Form submitted successfully:', response);
      if (onSubmitSuccess) onSubmitSuccess(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Team Name:</label>
            <input
              type="text"
              name="teamName"
              value={formData.teamName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Month:</label>
            <input
              type="text"
              name="teamMonth"
              value={formData.teamMonth}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Year:</label>
            <input
              type="number"
              name="teamYear"
              value={formData.teamYear}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Federation ID:</label>
            <input
              type="number"
              name="federationId"
              value={formData.federationId}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Competition:</label>
            <input
              type="text"
              name="competition"
              value={formData.competition}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City:</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stadium:</label>
            <input
              type="text"
              name="stadium"
              value={formData.games[0].stadium}
              onChange={(e) => handleGamesChange(0, e)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2"
          >
            {isEditing ? 'Update Team' : 'Add Team'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNationalTeamForm;
