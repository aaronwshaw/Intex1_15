import React from "react";

interface TitleBannerProps {
  title: string;
}

const TitleBanner: React.FC<TitleBannerProps> = ({ title }) => {
  return (
    <div
      style={{
        backgroundImage: "url('/background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "1rem 2rem",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <img
          src="/worldreel-logo.png"
          alt="WorldReel Logo"
          style={{ height: "50px", width: "50px" }}
        />
        <h1 style={{ color: "white", fontSize: "2rem", margin: 0 }}>{title}</h1>
      </div>
    </div>
  );
};

export default TitleBanner;
