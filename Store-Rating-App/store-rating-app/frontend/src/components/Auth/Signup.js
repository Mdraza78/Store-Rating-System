import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import "./Login.css";

const roles = ['Normal User', 'Store Owner', 'System Administrator'];

const Signup = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    address: '', 
    role: 'Normal User' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      const userRole = res.data.user.role;
      if (userRole === 'System Administrator') {
        navigate('/admin');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrapper">
      <div className="login-glow login-glow-1" />
      <div className="login-glow login-glow-2" />

      <form onSubmit={onSubmit} className="login-card">
        <div className="login-logo">StoreRate<span>.</span></div>
        <h2>Create Account</h2>
        <p className="login-subtitle">Join our professional feedback ecosystem.</p>
        
        {error && <div className="error-box">{error}</div>}
        
        <div className="login-form-content">
          <input 
            name="name" 
            placeholder="Full Name (20-60 characters)" 
            className="login-input"
            value={formData.name} 
            onChange={onChange} 
            required 
            minLength={20}
            maxLength={60}
          />
          
          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            className="login-input"
            value={formData.email} 
            onChange={onChange} 
            required 
          />
          
          <input 
            name="password" 
            type="password" 
            placeholder="Password (8-16 characters)" 
            className="login-input"
            value={formData.password} 
            onChange={onChange} 
            required 
            minLength={8}
            maxLength={16}
          />
          
          <input 
            name="address" 
            placeholder="Address (Max 400 characters)" 
            className="login-input"
            value={formData.address} 
            onChange={onChange} 
            maxLength={400}
            required
          />
          
          <select 
            name="role" 
            className="login-input" 
            value={formData.role} 
            onChange={onChange}
          >
            {roles.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <button className="login-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register Now'}
          </button>
        </div>

        <p className="signup-redirect">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;