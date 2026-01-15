import React, { useEffect, useState, useMemo } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [deletingStoreId, setDeletingStoreId] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [activeTab, setActiveTab] = useState("users");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [alert, setAlert] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "Normal User",
  });

  const loadData = async () => {
    try {
      const [uRes, sRes, statsRes] = await Promise.all([
        api.get("/users"),
        api.get("/stores"),
        api.get("/users/stats")
      ]);
      const extract = (res) => (Array.isArray(res.data) ? res.data : (res.data.rows || []));
      setUsers(extract(uRes));
      setStores(extract(sRes));
      setStats(statsRes.data || { totalUsers: 0, totalStores: 0, totalRatings: 0 });
    } catch (err) {
      console.error("Load failed:", err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const openProfileModal = () => {
    setShowProfileMenu(false);
    setShowProfileModal(true);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert('New passwords do not match');
      setTimeout(() => setAlert(''), 3000);
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      setAlert('New password must be 8-16 chars, include 1 uppercase and 1 special character');
      setTimeout(() => setAlert(''), 3000);
      return;
    }

    setChangingPassword(true);
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setAlert('Password changed successfully!');
      setTimeout(() => setAlert(''), 3000);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      closeProfileModal();
    } catch (error) {
      console.error('Password change error:', error.response?.data || error.message);
      setAlert(error.response?.data?.message || 'Failed to change password');
      setTimeout(() => setAlert(''), 3000);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${userId}`);
        loadData();
        setAlert("User deleted successfully!");
        setTimeout(() => setAlert(''), 3000);
      } catch (err) {
        console.error("Delete failed:", err);
        setAlert("Failed to delete user: " + (err.response?.data?.message || err.message));
        setTimeout(() => setAlert(''), 3000);
      }
    }
  };

  const handleDeleteStore = async (storeId, storeName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${storeName}"?\n\n` +
      `This will also delete all ratings associated with this store.\n` +
      `This action cannot be undone.`
    );
    
    if (!confirmed) return;

    setDeletingStoreId(storeId);
    
    try {
      await api.delete(`/stores/${storeId}`);
      setStores(prevStores => prevStores.filter(store => store.store_id !== storeId));
      setStats(prevStats => ({
        ...prevStats,
        totalStores: prevStats.totalStores - 1,
      }));
      
      const statsRes = await api.get("/users/stats");
      if (statsRes.data) {
        setStats(statsRes.data);
      }
      
      setAlert(`Store "${storeName}" deleted successfully!`);
      setTimeout(() => setAlert(''), 3000);
    } catch (err) {
      console.error("Delete store failed:", err);
      let errorMessage = "Failed to delete store";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.code === 'ERR_NETWORK') {
        errorMessage = "Network error. Please check your connection.";
      }
      setAlert(`Error: ${errorMessage}`);
      setTimeout(() => setAlert(''), 5000);
    } finally {
      setDeletingStoreId(null);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "users") {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16})/;
        if (!passwordRegex.test(formData.password)) {
          setAlert('Password must be 8-16 chars, include 1 uppercase and 1 special character');
          setTimeout(() => setAlert(''), 3000);
          return;
        }

        await api.post("/auth/register", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          address: formData.address ? formData.address.trim() : '',
          role: formData.role
        });
        
        setAlert("User added successfully!");
        setTimeout(() => setAlert(''), 3000);
        
      } else {
        await api.post("/stores", {
          name: formData.name.trim(),
          email: formData.email.trim(),
          address: formData.address ? formData.address.trim() : '',
        });
        
        setAlert("Store added successfully!");
        setTimeout(() => setAlert(''), 3000);
      }
      
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "Normal User",
      });
      loadData();
    } catch (err) {
      console.error("Add failed:", err.response?.data || err);
      setAlert("Error: " + (err.response?.data?.message || "Operation failed")); 
      setTimeout(() => setAlert(''), 5000);
    }
  };

  const filteredData = useMemo(() => {
    const data = activeTab === "users" ? users : stores;
    const term = search.toLowerCase();
    return data.filter(item => 
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      (activeTab === "users" && item.role?.toLowerCase().includes(term))
    );
  }, [users, stores, activeTab, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="admin-wrapper">
      <nav className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-logo">StoreRate<span>.</span></div>
          <div className="admin-nav-group">
            <button 
              className={activeTab === "users" ? "active" : ""} 
              onClick={() => { setActiveTab("users"); setCurrentPage(1); }}
            >
              Users
            </button>
            <button 
              className={activeTab === "stores" ? "active" : ""} 
              onClick={() => { setActiveTab("stores"); setCurrentPage(1); }}
            >
              Stores
            </button>
          </div>
        </div>

        <div className="admin-profile-section">
          {showProfileMenu && (
            <div className="admin-profile-menu">
              <button 
                className="admin-profile-menu-item view-profile"
                onClick={openProfileModal}
              >
                <span className="admin-menu-icon"></span>
                View Profile
              </button>
              <button 
                className="admin-profile-menu-item logout-btn"
                onClick={handleLogout}
              >
                <span className="admin-menu-icon"></span>
                Logout
              </button>
            </div>
          )}

          <div 
            className={`admin-sidebar-user-info ${showProfileMenu ? 'active' : ''}`}
            onClick={toggleProfileMenu}
          >
            <div className="admin-user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="admin-user-details">
              <strong>{user.name || 'Administrator'}</strong>
              <span>System Administrator</span>
            </div>
            <div className="admin-profile-toggle"></div>
          </div>
        </div>
      </nav>

      <main className="admin-main">
        <section className="admin-stats-grid">
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{stats.totalUsers}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Stores</span>
            <span className="stat-value">{stats.totalStores}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Ratings</span>
            <span className="stat-value">{stats.totalRatings}</span>
          </div>
        </section>

        <section className="admin-content-card">
          <div className="content-header">
            <h2>{activeTab === "users" ? "Platform Users" : "Registered Stores"}</h2>
            <div className="header-actions">
              <input 
                className="admin-search" 
                placeholder="Filter records..." 
                value={search} 
                onChange={(e) => {setSearch(e.target.value); setCurrentPage(1);}} 
              />
              <button className="action-btn" onClick={() => setShowModal(true)}>
                + Add {activeTab === "users" ? "User" : "Store"}
              </button>
            </div>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th className="text-center">Rating</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.user_id || item.store_id}>
                    <td className="font-bold">{item.name}</td>
                    <td>{item.email}</td>
                    <td className="truncate-cell">{item.address || "—"}</td>
                    <td>
                      <span className={`badge ${item.role?.replace(/\s+/g, '-').toLowerCase()}`}>
                        {activeTab === "users" ? item.role : "Store"}
                      </span>
                    </td>
                    <td className="text-center">
                      {(activeTab === "stores" || item.role === "Store Owner") ? (
                        <span className="rating-pill">★ {Number(item.average_rating || item.rating || 0).toFixed(1)}</span>
                      ) : "—"}
                    </td>
                    <td className="text-center">
                      <button 
                        className="icon-delete-btn" 
                        onClick={() => {
                          if (activeTab === "users") {
                            handleDeleteUser(item.user_id);
                          } else {
                            handleDeleteStore(item.store_id, item.name);
                          }
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="admin-pagination">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
            <span className="page-indicator">Page {currentPage} of {totalPages || 1}</span>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || totalPages === 0}>Next</button>
          </div>
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New {activeTab === "users" ? "User" : "Store"}</h3>
            <form onSubmit={handleAddSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              {activeTab === "users" && (
                <>
                  <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Normal User">Normal User</option>
                    <option value="Store Owner">Store Owner</option>
                    <option value="System Administrator">System Administrator</option>
                  </select>
                </>
              )}
              <textarea
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows="3"
              />
              <div className="modal-buttons">
                <button type="submit" className="modal-submit">Add</button>
                <button type="button" className="modal-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <div className="admin-modal-overlay" onClick={closeProfileModal}>
          <div className="admin-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Your Profile</h2>
              <button className="admin-close-modal" onClick={closeProfileModal}>×</button>
            </div>
            
            <div className="admin-profile-content">
              <div className="admin-profile-info-card">
                <div className="admin-profile-avatar-large">
                  {user.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="admin-profile-details">
                  <h3>{user.name || 'Administrator'}</h3>
                  <div className="admin-profile-info-grid">
                    <div className="admin-info-item">
                      <span className="admin-info-label">Email:</span>
                      <span className="admin-info-value">{user.email || 'N/A'}</span>
                    </div>
                    <div className="admin-info-item">
                      <span className="admin-info-label">Role:</span>
                      <span className="admin-info-value">{user.role || 'System Administrator'}</span>
                    </div>
                    <div className="admin-info-item">
                      <span className="admin-info-label">User ID:</span>
                      <span className="admin-info-value">{user.user_id || 'N/A'}</span>
                    </div>
                    <div className="admin-info-item">
                      <span className="admin-info-label">Address:</span>
                      <span className="admin-info-value">{user.address || 'Not specified'}</span>
                    </div>
                    <div className="admin-info-item">
                      <span className="admin-info-label">Joined:</span>
                      <span className="admin-info-value">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-change-password-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="admin-password-form">
                  <div className="admin-form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="8-16 chars, 1 uppercase, 1 special"
                      required
                    />
                  </div>
                  
                  <div className="admin-form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  
                  <div className="admin-form-actions">
                    <button 
                      type="button" 
                      className="admin-cancel-btn"
                      onClick={closeProfileModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="admin-save-btn"
                      disabled={changingPassword}
                    >
                      {changingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {alert && (
        <div className={`admin-alert-toast ${alert.includes('successfully') ? 'success' : 'error'}`}>
          {alert}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;