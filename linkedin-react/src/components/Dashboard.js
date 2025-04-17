import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        alert('Unauthorized or failed to fetch user.');
        window.location.href = '/';
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h2>Welcome to the Dashboard</h2>
      {user && <p>Hello, {user.name}</p>}
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
