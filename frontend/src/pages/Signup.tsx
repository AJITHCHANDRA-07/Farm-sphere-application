import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);

  // Check if user is already signed into Google
  useEffect(() => {
    checkGoogleSignInStatus();
  }, []);

  const checkGoogleSignInStatus = async () => {
    try {
      // In production, this would use Google's One Tap API
      // For now, we'll simulate checking if user is signed in
      const isSignedIn = await simulateGoogleSignInCheck();
      
      if (isSignedIn) {
        const userData = await getGoogleUserData();
        setGoogleUser(userData);
        setIsGoogleSignedIn(true);
      }
    } catch (error) {
      console.log('Google sign-in check failed:', error);
    }
  };

  const simulateGoogleSignInCheck = async () => {
    // Simulate checking Google sign-in status
    await new Promise(resolve => setTimeout(resolve, 500));
    // For demo purposes, randomly return true to simulate signed-in user
    return Math.random() > 0.5;
  };

  const getGoogleUserData = async () => {
    // Simulate getting Google user data
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      name: 'Farmer User',
      email: 'farmer@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      id: 'google-user-id'
    };
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // If user is already signed in, use existing data
      let userData = googleUser;
      
      if (!userData) {
        // Simulate Google OAuth flow
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock Google user data
        userData = {
          name: 'Google User',
          email: 'user@gmail.com',
          avatar: 'https://lh3.googleusercontent.com/a/default-user'
        };
      }
      
      // Create account using signup method
      const success = await signup(userData.name, userData.email, 'google-oauth-password');
      
      if (success) {
        setSuccess('Google account connected successfully!');
        setTimeout(() => navigate('/'), 2000);
      } else {
        setError('Failed to connect Google account');
      }
    } catch (err) {
      setError('Google signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickGoogleSignup = async () => {
    if (googleUser) {
      setIsLoading(true);
      setError('');
      
      try {
        // Direct signup with existing Google user data
        const success = await signup(googleUser.name, googleUser.email, 'google-oauth-password');
        
        if (success) {
          setSuccess('Welcome to FarmSphere!');
          setTimeout(() => navigate('/'), 1500);
        } else {
          setError('Failed to create account');
        }
      } catch (err) {
        setError('Signup failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMobileSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mobile signup logic will be implemented here
    console.log('Mobile signup submitted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="https://www.nicepng.com/png/detail/892-8924282_iafere-logo-environment-and-agriculture-logo.png" 
                  alt="FarmSphere Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Join FarmSphere</CardTitle>
            <CardDescription className="text-center">
              Simple signup for farmers - just mobile number or Google
            </CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-green-800">{success}</span>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-800">{error}</span>
              </div>
            )}
            {/* Google One Tap - If user is already signed in */}
            {isGoogleSignedIn && googleUser && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3">
                  <img 
                    src={googleUser.avatar} 
                    alt={googleUser.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{googleUser.name}</p>
                    <p className="text-sm text-gray-600">{googleUser.email}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleQuickGoogleSignup}
                  disabled={isLoading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  style={{
                    height: '50px',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Continue as {googleUser.name}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Using your Google account for FarmSphere
                </p>
              </div>
            )}

            {/* Standard Google Signup - If user not signed in */}
            {(!isGoogleSignedIn || !googleUser) && (
              <Button 
                onClick={handleGoogleSignup}
                disabled={isLoading}
                variant="outline" 
                className="w-full mb-6"
                style={{
                  backgroundColor: '#4285F4',
                  color: 'white',
                  border: 'none',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="white" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="white" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="white" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="white" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign up with Google
                  </>
                )}
              </Button>
            )}

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with mobile</span>
              </div>
            </div>

            {/* Mobile Signup Form */}
            <form onSubmit={handleMobileSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your 10-digit mobile number"
                  required
                  className="w-full"
                  pattern="[0-9]{10}"
                  maxLength={10}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                style={{
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: '500'
                }}
              >
                Sign up with Mobile
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-500 font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
