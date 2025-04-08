import { useState } from 'react';
import { Movie } from '../types/Movie';
import { addMovie } from '../api/AdminApi';
import { toast } from 'react-toastify';

interface NewBookFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

// List of all genre options
const genreOptions = [
  'action', 'adventure', 'anime', 'british', 'children', 'comedies',
  'comedies_dramas_int', 'comedies_int', 'comedies_rom', 'crime_docu',
  'documentaries', 'documentaries_int', 'docuseries', 'dramas',
  'dramas_int', 'dramas_rom', 'family', 'fantasy', 'horror', 'thrillers_int',
  'romantic_tv_shows_int', 'kids', 'language_tv', 'musicals', 'nature',
  'reality', 'spirituality', 'action_tv', 'tv_comedies', 'tv_dramas',
  'talk_shows', 'thrillers'
];

const NewMovieForm = ({ onSuccess, onCancel }: NewBookFormProps) => {
  const [formData, setFormData] = useState<Movie>({
    show_id: '',
    type: '',
    title: '',
    director: '',
    cast: '',
    country: '',
    release_year: 0,
    rating: '',
    duration: '',
    description: '',
    action: 0,
    adventure: 0,
    anime: 0,
    british: 0,
    children: 0,
    comedies: 0,
    comedies_dramas_int: 0,
    comedies_int: 0,
    comedies_rom: 0,
    crime_docu: 0,
    documentaries: 0,
    documentaries_int: 0,
    docuseries: 0,
    dramas: 0,
    dramas_int: 0,
    dramas_rom: 0,
    family: 0,
    fantasy: 0,
    horror: 0,
    thrillers_int: 0,
    romantic_tv_shows_int: 0,
    kids: 0,
    language_tv: 0,
    musicals: 0,
    nature: 0,
    reality: 0,
    spirituality: 0,
    action_tv: 0,
    tv_comedies: 0,
    tv_dramas: 0,
    talk_shows: 0,
    thrillers: 0
    // primaryGenre is still computed by the backend
  });

  // Track the currently selected genre for the dropdown
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'genreSelector') {
      setSelectedGenre(value); // track selection for dropdown

      // Update genre flags: 1 for selected, 0 for all others
      setFormData((prev) => ({
        ...prev,
        ...genreOptions.reduce((acc, genre) => {
          acc[genre as keyof Movie] = genre === value ? 1 : 0;
          return acc;
        }, {} as Partial<Movie>)
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting movie:', formData);
    const result = await addMovie(formData);
    if (result) {
      onSuccess();
    } else {
      toast.error('Failed to add movie');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 mb-4">
      <h2>Add New Movie</h2>

      <label>
        Title:
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="form-control mb-2"
        />
      </label>

      <label>
        Type:
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="form-control mb-2"
        />
      </label>

      <label>
        Director:
        <input
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
          className="form-control mb-2"
        />
      </label>

      <label>
        Country:
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="form-control mb-2"
        />
      </label>

      <label>
        Release Year:
        <input
          type="number"
          name="release_year"
          value={formData.release_year}
          onChange={handleChange}
          className="form-control mb-2"
        />
      </label>

      <label>
        Rating:
        <input
          type="text"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="form-control mb-2"
        />
      </label>

      <label>
        Duration:
        <input
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="form-control mb-2"
        />
      </label>

      <label>
        Primary Genre:
        <select
          name="genreSelector"
          value={selectedGenre}
          onChange={handleChange}
          className="form-control mb-3"
        >
          <option value="">-- Select a genre --</option>
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </label>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-success">
          Add Movie
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default NewMovieForm;
