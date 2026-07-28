import React from "react";

const InlineLoader = ({ size = "sm", className = "" }) => {
  const sizes = {
    xs: { width: "12px", height: "12px" },
    sm: { width: "16px", height: "16px" },
    md: { width: "24px", height: "24px" },
    lg: { width: "32px", height: "32px" },
  };

  const dotStyle = {
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    animation: "dotPulse 1.4s infinite ease-in-out",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.4)",
    ...sizes[size],
  };

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <span style={{ ...dotStyle, animationDelay: "0s" }} />
      <span style={{ ...dotStyle, animationDelay: "0.2s" }} />
      <span style={{ ...dotStyle, animationDelay: "0.4s" }} />
    </div>
  );
};

export default InlineLoader;
