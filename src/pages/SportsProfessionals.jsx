import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import PageLoading from '../components/ui/PageLoading';
import Message from '../components/ui/Message';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '../components/ui/Table';
import axiosInstance from '../utils/axiosInstance';
import Modal from '../components/ui/Modal';

const SportsProfessionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [functions, setFunctions] = useState([]);

  const [filteredProfessionals, setFilteredProfessionals] = useState([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState([]);
  const [filteredFunctions, setFilteredFunctions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('Professionals'); // Default to Professionals tab

  const [disciplineForm, setDisciplineForm] = useState({ name: '', type: '' });
  const [functionForm, setFunctionForm] = useState({ name: '', disciplineId: '' });

  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const [addingDiscipline, setAddingDiscipline] = useState(null);
  const [editingFunction, setEditingFunction] = useState(null);
  const [addingFunction, setAddingFunction] = useState(null);
  const [editingProfessional, setEditingProfessional] = useState(null);

  useEffect(() => {
    const fetchDisciplines = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/disciplines');
        setDisciplines(response.data);
        setFilteredDisciplines(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error fetching disciplines');
      }
    };

    const fetchFunctions = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/functions');
        setFunctions(response.data);
        setFilteredFunctions(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error fetching functions');
      }
    };

    const fetchProfessionals = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/professionals');
        setProfessionals(response.data);
        setFilteredProfessionals(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        toast.error('Error fetching professionals');
      }
    };

    fetchDisciplines();
    fetchFunctions();
    fetchProfessionals();
  }, []);

  // Handlers for Discipline Management
  const handleAddDiscipline = async () => {
    try {
      const response = await axiosInstance.post('/disciplines', disciplineForm);
      setDisciplines((prevState) => [...prevState, response.data]);
      setFilteredDisciplines((prevState) => [...prevState, response.data]);
      toast.success('Discipline added successfully');
      setDisciplineForm({ name: '', type: '' });
    } catch (error) {
      toast.error('Error adding discipline');
    }
  };

  const handleEditDiscipline = async () => {
    try {
      const response = await axiosInstance.put(`/disciplines/${editingDiscipline.id}`, disciplineForm);
      setDisciplines((prevState) =>
        prevState.map((d) => (d.id === editingDiscipline.id ? response.data : d))
      );
      setFilteredDisciplines((prevState) =>
        prevState.map((d) => (d.id === editingDiscipline.id ? response.data : d))
      );
      toast.success('Discipline updated successfully');
      setEditingDiscipline(null);
      setDisciplineForm({ name: '', type: '' });
    } catch (error) {
      toast.error('Error updating discipline');
    }
  };

  const handleDeleteDiscipline = async (discipline) => {
    try {
      await axiosInstance.delete(`/disciplines/${discipline.id}`);
      setDisciplines((prevState) => prevState.filter((d) => d.id !== discipline.id));
      setFilteredDisciplines((prevState) => prevState.filter((d) => d.id !== discipline.id));
      toast.success('Discipline deleted successfully');
    } catch (error) {
      toast.error('Error deleting discipline');
    }
  };

  const handleAddFunction = async () => {
    try {
      // Log the function form data to check its structure
      console.log('Form data being sent:', functionForm);
  
      // Ensure the data is in the correct format:
      const payload = {
        name: functionForm.name,
        disciplineId: Number(functionForm.disciplineId)  // Ensure it's a number
      };
  
      // Check if the disciplineId is valid before sending the request
      if (!payload.disciplineId || !payload.name) {
        toast.error('Please ensure both name and discipline are selected');
        return; // Exit the function if the data is invalid
      }
  
      // Send the request with the correct payload
      const response = await axiosInstance.post('/functions', payload);
  
      // Handle success
      setFunctions((prevState) => [...prevState, response.data]);
      setFilteredFunctions((prevState) => [...prevState, response.data]);
      toast.success('Function added successfully');
  
      // Reset the form
      setFunctionForm({ name: '', disciplineId: '' });
  
    } catch (error) {
      // Log the error to the console and show a toast notification
      console.error('Error occurred:', error.response);
      toast.error('Error adding function');
    }
  };
  
  const handleEditFunction = async () => {
    try {
      const response = await axiosInstance.put(`/functions/${editingFunction.id}`, functionForm);
      setFunctions((prevState) =>
        prevState.map((f) => (f.id === editingFunction.id ? response.data : f))
      );
      setFilteredFunctions((prevState) =>
        prevState.map((f) => (f.id === editingFunction.id ? response.data : f))
      );
      toast.success('Function updated successfully');
      setEditingFunction(null);
      setFunctionForm({ name: '', disciplineId: '' });
    } catch (error) {
      toast.error('Error updating function');
    }
  };

  const handleDeleteFunction = async (func) => {
    try {
      await axiosInstance.delete(`/functions/${func.id}`);
      setFunctions((prevState) => prevState.filter((f) => f.id !== func.id));
      setFilteredFunctions((prevState) => prevState.filter((f) => f.id !== func.id));
      toast.success('Function deleted successfully');
    } catch (error) {
      toast.error('Error deleting function');
    }
  };

  // Handlers for Sports Professionals
  const handleAddProfessional = async () => {
    try {
      const response = await axiosInstance.post('/professionals', professionalForm);
      setProfessionals((prevState) => [...prevState, response.data]);
      setFilteredProfessionals((prevState) => [...prevState, response.data]);
      toast.success('Professional added successfully');
      setProfessionalForm({ name: '', username: '', phone: '', nationality: '' });
    } catch (error) {
      toast.error('Error adding professional');
    }
  };

  const handleEditProfessional = async () => {
    try {
      const response = await axiosInstance.put(`/professionals/${editingProfessional.id}`, professionalForm);
      setProfessionals((prevState) =>
        prevState.map((p) => (p.id === editingProfessional.id ? response.data : p))
      );
      setFilteredProfessionals((prevState) =>
        prevState.map((p) => (p.id === editingProfessional.id ? response.data : p))
      );
      toast.success('Professional updated successfully');
      setEditingProfessional(null);
      setProfessionalForm({ name: '', username: '', phone: '', nationality: '' });
    } catch (error) {
      toast.error('Error updating professional');
    }
  };

  const handleDeleteProfessional = async (professional) => {
    try {
      await axiosInstance.delete(`/professionals/${professional.id}`);
      setProfessionals((prevState) => prevState.filter((p) => p.id !== professional.id));
      setFilteredProfessionals((prevState) => prevState.filter((p) => p.id !== professional.id));
      toast.success('Professional deleted successfully');
    } catch (error) {
      toast.error('Error deleting professional');
    }
  };

  const renderDisciplineRow = (discipline) => (
    <tr key={discipline.id}>
      <td>{discipline.name}</td>
      <td>{discipline.type}</td>
      <td>
        <button
          onClick={() => {
            setEditingDiscipline(discipline);
            setDisciplineForm({ name: discipline.name, type: discipline.type });
          }}
        >
          <Edit />
        </button>
        <button onClick={() => handleDeleteDiscipline(discipline)}>
          <Trash2 />
        </button>
      </td>
    </tr>
  );

  const renderFunctionRow = (func) => (
    <tr key={func.id}>
      <td>{func.name}</td>
      <td>{disciplines.find((d) => d.id === func.disciplineId)?.name}</td>
      <td>
        <button
          onClick={() => {
            setEditingFunction(func);
            setFunctionForm({ name: func.name, disciplineId: func.disciplineId });
          }}
        >
          <Edit />
        </button>
        <button onClick={() => handleDeleteFunction(func)}>
          <Trash2 />
        </button>
      </td>
    </tr>
  );

  const renderProfessionalRow = (professional) => (
    <tr key={professional.id}>
      <td>{professional.name}</td>
      <td>{professional.username}</td>
      <td>{professional.phone}</td>
      <td>{professional.nationality}</td>
      <td>
        <button
          onClick={() => {
            setEditingProfessional(professional);
            setProfessionalForm({
              name: professional.name,
              username: professional.username,
              phone: professional.phone,
              nationality: professional.nationality,
            });
          }}
        >
          <Edit />
        </button>
        <button onClick={() => handleDeleteProfessional(professional)}>
          <Trash2 />
        </button>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      {/* Tabs for navigation */}
      <div className="flex space-x-4">
        <Button onClick={() => setActiveTab('Professionals')} variant={activeTab === 'Professionals' ? 'solid' : 'outline'}>
          Sports Professionals
        </Button>
        <Button onClick={() => setActiveTab('Disciplines')} variant={activeTab === 'Disciplines' ? 'solid' : 'outline'}>
          Manage Disciplines
        </Button>
        <Button onClick={() => setActiveTab('Functions')} variant={activeTab === 'Functions' ? 'solid' : 'outline'}>
          Manage Functions
        </Button>
      </div>

      {/* Content for Sports Professionals */}
      {activeTab === 'Professionals' && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Sports Professionals</h3>
            <Button onClick={() => setEditingProfessional(null)}>Add New</Button>
            
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{filteredProfessionals.map(renderProfessionalRow)}</TableBody>
          </Table>
        </div>
      )}

      {/* Content for Manage Disciplines */}
      {activeTab === 'Disciplines' && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Manage Disciplines</h3>
            <Button onClick={() => setAddingDiscipline(true)}>Add New</Button>

          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{filteredDisciplines.map(renderDisciplineRow)}</TableBody>
          </Table>
        </div>
      )}

      {/* Content for Manage Functions */}
      {activeTab === 'Functions' && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-xl font-semibold">Manage Functions</h3>
            <Button onClick={() => setAddingFunction(true)}>Add New</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Discipline</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{filteredFunctions.map(renderFunctionRow)}</TableBody>
          </Table>
        </div>
      )}

      {/* Discipline Modal */}
      {editingDiscipline !== null && (
        <Modal
          isOpen={true}
          onClose={() => setEditingDiscipline(null)}
          title={editingDiscipline ? 'Edit Discipline' : 'Add Discipline'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (editingDiscipline) {
                handleEditDiscipline();
              } else {
                handleAddDiscipline();
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-semibold">Name</label>
                <input
                  type="text"
                  className="input"
                  value={disciplineForm.name}
                  onChange={(e) => setDisciplineForm({ ...disciplineForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold">Type</label>
                <input
                  type="text"
                  className="input"
                  value={disciplineForm.type}
                  onChange={(e) => setDisciplineForm({ ...disciplineForm, type: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Modal>
      )}




      {/* add Discipline Modal */}
      {addingDiscipline !== null && (
        <Modal
          isOpen={true}
          onClose={() => setAddingDiscipline(null)}
          title={addingDiscipline ? 'Add Discipline' : 'Edit Discipline'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (addingDiscipline) {
                handleAddDiscipline();
              } else {
                handleEditDiscipline();
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block font-semibold">Name</label>
                <input
                  type="text"
                  className="input"
                  value={disciplineForm.name}
                  onChange={(e) => setDisciplineForm({ ...disciplineForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block font-semibold">Type</label>
                <input
                  type="text"
                  className="input"
                  value={disciplineForm.type}
                  onChange={(e) => setDisciplineForm({ ...disciplineForm, type: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Modal>
      )}




      {/* Function Modal */}
      {editingFunction !== null && (
       <Modal
       isOpen={true}
       onClose={() => setEditingFunction(null)}
       title={editingFunction ? 'Edit Function' : 'Add Function'}
     >
       <form
         onSubmit={(e) => {
           e.preventDefault();
           if (editingFunction) {
             handleEditFunction();
           } else {
             handleAddFunction();
           }
         }}
       >
         <div className="space-y-4">
           <div className="space-y-2">
             <label className="block font-semibold">Name</label>
             <input
               type="text"
               className="input"
               value={functionForm.name}
               onChange={(e) => setFunctionForm({ ...functionForm, name: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <label className="block font-semibold">Discipline</label>
             <select
               className="input"
               value={functionForm.disciplineId}
               onChange={(e) => setFunctionForm({ ...functionForm, disciplineId: e.target.value })}
               required
             >
               <option value="">Select Discipline</option>
               {disciplines.map((discipline) => (
                 <option key={discipline.id} value={discipline.id}>
                   {discipline.name}
                 </option>
               ))}
             </select>
           </div>
           <Button type="submit">Save</Button>
         </div>
       </form>
     </Modal>

      )}
      
      {/*add Function Modal */}
      {addingFunction !== null && (
       <Modal
       isOpen={true}
       onClose={() => setAddingFunction(null)}
       title={addingFunction ? 'Add Function' : 'Edit Function'}
     >
       <form
         onSubmit={(e) => {
           e.preventDefault();
           if (addingFunction) {
             handleAddFunction();
           } else {
             handleEditFunction();
           }
         }}
       >
         <div className="space-y-4">
           <div className="space-y-2">
             <label className="block font-semibold">Name</label>
             <input
               type="text"
               className="input"
               value={functionForm.name}
               onChange={(e) => setFunctionForm({ ...functionForm, name: e.target.value })}
               required
             />
           </div>
           <div className="space-y-2">
             <label className="block font-semibold">Discipline</label>
             <select
               className="input"
               value={functionForm.disciplineId}
               onChange={(e) => setFunctionForm({ ...functionForm, disciplineId: e.target.value })}
               required
             >
               <option value="">Select Discipline</option>
               {disciplines.map((discipline) => (
                 <option key={discipline.id} value={discipline.id}>
                   {discipline.name}
                 </option>
               ))}
             </select>
           </div>
           <Button type="submit">Save</Button>
         </div>
       </form>
     </Modal>
     
     
      )}

    </div>
  );
};

export default SportsProfessionals;
