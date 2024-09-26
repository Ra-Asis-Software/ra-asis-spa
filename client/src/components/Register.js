import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    username: '',
    password: '',
    role: 'student', // default role
  });

  const [errors, setErrors] = useState({});  // State for tracking validation errors

  const { firstName, lastName, phoneNumber, email, username, password, role } = formData;

  // Handle input change
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Validation Function
  const validateFields = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = 'Please enter your first name!';
    if (!lastName) newErrors.lastName = 'Please enter your last name!';
    if (!phoneNumber) newErrors.phoneNumber = 'Please enter your phone number!';
    if (!email) newErrors.email = 'Please enter your email address!';
    if (!username) newErrors.username = 'Please enter your preferred username!';
    if (!password) newErrors.password = 'Please enter your preferred password!';

    return newErrors;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);  // Set validation errors if any
      return;
    }

    try {
      const res = await axios.post('/api/auth/register', formData);
      console.log(res.data); // For testing
      alert('User registered successfully');
    } catch (err) {
      console.error(err.response.data);
      alert('Registration failed');
    }
  };

  return (
    <div className='registration'>
      <div className='registration-intro'>
        <h2>Register</h2>
      </div>
      <div className='registration-form'>
        <form onSubmit={onSubmit}>
          <div className='user-category'>
            <div className='user-category-heading'>
              <h3>Please select a user category</h3>
            </div>
            <div className='user-category-choices'>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  checked={role === 'student'}
                  onChange={onChange}
                />
                Student
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  checked={role === 'teacher'}
                  onChange={onChange}
                />
                Teacher
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="parent"
                  checked={role === 'parent'}
                  onChange={onChange}
                />
                Parent
              </label>
            </div>
          </div>
          <div className='personal-details'>
            <input
              type="text"
              name="firstName"
              value={firstName}
              placeholder="First Name"
              onChange={onChange}
            />
            {errors.firstName && <small className="error">{errors.firstName}</small>}
            <input
              type="text"
              name="lastName"
              value={lastName}
              placeholder="Last Name"
              onChange={onChange}
            />
            {errors.lastName && <small className="error">{errors.lastName}</small>}
            <input
              type="text"
              name="phoneNumber"
              value={phoneNumber}
              placeholder="Phone Number"
              onChange={onChange}
            />
            {errors.phoneNumber && <small className="error">{errors.phoneNumber}</small>}
          </div>
          <div className='credential-details'>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Email"
              onChange={onChange}
            />
            {errors.email && <small className="error">{errors.email}</small>}
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Username"
              onChange={onChange}
            />
            {errors.username && <small className="error">{errors.username}</small>}
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Password"
              onChange={onChange}
            />
            {errors.password && <small className="error">{errors.password}</small>}
          </div>
          <div className='submit-button'>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
      <div className='login-prompt'>
        <p>Already have an account ? <Link to='/login'>Login</Link></p>
      </div>
    </div>
  );
};

export default Register;