import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../components/ui/table';
import { Search, Plus, Filter, X } from 'lucide-react';
import Modal from '../components/ui/Modal';
import AddTrainingForm from '../components/forms/AddTrainingForm';
import ActionMenu from '../components/ui/ActionMenu';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance'; // import the axios instance

const Training = () => {
  const { isDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState('All 87');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [filteredTrainings, setFilteredTrainings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [editDataToConfirm, setEditDataToConfirm] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState(null);

  // Fetch training data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/trainings'); // replace with your endpoint
        setTrainings(response.data);
        setFilteredTrainings(response.data);
        setIsLoading(false);
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Failed to load trainings. Please try again.'
        });
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding new training
  const handleAddTraining = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/trainings', data); // replace with your endpoint
      setTrainings([...trainings, response.data]);
      setFilteredTrainings([...trainings, response.data]);
      setShowAddModal(false);
      setMessage({
        type: 'success',
        text: 'Training added successfully'
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to add training'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing a training
  const handleEditConfirm = async (updatedData) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.put(`/trainings/${selectedTraining.id}`, updatedData); // replace with your endpoint
      const updatedTrainings = trainings.map(t => 
        t.id === selectedTraining.id ? { ...t, ...response.data } : t
      );
      setTrainings(updatedTrainings);
      setFilteredTrainings(updatedTrainings);
      setShowEditConfirm(false);
      setShowAddModal(false);
      setSelectedTraining(null);
      setEditDataToConfirm(null);
      toast.success('Training updated successfully');
    } catch (error) {
      toast.error('Failed to update training');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a training
  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      await axiosInstance.delete(`/trainings/${trainingToDelete.id}`); // replace with your endpoint
      const updatedTrainings = trainings.filter(t => t.id !== trainingToDelete.id);
      setTrainings(updatedTrainings);
      setFilteredTrainings(updatedTrainings);
      setShowDeleteConfirm(false);
      setTrainingToDelete(null);
      toast.success('Training deleted successfully');
    } catch (error) {
      toast.error('Failed to delete training');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle search
  const handleSearch = (searchValue) => {
    const filtered = trainings.filter(training => 
      training.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.organiser.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.venue.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.type.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.status.toLowerCase().includes(searchValue.toLowerCase()) ||
      training.period.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredTrainings(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTrainings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTrainings.length / itemsPerPage);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <div className={`p-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search trainings..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            handleSearch(e.target.value);
          }}
          className="border p-2 rounded-md w-full"
        />
        <Button
          variant="default"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-4 w-4" />
          Add Training
        </Button>
      </div>

      {/* Trainings Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Organiser</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Period</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((training) => (
            <TableRow key={training.id}>
              <TableCell>{training.title}</TableCell>
              <TableCell>{training.organiser}</TableCell>
              <TableCell>{training.venue}</TableCell>
              <TableCell>{training.type}</TableCell>
              <TableCell>{training.status}</TableCell>
              <TableCell>{`${training.period.startDate} to ${training.period.endDate}`}</TableCell>
              <TableCell>
                <ActionMenu
                  onEdit={() => {
                    setSelectedTraining(training);
                    setShowAddModal(true);
                  }}
                  onDelete={() => {
                    setTrainingToDelete(training);
                    setShowDeleteDialog(true);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => !isSubmitting && setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm} 
        title="Delete Training"
        message={`Are you sure you want to delete ${selectedTraining?.title}? This action cannot be undone.`}
        isSubmitting={isSubmitting}
      />

      <Modal
        isOpen={showAddModal}
        onClose={() => {
          if (!isSubmitting) {
            setShowAddModal(false);
            setSelectedTraining(null);
          }
        }}
        title={selectedTraining ? "Edit Training" : "Add Training"}
      >
        <AddTrainingForm
          initialData={selectedTraining}
          onSubmit={(data) => {
            if (selectedTraining) {
              setEditDataToConfirm(data);
              setShowEditConfirm(true);
            } else {
              handleAddTraining(data);
            }
          }}
          onCancel={() => {
            if (!isSubmitting) {
              setShowAddModal(false);
              setSelectedTraining(null);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Edit Confirmation Dialog */}
      <Dialog open={showEditConfirm} onOpenChange={setShowEditConfirm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              Confirm Changes
            </DialogTitle>
            <DialogDescription className="py-4">
              <div className="space-y-4">
                <p>Please confirm the following changes:</p>
                {editDataToConfirm && (
                  <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg">
                    <p><span className="font-semibold">Title:</span> {editDataToConfirm.title}</p>
                    <p><span className="font-semibold">Period:</span> {editDataToConfirm.period.startDate} to {editDataToConfirm.period.endDate}</p>
                    <p><span className="font-semibold">Organiser:</span> {editDataToConfirm.organiser}</p>
                    <p><span className="font-semibold">Venue:</span> {editDataToConfirm.venue}</p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button
              variant="destructive"
              onClick={() => handleEditConfirm(editDataToConfirm)}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Confirm Changes'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowEditConfirm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Training;
