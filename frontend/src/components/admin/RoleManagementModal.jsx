import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosConfig';

const BASE_URL = 'http://localhost:3000';

export default function RolePrivilegesEditor({ roleName = 'student' }) {
  const [data, setData] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch data on mount or roleName change
  useEffect(() => {
    if (!roleName) return;
    setLoading(true);
    axios
      .get(`${BASE_URL}/api/admin/role-privileges`, {
        params: { grantee: roleName },
      })
      .then((res) => {
        setData(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [roleName]);

  // Group data by table for easy display
  useEffect(() => {
    const group = {};
    data.forEach(({ table_schema, table_name, privilege_type }) => {
      const key = `${table_schema}.${table_name}`;
      if (!group[key]) {
        group[key] = { SELECT: false, INSERT: false, UPDATE: false, DELETE: false };
      }
      group[key][privilege_type] = true;
    });
    setGrouped(group);
  }, [data]);

  // Handle checkbox toggle
  const togglePrivilege = (tableKey, privilege) => {
    setGrouped((prev) => ({
      ...prev,
      [tableKey]: {
        ...prev[tableKey],
        [privilege]: !prev[tableKey][privilege],
      },
    }));
  };

  // Prepare data for update
  const handleUpdate = async () => {
    // Flatten grouped object back to array of privileges
    const privilegesToSend = [];
    Object.entries(grouped).forEach(([tableKey, privs]) => {
      const [table_schema, table_name] = tableKey.split('.');
      Object.entries(privs).forEach(([privilege, granted]) => {
        if (granted) {
          privilegesToSend.push({ table_schema, table_name, privilege_type: privilege });
        }
      });
    });

    try {
      await axios.post(`${BASE_URL}/api/admin/update-role-privileges`, {
        roleName,
        privileges: privilegesToSend,
      });
      alert('Privileges updated successfully!');
    } catch (err) {
      alert('Failed to update privileges');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Privileges for role: {roleName}</h2>
      <table className="table-auto border-collapse border border-gray-300 w-full text-left">
        <thead>
          <tr>
            <th className="border border-gray-300 px-3 py-1">Table</th>
            <th className="border border-gray-300 px-3 py-1">SELECT</th>
            <th className="border border-gray-300 px-3 py-1">INSERT</th>
            <th className="border border-gray-300 px-3 py-1">UPDATE</th>
            <th className="border border-gray-300 px-3 py-1">DELETE</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(grouped).map(([tableKey, privs]) => (
            <tr key={tableKey}>
              <td className="border border-gray-300 px-3 py-1 font-mono">{tableKey}</td>
              {['SELECT', 'INSERT', 'UPDATE', 'DELETE'].map((priv) => (
                <td
                  key={priv}
                  className="border border-gray-300 px-3 py-1 text-center"
                >
                  <input
                    type="checkbox"
                    checked={privs[priv]}
                    onChange={() => togglePrivilege(tableKey, priv)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Privileges
        </button>
      </div>
    </div>
  );
};