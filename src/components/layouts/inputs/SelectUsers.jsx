import React, { useState, useEffect } from 'react';
import { API_PATHS } from '../../../utils/apiPaths';
import axiosInstance from '../../../utils/axiosInstance';

const SelectUsers = ({ selectedUsers, setSelectedUsers }) => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isModalOpen) {
      fetchUsers();
    }
  }, [isModalOpen]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      setUsers(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.find(u => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter(u => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="w-full p-3 border border-gray-300 rounded text-left bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {selectedUsers.length === 0 ? (
          <span className="text-gray-500">Select Users</span>
        ) : (
          <span>{selectedUsers.map(user => user.name).join(', ')}</span>
        )}
      </button>

      {isModalOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-gray-500">Loading users...</div>
          ) : error ? (
            <div className="p-3 text-center text-red-500">{error}</div>
          ) : users.length === 0 ? (
            <div className="p-3 text-center text-gray-500">No users found</div>
          ) : (
            users.map(user => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`p-3 cursor-pointer hover:bg-gray-100 ${
                  selectedUsers.find(u => u._id === user._id) ? 'bg-purple-50' : ''
                }`}
              >
                <div className="flex items-center">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SelectUsers;

