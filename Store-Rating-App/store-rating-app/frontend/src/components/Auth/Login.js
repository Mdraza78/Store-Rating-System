import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const role = res.data.user.role;
      
      if (role === 'System Administrator') {
        navigate('/admin');
      } else if (role === 'Store Owner') {
        navigate('/owner');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glow login-glow-1" />
      <div className="login-glow login-glow-2" />

      <form onSubmit={onSubmit} className="login-card">
        <div className="login-logo">StoreRate<span>.</span></div>
        <h2>Sign In</h2>
        <p className="login-subtitle">Enter your credentials to access your dashboard.</p>
        
        {error && <div className="error-box">{error}</div>}
        
        <div className="login-form-content">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="login-input"
            value={formData.email}
            onChange={onChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="login-input"
            value={formData.password}
            onChange={onChange}
            required
          />
          
          <button className="login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </div>

        <p className="signup-redirect">
          Don't have an account? <Link to="/signup">Get Started</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;