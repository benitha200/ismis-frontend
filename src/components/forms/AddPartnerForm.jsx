import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../utils/axiosInstance';
import { locations } from '../../data/locations'; // Ensure this matches the export

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

  const [disciplines, setDisciplines] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [cells, setCells] = useState([]);
  const [villages, setVillages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        createdAt: initialData.createdAt || '',
        updatedAt: initialData.updatedAt || '',
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        const response = await axiosInstance.get('/disciplines');
        setDisciplines(response.data);
      } catch (error) {
        console.error('Error fetching disciplines:', error);
        toast.error('Failed to load disciplines');
      }
    };

    fetchDisciplines();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'location_province') {
      const selectedDistricts = locations.districts[value] || [];
      setDistricts(selectedDistricts);
      setSectors([]);
      setCells([]);
      setVillages([]);
    } else if (name === 'location_district') {
      const selectedSectors = locations.sectors[value] || [];
      setSectors(selectedSectors);
      setCells([]);
      setVillages([]);
    } else if (name === 'location_sector') {
      const selectedCells = locations.cells[value] || [];
      setCells(selectedCells);
      setVillages([]);
    } else if (name === 'location_cell') {
      const selectedVillages = locations.villages[value] || [];
      setVillages(selectedVillages);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };

    if (initialData) {
      delete payload.createdAt;
    } else {
      payload.createdAt = new Date().toISOString();
    }

    try {
      let response;
      if (initialData) {
        response = await axiosInstance.put(`/partners/${initialData.id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Data updated successfully!');
      } else {
        response = await axiosInstance.post('/partners', payload, {
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Data submitted successfully!');
      }
      onSubmit(response.data);
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
          <select
            name="sports_discipline"
            value={formData.sports_discipline}
            onChange={handleChange}
            required
            className="w-full border rounded"
          >
            <option value="">Select Discipline</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.name}>
                {discipline.name}
              </option>
            ))}
          </select>
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
          <select
            name="location_province"
            value={formData.location_province}
            onChange={handleChange}
            required
            className="w-full border rounded"
          >
            <option value="">Select Province</option>
            {locations.provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>
        {/* Location District */}
        <div>
          <label>Location District</label>
          <select
            name="location_district"
            value={formData.location_district}
            onChange={handleChange}
            required
            className="w-full border rounded"
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
        {/* Location Sector */}
        <div>
          <label>Location Sector</label>
          <select
            name="location_sector"
            value={formData.location_sector}
            onChange={handleChange}
            required
            className="w-full border rounded"
          >
            <option value="">Select Sector</option>
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </select>
        </div>
        {/* Location Cell */}
        <div>
          <label>Location Cell</label>
          <select
            name="location_cell"
            value={formData.location_cell}
            onChange={handleChange}
            required
            className="w-full border rounded"
          >
            <option value="">Select Cell</option>
            {cells.map((cell) => (
              <option key={cell} value={cell}>
                {cell}
              </option>
            ))}
          </select>
        </div>
        {/* Location Village */}
        <div>
          <label>Location Village</label>
          <select
            name="location_village"
            value={formData.location_village}
            onChange={handleChange}
            required
            className="w-full border rounded"
          >
            <option value="">Select Village</option>
            {villages.map((village) => (
              <option key={village} value={village}>
                {village}
              </option>
            ))}
          </select>
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
