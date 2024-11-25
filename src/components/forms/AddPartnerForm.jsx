import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axiosInstance'; // Import your custom axios instance

const AddSportForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    sports_discipline: '',
    legal_status: '',
    business: '',
    location_province: '',
    location_district: '',
    location_sector: '',
    location_cell: '',
    location_village: '',
    legal_representative_name: '',
    legal_representative_gender: '',
    legal_representative_email: '',
    legal_representative_phone: '',
    createdAt: '',
    updatedAt: '',
  });

  // If initialData is passed (edit mode), update formData state
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        sports_discipline: initialData.sports_discipline || '',
        legal_status: initialData.legal_status || '',
        business: initialData.business || '',
        location_province: initialData.location_province || '',
        location_district: initialData.location_district || '',
        location_sector: initialData.location_sector || '',
        location_cell: initialData.location_cell || '',
        location_village: initialData.location_village || '',
        legal_representative_name: initialData.legal_representative_name || '',
        legal_representative_gender: initialData.legal_representative_gender || '',
        legal_representative_email: initialData.legal_representative_email || '',
        legal_representative_phone: initialData.legal_representative_phone || '',
        createdAt: initialData.createdAt || '',
        updatedAt: initialData.updatedAt || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    // If we're editing, we don't want to include createdAt (or use initial createdAt)
    if (initialData) {
      delete payload.createdAt;
    } else {
      // For adding a new partner, ensure createdAt is included
      payload.createdAt = new Date().toISOString();
    }
  
    try {
      let response;
      if (initialData) {
        // Edit existing partner: Use PUT for updates
        response = await axiosInstance.put(`/partners/${initialData.id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Data updated successfully!');
      } else {
        // Add new partner: Use POST for creating a new entry
        response = await axiosInstance.post('/partners', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Data submitted successfully!');
      }
      onSubmit(response.data); // Return the response data to parent
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        toast.error(`Error: ${error.response.data.message || 'An error occurred'}`);
      } else {
        console.error('Error:', error);
        toast.error('There was an error submitting the form.');
      }
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Club Name */}
        <div>
          <label>Club Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Sports Discipline */}
        <div>
          <label>Sports Discipline</label>
          <input
            type="text"
            name="sports_discipline"
            value={formData.sports_discipline}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Legal Status */}
        <div>
          <label>Legal Status</label>
          <input
            type="text"
            name="legal_status"
            value={formData.legal_status}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Business */}
        <div>
          <label>Business</label>
          <input
            type="text"
            name="business"
            value={formData.business}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Location Province */}
        <div>
          <label>Location Province</label>
          <input
            type="text"
            name="location_province"
            value={formData.location_province}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Location District */}
        <div>
          <label>Location District</label>
          <input
            type="text"
            name="location_district"
            value={formData.location_district}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Location Sector */}
        <div>
          <label>Location Sector</label>
          <input
            type="text"
            name="location_sector"
            value={formData.location_sector}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Location Cell */}
        <div>
          <label>Location Cell</label>
          <input
            type="text"
            name="location_cell"
            value={formData.location_cell}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Location Village */}
        <div>
          <label>Location Village</label>
          <input
            type="text"
            name="location_village"
            value={formData.location_village}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Legal Representative Name */}
        <div>
          <label>Legal Representative Name</label>
          <input
            type="text"
            name="legal_representative_name"
            value={formData.legal_representative_name}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Legal Representative Gender */}
        <div>
          <label>Legal Representative Gender</label>
          <input
            type="text"
            name="legal_representative_gender"
            value={formData.legal_representative_gender}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Legal Representative Email */}
        <div>
          <label>Legal Representative Email</label>
          <input
            type="email"
            name="legal_representative_email"
            value={formData.legal_representative_email}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Legal Representative Phone */}
        <div>
          <label>Legal Representative Phone</label>
          <input
            type="tel"
            name="legal_representative_phone"
            value={formData.legal_representative_phone}
            onChange={handleChange}
            required
            className="w-full border rounded"
          />
        </div>
        {/* Submit / Cancel Buttons */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSportForm;
