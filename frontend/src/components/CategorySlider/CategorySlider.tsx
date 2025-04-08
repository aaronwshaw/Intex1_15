import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import Slider from 'react-slick';
import Spinner from '../Spinner/Spinner';
import { fetchTopRatedMovies } from '../../api/MoviesApi';
import { Movie } from '../../types/Movie';
import { toast } from 'react-toastify';

export default function CategorySlider() {
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 1500,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery<Movie[] | null>({
    queryKey: ['topRatedMovies'],
    queryFn: () => fetchTopRatedMovies(10),
  });

  useEffect(() => {
    if (isError) toast.error('Failed to load top-rated movies');
  }, [isError]);

  return (
    <div className="container my-10">
      <h3 className="text-3xl font-medium mb-5">Top Rated Movies</h3>
      {isLoading ? (
        <Spinner />
      ) : (
        <Slider {...settings}>
          {movies?.map((movie) => (
            <div
              key={movie.show_id}
              className="rounded-lg px-4 py-6 dark:bg-gray-800 dark:border-gray-700 text-center shadow-md"
            >
              {/* Placeholder for image — will connect to Amazon Blob Storage later */}
              {/* <img
                src={movie.poster_url}
                alt={movie.title}
                className="rounded-lg object-cover w-full h-80 mb-4"
              /> */}
              <h3 className="text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap font-semibold text-xl tracking-tight dark:text-white">
                {movie.title}
              </h3>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

