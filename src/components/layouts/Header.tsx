import React from 'react';
import titleImage from '~/assets/images/kz_creation.svg?url';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full h-24 flex items-center justify-center z-20 gap-64">
      <img src={titleImage} alt="title image" className="w-64" />
      <div className="flex items-center justify-center text-[#FCFCFC] font-fugaz text-3xl gap-12">
        <a href="">Profile</a>
        <a href="">Activity</a>
        <a href="">Notes</a>
      </div>
    </header>
  )
}

export default Header;
