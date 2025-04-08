import img1 from '../../assets/slider-image-1.jpeg';
import img2 from '../../assets/slider-image-2.jpeg';
import img3 from '../../assets/slider-image-3.jpeg';

import Slider, { Settings } from 'react-slick';

export default function MainSlider() {
  const settings: Settings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container mt-7">
      <div className="flex">
        {/* Left side: main slider */}
        <div className="md:w-3/4 w-full my-0">
          <Slider {...settings}>
            <img
              className="w-full h-[400px] object-cover object-right rounded-lg md:rounded-l-lg md:rounded-r-none"
              src={img1}
              alt="Slider 1"
            />
            <img
              className="w-full h-[400px] object-cover object-right rounded-lg md:rounded-l-lg md:rounded-r-none"
              src={img2}
              alt="Slider 2"
            />
            <img
              className="w-full h-[400px] object-cover object-right rounded-lg md:rounded-l-lg md:rounded-r-none"
              src={img3}
              alt="Slider 3"
            />
          </Slider>
        </div>

        {/* Right side: stacked images (only on md+) */}
        <div className="md:w-1/4 md:block hidden">
          <div className="h-1/2">
            <img
              className="w-full h-[200px] object-cover md:rounded-tr-lg"
              src={img2}
              alt="Promo 1"
            />
          </div>
          <div className="h-1/2">
            <img
              className="w-full h-[200px] object-cover md:rounded-br-lg"
              src={img3}
              alt="Promo 2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
