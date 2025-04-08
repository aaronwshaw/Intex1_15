import { useEffect, useState } from 'react';
import "./GenreFilter.css"
import { fetchGenres } from '../api/MoviesApi';

function GenreFilter({
  selectedGenres,
  setSelectedGenres,
}: {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const getGenres = async () => {
      const data = await fetchGenres();
      if (data) {
        console.log('Fetched genres:', data);
        setGenres(data);
      }
    };
    getGenres();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedGenres = selectedGenres.includes(target.value)
      ? selectedGenres.filter((x) => x !== target.value)
      : [...selectedGenres, target.value];

    setSelectedGenres(updatedGenres);
  }

  return (
    <div className="genre-filter">
      <h5>Genres</h5>
      <div className="genre-list">
        {genres.map((c) => (
          <div key={c} className="genre-item">
            <input
              type="checkbox"
              id={c}
              value={c}
              className="genre-checkbox"
              onChange={handleCheckboxChange}
              checked={selectedGenres.includes(c)}
            />
            <label htmlFor={c}>{c}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GenreFilter;
