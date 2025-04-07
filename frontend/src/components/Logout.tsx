import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/IntexAPI';

function Logout(props: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    const result = await logoutUser();

    if (result.ok) {
      navigate('/login');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  return (
    <a className="logout" href="#" onClick={handleLogout}>
      {props.children}
    </a>
  );
}

export default Logout;
