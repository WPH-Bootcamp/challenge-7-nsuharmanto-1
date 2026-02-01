import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.phone) newErrors.phone = 'Phone number is required';
    else if (!/^[0-9]{10,15}$/.test(form.phone)) newErrors.phone = 'Invalid phone number';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 6) newErrors.password = 'Min 6 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setApiError(null);
  };

  function isAxiosError(error: unknown): error is {
    response?: { data?: { message?: string } };
  } {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as { response?: unknown }).response === 'object'
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError(null);
    try {
      await axios.post(
        `${baseUrl}/api/auth/register`,
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
        }
      );
      navigate('/login');
    } catch (err: unknown) {
      if (
        isAxiosError(err) &&
        err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        err.response.data !== null &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
      ) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col md:flex-row w-full h-screen overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-gray-950 items-center justify-center">
          <img
            src="/images/register_login.svg"
            alt="Register Login"
            className="object-cover h-full w-full"
            style={{ objectPosition: 'left' }}
          />
        </div>
        <div className="w-full md:w-1/2 h-full flex items-center justify-center bg-white">
          <div className="w-full max-w-[374px] shadow-lg flex flex-col items-center justify-start bg-white rounded-none md:rounded-2xl p-4 md:p-8">
            <div className="flex items-center gap-3 w-full mb-4">
              <a href="/" className="focus:outline-none">
                <img
                  src="/logos/foody_logo_r.svg"
                  alt="Foody Logo Red"
                  className="h-10 w-10 mt-1 cursor-pointer"
                />
              </a>
              <h2 className="font-extrabold text-2xl text-gray-900">Foody</h2>
            </div>
            <div className="font-extrabold text-xl text-gray-900 w-full mb-1">Create Account</div>
            <div className="text-gray-700 text-base w-full mb-4">
              Join us and enjoy your meal!
            </div>
            <div className="flex w-full h-14 rounded-2xl gap-2 overflow-hidden bg-gray-100 shadow mb-2">
              <button
                type="button"
                className="flex-1 flex items-center justify-center h-10 mt-2 ml-2 rounded-xl border-none font-medium text-base bg-gray-100 text-gray-600 hover:bg-white hover:text-gray-950 hover:font-bold hover:shadow cursor-pointer"
                onClick={() => navigate('/login')}
              >
                Sign in
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center h-10 mt-2 mr-2 rounded-xl border-none text-base bg-white text-gray-950 font-bold cursor-default pointer-events-none shadow"
                tabIndex={-1}
              >
                Sign up
              </button>
            </div>
            <form className="w-full flex flex-col" onSubmit={handleSubmit} autoComplete="off">
              <div className="relative w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className={`w-full h-12 px-4 rounded-xl border text-base box-border focus:outline-none shadow ${
                    errors.name ? 'border-primary bg-red-50' : 'border-gray-300'
                  } transition-colors`}
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                  {errors.name}
                </div>
              )}
              <div className="relative w-full mt-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full h-12 px-4 rounded-xl border text-base box-border focus:outline-none shadow ${
                    errors.email ? 'border-primary bg-red-50' : 'border-gray-300'
                  } transition-colors`}
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                  {errors.email}
                </div>
              )}
              <div className="relative w-full mt-4">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className={`w-full h-12 px-4 rounded-xl border text-base box-border focus:outline-none shadow ${
                    errors.phone ? 'border-primary bg-red-50' : 'border-gray-300'
                  } transition-colors`}
                  value={form.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
              {errors.phone && (
                <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                  {errors.phone}
                </div>
              )}
              <div className="relative w-full mt-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  className={`w-full h-12 pr-12 px-4 rounded-xl border text-base box-border focus:outline-none shadow ${
                    errors.password ? 'border-primary bg-red-50' : 'border-gray-300'
                  } transition-colors`}
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  inputMode="text"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500 p-0 m-0 bg-transparent border-none outline-none"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    // Eye open
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11 3a3 3 0 100-6 3 3 0 000 6z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye closed
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M17.94 17.94A10.94 10.94 0 0112 19C7 19 2.73 15.89 1 12a17.77 17.77 0 013.07-4.61M9.9 9.9a3 3 0 104.24 4.24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="21"
                        y1="21"
                        x2="3"
                        y2="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                  {errors.password}
                </div>
              )}
              <div className="relative w-full mt-4">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full h-12 pr-12 px-4 rounded-xl border text-base box-border focus:outline-none shadow ${
                    errors.confirmPassword ? 'border-primary bg-red-50' : 'border-gray-300'
                  } transition-colors`}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  inputMode="text"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-gray-500 p-0 m-0 bg-transparent border-none outline-none"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? (
                    // Eye open
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12zm11 3a3 3 0 100-6 3 3 0 000 6z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    // Eye closed
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M17.94 17.94A10.94 10.94 0 0112 19C7 19 2.73 15.89 1 12a17.77 17.77 0 013.07-4.61M9.9 9.9a3 3 0 104.24 4.24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <line
                        x1="21"
                        y1="21"
                        x2="3"
                        y2="3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                  {errors.confirmPassword}
                </div>
              )}
              {/* API Error */}
              {apiError && (
                <div className="w-full text-center text-primary text-sm font-semibold mt-2">
                  {apiError}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-primary text-white font-bold text-base mt-4 shadow hover:bg-red-700 transition border-none disabled:opacity-60"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}