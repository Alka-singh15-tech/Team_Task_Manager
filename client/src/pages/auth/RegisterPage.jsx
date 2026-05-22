import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, Input, Spinner } from '../../components/common';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'member']),
});

const RegisterPage = () => {
  const { register: registerAction } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'member' }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await registerAction(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Get Started
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create your account and start organizing your team.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center font-medium border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Input label="Full Name" placeholder="Jane Doe" {...register('name')} error={errors.name?.message} />
          <Input label="Email Address" type="email" placeholder="jane@company.com" {...register('email')} error={errors.email?.message} />
          <Input label="Password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Role</label>
            <div className="grid grid-cols-2 gap-4">
               <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                 selectedRole === 'member' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
               }`}>
                  <input type="radio" value="member" {...register('role')} className="sr-only" />
                  <span className="text-sm font-bold dark:text-gray-200">Member</span>
               </label>
               <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${
                 selectedRole === 'admin' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
               }`}>
                  <input type="radio" value="admin" {...register('role')} className="sr-only" />
                  <span className="text-sm font-bold dark:text-gray-200">Admin</span>
               </label>
            </div>
          </div>

          <Button type="submit" className="w-full py-3 mt-6 text-lg font-bold shadow-lg" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" className="mx-auto" /> : 'Create Account'}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-indigo-600 hover:text-indigo-500">
            Sign in instead
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
