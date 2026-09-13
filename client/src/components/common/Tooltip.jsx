import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';

/**
 * Universal Tooltip component
 * Features:
 * - Light Mode: background white, text gray-900, border gray-200, shadow-lg, rounded-xl, matching arrow
 * - Dark Mode: background gray-900, text white, border gray-700, matching arrow
 * - Fade + slide animation
 * - Positioned above element by default with collision bounds checking
 * - Keyboard & touch accessible
 */
export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 150,
  className = '',
  disabled = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipElement = tooltipRef.current;
    const tooltipWidth = tooltipElement ? tooltipElement.offsetWidth : 120;
    const tooltipHeight = tooltipElement ? tooltipElement.offsetHeight : 34;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 8;

    let targetPos = position;
    let top = 0;
    let left = 0;

    // Check if preferred top position clips
    if (position === 'top' && triggerRect.top - tooltipHeight - margin < 0) {
      targetPos = 'bottom';
    } else if (position === 'bottom' && triggerRect.bottom + tooltipHeight + margin > viewportHeight) {
      targetPos = 'top';
    }

    if (targetPos === 'top') {
      top = triggerRect.top - tooltipHeight - margin;
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);
    } else if (targetPos === 'bottom') {
      top = triggerRect.bottom + margin;
      left = triggerRect.left + (triggerRect.width / 2) - (tooltipWidth / 2);
    } else if (targetPos === 'left') {
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipHeight / 2);
      left = triggerRect.left - tooltipWidth - margin;
    } else if (targetPos === 'right') {
      top = triggerRect.top + (triggerRect.height / 2) - (tooltipHeight / 2);
      left = triggerRect.right + margin;
    }

    // Keep within horizontal viewport bounds
    if (left < margin) left = margin;
    if (left + tooltipWidth > viewportWidth - margin) {
      left = viewportWidth - tooltipWidth - margin;
    }

    setActualPosition(targetPos);
    setCoords({ top, left });
  };

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    timeoutRef.current = setTimeout(() => {
      calculatePosition();
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      const handleScroll = () => calculatePosition();
      const handleResize = () => calculatePosition();
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isVisible]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Directional slide animation variants
  const animationVariants = {
    top: { initial: { opacity: 0, y: 4, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 2, scale: 0.96 } },
    bottom: { initial: { opacity: 0, y: -4, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -2, scale: 0.96 } },
    left: { initial: { opacity: 0, x: 4, scale: 0.96 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 2, scale: 0.96 } },
    right: { initial: { opacity: 0, x: -4, scale: 0.96 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: 2, scale: 0.96 } },
  };

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
        className="inline-flex"
      >
        {children}
      </span>

      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            ref={tooltipRef}
            initial={animationVariants[actualPosition].initial}
            animate={animationVariants[actualPosition].animate}
            exit={animationVariants[actualPosition].exit}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
            className={cn(
              'z-50 px-3 py-1.5 text-xs font-semibold rounded-xl pointer-events-none whitespace-nowrap select-none',
              // Light Mode: white background, gray-900 text, gray-200 border, shadow-lg, rounded-xl
              'bg-white text-gray-900 border border-gray-200 shadow-xl',
              // Dark Mode: gray-900 background, white text, gray-700 border
              'dark:bg-gray-900 dark:text-white dark:border-gray-700',
              className
            )}
            role="tooltip"
          >
            {content}

            {/* Triangle Arrow matching background and border */}
            <div
              className={cn(
                'absolute w-2 h-2 rotate-45 pointer-events-none',
                'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
                actualPosition === 'top' && 'bottom-[-5px] left-1/2 -translate-x-1/2 border-r border-b',
                actualPosition === 'bottom' && 'top-[-5px] left-1/2 -translate-x-1/2 border-l border-t',
                actualPosition === 'left' && 'right-[-5px] top-1/2 -translate-y-1/2 border-r border-t',
                actualPosition === 'right' && 'left-[-5px] top-1/2 -translate-y-1/2 border-l border-b'
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
