import React from "react";

const TitleBanner: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <img
        src="/background.png"
        alt="Banner Background"
        style={{
          width: "100%",
          height: "auto",     // ✅ maintain full height
          display: "block",
        }}
      />
    </div>
  );
};

export default TitleBanner;
