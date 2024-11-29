import { useState } from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';

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
  'location.province': {
    required: true
  },
  'location.district': {
    required: true
  },
  'location.sector': {
    required: true
  },
  'location.cell': {
    required: true
  },
  'location.village': {
    required: true
  },
  legalRepresentativeName: {
    required: true
  },
  legalRepresentativeGender: {
    required: true
  },
  legalRepresentativeEmail: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  legalRepresentativePhone: {
    required: true,
    minLength: 10
  }
};

function InstitutionForm({ institution = {}, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    resetForm
  } = useFormValidation(
    {
      name: institution?.name || '',
      domain: institution?.domain || '',
      category: institution?.category || 'EXCELLENCE SCHOOL',
      location: {
        province: institution?.location?.province || '',
        district: institution?.location?.district || '',
        sector: institution?.location?.sector || '',
        cell: institution?.location?.cell || '',
        village: institution?.location?.village || ''
      },
      legalRepresentativeName: institution?.legalRepresentativeName || '',
      legalRepresentativeGender: institution?.legalRepresentativeGender || '',
      legalRepresentativeEmail: institution?.legalRepresentativeEmail || '',
      legalRepresentativePhone: institution?.legalRepresentativePhone || ''
    },
    validationRules
  );

  const categories = ['EXCELLENCE SCHOOL', 'REGULAR SCHOOL', 'SPECIAL SCHOOL'];
  const genders = ['Male', 'Female'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(values);
      resetForm();
    } catch (error) {
      console.error('Failed to save institution', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="max-h-[70vh] overflow-y-auto p-4 border rounded-lg">
        <div className="grid grid-cols-2 gap-6">
          {/* Institution Name */}
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

          {/* Domain */}
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

          {/* Category */}
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Province */}
          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Province
            </label>
            <input
              type="text"
              name="location.province"
              value={values.location.province}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors['location.province'] && touched['location.province']
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter province"
            />
            {errors['location.province'] && touched['location.province'] && (
              <p className="mt-1 text-sm text-red-500">{errors['location.province']}</p>
            )}
          </div>

          {/* District */}
          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              District
            </label>
            <input
              type="text"
              name="location.district"
              value={values.location.district}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors['location.district'] && touched['location.district']
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter district"
            />
            {errors['location.district'] && touched['location.district'] && (
              <p className="mt-1 text-sm text-red-500">{errors['location.district']}</p>
            )}
          </div>

          {/* Sector */}
          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Sector
            </label>
            <input
              type="text"
              name="location.sector"
              value={values.location.sector}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors['location.sector'] && touched['location.sector']
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter sector"
            />
            {errors['location.sector'] && touched['location.sector'] && (
              <p className="mt-1 text-sm text-red-500">{errors['location.sector']}</p>
            )}
          </div>

          {/* Cell */}
          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Cell
            </label>
            <input
              type="text"
              name="location.cell"
              value={values.location.cell}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors['location.cell'] && touched['location.cell']
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter cell"
            />
            {errors['location.cell'] && touched['location.cell'] && (
              <p className="mt-1 text-sm text-red-500">{errors['location.cell']}</p>
            )}
          </div>

          {/* Village */}
          <div>
            <label className="block text-sm font-medium text-[#1B2559] mb-2">
              Village
            </label>
            <input
              type="text"
              name="location.village"
              value={values.location.village}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors['location.village'] && touched['location.village']
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-[#E2E7F0] focus:ring-[#4318FF]'
              } focus:outline-none focus:ring-2`}
              placeholder="Enter village"
            />
            {errors['location.village'] && touched['location.village'] && (
              <p className="mt-1 text-sm text-red-500">{errors['location.village']}</p>
            )}
          </div>

          {/* Legal Representative Name */}
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

          {/* Legal Representative Gender */}
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
              <option value="">Select gender</option>
              {genders.map(gender => (
                <option key={gender} value={gender}>{gender}</option>
              ))}
            </select>
          </div>

          {/* Legal Representative Email */}
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

          {/* Legal Representative Phone */}
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

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-lg border border-[#E2E7F0] text-[#A3AED0] hover:bg-[#F4F7FE]"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg bg-[#4318FF] text-white hover:bg-[#3311CC] disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default InstitutionForm;
