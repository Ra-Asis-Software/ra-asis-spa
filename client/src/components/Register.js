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

    // Username Validation (lowercase letters, at least 3 characters)
    if (!username) newErrors.username = 'Please enter your preferred username!';
    else if (!/^[a-z]+$/.test(username)) newErrors.username = 'Username should contain only lowercase letters, no special characters!';
    else if (username.length < 3) newErrors.username = 'Username should be at least 3 characters long!';

    // Password Validation (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    if (!password) newErrors.password = 'Please enter your preferred password!';
    else if (password.length < 8) newErrors.password = 'Password should be at least 8 characters long!';
    else if (!/[A-Z]/.test(password)) newErrors.password = 'Password should contain at least one uppercase letter!';
    else if (!/[a-z]/.test(password)) newErrors.password = 'Password should contain at least one lowercase letter!';
    else if (!/[0-9]/.test(password)) newErrors.password = 'Password should contain at least one number!';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = 'Password should contain at least one special character!';

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
      alert('You registration was successful. Check your inbox to verify your email');
    } catch (err) {
      console.error(err.response.data);
      alert('Something went wrong, please try again');
    }
  };

  return (
    <div className='registration-container'>
        <div className='registration-content'>
            <div className='registration-intro'>
                <h2>Register</h2>
            </div>
            <div className='registration-form'>
                <form onSubmit={onSubmit} noValidate>
                    <div className='user-category'>
                        <div className='user-category-heading'>
                            <p>Please select a user category</p>
                        </div>
                        <div className='user-category-choices'>
                            <label className='radio-restyle'>
                                <input
                                type="radio"
                                className='radio-restyle'
                                name="role"
                                value="student"
                                checked={role === 'student'}
                                onChange={onChange}
                                />
                                <span>Student</span>
                            </label>
                            <label className='radio-restyle'>
                                <input
                                type="radio"
                                className='radio-restyle'
                                name="role"
                                value="teacher"
                                checked={role === 'teacher'}
                                onChange={onChange}
                                />
                                <span>Teacher</span>
                            </label>
                            <label className='radio-restyle'>
                                <input
                                type="radio"
                                className='radio-restyle'
                                name="role"
                                value="parent"
                                checked={role === 'parent'}
                                onChange={onChange}
                                />
                                <span>Parent</span>
                            </label>
                        </div>
                    </div>
                    <div className='details'>
                        <div className='personal-details'>
                            <div className='details-heading personal-details-heading'>
                                <h4>Personal Details</h4>
                            </div>
                            <div className='personal-details-inputs'>
                                <div className='input-container'>
                                    <label>First Name<span className='required-star'>*</span></label>
                                    <input
                                    type="text"
                                    name="firstName"
                                    value={firstName}
                                    size="30"
                                    placeholder="enter your first name"
                                    onChange={onChange}
                                    />
                                    {errors.firstName && <small className="error">{errors.firstName}</small>}
                                </div>
                                <div className='input-container'>
                                    <label>Last Name<span className='required-star'>*</span></label>
                                    <input
                                    type="text"
                                    name="lastName"
                                    value={lastName}
                                    size="30"
                                    placeholder="enter your last name"
                                    onChange={onChange}
                                    />
                                    {errors.lastName && <small className="error">{errors.lastName}</small>}  
                                </div>
                                <div className='input-container'>
                                    <label>Phone Number<span className='required-star'>*</span></label>
                                    <input
                                    type="text"
                                    name="phoneNumber"
                                    value={phoneNumber}
                                    size="30"
                                    placeholder="enter your phone number"
                                    onChange={onChange}
                                    />
                                    {errors.phoneNumber && <small className="error">{errors.phoneNumber}</small>}
                                </div>
                            </div>
                        </div>
                        <div className='credential-details'>
                            <div className='details-heading credential-details-heading'>
                                <h4>Credential Details</h4>
                            </div>
                            <div className='credential-details-inputs'>
                                <div className='input-container'>
                                    <label>Email Address<span className='required-star'>*</span></label>
                                    <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    size="30"
                                    placeholder="enter your email address"
                                    onChange={onChange}
                                    />
                                    {errors.email && <small className="error">{errors.email}</small>}
                                </div>
                                <div className='input-container'>
                                    <label>Username<span className='required-star'>*</span></label>
                                    <input
                                    type="text"
                                    name="username"
                                    value={username}
                                    size="30"
                                    placeholder="enter your preferred username"
                                    onChange={onChange}
                                    />
                                    {errors.username && <small className="error">{errors.username}</small>}
                                </div>
                                <div className='input-container'>
                                    <label>Password<span className='required-star'>*</span></label>
                                    <input
                                    type="password"
                                    name="password"
                                    value={password}
                                    size="30"
                                    placeholder="enter your preferred password"
                                    onChange={onChange}
                                    />
                                    {errors.password && <small className="error">{errors.password}</small>}
                                </div>
                            </div>
                        </div>
                        <div className='submit-button'>
                            <button type="submit">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='login-prompt'>
                <p>Already have an account ? <Link to='/login'>Login</Link></p>
            </div>
        </div>
    </div>
  );
};

export default Register;