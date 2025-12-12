'use client';

import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import titleImage from '~/assets/kz_creation.svg?url';
import ContactDialog from './ContactDialog';
import { Hamburger } from '~/components/ui/hamburger';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '~/components/ui/sheet';

type Page = 'home' | 'profile' | 'activity' | 'works';

interface HeaderProps {
  onPageChange: (page: Page) => void;
  currentPage: Page;
}

interface HoverCornerButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const HoverCornerButton: React.FC<HoverCornerButtonProps> = ({ children, onClick, className }) => {
  const containerRef = useRef<HTMLButtonElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
  const bottomRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const topLeft = topLeftRef.current;
    const bottomRight = bottomRightRef.current;

    if (!container || !topLeft || !bottomRight) return;

    gsap.set(topLeft, { opacity: 0, x: 0, y: 0 });
    gsap.set(bottomRight, { opacity: 0, x: 0, y: 0 });

    const handleMouseEnter = () => {
      gsap.killTweensOf([topLeft, bottomRight]);

      gsap.to(topLeft, {
        opacity: 1,
        x: -4,
        y: -4,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });

      gsap.to(bottomRight, {
        opacity: 1,
        x: 4,
        y: 4,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      gsap.killTweensOf([topLeft, bottomRight]);

      gsap.to(topLeft, {
        opacity: 0,
        x: 2,
        y: 2,
        duration: 0.15,
        ease: 'power2.in',
        overwrite: 'auto',
      });

      gsap.to(bottomRight, {
        opacity: 0,
        x: -2,
        y: -2,
        duration: 0.15,
        ease: 'power2.in',
        overwrite: 'auto',
      });
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <button
      ref={containerRef}
      onClick={onClick}
      type="button"
      className={`relative inline-flex items-center justify-center bg-transparent px-4 py-2 text-[#FCFCFC] font-eurostile font-regular text-xl transition-colors duration-300 hover:text-[#E5E5E5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E5E5E5] ${className ?? ''}`}
    >
      <div
        ref={topLeftRef}
        className="pointer-events-none absolute left-0 top-0"
        style={{ opacity: 0 }}
      >
        <div className="h-0.5 w-3 bg-current" />
        <div className="h-3 w-0.5 bg-current" />
      </div>
      <div
        ref={bottomRightRef}
        className="pointer-events-none absolute bottom-0 right-0"
        style={{ opacity: 0 }}
      >
        <div className="absolute bottom-0 right-0 h-0.5 w-3 bg-current" />
        <div className="absolute bottom-0 right-0 h-3 w-0.5 bg-current" />
      </div>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ onPageChange, currentPage }) => {
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handlePageChange = (page: Page) => {
    if (currentPage !== page) {
      onPageChange(page);
      setIsMobileMenuOpen(false);
    }
  };

  const handleContactClick = () => {
    setIsContactDialogOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 w-full h-24 flex items-center justify-between px-4 sm:px-6 md:px-8 z-20">
        <div className="flex items-center">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange('home');
            }}
          >
            <img src={titleImage} alt="title image" className="h-8 sm:h-10" />
          </a>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center text-[#FCFCFC] font-eurostile font-regular text-xl gap-12">
          <HoverCornerButton onClick={() => handlePageChange('profile')} className="px-2 py-2">
            Profile
          </HoverCornerButton>
          <HoverCornerButton onClick={() => handlePageChange('activity')} className="px-2 py-2">
            Activity
          </HoverCornerButton>
          <HoverCornerButton onClick={() => handlePageChange('works')} className="px-2 py-2">
            Works
          </HoverCornerButton>
        </div>
        {/* Desktop Contact Button */}
        <div className="hidden md:flex items-center justify-center">
          <HoverCornerButton onClick={handleContactClick} className="px-8 py-4">
            Contact Me!
          </HoverCornerButton>
        </div>
        {/* Mobile Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-[#FCFCFC] p-2"
              aria-label="Open menu"
            >
              <Hamburger open={isMobileMenuOpen} />
            </button>
            <SheetContent side="right" className="bg-[#121212] border-[#252525] w-64">
              <SheetHeader>
                <SheetTitle className="text-[#FCFCFC] font-eurostile text-xl">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => handlePageChange('home')}
                  className={`text-left px-4 py-3 text-[#FCFCFC] font-eurostile text-lg transition-colors ${
                    currentPage === 'home' ? 'text-[#E5E5E5]' : ''
                  } hover:text-[#E5E5E5]`}
                >
                  Home
                </button>
                <button
                  onClick={() => handlePageChange('profile')}
                  className={`text-left px-4 py-3 text-[#FCFCFC] font-eurostile text-lg transition-colors ${
                    currentPage === 'profile' ? 'text-[#E5E5E5]' : ''
                  } hover:text-[#E5E5E5]`}
                >
                  Profile
                </button>
                <button
                  onClick={() => handlePageChange('activity')}
                  className={`text-left px-4 py-3 text-[#FCFCFC] font-eurostile text-lg transition-colors ${
                    currentPage === 'activity' ? 'text-[#E5E5E5]' : ''
                  } hover:text-[#E5E5E5]`}
                >
                  Activity
                </button>
                <button
                  onClick={() => handlePageChange('works')}
                  className={`text-left px-4 py-3 text-[#FCFCFC] font-eurostile text-lg transition-colors ${
                    currentPage === 'works' ? 'text-[#E5E5E5]' : ''
                  } hover:text-[#E5E5E5]`}
                >
                  Works
                </button>
                <button
                  onClick={handleContactClick}
                  className="text-left px-4 py-3 text-[#FCFCFC] font-eurostile text-lg transition-colors hover:text-[#E5E5E5] mt-4 border-t border-[#252525] pt-4"
                >
                  Contact Me!
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <ContactDialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
    </>
  )
}

export default Header;
