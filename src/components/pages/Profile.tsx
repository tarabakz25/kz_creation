import React, { useState, useEffect } from 'react';

import Header from '../layouts/Header';
import Footer from '../layouts/Footer';

import ProfileIcon from '~/assets/images/u3629887153_a_short-haired_anime_boy_sitting_wearing_a_black__7ac53e52-ff93-4e02-8942-30490f55db56_0.png?url';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#252525]">
      <div className="w-full h-screen flex items-center justify-center gap-8">
        <img src={ProfileIcon} alt="profile icon" className="w-36 h-36 object-cover rounded-3xl" />
        <div className="flex flex-col text-[#fcfcfc] font-futura gap-2">
          <h1 className="text-3xl">Kizuki Aiki</h1>
          <h2 className="text-xl font-light">Web Engineering, UI/UX Design and AI/LLM Coding</h2>
        </div>
      </div>
    </div>
  )
}

export default Profile;
