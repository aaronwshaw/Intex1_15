import { useState } from 'react';
import noPoster from "../assets/no_post.png"

interface MoviePosterProps {
  title: string;
  width?: number;
  height?: number;
}

const MoviePoster = ({ title, width = 200, height = 300 }: MoviePosterProps) => {
  const [failed, setFailed] = useState(false);

  const normalizeTitleToMatchBlob = (title: string) => {
    return title
      .replace(/[^a-zA-Z0-9 ]/g, '') // remove special characters but keep existing spaces
      .replace(/ /g, '%20');         // replace each space with %20 (including double spaces)
  };
  

  const getPosterUrl = (title: string) => {
    const normalized = normalizeTitleToMatchBlob(title);
    return `https://posterstorage115.blob.core.windows.net/posters/Movie%20Posters/${normalized}.jpg`;
  };

  if (failed) {
    return (
      <div
        style={{
          width,
          height,
          backgroundColor: '#ccc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={noPoster}
          alt="Poster Coming Soon"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }
  

  return (
    <img
      src={getPosterUrl(title)}
      alt={`${title} poster`}
      style={{ width, height, objectFit: 'cover' }}
      onError={() => setFailed(true)}
    />
  );
};

export default MoviePoster;
