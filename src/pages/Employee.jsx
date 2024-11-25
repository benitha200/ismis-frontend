import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Loader2, Edit, Trash } from 'lucide-react'; // Add Trash icon for delete button
import AddEmployeeModal from '../components/AddEmployeeModal';
import EditEmployeeModal from '../components/EditEmployeeModal';
import toast from 'react-hot-toast';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/employee'; // Ensure you have deleteEmployee function
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog'; // Import Dialog components
import { AlertCircle } from 'lucide-react'; // For delete confirmation icon

function Employee() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { isDarkMode } = useTheme();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeesData, setEmployeesData] = useState([]);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete modal visibility
  const [employeeToDelete, setEmployeeToDelete] = useState(null); // State to store the employee to delete

  const getEmployees = async () => {
    try {
      setLoading(true);
      const data = await fetchEmployees();
      setEmployeesData(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch employees data');
      setEmployeesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleAddEmployee = async (newEmployee) => {
    try {
      await createEmployee(newEmployee);
      await getEmployees();
      setIsAddModalOpen(false);
      toast.success('Employee added successfully!');
    } catch (err) {
      toast.error('Failed to add employee.');
    }
  };

  const handleEditSubmit = async (updatedEmployee) => {
    try {
      await updateEmployee(updatedEmployee.id, updatedEmployee);
      await getEmployees();
      setIsEditModalOpen(false);
      toast.success('Employee updated successfully!');
    } catch (err) {
      toast.error('Failed to update employee.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEmployee(employeeToDelete.id); // Delete the employee
      await getEmployees(); // Refresh employee list
      setDeleteModalOpen(false); // Close the delete modal
      toast.success('Employee deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete employee.');
    }
  };

  const filteredData = employeesData.filter(employee =>
    Object.values(employee).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="mt-2 text-gray-600">Loading employee data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertTriangle className="w-8 h-8 text-red-600 mb-2" />
        <p className="text-red-600">{error}</p>
        <Button onClick={getEmployees} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'dark' : ''}`}>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Employees</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>Add Employee</Button>
        </div>

        <div className="mb-4">
          <Input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-left">Photo</th>
                <th className="px-6 py-3 border-b text-left">Name</th>
                <th className="px-6 py-3 border-b text-left">Email</th>
                <th className="px-6 py-3 border-b text-left">Status</th>
                <th className="px-6 py-3 border-b text-left">Type</th>
                <th className="px-6 py-3 border-b text-left">Gender</th>
                <th className="px-6 py-3 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-3 text-center">No employees found</td>
                </tr>
              ) : (
                filteredData.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-3 border-b">
                      <img
                        src={employee.photo_passport}
                        alt={employee.firstname}
                        className="w-12 h-12 rounded-full"
                      />
                    </td>
                    <td className="px-6 py-3 border-b">{`${employee.firstname} ${employee.lastname}`}</td>
                    <td className="px-6 py-3 border-b">{employee.email}</td>
                    <td className="px-6 py-3 border-b">{employee.employee_status}</td>
                    <td className="px-6 py-3 border-b">{employee.employee_type}</td>
                    <td className="px-6 py-3 border-b">{employee.gender}</td>
                    <td className="px-6 py-3 border-b flex gap-2">
                      <Button onClick={() => { setSelectedEmployee(employee); setIsEditModalOpen(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                              size="sm"
                              variant="destructive"
                      onClick={() => { setEmployeeToDelete(employee); setDeleteModalOpen(true); }}>
                        <Trash className="h-4 w-4 mr-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />
      <EditEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        employee={selectedEmployee}
        onEdit={handleEditSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription className="py-4">
              Are you sure you want to delete <span className="font-semibold">{employeeToDelete?.firstname} {employeeToDelete?.lastname}</span>?
              This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Employee
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Employee;
