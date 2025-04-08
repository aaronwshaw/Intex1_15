// import { useNavigate, useParams } from 'react-router-dom';
// import { useState } from 'react';
//import WelcomeBand from '../components/WelcomeBand';
import AuthorizeView, { AuthorizedUser } from '../components/AuthorizeView';
import Logout from '../components/Logout';
import MovieList from '../components/MovieList';
import { useState } from 'react';
import GenreFilter from '../components/GenreFilter';
import WelcomeBand from '../components/WelcomeBand';

function HomePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  return (
    <AuthorizeView>
      <span>
        <Logout>
          Logout <AuthorizedUser value="email" />
        </Logout>
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