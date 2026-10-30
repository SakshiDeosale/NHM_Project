import React, { useEffect, useMemo, useState } from "react";
import API_URL, { apiFetch } from "../../utils/api";

const USERS_API = `${API_URL}/users`;

// const getAuthToken = () =>
//     localStorage.getItem("token") ||
//     sessionStorage.getItem("token");

// const getAuthHeaders = () => {
//     const token = getAuthToken();

//     return token
//         ? { Authorization: `Bearer ${token}` }
//         : {};
// };
const CIRCLES_URL = `${API_URL}/circles`;
const DISTRICTS_URL = `${API_URL}/districts`;

const designations = [
    "Superintending Engineer",
    "Executive Engineer",
    "Deputy Engineer",
    "Junior Engineer",
    "Assistant Engineer",
    "Amdar",
    "Khasdar",
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

export default function UserSettings() {
    const [surname, setSurname] = useState("");
    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [designation, setDesignation] = useState("");
    const [circleID, setCircleID] = useState("");
    const [districtID, setDistrictID] = useState("");
    const [username, setUsername] = useState("");
    const [photo, setPhoto] = useState(null);

    const [circles, setCircles] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [users, setUsers] = useState([]);

    const [editingId, setEditingId] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [photoUrls, setPhotoUrls] = useState({});

    const selectedCircle = circles.find(
        (circle) => String(circle.CircleID) === String(circleID)
    );

    const selectedDistrict = districts.find(
        (district) =>
            String(district.DistrictID) === String(districtID) &&
            String(district.CircleID) === String(circleID)
    );

    const filteredDistricts = useMemo(
        () =>
            districts.filter(
                (district) => String(district.CircleID) === String(circleID)
            ),
        [districts, circleID]
    );

    // Preview the next user number using the highest existing UserID.
    // The backend must validate/generate the final username when saving.
    const nextUserNumber = useMemo(() => {
        const highestID = users.reduce(
            (highest, user) => Math.max(highest, Number(user.UserID) || 0),
            0
        );

        return highestID + 1;
    }, [users]);

    // Username format: Designation + CircleName + UserNumber.
    useEffect(() => {
        if (editingId !== null) return;

        if (!designation || !selectedCircle) {
            setUsername("");
            return;
        }

        const designationCode = designation.replace(/[^a-zA-Z0-9]/g, "");
        const circleCode = selectedCircle.CircleName.replace(
            /[^a-zA-Z0-9]/g,
            ""
        );

        setUsername(
            `${designationCode}${circleCode}${nextUserNumber}`
        );
    }, [designation, selectedCircle, nextUserNumber, editingId]);

    const fetchLocations = async () => {
        try {
            setLoadingLocations(true);

            const [circleResponse, districtResponse] = await Promise.all([
                apiFetch(CIRCLES_URL),
                apiFetch(DISTRICTS_URL),
            ]);

            const circleData = await circleResponse.json();
            const districtData = await districtResponse.json();

            if (!circleResponse.ok) {
                throw new Error("Unable to load circles.");
            }

            if (!districtResponse.ok) {
                throw new Error("Unable to load districts.");
            }

            setCircles(Array.isArray(circleData) ? circleData : []);
            setDistricts(Array.isArray(districtData) ? districtData : []);
        } catch (error) {
            console.error("Location loading error:", error);
            setErrorMessage(
                "Unable to load circles or districts. Check the backend APIs."
            );
        } finally {
            setLoadingLocations(false);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoadingUsers(true);

            const response = await apiFetch(USERS_API);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load users.");
            }

            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Fetch users error:", error);
            setErrorMessage(error.message || "Unable to load users.");
        } finally {
            setLoadingUsers(false);
        }
    };


    useEffect(() => {
        let cancelled = false;
        const objectUrls = [];

        const loadPhotos = async () => {
            const usersWithPhotos = users.filter((user) => user.HasPhoto);

            const entries = await Promise.all(
                usersWithPhotos.map(async (user) => {
                    try {
                        const response = await apiFetch(
                            `${USERS_API}/${user.UserID}/photo`
                        );

                        if (!response.ok) {
                            console.error(
                                `Photo failed for user ${user.UserID}:`,
                                response.status
                            );
                            return [user.UserID, ""];
                        }

                        const blob = await response.blob();
                        const objectUrl = URL.createObjectURL(blob);
                        objectUrls.push(objectUrl);

                        return [user.UserID, objectUrl];
                    } catch (error) {
                        console.error("Unable to load user photo:", error);
                        return [user.UserID, ""];
                    }
                })
            );

            if (!cancelled) {
                setPhotoUrls(Object.fromEntries(entries));
            }
        };

        if (users.length > 0) {
            loadPhotos();
        } else {
            setPhotoUrls({});
        }

        return () => {
            cancelled = true;
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [users]);


    useEffect(() => {
        fetchLocations();
        fetchUsers();
    }, []);

    const resetForm = () => {
        setSurname("");
        setFirstName("");
        setMiddleName("");
        setMobile("");
        setEmail("");
        setDesignation("");
        setCircleID("");
        setDistrictID("");
        setUsername("");
        setPhoto(null);
        setEditingId(null);
        setErrorMessage("");

        const photoInput = document.getElementById("photo");
        if (photoInput) photoInput.value = "";
    };

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

        if (!designation || !circleID || !districtID) {
            alert("Please select Designation, Circle, and District.");
            return;
        }

        if (!selectedCircle || !selectedDistrict) {
            alert("Please select a valid Circle and District.");
            return;
        }

        if (!username) {
            alert("Username could not be generated.");
            return;
        }

        const formData = new FormData();

        formData.append("surname", surname.trim());
        formData.append("firstName", firstName.trim());
        formData.append("middleName", middleName.trim());
        formData.append("mobile", mobile);
        formData.append("email", email.trim());
        formData.append("designation", designation);

        formData.append("circleID", circleID);
        formData.append("circle", selectedCircle.CircleName);
        formData.append("districtID", districtID);
        formData.append("district", selectedDistrict.DistrictName);
        formData.append("username", username);

        // No password field is shown. Mobile is the initial password.
        // The backend must bcrypt-hash this value before storing it.
        if (editingId === null) {
            formData.append("password", mobile);
        }

        if (photo) {
            formData.append("photo", photo);
        }

        const isEditing = editingId !== null;
        const url = isEditing ? `${USERS_API}/${editingId}` : USERS_API;

        try {
            setSaving(true);

            const response = await apiFetch(url, {
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
            console.error("Save user error:", error);
            alert(error.message || "Unable to connect to the backend.");
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.UserID);
        setSurname(user.Surname || "");
        setFirstName(user.FirstName || "");
        setMiddleName(user.MiddleName || "");
        setMobile(user.Mobile || "");
        setEmail(user.Email || "");
        setDesignation(user.Designation || "");
        setUsername(user.Username || "");
        setPhoto(null);

        const matchingCircle = circles.find(
            (circle) => circle.CircleName === user.Circle
        );

        const matchingDistrict = districts.find(
            (district) =>
                district.DistrictName === user.District &&
                (!matchingCircle ||
                    String(district.CircleID) === String(matchingCircle.CircleID))
        );

        setCircleID(matchingCircle ? String(matchingCircle.CircleID) : "");
        setDistrictID(matchingDistrict ? String(matchingDistrict.DistrictID) : "");
        setErrorMessage("");

        const photoInput = document.getElementById("photo");
        if (photoInput) photoInput.value = "";

        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // const handleDelete = async (user) => {
    //     const confirmed = window.confirm(
    //         `Are you sure you want to delete ${user.FirstName} ${user.Surname}?`
    //     );

    //     if (!confirmed) return;

    //     try {
    //         const response = await fetch(`${API_URL}/${user.UserID}`, {
    //             method: "DELETE",
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             throw new Error(result.message || "Unable to delete user.");
    //         }

    //         if (editingId === user.UserID) {
    //             resetForm();
    //         }

    //         alert("User deleted successfully.");
    //         await fetchUsers();
    //     } catch (error) {
    //         console.error("Delete user error:", error);
    //         alert(error.message || "Unable to delete user.");
    //     }
    // };



    return (
        <>
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

            <section className="panel">
                <div className="panel-header">
                    <h2 className="h5 mb-1 section-title">
                        <i
                            className={`bi ${editingId ? "bi-pencil-square" : "bi-person-plus"
                                } me-2`}
                            aria-hidden="true"
                        ></i>
                        {editingId ? "Edit User" : "Add New User"}
                    </h2>
                    <p className="text-muted mb-0">
                        Enter user details below. The initial password is generated
                        internally from the mobile number.
                    </p>
                </div>

                <div className="report-filter-list">
                    <div className="report-filter-row">
                        <label className="report-filter-label">
                            Officer/Employee Name
                        </label>
                        <div className="report-filter-control">
                            <div className="row g-2">
                                <div className="col-md-4">
                                    <input
                                        className="form-control"
                                        placeholder="Surname"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        className="form-control"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <input
                                        className="form-control"
                                        placeholder="Middle Name"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="mobile" className="report-filter-label">
                            Mobile No.
                        </label>
                        <div className="report-filter-control">
                            <input
                                id="mobile"
                                type="tel"
                                className="form-control"
                                value={mobile}
                                maxLength={10}
                                placeholder="Enter mobile number"
                                onChange={(e) =>
                                    setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                                }
                                required
                            />
                            <small className="text-muted">
                                Used as the initial password.
                            </small>
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="email" className="report-filter-label">
                            Email
                        </label>
                        <div className="report-filter-control">
                            <input
                                id="email"
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

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
                                required
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

                    <div className="report-filter-row">
                        <label htmlFor="circle" className="report-filter-label">
                            Circle
                        </label>
                        <div className="report-filter-control">
                            <select
                                id="circle"
                                className="form-select"
                                value={circleID}
                                onChange={(e) => {
                                    setCircleID(e.target.value);
                                    setDistrictID("");
                                }}
                                required
                                disabled={loadingLocations}
                            >
                                <option value="">
                                    {loadingLocations ? "Loading circles..." : "Select Circle"}
                                </option>
                                {circles.map((circle) => (
                                    <option key={circle.CircleID} value={circle.CircleID}>
                                        {circle.CircleName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="district" className="report-filter-label">
                            District
                        </label>

                        <div className="report-filter-control">
                            <select
                                id="district"
                                className="form-select"
                                value={districtID}
                                onChange={(e) => setDistrictID(e.target.value)}
                                disabled={!circleID || loadingLocations}
                                required
                            >
                                <option value="">
                                    {!circleID
                                        ? "Select Circle First"
                                        : loadingLocations
                                            ? "Loading districts..."
                                            : filteredDistricts.length === 0
                                                ? "No districts available"
                                                : "Select District"}
                                </option>

                                {filteredDistricts.map((district) => (
                                    <option
                                        key={district.DistrictID}
                                        value={String(district.DistrictID)}
                                    >
                                        {district.DistrictName}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    <div className="report-filter-row">
                        <label htmlFor="username" className="report-filter-label">
                            Username
                        </label>
                        <div className="report-filter-control">
                            <input
                                id="username"
                                type="text"
                                className="form-control"
                                value={username}
                                placeholder="Generated automatically"
                                readOnly
                            />
                            <small className="text-muted">
                                Format: Designation + Circle Name + next User ID.
                            </small>
                        </div>
                    </div>

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
                                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                            />
                            <small className="text-muted">
                                JPG, PNG or WebP; maximum 2 MB.
                                {editingId && " Leave empty to keep the current photo."}
                            </small>
                        </div>
                    </div>

                    <div className="report-filter-row">
                        <div></div>
                        <div className="report-filter-control d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                                disabled={saving || loadingLocations}
                            >
                                <i
                                    className={`bi ${editingId ? "bi-check-circle" : "bi-plus-circle"
                                        } me-1`}
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
                                        <th>CIRCLE</th>
                                        <th>DISTRICT</th>
                                        <th>USERNAME</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={11}
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
                                                            src={photoUrls[user.UserID] || ""}
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
                                                <td>{user.Circle || ""}</td>
                                                <td>{user.District || ""}</td>
                                                <td>{user.Username}</td>
                                                <td>
                                                    {user.IsActive ? (
                                                        <span className="badge bg-success">Active</span>
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
                                                        {/* <button
                                                            type="button"
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDelete(user)}
                                                            title="Delete user"
                                                        >
                                                            <i className="bi bi-trash me-1"></i>
                                                            Delete
                                                        </button> */}
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
