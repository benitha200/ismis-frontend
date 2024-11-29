/* src/pages/NationalTeams.jsx */
import React, { useState, useEffect, Fragment } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Plus, Eye, Edit, Trash2, X } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from '../components/ui/button';
import Modal from '../components/ui/Modal';
import AddNationalTeamForm from '../components/forms/AddNationalTeamForm';
import toast from 'react-hot-toast';

function NationalTeams() {
  // Basic state declarations
  const [activeTab, setActiveTab] = useState('Manage National Teams');
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeamData, setSelectedTeamData] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTeam, setViewTeam] = useState(null);

  // Player form states
  const [selectedTeamForPlayer, setSelectedTeamForPlayer] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [availableGames, setAvailableGames] = useState([]);
// Update the Games Section in the modal
const [selectedGames, setSelectedGames] = useState([]);
// Add this to your state declarations
const [playerStaffList, setPlayerStaffList] = useState([]);
const [selectedPlayerStaff, setSelectedPlayerStaff] = useState('');


  // Tabs configuration
  const tabs = [
    'Manage National Teams',
    'Manage Players'
  ];

  // Table columns configuration
  const teamColumns = [
    { key: 'id', header: 'ID' },
    { key: 'teamName', header: 'TEAM NAME' },
    { key: 'month', header: 'MONTH' },
    { key: 'status', header: 'STATUS' },
    { key: 'federation', header: 'FEDERATION' },
    { key: 'players', header: 'PLAYERS' }
  ];

  const playerColumns = [
    { key: 'name', header: 'Player Name' },
    { key: 'teamName', header: 'Team' },
    { key: 'federation', header: 'Federation' },
    { key: 'club', header: 'Club' },
    { key: 'games', header: 'Games' }
  ];

 // Update the useEffect to fetch player-staff data
