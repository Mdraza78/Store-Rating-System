import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './StoreOwner.css';

const OwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', address: '' });
  const [activeTab, setActiveTab] = useState('create');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.user_id;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const load = async () => {
    setLoading(true);
    try {
      const response = await api.get('/stores');
      const allStores = response.data || [];
      setStores(allStores);
    } catch (e) {
      console.error("Failed to load stores", e);
      setAlert('Failed to load stores');
      setTimeout(() => setAlert(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/stores', form);
      setForm({ name: '', email: '', address: '' });
      await load();
      setActiveTab('stores');
      setCurrentPage(1);
      setAlert('Store created successfully!');
      setTimeout(() => setAlert(''), 3000);
    } catch (e) {
      console.error('Store creation error:', e.response?.data || e.message);
      setAlert('Failed to add store');
      setTimeout(() => setAlert(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const ownerStores = stores.filter((store) => Number(store.owner_id) === Number(userId));
  const totalPages = Math.ceil(ownerStores.length / itemsPerPage);
  const paginatedStores = ownerStores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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

  return (
    <div className="owner-dash-wrapper">
      <div className="dash-glow dash-glow-1" />
      <div className="dash-glow dash-glow-2" />

      <nav className="owner-sidebar">
        <div className="owner-sidebar-top">
          <div className="owner-logo">StoreRate<span>.</span></div>
          <div className="nav-group">
            <button 
              className={activeTab === 'create' ? 'active' : ''} 
              onClick={() => setActiveTab('create')}
            >
              Create Store
            </button>
            <button 
              className={activeTab === 'stores' ? 'active' : ''} 
              onClick={() => setActiveTab('stores')}
            >
              Your Stores
            </button>
          </div>
        </div>

        <div className="profile-section">
          {showProfileMenu && (
            <div className="profile-menu">
              <button 
                className="profile-menu-item view-profile"
                onClick={openProfileModal}
              >
                <span className="menu-icon"></span>
                View Profile
              </button>
              <button 
                className="profile-menu-item logout-btn"
                onClick={handleLogout}
              >
                <span className="menu-icon"></span>
                Logout
              </button>
            </div>
          )}

          <div 
            className={`sidebar-user-info ${showProfileMenu ? 'active' : ''}`}
            onClick={toggleProfileMenu}
          >
            <div className="user-avatar">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <strong>{user.name || 'Store Owner'}</strong>
              <span>Store Owner</span>
            </div>
            <div className="profile-toggle"></div>
          </div>
        </div>
      </nav>

      {showProfileModal && (
        <div className="modal-overlay" onClick={closeProfileModal}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Your Profile</h2>
              <button className="close-modal" onClick={closeProfileModal}>×</button>
            </div>
            
            <div className="profile-content">
              <div className="profile-info-card">
                <div className="profile-avatar-large">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="profile-details">
                  <h3>{user.name || 'Store Owner'}</h3>
                  <div className="profile-info-grid">
                    <div className="info-item">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{user.email || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Role:</span>
                      <span className="info-value">{user.role || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">User ID:</span>
                      <span className="info-value">{user.user_id || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Address:</span>
                      <span className="info-value">{user.address || 'Not specified'}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Joined:</span>
                      <span className="info-value">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="change-password-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="8-16 chars, 1 uppercase, 1 special"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={closeProfileModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="save-btn"
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

      <main className="owner-content">
        {activeTab === 'create' && (
          <div className="owner-glass-card fade-in">
            <h2>Register New Store</h2>
            <p className="card-subtitle">Enter details to add your store to the platform</p>
            <form onSubmit={submit} className="owner-form">
              <input 
                type="text" 
                placeholder="Store Name" 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                required 
              />
              <input 
                type="email" 
                placeholder="Contact Email" 
                value={form.email} 
                onChange={(e) => setForm({ ...form, email: e.target.value })} 
                required 
              />
              <textarea 
                placeholder="Address" 
                value={form.address} 
                onChange={(e) => setForm({ ...form, address: e.target.value })} 
                rows="3" 
                className="owner-form-input" 
              />
              <button type="submit" className="owner-btn" disabled={loading}>
                {loading ? 'Creating...' : 'Create Store'}
              </button>
            </form>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="owner-glass-card fade-in">
            <div className="content-header">
              <div>
                <h2>Your Stores Portfolio</h2>
                <p className="card-subtitle">
                  Showing stores for: <strong>{user.name}</strong>
                  <span className="store-count"> ({ownerStores.length} stores)</span>
                </p>
              </div>
            </div>
            
            <div className="table-container">
              <table className="stores-table">
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Rating</th>
                    <th className="text-center">Total Ratings</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStores.map((store) => (
                    <tr key={store.store_id}>
                      <td className="font-bold">{store.name}</td>
                      <td>{store.email}</td>
                      <td className="truncate-cell" title={store.address}>
                        {store.address || '—'}
                      </td>
                      <td className="text-center">
                        <span className="rating-pill">
                          ★ {Number(store.average_rating || 0).toFixed(1)}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="rating-count-clean">
                          {store.rating_count || 0}
                        </span>
                      </td>
                      <td>
                        <span className="status-badge">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {ownerStores.length === 0 && (
                <div className="empty-state-card">
                  <div className="empty-icon">🏪</div>
                  <h3>No Stores Found</h3>
                  <button 
                    className="empty-action-btn" 
                    onClick={() => setActiveTab('create')}
                  >
                    Create Your First Store
                  </button>
                </div>
              )}
            </div>

            {ownerStores.length > itemsPerPage && (
              <div className="owner-pagination">
                <button 
                  onClick={() => goToPage(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                <span className="page-indicator">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => goToPage(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {alert && <div className="owner-alert-toast">{alert}</div>}
    </div>
  );
};

export default OwnerDashboard;