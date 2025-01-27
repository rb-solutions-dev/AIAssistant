
"use client"; // This marks the component as a client-side component// components/SplashScreen.tsx

import React, { useEffect, useState } from "react";
import Image from "next/image";
const SplashScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000); // Show splash screen for 3 seconds
  }, []);

  if (loading) {
    return (
      <div className="splash-screen">
         <div className="logo-container">
          <Image
            src="/icons/ios/1024.png" // Make sure this is the correct path to your logo
            alt="Logo"
            width={150} // Adjust the size according to your logo
            height={150} // Adjust the size according to your logo
          />
        </div>
        <div className="spinner"></div>
      </div>
    );
  }

  return null;
};

export default SplashScreen; // Ensure this is the default export
