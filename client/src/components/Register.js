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

        // First Name Validation (ensure only letters and at least 2 characters)
        if (!firstName) newErrors.firstName = 'You did not enter your first name!';
        else if (!/^[A-Za-z]+$/.test(firstName)) newErrors.firstName = 'Your first name should contain only letters!';
        else if (firstName.length < 2) newErrors.firstName = 'Your first name should be at least 2 characters long!';

        // Last Name Validation (ensure only letters and at least 2 characters)
        if (!lastName) newErrors.lastName = 'Please enter your last name!';
        else if (!/^[A-Za-z]+$/.test(lastName)) newErrors.lastName = 'Your last name should contain only letters!';
        else if (lastName.length < 2) newErrors.lastName = 'Your last name should be at least 2 characters long!';

        // Phone Number Validation (digits only, length 10)
        if (!phoneNumber) newErrors.phoneNumber = 'Please enter your phone number!';
        else if (!/^\d{10}$/.test(phoneNumber)) newErrors.phoneNumber = 'The phone number you provided is invalid!';

        // Email Validation (basic email format check)
        if (!email) newErrors.email = 'Please enter your email address!';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Please enter a valid email address!';

        // Username and Password (not changing yet, will handle later)
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