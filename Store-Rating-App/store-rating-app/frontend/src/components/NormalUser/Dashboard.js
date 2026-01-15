import React, { useEffect, useState, useMemo } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';
import './NormalUser.css';

const ITEMS_PER_PAGE = 5;

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [ratingSubmitting, setRatingSubmitting] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [alert, setAlert] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const load = () => api.get('/stores').then(r => setStores(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const rate = async (storeId, rating) => {
    setRatingSubmitting(storeId);
    try {
      await api.post(`/ratings/${storeId}`, { rating });
      load();
    } finally {
      setRatingSubmitting(null);
    }
  };

  const filteredStores = useMemo(() => (
    stores.filter(s => 
      s.name.toLowerCase().includes(search.trim().toLowerCase()) || 
      s.address?.toLowerCase().includes(search.trim().toLowerCase())
    )
  ), [stores, search]);

  const totalPages = Math.ceil(filteredStores.length / ITEMS_PER_PAGE);
  const currentStores = filteredStores.slice((page-1)*ITEMS_PER_PAGE, page*ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search]);
  const handlePage = (p) => { if (p >= 1 && p <= totalPages) setPage(p); };

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
    <div className="user-dash-wrapper">
      <nav className="user-nav">
        <div className="user-nav-container">
          <div className="user-logo">StoreRate<span>.</span></div>
          
          <div className="user-profile-nav-section">
            {showProfileMenu && (
              <div className="user-profile-menu">
                <button 
                  className="user-profile-menu-item view-profile"
                  onClick={openProfileModal}
                >
                  <span className="menu-icon"></span>
                  View Profile
                </button>
                <button 
                  className="user-profile-menu-item logout-btn"
                  onClick={handleLogout}
                >
                  <span className="menu-icon"></span>
                  Logout
                </button>
              </div>
            )}

            <div 
              className={`user-nav-profile ${showProfileMenu ? 'active' : ''}`}
              onClick={toggleProfileMenu}
            >
              <div className="user-nav-avatar">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="user-nav-info">
                <strong>{user.name || 'User'}</strong>
                <span>Normal User</span>
              </div>
              <div className="user-nav-toggle"></div>
            </div>
          </div>
        </div>
      </nav>

      <div className="dash-glow dash-glow-1" />
      <div className="dash-glow dash-glow-2" />

      {showProfileModal && (
        <div className="user-modal-overlay" onClick={closeProfileModal}>
          <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="user-modal-header">
              <h2>Your Profile</h2>
              <button className="user-close-modal" onClick={closeProfileModal}>×</button>
            </div>
            
            <div className="user-profile-content">
              <div className="user-profile-info-card">
                <div className="user-profile-avatar-large">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="user-profile-details">
                  <h3>{user.name || 'Normal User'}</h3>
                  <div className="user-profile-info-grid">
                    <div className="user-info-item">
                      <span className="user-info-label">Email:</span>
                      <span className="user-info-value">{user.email || 'N/A'}</span>
                    </div>
                    <div className="user-info-item">
                      <span className="user-info-label">Role:</span>
                      <span className="user-info-value">{user.role || 'Normal User'}</span>
                    </div>
                    <div className="user-info-item">
                      <span className="user-info-label">User ID:</span>
                      <span className="user-info-value">{user.user_id || 'N/A'}</span>
                    </div>
                    <div className="user-info-item">
                      <span className="user-info-label">Address:</span>
                      <span className="user-info-value">{user.address || 'Not specified'}</span>
                    </div>
                    <div className="user-info-item">
                      <span className="user-info-label">Joined:</span>
                      <span className="user-info-value">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="user-change-password-section">
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className="user-password-form">
                  <div className="user-form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                      placeholder="Enter current password"
                      required
                    />
                  </div>
                  
                  <div className="user-form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      placeholder="8-16 chars, 1 uppercase, 1 special"
                      required
                    />
                  </div>
                  
                  <div className="user-form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                  
                  <div className="user-form-actions">
                    <button 
                      type="button" 
                      className="user-cancel-btn"
                      onClick={closeProfileModal}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="user-save-btn"
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

      <div className='user-dash-container'>
        <header className="user-dash-header">
          <h1 className='user-dash-title'>Explore Stores</h1>
          <p className="user-dash-subtitle">Discover top-rated locations and share your feedback.</p>
        </header>

        <div className="search-wrapper">
          <input
            className="user-search-box"
            placeholder="Search by store name or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="store-grid">
          {currentStores.length === 0 && (
            <div className="no-stores">No stores found matching your search.</div>
          )}
          
          {currentStores.map(s => (
            <div className="user-store-card" key={s.store_id}>
              <div className="user-store-info">
                <span className="user-store-name">{s.name}</span>
                <span className="user-store-addr">{s.address || 'No address provided'}</span>
                <div className="user-rating-badge">
                  ★ {Number(s.average_rating).toFixed(1)} <span>({s.rating_count} reviews)</span>
                </div>
              </div>

              <div className="user-rate-section">
                <span className="rate-label">Rate this store:</span>
                <div className="user-rate-buttons">
                  {[1,2,3,4,5].map(n => (
                    <button
                      key={n}
                      className="user-rate-btn"
                      disabled={ratingSubmitting === s.store_id}
                      onClick={() => rate(s.store_id, n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="user-pagination">
            <button className="user-page-btn" onClick={()=>handlePage(page-1)} disabled={page===1}>Prev</button>
            {Array.from({length: totalPages}, (_,i)=>(
              <button
                key={i+1}
                className={`user-page-btn ${page === i + 1 ? 'active' : ''}`}
                onClick={() => handlePage(i + 1)}
              >
                {i+1}
              </button>
            ))}
            <button className="user-page-btn" onClick={()=>handlePage(page+1)} disabled={page===totalPages}>Next</button>
          </div>
        )}
      </div>

      <footer className="user-footer">
        &copy; {new Date().getFullYear()} Store Rate — Enterprise Edition
      </footer>

      {alert && (
        <div className={`user-alert-toast ${alert.includes('successfully') ? 'success' : 'error'}`}>
          {alert}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;