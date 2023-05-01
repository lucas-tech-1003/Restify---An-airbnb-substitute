import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/RestifyWhite.png';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    avatar: null,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm_password: '',
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      alert('You have successfully signed up!');
      navigate('/');
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert('Passwords do not match.');
      return;
    }

    const newUser = {
      username: formData.username,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:8000/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User registered:', data);
        setSuccess(true);
      } else {
        const errorData = await response.json();
        console.error('Error during signup:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    navigate('/');
  };

  return (
    <div className='body'>
      <div className="logo-div-register">
        <img className="logo-register" src={logo} alt="The logo" />
      </div>

      <div className="center">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          {['username', 'first_name', 'last_name', 'email', 'phone', 'address', 'password', 'confirm_password'].map((field) => (
            <div className="txt_field" key={field}>
              <input type={field === 'password' || field === 'confirm_password' ? 'password' : 'text'} name={field} value={formData[field]} onChange={handleChange} required />
              <span></span>
              <label>{field.split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</label>
            </div>
          ))}
          <button type="submit" id="signup-btn" className="btn btn-primary btn-lg">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