useEffect(() => {
  async function fetchData() {
    try {
      const [teamResponse, playerResponse, clubResponse, playerStaffResponse] = await Promise.all([
        axiosInstance.get('/national-teams'),
        axiosInstance.get('/national-team-player-staff'),
        axiosInstance.get('/clubs'),
        axiosInstance.get('/player-staff'), // Add this new endpoint
      ]);
      setTeams(teamResponse.data);
      setPlayers(playerResponse.data);
      setClubs(clubResponse.data);
      setPlayerStaffList(playerStaffResponse.data);
    } catch (error) {
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);

  // Handle team operations
  const handleView = (team) => {
    setViewTeam(team);
    setIsViewModalOpen(true);
  };

  const handleEdit = (team) => {
    setSelectedTeamData(team);
    setShowAddModal(true);
  };

  const handleDelete = (team) => {
    setSelectedTeamData(team);
    setShowDeleteDialog(true);
  };

  const handleAddTeam = async (data) => {
    try {
      if (selectedTeamData) {
        const response = await axiosInstance.put(`/national-teams/${selectedTeamData.id}`, data);
        setTeams(prev => prev.map(team => 
          team.id === selectedTeamData.id ? response.data : team
        ));
        toast.success('Team updated successfully');
      } else {
        const response = await axiosInstance.post('/national-teams', {
          ...data,
          status: 'Active'
        });
        setTeams(prev => [...prev, response.data]);
        toast.success('Team added successfully');
      }
      setShowAddModal(false);
      setSelectedTeamData(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const confirmDelete = async () => {
    try {
      await axiosInstance.delete(`/national-teams/${selectedTeamData.id}`);
      setTeams(prev => prev.filter(team => team.id !== selectedTeamData.id));
      setShowDeleteDialog(false);
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete team');
    }
  };

 // Handle player operations
const handleAddPlayerSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const selectedTeam = teams.find(t => t.id === parseInt(selectedTeamForPlayer));
  const selectedClubData = clubs.find(c => c.id === parseInt(selectedClub));

  // const playerData = {
  //   name: formData.get('name'),
  //   federationId: selectedTeam?.federationId,
  //   teamId: parseInt(selectedTeamForPlayer),
  //   clubId: parseInt(selectedClub),
 
  // };

  const playerData = {
    federationId: selectedTeam?.federationId,
    teamId: parseInt(selectedTeamForPlayer),
    // name: formData.get('name'),
    clubId: parseInt(selectedClub),
    playerStaffId: parseInt(selectedPlayerStaff),
    games: parseInt(selectedGames),
 
  };


  try {
    console.log(playerData);
    const response = await axiosInstance.post('/national-team-player-staff', playerData);
    setPlayers(prev => [...prev, response.data]);
    toast.success('Player added successfully');
    setShowAddPlayerModal(false);
    
    // Reset form states
    setSelectedTeamForPlayer('');
    setSelectedClub('');
    setAvailableGames([]);
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to add player');
  }
};


  // Render team details
  const renderTeamDetails = (team) => {
    if (!team) return null;

    const details = [
      { label: 'Team Name', value: team.teamName },
      { label: 'Month', value: team.month },
      { label: 'Status', value: team.status },
      { label: 'Federation', value: team.federation.name || team.federation }, // Ensure federation is a string
      { label: 'Players', value: Array.isArray(team.players) ? team.players.length : team.players } // Ensure players is a number
    ];

    return (
      <div className="space-y-4">
        {details.map((detail, index) => (
          <div key={index} className="grid grid-cols-2 gap-4">
            <span className="text-gray-500">{detail.label}:</span>
            <span className="font-medium">{detail.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render actions for each team
  const renderActions = (team) => (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleView(team)}
        className="p-1 h-7 w-7"
        title="View Details"
      >
        <Eye className="h-4 w-4 text-blue-600" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleEdit(team)}
        className="p-1 h-7 w-7"
        title="Edit Team"
      >
        <Edit className="h-4 w-4 text-green-600" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => handleDelete(team)}
        className="p-1 h-7 w-7"
        title="Delete Team"
      >
        <Trash2 className="h-4 w-4 text-red-600" />
      </Button>
    </div>
  );

  // Render content based on active tab
  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>; // Display loading state
    }

    if (activeTab === 'Manage National Teams') {
      return (
        <div className="transition-all duration-200 ease-in-out">
          {/* Teams Table */}
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {teamColumns.map(col => (
                    <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      {col.header}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Operation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{team.id}</td>
                      <td className="px-4 py-3">{team.teamName}</td>
                      <td className="px-4 py-3">{team.month}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          team.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {team.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{team.federation.name || team.federation}</td>
                      <td className="px-4 py-3">{Array.isArray(team.players) ? team.players.length : team.players}</td>
                      <td className="px-4 py-3">
                        {renderActions(team)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={teamColumns.length + 1} className="px-4 py-3 text-center text-gray-500">
                      No teams available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else if (activeTab === 'Manage Players') {
      return (
        <div className="transition-all duration-200 ease-in-out">
          {/* Add Player Button */}
          <div className="mb-4">
            <Button
              onClick={() => setShowAddPlayerModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Player
            </Button>
          </div>

         {/* Players Table */}
<div className="bg-white rounded-lg shadow overflow-x-auto">
  <table className="w-full">
    <thead className="bg-gray-50">
      <tr>
        {playerColumns.map(col => (
          <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500">
            {col.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-200">
      {players.length > 0 ? (
        players.map((player) => (
          <tr key={player.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">{player.name}</td>
            <td className="px-4 py-3">{player.teamName}</td>
            <td className="px-4 py-3">
              {player.federation?.name || 
               (typeof player.federation === 'object' ? 
                 JSON.stringify(player.federation) : 
                 player.federation)}
            </td>
            <td className="px-4 py-3">
              {typeof player.club === 'object' ? player.club.name : player.club}
            </td>
            <td className="px-4 py-3">
              {Array.isArray(player.games) 
                ? player.games.map(game => 
                    typeof game === 'object' ? game.stadium : game
                  ).join(', ') 
                : player.games}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={playerColumns.length} className="px-4 py-3 text-center text-gray-500">
            No players available
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div> 
</div>
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage National Team</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add National Team</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="mt-6">
        {renderContent()}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedTeamData(null);
        }}
        title={selectedTeamData ? "Edit Team" : "Add National Team"}
      >
        <AddNationalTeamForm
          initialData={selectedTeamData}
          onSubmit={handleAddTeam}
          onCancel={() => {
            setShowAddModal(false);
            setSelectedTeamData(null);
          }}
        />
      </Modal>

     {/* Add Player Modal */}
<Modal
  isOpen={showAddPlayerModal}
  onClose={() => setShowAddPlayerModal(false)}
  title="Add National Team Player"
>
  <form onSubmit={handleAddPlayerSubmit} className="space-y-6">
    {/* Player Name */}
    <div>
      <label className="block text-sm font-medium mb-1">
        Player Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="name"
        placeholder="Enter player name"
        required
        className="w-full border rounded-lg p-2"
      />
    </div>

    {/* Player Staff Selection */}
    <div>
      <label className="block text-sm font-medium mb-1">
        Player/Staff <span className="text-red-500">*</span>
      </label>
      <select
        value={selectedPlayerStaff}
        onChange={(e) => setSelectedPlayerStaff(e.target.value)}
        className="w-full border rounded-lg p-2"
        required
      >
        <option value="">Select Player/Staff</option>
        {playerStaffList.map(staff => (
          <option key={staff.id} value={staff.id}>
            {staff.type}
          </option>
        ))}
      </select>
    </div>

    {/* Team Selection */}
<div>
  <label className="block text-sm font-medium mb-1">
    Team <span className="text-red-500">*</span>
  </label>
  <select
    value={selectedTeamForPlayer}
    onChange={(e) => {
      const teamId = parseInt(e.target.value);
      setSelectedTeamForPlayer(teamId);
      const team = teams.find(t => t.id === teamId);
      setAvailableGames(team?.games || []);
      setSelectedGames([]); // Reset selected games when team changes
    }}
    className="w-full border rounded-lg p-2"
    required
  >
    <option value="">Select Team</option>
    {teams.map(team => (
      <option key={team.id} value={team.id}>{team.teamName}</option>
    ))}
  </select>
</div>

    {/* Club Selection */}
    <div>
      <label className="block text-sm font-medium mb-1">
        Club <span className="text-red-500">*</span>
      </label>
      <select
        value={selectedClub}
        onChange={(e) => setSelectedClub(e.target.value)}
        className="w-full border rounded-lg p-2"
        required
        disabled={!selectedTeamForPlayer}
      >
        <option value="">Select Club</option>
        {clubs.map(club => (
          <option key={club.id} value={club.id}>{club.name}</option>
        ))}
      </select>
    </div>

          {/* Games Section */}
<div>
  <h3 className="text-md font-medium mb-3">Games</h3>
  {availableGames.length > 0 ? (
    <div className="space-y-2">
      {availableGames.map((game) => (
        <div key={game.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id={`game-${game.id}`}
            checked={selectedGames.includes(game.id)}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedGames(prev => [...prev, game.id]);
              } else {
                setSelectedGames(prev => prev.filter(id => id !== game.id));
              }
            }}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div className="flex-1">
            <label htmlFor={`game-${game.id}`} className="cursor-pointer">
              <p className="font-medium">{game.stadium}</p>
              <p className="text-sm text-gray-500">
                {game.competition || 'No competition specified'}
              </p>
            </label>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center py-4 bg-gray-50 rounded-lg">
      <p className="text-gray-500">No games found</p>
    </div>
  )}
</div>
          {/* Submit Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddPlayerModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Add Player
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-50" 
          onClose={() => setIsViewModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-xl font-bold">
                    View Team Details
                  </Dialog.Title>
                  <button
                    onClick={() => setIsViewModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {renderTeamDetails(viewTeam)}

                <div className="flex justify-end mt-6 pt-4 border-t">
                  <Button onClick={() => setIsViewModalOpen(false)}>
                    Close
                  </Button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Dialog */}
      <Modal
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        title="Delete Team"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this team? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default NationalTeams;
