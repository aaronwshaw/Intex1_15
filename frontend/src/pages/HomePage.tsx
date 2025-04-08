// import { useNavigate, useParams } from 'react-router-dom';
// import { useState } from 'react';
//import WelcomeBand from '../components/WelcomeBand';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import MovieList from '../components/MovieList';
import { useState } from 'react';
import GenreFilter from '../components/GenreFilter';
import { useNavigate } from 'react-router-dom';
function HomePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const navigate = useNavigate();
import WelcomeBand from '../components/WelcomeBand';


  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
        <p onClick={()=> navigate('/privacy')}>Privacy Policy</p>
      </span>
      <WelcomeBand />
      <GenreFilter
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
      <MovieList selectedGenres={selectedGenres} />
    </AuthorizeView>
  );
}
 export default HomePage