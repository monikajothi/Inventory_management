import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";


function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const location = useLocation();
  React.useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const sendOtp = async () => {
    const res = await fetch('https://inventory-management-s29k.onrender.com/api/auth/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (res.ok) setStep(2);
  };

  const verifyOtp = async () => {
    const res = await fetch('https://inventory-management-s29k.onrender.com/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    if (res.ok) setStep(3);
  };

  const resetPassword = async () => {
    const res = await fetch('https://inventory-management-s29k.onrender.com/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, newPassword }),
    });
    if (res.ok) {
      alert("Password changed successfully!");
      navigate("/login");
    }
  };

  return (
    <div className="p-6">
      {step === 1 && (
        <>
          <h2>Forgot Password</h2>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}
      {step === 2 && (
        <>
          <h2>Verify OTP</h2>
          <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
          <button onClick={verifyOtp}>Verify</button>
        </>
      )}
      {step === 3 && (
        <>
          <h2>Reset Password</h2>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New password" />
          <button onClick={resetPassword}>Reset</button>
        </>
      )}
    </div>
  );
}

export default ForgotPassword;
