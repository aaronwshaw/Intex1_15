import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/IntexAPI';
import '../styles/Identity.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
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

    const validationErrors: string[] = [];

    if (!email || !password || !confirmPassword) {
      validationErrors.push('Please fill in all fields.');
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      validationErrors.push('Please enter a valid email address.');
    }

    if (password !== confirmPassword) {
      validationErrors.push('Passwords do not match.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await registerUser(email, password);

    if (result.ok) {
      setErrors(['Registration successful! Redirecting to login...']);
      setTimeout(() => navigate('/login'), 2500);
    } else {
      const backendErrors = (
        result.error ?? 'An unknown error occurred.'
      ).split(/(?<=\.)\s+/);
      setErrors(backendErrors);
    }
  };

  return (
    <div className="login-page full-height d-flex justify-content-center align-items-center">
      <div className="row">
        <div className="card border-0 shadow rounded-3">
          <div className="card-body p-4 p-sm-5">
            <h5 className="card-title text-center mb-5 fw-light fs-5">
              Register
            </h5>
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
                  className="btn btn-danger text-uppercase fw-bold"
                  type="button"
                  onClick={handleLoginClick}
                >
                  Go to Login
                </button>
              </div>
            </form>

            {errors.length > 0 && (
              <div
                className={`alert ${
                  errors[0].toLowerCase().includes('success')
                    ? 'alert-success'
                    : 'alert-danger'
                } mt-3`}
                role="alert"
              >
                <ul className="mb-0">
                  {errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
