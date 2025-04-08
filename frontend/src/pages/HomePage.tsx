// import { useNavigate, useParams } from 'react-router-dom';
// import { useState } from 'react';
import WelcomeBand from '../components/WelcomeBand';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import MovieList from '../components/MovieList';
import { useState } from 'react';
import GenreFilter from '../components/GenreFilter';

function HomePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  return (
    <>
    <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
      </span>
      <WelcomeBand />
      <GenreFilter 
      selectedGenres={selectedGenres}
      setSelectedGenres={setSelectedGenres}/>
      <MovieList 
      selectedGenres={selectedGenres}/>
    </>
  );
}

export default HomePage;
