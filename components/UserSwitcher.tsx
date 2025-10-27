import React from 'react';
import { useData } from '../hooks/useDataContext';

const UserSwitcher: React.FC = () => {
  const { users, currentUser, setCurrentUser } = useData();

  if (users.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        Add a team member to begin
      </div>
    );
  }

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUserId = parseInt(e.target.value, 10);
    const selectedUser = users.find(u => u.id === selectedUserId) || null;
    setCurrentUser(selectedUser);
  };

  return (
    <div className="flex items-center space-x-2">
       {currentUser && <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-8 h-8 rounded-full" />}
      <select
        value={currentUser?.id || ''}
        onChange={handleUserChange}
        className="text-sm font-medium text-gray-700 bg-gray-100 border-transparent rounded-md focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled>Select a user...</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default UserSwitcher;
