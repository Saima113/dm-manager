// /src/components/Signup.js

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './signup.css';

// ✅ Create validation schema with yup
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
//backend connection
  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/signup', data);
      alert('Signup successful! Please log in.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Signup failed!');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      <p>{errors.name?.message}</p>

      <input {...register('email')} placeholder="Email" />
      <p>{errors.email?.message}</p>

      <input {...register('password')} type="password" placeholder="Password" />
      <p>{errors.password?.message}</p>

      <button type="submit">Sign Up</button>
    </form>
  );
}

export default Signup;
