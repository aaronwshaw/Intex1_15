import { useEffect, useState } from 'react';

function GenreFilter({
  selectedGenres,
  setSelectedGenres,
}: {
  selectedGenres: string[];
  setSelectedGenres: (genres: string[]) => void;
}) {
  const [genres, setGenres] = useState<string[]>([]);
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          'https://localhost:5000/api/Movies/GetGenres'
        );
        const data = await response.json();
        console.log('Fetched genres: ', data);
        setGenres(data);
      } catch (error) {
        console.error('Error fetching genres', error);
      }
    };
    fetchGenres();
  }, []);

  function handleCheckboxChange({ target }: { target: HTMLInputElement }) {
    const updatedGenres = selectedGenres.includes(target.value)
      ? selectedGenres.filter((x) => x !== target.value)
      : [...selectedGenres, target.value];

    setSelectedGenres(updatedGenres);
  }

  return(
    <>
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
  </>
  )
}

export default GenreFilter;
