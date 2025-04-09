import React from 'react';

const TitleBanner: React.FC = () => {
  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        border: 0,
        fontSize: '100%',
        verticalAlign: 'baseline',
      }}
    >
      {/* Background Image Container */}
      <div
        style={{
          margin: 0,
          padding: 0,
          width: '100%',
          lineHeight: '0', // removes inline whitespace
        }}
      >
        <img
          src="/background.png"
          alt="Banner Background"
          style={{
            width: '100%',
            height: 'auto',
            display: 'block', // removes extra space under image
            margin: 0,
            padding: 0,
          }}
        />
      </div>

      {/* Text Directly Below */}
      <div
        style={{
          backgroundColor: '#0b0c0f',
          color: 'white',
          padding: '2rem 1rem',
          marginTop: 0, // ensure no spacing
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
          Welcome to CineNiche
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
