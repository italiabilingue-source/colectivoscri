'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:';
const ANIMATION_SPEED_MS = 50;

type SplitFlapCharProps = {
  char: string;
  className?: string;
};

const SplitFlapChar = ({ char, className }: SplitFlapCharProps) => {
  const [displayChar, setDisplayChar] = useState(' ');
  const [prevChar, setPrevChar] = useState(' ');
  const [isFlipping, setIsFlipping] = useState(false);
  const targetChar = char.toUpperCase();
  const animationFrameRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);

  useEffect(() => {
    if (targetChar === displayChar) {
      if (isFlipping) {
        setIsFlipping(false);
      }
      return;
    }

    setIsFlipping(true);

    const animate = (timestamp: number) => {
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = timestamp;
      }
      const elapsed = timestamp - lastUpdateTimeRef.current;

      if (elapsed > ANIMATION_SPEED_MS) {
        lastUpdateTimeRef.current = timestamp;
        setDisplayChar(prevDisplayChar => {
          if (prevDisplayChar === targetChar) {
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            setIsFlipping(false);
            return prevDisplayChar;
          }

          const currentIndex = CHARS.indexOf(prevDisplayChar);
          const nextIndex = (currentIndex + 1) % CHARS.length;
          const nextChar = CHARS[nextIndex] || ' ';
          setPrevChar(prevDisplayChar);
          
          if (nextChar === targetChar) {
             if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
            // Set flipping to false on the next render cycle after the final character is set
            setTimeout(() => setIsFlipping(false), ANIMATION_SPEED_MS);
          }

          return nextChar;
        });
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetChar, displayChar, isFlipping]);
  
  const currentPrevChar = CHARS[(CHARS.indexOf(displayChar) - 1 + CHARS.length) % CHARS.length];

  return (
    <div className={cn("relative w-[1ch] h-[1.2em] text-center perspective-300", className)}>
      {/* Static characters */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 right-0 bottom-1/2 overflow-hidden">
          <div className="p-[0.1em]">{displayChar}</div>
        </div>
        <div className="absolute top-1/2 left-0 right-0 bottom-0 overflow-hidden">
          <div className="p-[0.1em] -translate-y-1/2">{displayChar}</div>
        </div>
      </div>
      
      {/* Flipping animation */}
      {isFlipping && (
        <div className="absolute inset-0 flip-card">
          <div className="absolute top-0 left-0 right-0 bottom-1/2 overflow-hidden flip-card-front animate-flip-top">
             <div className="p-[0.1em]">{currentPrevChar}</div>
          </div>
          <div className="absolute top-1/2 left-0 right-0 bottom-0 overflow-hidden flip-card-back animate-flip-bottom">
            <div className="p-[0.1em] -translate-y-1/2">{displayChar}</div>
          </div>
        </div>
      )}
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
        <SplitFlapChar key={`${text}-${index}`} char={char} />
      ))}
    </div>
  );
};
