import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/IntexAPI';
import '../styles/Identity.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');

    const result = await registerUser(email, password);

    if (result.ok) {
      setError('Successful registration. Please log in.');
    } else {
      setError(result.error || 'Error registering.');
    }
  };

  return (
    <div className="login-page full-height d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="card border-0 shadow rounded-3">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">Register</h5>
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
                <label htmlFor="email">Email address</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  className="form-control"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>

              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-login text-uppercase fw-bold"
                  type="submit"
                >
                  Register
                </button>
              </div>
              <div className="d-grid mb-2">
                <button
                  className="btn btn-primary btn-google text-uppercase fw-bold"
                  onClick={handleLoginClick}
                >
                  Go to Login
                </button>
              </div>
            </form>
            {error && <p className="text-danger">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
