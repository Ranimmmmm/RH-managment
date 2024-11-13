import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import './Login.css'
const Login = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      // Here we're simulating a profile object with the information we have
      const simulatedProfile = {
        name: codeResponse.name , // We don't have the actual name
        token: codeResponse.access_token
      };
      navigate('/employee/TeamActivity', { state: { profile: simulatedProfile } });
    },
    onError: (error) => console.log('Login Failed:', error)
  });

  return (
    <div className="App"> 
      <div className="login-container">
        <h2>Login</h2>
        <button onClick={() => login()} className="google-login-btn">
          Sign in with Google 🚀
        </button>
      </div>
    </div>
  );

};

export default Login;