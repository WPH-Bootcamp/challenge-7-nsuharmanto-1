import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '../components/ui/checkbox';
import axios from '../services/api/axios';
import { useDispatch } from 'react-redux';
import { login } from '../features/user/userSlice';
import { Button } from '../components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validate = () => {
    let valid = true;
    setEmailError(null);
    setPasswordError(null);
    setAuthError(null);
    if (!email) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    return valid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setAuthError(null);
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      const token = res.data?.data?.token;
      const userData = res.data?.data?.user;
      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({
          name: userData?.name || 'User',
          avatar: userData?.avatar || '/images/user_avatar.png',
          email: userData?.email,
          phone: userData?.phone || '',
        }));
        dispatch(
          login({
            name: userData?.name || 'User',
            avatar: userData?.avatar || '/images/user_avatar.png',
            email: userData?.email,
            phone: userData?.phone || '',
          })
        );
        navigate('/');
      } else {
        setAuthError('Incorrect email or password.');
      }
    } catch {
      setAuthError('Incorrect email or password.');
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
              <h2 className="font-extrabold text-2xl text-gray-950">Foody</h2>
            </div>
            <div className="font-extrabold text-xl text-gray-950 w-full mb-1">Welcome Back</div>
            <div className="text-gray-950 text-base w-full mb-4">
              Good to see you again! Let's eat
            </div>
            <form className="w-full flex flex-col" onSubmit={handleLogin}>
              <div className="flex w-full h-14 rounded-2xl gap-2 overflow-hidden bg-gray-100 shadow">
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 flex items-center justify-center h-10 mt-2 ml-2 rounded-xl border-none font-medium text-base ${
                    activeTab === 'signin'
                      ? 'bg-white text-gray-950 font-bold cursor-default pointer-events-none shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-white hover:text-gray-950 hover:font-bold hover:shadow cursor-pointer'
                  }`}
                  onClick={() => setActiveTab('signin')}
                  tabIndex={activeTab === 'signin' ? -1 : 0}
                >
                  Sign in
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className={`flex-1 flex items-center justify-center h-10 mt-2 mr-2 rounded-xl border-none font-medium text-base ${
                    activeTab === 'signup'
                      ? 'bg-white text-gray-950 font-bold cursor-default pointer-events-none shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-white hover:text-gray-950 hover:font-bold hover:shadow cursor-pointer'
                  }`}
                  onClick={() => navigate('/register')}
                  tabIndex={activeTab === 'signup' ? -1 : 0}
                >
                  Sign up
                </Button>
              </div>
              <div className="relative w-full mt-6">
                <input
                  type="text"
                  placeholder="Email"
                  className={`w-full h-12 px-4 rounded-xl border text-base box-border focus:outline-none shadow ${
                    emailError ? 'border-primary bg-red-50' : 'border-gray-300'
                  } transition-colors`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  onBlur={() => {
                    if (!email) {
                      setEmailError('Email is required');
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                      setEmailError('Please enter a valid email address');
                    } else {
                      setEmailError(null);
                    }
                  }}
                  autoComplete="username"
                />
              </div>
              {emailError && (
                <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                  {emailError}
                </div>
              )}
              <div className="relative w-full mt-4">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`w-full h-12 pr-10 px-4 rounded-xl border text-base box-border focus:outline-none shadow ${
                    passwordError ? 'border-primary bg-red-50' : 'border-gray-300'
                  } transition-colors`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onBlur={() => {
                    if (!password) {
                      setPasswordError('Password is required');
                    } else if (password.length < 6) {
                      setPasswordError('Password must be at least 6 characters');
                    } else {
                      setPasswordError(null);
                    }
                  }}
                  autoComplete="current-password"
                  inputMode="text"
                  spellCheck={false}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 p-0 m-0 bg-transparent border-none outline-none"
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
              {passwordError && (
                <div className="w-full mt-1 text-left text-primary text-sm font-semibold">
                  {passwordError}
                </div>
              )}
              <div className="flex items-center gap-2 mb-2 mt-4">
                <Checkbox
                  id="remember"
                  className="border border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded-sm flex-shrink-0 focus-visible:ring-0 focus-visible:ring-offset-0 shadow"
                />
                <label
                  htmlFor="remember"
                  className="text-gray-900 text-base select-none cursor-pointer leading-5 flex items-center"
                  style={{
                    lineHeight: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  Remember Me
                </label>
              </div>
              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-white font-bold text-base mt-2 shadow hover:bg-red-700 transition border-none"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Login'}
              </Button>
              {authError && (
                <div className="w-full text-center text-primary text-sm font-semibold mt-2">
                  {authError}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}