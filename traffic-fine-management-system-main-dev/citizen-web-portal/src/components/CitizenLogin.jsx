import { useState } from 'react';
import { loginCitizen, registerCitizenAccount } from '../api/citizenApi';
import { setAuthToken } from '../api/client';

export default function CitizenLogin({ onLoginSuccess, onCancel, activeFine = null, isCheckout = false }) {
  const [activeTab, setActiveTab] = useState(isCheckout ? 'signup' : 'login');
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Signup states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Shared states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim() || !/\S+@\S+\.\S+/.test(loginEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await loginCitizen(loginEmail.trim(), loginPassword);
      const payload = response?.data?.data;
      if (payload?.token) {
        setAuthToken(payload.token);
        onLoginSuccess({
          id: payload.id,
          fullName: payload.name || loginEmail.trim(),
          email: payload.email,
          licenseNumber: '',
          vehicleNumber: '',
          token: payload.token,
        });
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('Unable to sign in. Please verify your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        name: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: 'DRIVER',
        phoneNumber: phoneNumber.trim() || null,
        district: district.trim() || null,
      };
      const response = await registerCitizenAccount(payload);
      const authPayload = response?.data?.data;
      if (authPayload?.token) {
        setAuthToken(authPayload.token);
        onLoginSuccess({
          id: authPayload.id,
          fullName: authPayload.name || fullName.trim(),
          email: authPayload.email,
          licenseNumber: '',
          vehicleNumber: '',
          token: authPayload.token,
        });
      } else {
        setError('Unable to create your account. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create your account right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, pass) => {
    setLoginEmail(demoEmail);
    setLoginPassword(pass);
    setError('');

    setIsLoading(true);
    try {
      const response = await loginCitizen(demoEmail, pass);
      const payload = response?.data?.data;
      if (payload?.token) {
        setAuthToken(payload.token);
        onLoginSuccess({
          id: payload.id,
          fullName: payload.name || demoEmail,
          email: payload.email,
          licenseNumber: '',
          vehicleNumber: '',
          token: payload.token,
        });
      }
    } catch (err) {
      setError('Demo login is not available right now.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardTitle = isCheckout ? "Step 3: Account Verification" : "Citizen Portal Login";
  const cardDesc = isCheckout 
    ? "Create a Citizen Portal account or log in to link this payment to your official driving license record."
    : "Log in or register your driving license credentials to view pending fines, payment history, and generate digital clearance.";

  return (
    <div className="card animate-fade-in" style={{ maxWidth: '540px', margin: '0 auto' }}>
      <h2 className="form-title" style={{ justifyContent: 'center', marginBottom: '8px' }}>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="var(--primary-light)" style={{ marginRight: '8px' }}>
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="var(--primary-light)"/>
        </svg>
        {cardTitle}
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px', textAlign: 'center' }}>
        {cardDesc}
      </p>

      {isCheckout && activeFine && (
        <div className="license-release-notice" style={{
          background: 'var(--bg-card-hover, rgba(245, 192, 67, 0.08))',
          border: '1px solid var(--primary-light)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          color: 'var(--text-h)',
          fontSize: '13.5px',
          textAlign: 'left',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--primary-light)" style={{ flexShrink: 0 }}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
          <span>
            <strong>Ticket Match Detected:</strong> We've prefilled details from ticket <strong>{activeFine.referenceNumber}</strong>. Set a password and email to create your new account instantly.
          </span>
        </div>
      )}

      <div className="dashboard-tabs" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)' }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('login');
            setError('');
          }}
          style={{ flex: 1, textAlign: 'center', padding: '10px' }}
        >
          Sign In / Log In
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('signup');
            setError('');
          }}
          style={{ flex: 1, textAlign: 'center', padding: '10px' }}
        >
          Sign Up (New User)
        </button>
      </div>

      {activeTab === 'login' ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="loginEmail">Email Address</label>
            <input
              id="loginEmail"
              type="email"
              placeholder="e.g. name@domain.com"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px', position: 'relative' }}>
            <label htmlFor="loginPassword">Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="loginPassword"
                type={showLoginPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{ width: '100%', paddingRight: '48px' }}
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '4px'
                }}
                aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
              >
                {showLoginPassword ? (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.39 2.7-3.16 3.44-5.18-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22l1.41-1.41L3.41 2.86 2 4.27zM9.53 9.53l1.41 1.41c-.05.18-.08.38-.08.56 0 1.1.9 2 2 2 .18 0 .38-.03.56-.08l1.41 1.41c-.6.38-1.3.61-2.06.61-2.21 0-4-1.79-4-4 0-.76.23-1.46.61-2.06zM11.93 9l2.84 2.84C14.74 10.82 14 9.5 12 9c-.02 0-.05.01-.07.01z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="alert-error animate-slide-in" style={{ marginTop: '0', marginBottom: '20px' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
              Back
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1.5 }} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                  Logging In...
                </>
              ) : (
                'Log In & Continue'
              )}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSignupSubmit}>
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="signupFullName">Full Name *</label>
            <input
              id="signupFullName"
              type="text"
              placeholder="e.g. Hirushi Perera"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label htmlFor="signupEmail">Email Address *</label>
            <input
              id="signupEmail"
              type="email"
              placeholder="e.g. name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="signupPassword">Password *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="signupPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px'
                  }}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.39 2.7-3.16 3.44-5.18-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22l1.41-1.41L3.41 2.86 2 4.27zM9.53 9.53l1.41 1.41c-.05.18-.08.38-.08.56 0 1.1.9 2 2 2 .18 0 .38-.03.56-.08l1.41 1.41c-.6.38-1.3.61-2.06.61-2.21 0-4-1.79-4-4 0-.76.23-1.46.61-2.06zM11.93 9l2.84 2.84C14.74 10.82 14 9.5 12 9c-.02 0-.05.01-.07.01z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label htmlFor="signupConfirmPassword">Confirm Password *</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  id="signupConfirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px'
                  }}
                >
                  {showConfirmPassword ? (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.82l2.92 2.92c1.51-1.39 2.7-3.16 3.44-5.18-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22l1.41-1.41L3.41 2.86 2 4.27zM9.53 9.53l1.41 1.41c-.05.18-.08.38-.08.56 0 1.1.9 2 2 2 .18 0 .38-.03.56-.08l1.41 1.41c-.6.38-1.3.61-2.06.61-2.21 0-4-1.79-4-4 0-.76.23-1.46.61-2.06zM11.93 9l2.84 2.84C14.74 10.82 14 9.5 12 9c-.02 0-.05.01-.07.01z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div className="form-group">
              <label htmlFor="signupPhoneNumber">Phone Number (Optional)</label>
              <input
                id="signupPhoneNumber"
                type="tel"
                placeholder="e.g. +94712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="signupDistrict">District (Optional)</label>
              <input
                id="signupDistrict"
                type="text"
                placeholder="e.g. Colombo"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="alert-error animate-slide-in" style={{ marginTop: '0', marginBottom: '20px' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onCancel}>
              Back
            </button>
            <button type="submit" className="btn-accent" style={{ flex: 1.5 }} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></span>
                  Registering...
                </>
              ) : (
                'Create Account & Continue'
              )}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'login' && (
        <div style={{ marginTop: '32px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textAlign: 'center' }}>
            Quick Demo Login Accounts:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '8px', fontSize: '12px', borderRadius: '8px', textAlign: 'left' }}
              onClick={() => handleDemoLogin('driver1@example.com', 'password123')}
            >
              <strong>Hirushi Perera</strong>
              <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>Email: driver1@example.com</span>
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '8px', fontSize: '12px', borderRadius: '8px', textAlign: 'left' }}
              onClick={() => handleDemoLogin('driver2@example.com', 'password123')}
            >
              <strong>Aruni Fernando</strong>
              <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)' }}>Email: driver2@example.com</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
