import React from 'react';

import { Hamburger } from './ui/hamburger';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 px-8 blur-bg fixed top-0 left-0 right-0 text-white z-50">
      <a className="text-3xl font-fugaz" href="/">Kz Creation</a>
      <Hamburger open={false} onClick={() => {}} />
    </header>
  )
}
