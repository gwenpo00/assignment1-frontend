import Container from './Container'
import Page from './Page'
import React, { useState, useContext } from "react";


function Terms() {
// Sample data for the table (replace with your actual data)
const initialUsers = [
  { id: 1, username: 'user1', password: 'password1', email: 'user1@example.com', group: 'Group 1', activity: 'Active' },
  { id: 2, username: 'user2', password: 'password2', email: 'user2@example.com', group: 'Group 2', activity: 'Inactive' },
  // Add more users as needed
];

// State to manage editable fields
const [users, setUsers] = useState(initialUsers);

const handleEdit = (id, field, value) => {
  // Find the user by id and update the field
  const updatedUsers = users.map(user =>
    user.id === id ? { ...user, [field]: value } : user
  );
  setUsers(updatedUsers);
};

return (
  <Page title="User Management">
    <table className="table">
      <thead>
        <tr>
          <th>Username</th>
          <th>Password</th>
          <th>Email</th>
          <th>Groups</th>
          <th>Activity</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>
              <input
                type="text"
                value={user.username}
                onChange={(e) => handleEdit(user.id, 'username', e.target.value)}
              />
            </td>
            <td>
              <input
                type="password"
                value={user.password}
                onChange={(e) => handleEdit(user.id, 'password', e.target.value)}
              />
            </td>
            <td>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleEdit(user.id, 'email', e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                value={user.group}
                onChange={(e) => handleEdit(user.id, 'group', e.target.value)}
              />
            </td>
            <td>{user.activity}</td>
            <td>
              <button className="btn btn-sm btn-secondary">Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Page>
);
}

export default Terms