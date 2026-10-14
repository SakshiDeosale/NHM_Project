
import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:5000/api/users';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users.');
        }

        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Fetch users error:', err);
        setError(err.message || 'Unable to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase();

    return [
      user.UserID,
      user.FirstName,
      user.MiddleName,
      user.Surname,
      user.Mobile,
      user.Email,
      user.Designation,
      user.Circle,
      user.District,
      user.Username,
    ].some((value) =>
      String(value ?? '').toLowerCase().includes(query)
    );
  });

  return (
    <>
      {/* Page Heading */}
      <div className="page-heading">
        <div className="page-heading-copy">
          <span className="page-icon">
            <i className="bi bi-people" aria-hidden="true" />
          </span>

          <div>
            <h1 className="h3 mb-1">Users</h1>
            <p className="text-muted mb-0">
              View and search registered system users.
            </p>
          </div>
        </div>
      </div>

      {/* User Table */}
      <section className="panel mt-3">
        <div className="panel-header">
          <div>
            <h2 className="h5 mb-1 section-title">
              <i className="bi bi-table me-2" aria-hidden="true" />
              User List
            </h2>
            <p className="text-muted mb-0">
              Total users: {users.length}
            </p>
          </div>

          <input
            type="search"
            className="form-control form-control-sm table-search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search users"
          />
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Photo</th>
                <th>Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Circle</th>
                <th>District</th>
                <th>Username</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="text-center py-4">
                    Loading users...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center text-danger py-4"
                  >
                    {error}
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.UserID}>
                    <td>{user.UserID}</td>

                    <td>
                      {user.HasPhoto ? (
                        <img
                          src={`${API_URL}/${user.UserID}/photo`}
                          alt="User profile"
                          width="42"
                          height="42"
                          style={{
                            objectFit: 'cover',
                            borderRadius: '50%',
                            border: '2px solid #dee2e6',
                          }}
                        />
                      ) : (
                        <span className="text-muted small">
                          No photo
                        </span>
                      )}
                    </td>

                    <td className="fw-semibold">
                      {[
                        user.FirstName,
                        user.MiddleName,
                        user.Surname,
                      ]
                        .filter(Boolean)
                        .join(' ') || '-'}
                    </td>

                    <td>{user.Mobile || '-'}</td>
                    <td>{user.Email || '-'}</td>
                    <td>{user.Designation || '-'}</td>
                    <td>{user.Circle || '-'}</td>
                    <td>{user.District || '-'}</td>
                    <td>{user.Username || '-'}</td>

                    <td>
                      {user.IsActive === true ||
                        user.IsActive === 1 ? (
                        <span className="badge text-bg-success">
                          Active
                        </span>
                      ) : (
                        <span className="badge text-bg-secondary">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={10}
                    className="text-center text-muted py-4"
                  >
                    {searchTerm
                      ? 'No matching users found.'
                      : 'No users found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && (
          <div className="p-3 border-top">
            <small className="text-muted">
              Showing {filteredUsers.length} of {users.length} users
            </small>
          </div>
        )}
      </section>
    </>
  );
}
