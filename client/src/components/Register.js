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

  const { firstName, lastName, phoneNumber, email, username, password, role } = formData;

  // Handle input change
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
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
                    required
                    />
                    <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    placeholder="Last Name"
                    onChange={onChange}
                    required
                    />
                    <input
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    placeholder="Phone Number"
                    onChange={onChange}
                    required
                    />
                </div>
                <div className='credential-details'>
                    <input
                    type="email"
                    name="email"
                    value={email}
                    placeholder="Email"
                    onChange={onChange}
                    required
                    />
                    <input
                    type="text"
                    name="username"
                    value={username}
                    placeholder="Username"
                    onChange={onChange}
                    required
                    />
                    <input
                    type="password"
                    name="password"
                    value={password}
                    placeholder="Password"
                    onChange={onChange}
                    required
                    />
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