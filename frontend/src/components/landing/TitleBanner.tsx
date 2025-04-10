import React from 'react';

const TitleBanner: React.FC = () => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
      }}
    >
      {/* Background Image */}
      <div
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          lineHeight: 0,
        }}
      >
        <img
          src="/background.png"
          alt="Banner Background"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            margin: 0,
            padding: 0,
            border: 'none',
          }}
        />
      </div>

      {/* Text Section */}
      <div
        style={{
          backgroundColor: '#141414',
          color: 'white',
          padding: '2rem 1rem',
          marginTop: '0px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
          }}
        >
          Why be sad when you can watch a movie, ding
        </h2>
        <p
          style={{
            fontSize: '1.1rem',
            maxWidth: '800px',
            margin: '0 auto',
            color: '#bbb',
          }}
        >
          Discover, explore, and enjoy a world of films curated just for you.
          Our top-rated picks and personalized recommendations make movie nights
          better than ever.
        </p>
      </div>
    </div>
  );
};

export default TitleBanner;

