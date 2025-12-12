import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 w-full h-12 sm:h-14 flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12">
      <div className="flex-1 hidden sm:block"></div>
      <p className="absolute left-1/2 transform -translate-x-1/2 text-[#FCFCFC] font-futura text-xs sm:text-sm text-center px-2">
        © 2025 KZ Creation. All rights reserved.
      </p>
      <a
        href="/privacy-policy"
        className="text-[#FCFCFC] font-futura text-xs sm:text-sm hover:underline ml-2 sm:ml-4 hidden sm:flex flex-1 justify-end"
        target="_blank"
        rel="noopener noreferrer"
      >
        Privacy Policy
      </a>
    </footer>
  )
}

export default Footer;
