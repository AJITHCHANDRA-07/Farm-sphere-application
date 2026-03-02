import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Mail, Phone, User, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

interface LoginFormData {
  name: string;
  email: string;
  password: string;
}

interface MobileFormData {
  mobile: string;
  otp: string;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  
  // Form states
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [loginData, setLoginData] = useState<LoginFormData>({
    name: '',
    email: '',
    password: ''
  });
  const [mobileData, setMobileData] = useState<MobileFormData>({
    mobile: '',
    otp: ''
  });
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle login form changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  // Handle mobile form changes
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMobileData({
      ...mobileData,
      [e.target.name]: e.target.value
    });
  };

  // Handle email/password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await login(loginData.email, loginData.password);
      setSuccess('Login successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle email signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signup(loginData.name, loginData.email, loginData.password);
      setSuccess('Account created successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mobile OTP send
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsOtpSent(true);
      setShowOtpField(true);
      setSuccess('OTP sent to your mobile number');
    } catch (err) {
      setError('Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle mobile OTP verification
  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Login successful!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-600 rounded-full p-3">
              <User className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {!isLoginMode ? 'Join FarmSphere' : 
             isSignupMode ? 'Create your FarmSphere account' : 
             'Sign in to FarmSphere'}
          </h2>
          <p className="text-gray-600">
            {!isLoginMode 
              ? 'Create your account to get started with mobile'
              : isSignupMode
              ? 'Join thousands of farmers using FarmSphere'
              : 'Welcome back! Please sign in to your account'
            }
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Login Type Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => {
              setIsLoginMode(true);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              isLoginMode
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email
          </button>
          <button
            onClick={() => {
              setIsLoginMode(false);
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              !isLoginMode
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            Mobile
          </button>
        </div>

        {/* Email/Password Auth Type Toggle */}
        {isLoginMode && (
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => {
                setIsSignupMode(false);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isSignupMode
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignupMode(true);
                setError('');
                setSuccess('');
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isSignupMode
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Email/Password Form */}
        {isLoginMode && !isSignupMode && (
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-500">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Email/Password Signup Form */}
        {isLoginMode && isSignupMode && (
          <form onSubmit={handleEmailSignup} className="space-y-6">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={loginData.name}
                onChange={handleLoginChange}
                className="w-full"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={loginData.email}
                onChange={handleLoginChange}
                className="w-full"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className="w-full pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Eye className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="agree"
                name="agree"
                type="checkbox"
                required
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="agree" className="ml-2 block text-sm text-gray-700">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        )}

        {/* Mobile OTP Form */}
        {!isLoginMode && (
          <form onSubmit={showOtpField ? handleMobileLogin : handleSendOtp} className="space-y-6">
            <div>
              <Label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </Label>
              <Input
                id="mobile"
                name="mobile"
                type="tel"
                required
                value={mobileData.mobile}
                onChange={handleMobileChange}
                className="w-full"
                placeholder="+91-XXXXXXXXXX"
                pattern="[+]?[0-9]{10,15}"
              />
            </div>

            {showOtpField && (
              <div>
                <Label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={mobileData.otp}
                  onChange={handleMobileChange}
                  className="w-full"
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading 
                ? (showOtpField ? 'Verifying...' : 'Sending OTP...')
                : (showOtpField ? 'Verify OTP' : 'Send OTP')
              }
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {showOtpField && (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full text-sm text-green-600 hover:text-green-500"
              >
                Resend OTP
              </button>
            )}
          </form>
        )}

        {/* Signup Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
              Sign up
            </Link>
          </p>
        </div>

        {/* Terms */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <Link to="/terms" className="text-green-600 hover:text-green-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-green-600 hover:text-green-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
