import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`,
            Accept: 'application/json'
          }
        })
        .then((res) => {
          console.log('google user info: ',res.data);
          const userProfile = {
            name: res.data.name,
            picture : res.data.picture
          };
          // Store the user profile and token in localStorage
          localStorage.setItem('userProfile', JSON.stringify(userProfile));
          localStorage.setItem('token', codeResponse.access_token);
          navigate('/employee/TeamActivity'); // Navigate to dashboard
        })
        .catch((err) => {
          console.log(err);
          setErrorMsg('Failed to fetch user profile. Please try again.');
        });
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      setErrorMsg('Login failed. Please try again.');
    }
  });

  return (
    <div className="container">
      <div className="login-container">
        <h2>Login</h2>
        <button onClick={login} className="google-login-btn">
          Sign in with Google 🚀
        </button>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
      </div>
    </div>
  );
};

export default Login;
