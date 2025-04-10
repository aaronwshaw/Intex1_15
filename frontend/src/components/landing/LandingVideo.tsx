import React from 'react';
import landingVideo from '../../assets/promotion.mp4';

const LandingVideo: React.FC = () => {
  return (
    <div className="w-screen px-4 flex justify-center py-8 bg-black">
      <video
        src={landingVideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-[1600px] h-auto object-cover"
        style={{ maxWidth: '1600px' }}
      />
    </div>
  );
};

export default LandingVideo;
