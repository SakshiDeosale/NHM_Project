
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/users";

export default function UserSettings() {
    const [surname, setSurname] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [designation, setDesignation] = useState("");
    const [office, setOffice] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [photo, setPhoto] = useState(null);

    const [users, setUsers] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const designations = [
        "Executive Engineer",
        "Deputy Engineer",
        "Junior Engineer",
        "Assistant Engineer",
        "Clerk",
        "Sectional Engineer",
        "Assistant Engineer Class-1",
        "Assistant Engineer Class-2",
        "Divisional Accountant",
        "Senior Auditor",
        "Senior Clerk",
        "Junior Clerk",
        "Contractor",
        "Other",
    ];

    const offices = [
        "Kokan",
        "Pune",
        "Nashik",
        "Latur",
        "Aurangabad",
        "Akola",
        "Nagpur",
        "Nagpur (Ele)",
    ];

    // Fetch active users from SQL Server
    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);
            setErrorMessage("");

            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load users.");
            }

            setUsers(data);
        } catch (error) {
            console.error("Fetch users error:", error.message);
            setErrorMessage(error.message || "Unable to load users.");
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Clear the form
    const resetForm = () => {
        setSurname("");
        setFirstName("");
        setMiddleName("");
        setMobile("");
        setEmail("");
        setDesignation("");
        setOffice("");
        setUsername("");
        setPassword("");
        setPhoto(null);
        setEditingId(null);

        const photoInput = document.getElementById("photo");
        if (photoInput) photoInput.value = "";
    };

    // Add a new user or update an existing user
    const handleSave = async () => {
        setErrorMessage("");

        if (!surname.trim() || !firstName.trim() || !middleName.trim()) {
            alert("Please enter Surname, First Name, and Middle Name.");
            return;
        }

        if (!/^[6-9]\d{9}$/.test(mobile)) {
            alert("Please enter a valid 10-digit mobile number.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            alert("Please enter a valid email address.");
            return;
        }

        if (!designation || !office) {
            alert("Please select Designation and Office.");
            return;
        }

        if (!username.trim()) {
            alert("Please enter Username.");
            return;
        }

        if (!editingId && !password) {
            alert("Please enter Password.");
            return;
        }

        const formData = new FormData();

        formData.append("surname", surname.trim());
        formData.append("firstName", firstName.trim());
        formData.append("middleName", middleName.trim());
        formData.append("mobile", mobile);
        formData.append("email", email.trim());
        formData.append("designation", designation);
        formData.append("office", office);
        formData.append("username", username.trim());

        // Password is required when adding, optional when editing.
        if (password) {
            formData.append("password", password);
        }

        if (photo) {
            formData.append("photo", photo);
        }

        const isEditing = editingId !== null;
        const url = isEditing
            ? `${API_URL}/${editingId}`
            : API_URL;

        try {
            setSaving(true);

            const response = await fetch(url, {
                method: isEditing ? "PUT" : "POST",
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to save user.");
            }

            alert(
                isEditing
                    ? "User updated successfully."
                    : `User added successfully! User ID: ${result.userID}`
            );

            resetForm();
            await fetchUsers();
        } catch (error) {
            console.error("Save user error:", error.message);
            alert(error.message || "Unable to connect to the backend.");
        } finally {
            setSaving(false);
        }
    };

    // Load selected user's details into the form
    const handleEdit = (user) => {
        setEditingId(user.UserID);
        setSurname(user.Surname || "");
        setFirstName(user.FirstName || "");
        setMiddleName(user.MiddleName || "");
        setMobile(user.Mobile || "");
        setEmail(user.Email || "");
        setDesignation(user.Designation || "");
        setOffice(user.Office || "");
        setUsername(user.Username || "");
        setPassword("");
        setPhoto(null);
        setErrorMessage("");

        const photoInput = document.getElementById("photo");
        if (photoInput) photoInput.value = "";

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Soft-delete selected user in SQL Server
    const handleDelete = async (user) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${user.FirstName} ${user.Surname}?`
        );

        if (!confirmed) return;

        try {
            const response = await fetch(`${API_URL}/${user.UserID}`, {
                method: "DELETE",
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Unable to delete user.");
            }

            if (editingId === user.UserID) {
                resetForm();
            }

            alert("User deleted successfully.");
            await fetchUsers();
        } catch (error) {
            console.error("Delete user error:", error.message);
            alert(error.message || "Unable to delete user.");
        }
    };

    return (
        <>
            {/* Page heading */}
            <div className="page-heading">
                <div className="page-heading-copy">
                    <span className="page-icon">
                        <i className="bi bi-person-plus" aria-hidden="true"></i>
                    </span>

                    <div>
                        <h1 className="h3 mb-1">Add New User</h1>
                        <p className="text-muted mb-0">
                            Add and manage system users.
                        </p>
                    </div>
                </div>
            </div>

            {/* User form */}
            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i
                            className={`bi ${editingId ? "bi-pencil-square" : "bi-person-plus"} me-2`}
                            aria-hidden="true"
                        ></i>
                        <span>{editingId ? "Edit User" : "Add New User"}</span>
                    </h2>

                    <p className="text-muted mb-0">
                        {editingId
                            ? "Update the selected user's details."
                            : "Enter the user details below."}
                    </p>
                </div>

                <div className="report-filter-list">
                    {/* Name */}
                    <div className="report-filter-row">
                        <label className="report-filter-label">
                            Officer/Employee Name
                        </label>

                        <div className="report-filter-control">
                            <div className="row g-2">
                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Surname"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Middle Name"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile */}
                    <div className="report-filter-row">
                        <label htmlFor="mobile" className="report-filter-label">
                            Mobile No.
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="mobile"
                                type="tel"
                                className="form-control"
                                placeholder="Enter 10-digit Mobile No."
                                maxLength={10}
                                value={mobile}
                                onChange={(e) =>
                                    setMobile(
                                        e.target.value.replace(/\D/g, "").slice(0, 10)
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="report-filter-row">
                        <label htmlFor="email" className="report-filter-label">
                            Email
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Designation */}
                    <div className="report-filter-row">
                        <label htmlFor="designation" className="report-filter-label">
                            Designation
                        </label>

                        <div className="report-filter-control">
                            <select
                                id="designation"
                                className="form-select"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            >
                                <option value="">Select Designation</option>

                                {designations.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Office */}
                    <div className="report-filter-row">
                        <label htmlFor="office" className="report-filter-label">
                            Office
                        </label>

                        <div className="report-filter-control">
                            <select
                                id="office"
                                className="form-select"
                                value={office}
                                onChange={(e) => setOffice(e.target.value)}
                            >
                                <option value="">Select Office</option>

                                {offices.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Username */}
                    <div className="report-filter-row">
                        <label htmlFor="username" className="report-filter-label">
                            Username
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                placeholder="Enter Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="report-filter-row">
                        <label htmlFor="password" className="report-filter-label">
                            Password
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder={
                                    editingId
                                        ? "Leave blank to keep current password"
                                        : "Enter Password"
                                }
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {/* Photo */}
                    <div className="report-filter-row">
                        <label htmlFor="photo" className="report-filter-label">
                            Profile Photo
                        </label>

                        <div className="report-filter-control">
                            <input
                                id="photo"
                                type="file"
                                className="form-control"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={(e) =>
                                    setPhoto(e.target.files?.[0] || null)
                                }
                            />

                            <small className="text-muted">
                                JPG, PNG or WebP; maximum 2 MB.
                                {editingId && " Leave empty to keep the current photo."}
                            </small>
                        </div>
                    </div>

                    {/* Form buttons */}
                    <div className="report-filter-row">
                        <div></div>

                        <div className="report-filter-control d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                <i
                                    className={`bi ${editingId ? "bi-check-circle" : "bi-plus-circle"} me-1`}
                                    aria-hidden="true"
                                ></i>
                                {saving
                                    ? "Saving..."
                                    : editingId
                                        ? "Save Changes"
                                        : "Add"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                    disabled={saving}
                                >
                                    <i className="bi bi-x-circle me-1"></i>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* User list panel */}
            <section className="panel mt-4">
                <div className="panel-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <h2 className="h5 mb-1 section-title">
                        <i className="bi bi-list-ul me-2" aria-hidden="true"></i>
                        User List
                    </h2>

                    <p className="text-muted mb-0">
                        Users saved in the database.
                    </p>
                </div>

                <div className="p-3">
                    {errorMessage && (
                        <div className="alert alert-danger" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    {loadingUsers ? (
                        <p className="text-muted mb-0">Loading users...</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>PHOTO</th>
                                        <th>NAME</th>
                                        <th>MOBILE</th>
                                        <th>EMAIL</th>
                                        <th>DESIGNATION</th>
                                        <th>OFFICE</th>
                                        <th>USERNAME</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={10}
                                                className="text-center text-muted py-4"
                                            >
                                                No users found. Add a user using the form above.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.map((user) => (
                                            <tr key={user.UserID}>
                                                <td>{user.UserID}</td>

                                                <td>
                                                    {user.HasPhoto ? (
                                                        <img
                                                            src={`http://localhost:5000/api/users/${user.UserID}/photo`}
                                                            alt={`${user.FirstName} ${user.Surname}`}
                                                            width="48"
                                                            height="48"
                                                            style={{
                                                                objectFit: "cover",
                                                                borderRadius: "50%",
                                                                border: "2px solid #dee2e6",
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-muted">No photo</span>
                                                    )}
                                                </td>

                                                <td>
                                                    {[
                                                        user.FirstName,
                                                        user.MiddleName,
                                                        user.Surname,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(" ")}
                                                </td>

                                                <td>{user.Mobile}</td>
                                                <td>{user.Email}</td>
                                                <td>{user.Designation}</td>
                                                <td>{user.Office}</td>
                                                <td>{user.Username}</td>

                                                <td>
                                                    {user.IsActive ? (
                                                        <span className="badge bg-success">
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="badge bg-secondary">
                                                            Inactive
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleEdit(user)}
                                                            title="Edit user"
                                                        >
                                                            <i className="bi bi-pencil-square me-1"></i>
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDelete(user)}
                                                            title="Delete user"
                                                        >
                                                            <i className="bi bi-trash me-1"></i>
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
