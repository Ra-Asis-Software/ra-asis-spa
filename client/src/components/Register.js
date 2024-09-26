import React, { useState } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
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
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Confirm Password"
          onChange={onChange}
          required
        />
        <button type="submit">Submit Details</button>
      </form>
    </div>
  );
};

export default Register;