import { useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useToast } from '../../contexts/ToastContext';
import { locations } from '../../data/locations';

const validationRules = {
  name: {
    required: true,
    minLength: 3
  },
  domain: {
    required: true
  },
  category: {
    required: true
  },
  location: {
    required: true,
    fields: {
      province: { required: true },
      district: { required: true },
      sector: { required: true },
      cell: { required: true },
      village: { required: true }
    }
  },
  legalRepresentativeName: {
    required: true
  },
  legalRepresentativeGender: {
    required: true
  },
  legalRepresentativeEmail: {
    required: true,
    email: true
  },
  legalRepresentativePhone: {
    required: true
  }
};

function InstitutionForm({ institution, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  // Set default values for the form
  const initialValues = {
    name: '',
    domain: '',
    category: 'EXCELLENCE SCHOOL',
    location: {
      province: '',
      district: '',
      sector: '',
      cell: '',
      village: ''
    },
    legalRepresentativeName: '',
    legalRepresentativeGender: 'Male',
    legalRepresentativeEmail: '',
    legalRepresentativePhone: '',
    ...institution // Spread institution to override defaults if provided
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    resetForm
  } = useFormValidation(initialValues, validationRules);

  const categories = ['EXCELLENCE SCHOOL', 'REGULAR SCHOOL', 'SPECIAL SCHOOL'];
  const genders = ['Male', 'Female'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(values);
      showToast('Institution saved successfully');
      resetForm();
    } catch (error) {
      showToast('Failed to save institution', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    const locationKey = name.split('.')[1]; // Access the correct nested location key (province, district, etc.)
    const updatedLocation = { ...values.location, [locationKey]: value }; // Update the specific location field

    // Reset dependent fields
    if (locationKey === 'province') {
      updatedLocation.district = '';
      updatedLocation.sector = '';
      updatedLocation.cell = '';
      updatedLocation.village = '';
    } else if (locationKey === 'district') {
      updatedLocation.sector = '';
      updatedLocation.cell = '';
      updatedLocation.village = '';
    } else if (locationKey === 'sector') {
      updatedLocation.cell = '';
      updatedLocation.village = '';
    } else if (locationKey === 'cell') {
      updatedLocation.village = '';
    }

    // Update the form state for location
    handleChange({ target: { name: 'location', value: updatedLocation } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="overflow-y-auto max-h-[80vh]">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Institution Name
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name && touched.name
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter institution name"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Domain
            </label>
            <input
              type="text"
              name="domain"
              value={values.domain}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.domain && touched.domain
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter domain"
            />
            {errors.domain && touched.domain && (
              <p className="mt-1 text-sm text-red-500">{errors.domain}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Category
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#E2E7F0] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Location
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1B2559] mb-2">
                  Province
                </label>
                <select
                  name="location.province"
                  value={values.location?.province || ''}
                  onChange={handleLocationChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.location?.province && touched.location?.province
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#E2E7F0] focus:ring-[#4318FF]'
                  } focus:outline-none focus:ring-2`}
                >
                  <option value="">Select Province</option>
                  {locations.provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.location?.province && touched.location?.province && (
                  <p className="mt-1 text-sm text-red-500">{errors.location.province}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B2559] mb-2">
                  District
                </label>
                <select
                  name="location.district"
                  value={values.location?.district || ''}
                  onChange={handleLocationChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.location?.district && touched.location?.district
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#E2E7F0] focus:ring-[#4318FF]'
                  } focus:outline-none focus:ring-2`}
                  disabled={!values.location.province}
                >
                  <option value="">Select District</option>
                  {locations.districts[values.location.province]?.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
                {errors.location?.district && touched.location?.district && (
                  <p className="mt-1 text-sm text-red-500">{errors.location.district}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B2559] mb-2">
                  Sector
                </label>
                <select
                  name="location.sector"
                  value={values.location?.sector || ''}
                  onChange={handleLocationChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.location?.sector && touched.location?.sector
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#E2E7F0] focus:ring-[#4318FF]'
                  } focus:outline-none focus:ring-2`}
                  disabled={!values.location.district}
                >
                  <option value="">Select Sector</option>
                  {locations.sectors[values.location.district]?.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
                {errors.location?.sector && touched.location?.sector && (
                  <p className="mt-1 text-sm text-red-500">{errors.location.sector}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B2559] mb-2">
                  Cell
                </label>
                <select
                  name="location.cell"
                  value={values.location?.cell || ''}
                  onChange={handleLocationChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.location?.cell && touched.location?.cell
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#E2E7F0] focus:ring-[#4318FF]'
                  } focus:outline-none focus:ring-2`}
                  disabled={!values.location.sector}
                >
                  <option value="">Select Cell</option>
                  {locations.cells[values.location.sector]?.map((cell) => (
                    <option key={cell} value={cell}>
                      {cell}
                    </option>
                  ))}
                </select>
                {errors.location?.cell && touched.location?.cell && (
                  <p className="mt-1 text-sm text-red-500">{errors.location.cell}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B2559] mb-2">
                  Village
                </label>
                <select
                  name="location.village"
                  value={values.location?.village || ''}
                  onChange={handleLocationChange}
                  onBlur={handleBlur}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.location?.village && touched.location?.village
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-[#E2E7F0] focus:ring-[#4318FF]'
                  } focus:outline-none focus:ring-2`}
                  disabled={!values.location.cell}
                >
                  <option value="">Select Village</option>
                  {locations.villages[values.location.cell]?.map((village) => (
                    <option key={village} value={village}>
                      {village}
                    </option>
                  ))}
                </select>
                {errors.location?.village && touched.location?.village && (
                  <p className="mt-1 text-sm text-red-500">{errors.location.village}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Legal Representative Name
            </label>
            <input
              type="text"
              name="legalRepresentativeName"
              value={values.legalRepresentativeName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.legalRepresentativeName && touched.legalRepresentativeName
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter legal representative name"
            />
            {errors.legalRepresentativeName && touched.legalRepresentativeName && (
              <p className="mt-1 text-sm text-red-500">{errors.legalRepresentativeName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Legal Representative Gender
            </label>
            <select
              name="legalRepresentativeGender"
              value={values.legalRepresentativeGender}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#E2E7F0] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
            >
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Legal Representative Email
            </label>
            <input
              type="email"
              name="legalRepresentativeEmail"
              value={values.legalRepresentativeEmail}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.legalRepresentativeEmail && touched.legalRepresentativeEmail
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter legal representative email"
            />
            {errors.legalRepresentativeEmail && touched.legalRepresentativeEmail && (
              <p className="mt-1 text-sm text-red-500">{errors.legalRepresentativeEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Legal Representative Phone
            </label>
            <input
              type="text"
              name="legalRepresentativePhone"
              value={values.legalRepresentativePhone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.legalRepresentativePhone && touched.legalRepresentativePhone
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter legal representative phone"
            />
            {errors.legalRepresentativePhone && touched.legalRepresentativePhone && (
              <p className="mt-1 text-sm text-red-500">{errors.legalRepresentativePhone}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 text-sm font-semibold text-white rounded-lg focus:outline-none focus:ring-2 ${
            loading ? 'bg-gray-500' : 'bg-[#4318FF] hover:bg-[#3600FF]'
          }`}
        >
          {loading ? 'Saving...' : 'Save Institution'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-sm font-semibold text-[#1B2559] rounded-lg border border-[#E2E7F0] hover:border-[#4318FF] focus:outline-none focus:ring-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default InstitutionForm;
