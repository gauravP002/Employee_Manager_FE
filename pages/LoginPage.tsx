
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../features/auth/authSlice';
import { RootState } from '../app/store';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: 'employee@company.com',
      password: 'password'
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    dispatch(authActions.loginRequest(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-4">
            <i className="fas fa-layer-group text-3xl text-indigo-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Sign In</h1>
          <p className="text-slate-500 mt-2">Access your workflow dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center">
            <i className="fas fa-exclamation-circle mr-3"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="far fa-envelope"></i>
              </span>
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} focus:outline-none focus:ring-4 transition-all`}
                placeholder="you@company.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <i className="fas fa-lock"></i>
              </span>
              <input
                {...register('password')}
                type="password"
                className={`w-full pl-12 pr-4 py-3 rounded-xl border ${errors.password ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-indigo-100'} focus:outline-none focus:ring-4 transition-all`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center disabled:opacity-50"
          >
            {loading ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100 text-center text-sm">
          <p className="text-slate-400">Demo Accounts:</p>
          <div className="flex justify-center space-x-4 mt-2">
            <code className="bg-slate-50 px-2 py-1 rounded text-slate-600">employee@company.com</code>
            <code className="bg-slate-50 px-2 py-1 rounded text-slate-600">manager@company.com</code>
          </div>
          <p className="mt-2 text-slate-400">Password: <code className="bg-slate-50 px-2 py-1 rounded">password</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
