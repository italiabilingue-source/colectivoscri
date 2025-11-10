'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:';

type SplitFlapCharProps = {
  char: string;
  className?: string;
};

const SplitFlapChar = ({ char, className }: SplitFlapCharProps) => {
  const [displayChar, setDisplayChar] = useState(' ');
  const [isFlipping, setIsFlipping] = useState(false);
  const targetChar = char.toUpperCase();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (displayChar !== targetChar) {
      setIsFlipping(true);
      const currentIndex = CHARS.indexOf(displayChar);
      const targetIndex = CHARS.indexOf(targetChar);

      if (targetIndex === -1) {
        setDisplayChar(targetChar);
        setIsFlipping(false);
        return;
      }
      
      let nextIndex = (currentIndex + 1) % CHARS.length;
      
      timeoutRef.current = setTimeout(() => {
        setDisplayChar(CHARS[nextIndex]);
      }, 50); // Animation speed
    } else {
      setIsFlipping(false);
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [displayChar, targetChar]);

  useEffect(() => {
    // Kickstart animation on initial mount or when char prop changes
    if (displayChar !== targetChar) {
        setDisplayChar(displayChar);
    } else {
        const currentIndex = CHARS.indexOf(displayChar);
        let nextIndex = (currentIndex + 1) % CHARS.length;
        if(CHARS[nextIndex] !== targetChar) {
             setDisplayChar(CHARS[nextIndex]);
        }
    }
  }, [char]);

  const prevChar = CHARS[(CHARS.indexOf(displayChar) - 1 + CHARS.length) % CHARS.length];

  return (
    <div className={cn("relative w-[1ch] h-[1.2em] text-center perspective-300", className)}>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 bottom-1/2 overflow-hidden">
          <div className="p-[0.1em]">{displayChar}</div>
        </div>
        <div className="absolute top-1/2 left-0 right-0 bottom-0 overflow-hidden">
          <div className="p-[0.1em] -translate-y-1/2">{displayChar}</div>
        </div>
      </div>
      
      {isFlipping && (
        <div className="absolute inset-0 flip-card animate-flip">
          <div className="absolute top-0 left-0 right-0 bottom-1/2 overflow-hidden flip-card-front">
             <div className="p-[0.1em]">{prevChar}</div>
          </div>
          <div className="absolute top-1/2 left-0 right-0 bottom-0 overflow-hidden flip-card-back">
            <div className="p-[0.1em] -translate-y-1/2">{displayChar}</div>
          </div>
        </div>
      )}

      {/* Static background character */}
      <div className="absolute -z-10 top-1/2 left-0 right-0 bottom-0 overflow-hidden">
        <div className="p-[0.1em] -translate-y-1/2">{displayChar}</div>
      </div>
    </div>
  );
};

type SplitFlapDisplayProps = {
  text: string;
  className?: string;
};

export const SplitFlapDisplay = ({ text, className }: SplitFlapDisplayProps) => {
  return (
    <div className={cn("flex", className)}>
      {text.split('').map((char, index) => (
        <SplitFlapChar key={index} char={char} />
      ))}
    </div>
  );
};
