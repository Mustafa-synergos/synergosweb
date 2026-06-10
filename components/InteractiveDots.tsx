'use client';

import { useEffect, useRef, useCallback } from 'react';

export type InteractiveDotsVariant = 'dark' | 'red' | 'card' | 'footer' | 'transparent';

interface InteractiveDotsProps {
  variant?: InteractiveDotsVariant;
  dotColor?: string;
  opacity?: number;
  gridSpacing?: number;
  rippleIntensity?: number;
  interactionRadius?: number;
  animationSpeed?: number;
  className?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

const VARIANT_CONFIGS: Record<InteractiveDotsVariant, { dotColor: string; opacity: number; hoverOpacity: number; rippleOpacity: number }> = {
  dark: { dotColor: '#ffffff', opacity: 0.08, hoverOpacity: 0.18, rippleOpacity: 0.25 },
  red: { dotColor: '#ffffff', opacity: 0.12, hoverOpacity: 0.22, rippleOpacity: 0.30 },
  card: { dotColor: '#ffffff', opacity: 0.15, hoverOpacity: 0.25, rippleOpacity: 0.35 },
  footer: { dotColor: '#ffffff', opacity: 0.10, hoverOpacity: 0.20, rippleOpacity: 0.28 },
  transparent: { dotColor: '#ffffff', opacity: 0.08, hoverOpacity: 0.18, rippleOpacity: 0.25 },
};

// Lerp function for smooth interpolation
const lerp = (start: number, end: number, factor: number): number => {
  return start + (end - start) * factor;
};

// Spring physics for natural movement
const spring = (current: number, target: number, stiffness: number, damping: number): number => {
  const velocity = 0;
  const force = (target - current) * stiffness;
  const acceleration = force - velocity * damping;
  return current + acceleration;
};

export default function InteractiveDots({
  variant = 'dark',
  dotColor: customDotColor,
  opacity: customOpacity,
  gridSpacing = 30,
  rippleIntensity = 3.0,
  interactionRadius = 200,
  animationSpeed = 0.002,
  className = '',
  containerRef,
}: InteractiveDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true); // Track if canvas is in viewport
  const prefersReducedMotionRef = useRef<boolean>(false);
  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    isDown: false,
    vx: 0,
    vy: 0,
    lastX: -1000,
    lastY: -1000
  });
  const ripples = useRef<Array<{
    x: number;
    y: number;
    time: number;
    intensity: number;
    layer: number;
  }>>([]);
  
  // Enhanced dot data with velocity and displacement
  const dotsRef = useRef<Array<{
    x: number; 
    y: number; 
    originalX: number; 
    originalY: number; 
    phase: number;
    vx: number;
    vy: number;
    displacementX: number;
    displacementY: number;
  }>>([]);
  
  const dprRef = useRef<number>(1);
  const isMobileRef = useRef<boolean>(false);

  const config = {
    dotColor: customDotColor || VARIANT_CONFIGS[variant].dotColor,
    opacity: customOpacity ?? VARIANT_CONFIGS[variant].opacity,
    hoverOpacity: VARIANT_CONFIGS[variant].hoverOpacity,
    rippleOpacity: VARIANT_CONFIGS[variant].rippleOpacity,
  };

  // Stronger cursor field with magnetic attraction
  const getMouseInfluence = useCallback((x: number, y: number): { 
    influence: number; 
    dx: number; 
    dy: number; 
    distance: number;
  } => {
    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Smooth falloff with larger radius
    const normalizedDistance = distance / interactionRadius;
    const influence = Math.max(0, 1 - Math.pow(normalizedDistance, 0.7));
    
    return { influence, dx, dy, distance };
  }, [interactionRadius]);

  // Enhanced ripple with layered waves
  const getRippleInfluence = useCallback((x: number, y: number, currentTime: number): { 
    influence: number; 
    displacementX: number; 
    displacementY: number;
  } => {
    let totalInfluence = 0;
    let totalDisplacementX = 0;
    let totalDisplacementY = 0;

    ripples.current.forEach((ripple) => {
      const age = currentTime - ripple.time;
      const maxAge = 4000;
      
      if (age < maxAge) {
        const progress = age / maxAge;
        const dx = x - ripple.x;
        const dy = y - ripple.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Layered wave propagation - increased speed and width for better visibility
        const waveSpeed = 400;
        const rippleRadius = progress * waveSpeed;
        const rippleWidth = 150;
        
        if (Math.abs(distance - rippleRadius) < rippleWidth) {
          const waveProgress = (distance - (rippleRadius - rippleWidth)) / (rippleWidth * 2);
          const rippleStrength = (1 - Math.pow(progress, 1.5)) * ripple.intensity * (1 + ripple.layer * 0.3);
          const proximityToRipple = 1 - Math.abs(distance - rippleRadius) / rippleWidth;
          
          totalInfluence += rippleStrength * proximityToRipple;
          
          // Displacement outward from ripple center - increased for better visibility
          const displacementStrength = rippleStrength * proximityToRipple * 20;
          if (distance > 0) {
            totalDisplacementX += (dx / distance) * displacementStrength;
            totalDisplacementY += (dy / distance) * displacementStrength;
          }
        }
      }
    });

    return { 
      influence: Math.min(totalInfluence, 3), 
      displacementX: totalDisplacementX, 
      displacementY: totalDisplacementY 
    };
  }, [rippleIntensity]);

  const initializeDots = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    const dots: Array<{
      x: number; 
      y: number; 
      originalX: number; 
      originalY: number; 
      phase: number;
      vx: number;
      vy: number;
      displacementX: number;
      displacementY: number;
    }> = [];

    for (let x = gridSpacing / 2; x < canvasWidth; x += gridSpacing) {
      for (let y = gridSpacing / 2; y < canvasHeight; y += gridSpacing) {
        dots.push({
          x,
          y,
          originalX: x,
          originalY: y,
          phase: Math.random() * Math.PI * 2,
          vx: 0,
          vy: 0,
          displacementX: 0,
          displacementY: 0,
        });
      }
    }

    dotsRef.current = dots;
  }, [gridSpacing]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    dprRef.current = dpr;

    // Use containerRef if provided, otherwise use parent
    const container = containerRef?.current || canvas.parentElement;
    const displayWidth = container?.clientWidth || window.innerWidth;
    const displayHeight = container?.clientHeight || window.innerHeight;

    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;

    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
  }, [initializeDots, containerRef]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (isMobileRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // const rect = canvas.getBoundingClientRect();
    // const newX = e.clientX - rect.left;
    // const newY = e.clientY - rect.top;
    const rect = canvas.getBoundingClientRect();

const newX =
  ((e.clientX - rect.left) / rect.width) *
  canvas.clientWidth;

const newY =
  ((e.clientY - rect.top) / rect.height) *
  canvas.clientHeight;
    
    // IMMEDIATE pointer position update - no throttling, no delay
    mouseRef.current.x = newX;
    mouseRef.current.y = newY;
    
    // Calculate pointer velocity for motion trail
    mouseRef.current.vx = newX - mouseRef.current.lastX;
    mouseRef.current.vy = newY - mouseRef.current.lastY;
    mouseRef.current.lastX = newX;
    mouseRef.current.lastY = newY;
  }, []);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    mouseRef.current.isDown = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const now = Date.now();

    // Primary ripple - immediate and strong
    ripples.current.push({
      x,
      y,
      time: now,
      intensity: rippleIntensity,
      layer: 0,
    });
    
    // Secondary delayed wave - 100ms delay for layered effect
    setTimeout(() => {
      ripples.current.push({
        x,
        y,
        time: Date.now(),
        intensity: rippleIntensity * 0.7,
        layer: 1,
      });
    }, 100);

    // Tertiary wave - 200ms delay for depth
    setTimeout(() => {
      ripples.current.push({
        x,
        y,
        time: Date.now(),
        intensity: rippleIntensity * 0.4,
        layer: 2,
      });
    }, 200);

    // Clean up old ripples
    ripples.current = ripples.current.filter((ripple) => now - ripple.time < 5000);
  }, [rippleIntensity]);

  const handlePointerUp = useCallback(() => {
    mouseRef.current.isDown = false;
  }, []);

  const handlePointerLeave = useCallback(() => {
    // Reset pointer position when leaving canvas
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip animation if not in viewport or reduced motion is preferred
    if (!isVisibleRef.current || prefersReducedMotionRef.current) {
      animationFrameId.current = requestAnimationFrame(animate);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += animationSpeed;
    const currentTime = Date.now();

    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Decay mouse velocity
    mouseRef.current.vx *= 0.92;
    mouseRef.current.vy *= 0.92;

    dotsRef.current.forEach((dot) => {
      const mouseData = getMouseInfluence(dot.originalX, dot.originalY);
      const rippleData = getRippleInfluence(dot.originalX, dot.originalY, currentTime);
      
      const totalInfluence = mouseData.influence + rippleData.influence;

      // Ambient breathing animation
      const breathing = Math.sin(timeRef.current * 0.8 + dot.phase) * 0.15;
      const organicDrift = Math.sin(timeRef.current * 0.3 + dot.phase * 2) * 0.1;
      
      // Calculate target displacement
      let targetDisplacementX = 0;
      let targetDisplacementY = 0;
      
      // Mouse magnetic attraction
      // if (mouseData.influence > 0) {
      //   const attractionStrength = mouseData.influence * 8;
      //   targetDisplacementX -= (mouseData.dx / (mouseData.distance + 1)) * attractionStrength;
      //   targetDisplacementY -= (mouseData.dy / (mouseData.distance + 1)) * attractionStrength;
        
      //   // Add velocity-based displacement for motion trail
      //   targetDisplacementX -= mouseRef.current.vx * mouseData.influence * 2;
      //   targetDisplacementY -= mouseRef.current.vy * mouseData.influence * 2;
      // }
      // Cursor flow field animation
if (mouseData.influence > 0) {
  const flowStrength = mouseData.influence * 18;

  // Push dots based on cursor velocity
  targetDisplacementX += mouseRef.current.vx * flowStrength * 0.08;
  targetDisplacementY += mouseRef.current.vy * flowStrength * 0.08;

  // Organic wave motion around cursor
  targetDisplacementX +=
    Math.sin(timeRef.current * 2 + dot.phase) *
    mouseData.influence *
    6;

  targetDisplacementY +=
    Math.cos(timeRef.current * 2 + dot.phase) *
    mouseData.influence *
    6;

  // Slight magnetic pull
  targetDisplacementX -=
    (mouseData.dx / (mouseData.distance + 1)) *
    mouseData.influence *
    4;

  targetDisplacementY -=
    (mouseData.dy / (mouseData.distance + 1)) *
    mouseData.influence *
    4;
}
      
      // Ripple displacement
      targetDisplacementX += rippleData.displacementX;
      targetDisplacementY += rippleData.displacementY;
      
      // Spring interpolation for smooth displacement
      dot.displacementX = lerp(dot.displacementX, targetDisplacementX, 0.12);
      dot.displacementY = lerp(dot.displacementY, targetDisplacementY, 0.12);
      
      // Apply displacement with ambient movement
      dot.x = dot.originalX + dot.displacementX + organicDrift;
      dot.y = dot.originalY + dot.displacementY + breathing;

      // Enhanced size calculation - FIXED to 4px x 4px base
      const baseDotSize = 2;
      const mouseScale = mouseData.influence * 5;
      const rippleScale = rippleData.influence * 6;
      const ambientScale = breathing * 0.5;
      
      const dotSize = baseDotSize + mouseScale + rippleScale + ambientScale;
      
      // Enhanced opacity with layered response using variant configs
      const baseOpacity = config.opacity;
      const mouseOpacity = config.hoverOpacity;
      const rippleOpacity = config.rippleOpacity;
      const ambientOpacity = 0.02;
      
      // Distance-based opacity falloff for layered depth
      const depthFactor = 1 - (mouseData.distance / (interactionRadius * 1.5));
      const layeredOpacity = baseOpacity + ambientOpacity + 
        (mouseData.influence * (mouseOpacity - baseOpacity) * depthFactor) +
        (rippleData.influence * (rippleOpacity - baseOpacity));
      
      const opacity = Math.min(layeredOpacity, rippleOpacity);

      const red = Number.parseInt(config.dotColor.slice(1, 3), 16);
      const green = Number.parseInt(config.dotColor.slice(3, 5), 16);
      const blue = Number.parseInt(config.dotColor.slice(5, 7), 16);

      ctx.fillStyle = `rgba(${red}, ${green}, ${blue}, ${opacity})`;
      
      // Render as exact 4px x 4px squares (no circles)
      const dotSizeHalf = dotSize / 2;
      ctx.fillRect(dot.x - dotSizeHalf, dot.y - dotSizeHalf, dotSize, dotSize);
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [config.dotColor, config.opacity, config.hoverOpacity, config.rippleOpacity, getMouseInfluence, getRippleInfluence, animationSpeed, interactionRadius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotionRef.current = mediaQuery.matches;
    const handleMediaChange = (e: MediaQueryListEvent) => {
      prefersReducedMotionRef.current = e.matches;
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    // IntersectionObserver to stop animation when not in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    resizeCanvas();

    const handleResize = () => {
      isMobileRef.current = window.innerWidth < 768;
      resizeCanvas();
    };

    isMobileRef.current = window.innerWidth < 768;

    window.addEventListener('resize', handleResize);
    // canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    // window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointermove', handlePointerMove);

    // Add ResizeObserver to watch parent container size changes
    let resizeObserver: ResizeObserver | null = null;
    if (canvas.parentElement && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
        requestAnimationFrame(() => initializeDots()); // Re-initialize dots on resize
      });
      resizeObserver.observe(canvas.parentElement);
    }

    // Initialize dots after initial resize with a small delay to ensure dimensions are set
    requestAnimationFrame(() => {
      requestAnimationFrame(() => initializeDots());
    });
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      // canvas.removeEventListener('pointermove', handlePointerMove);
      // canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      // window.removeEventListener('pointerup', handlePointerUp);

      mediaQuery.removeEventListener('change', handleMediaChange);
      observer.disconnect();

      if (resizeObserver && canvas.parentElement) {
        resizeObserver.unobserve(canvas.parentElement);
      }

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      timeRef.current = 0;
      ripples.current = [];
      dotsRef.current = [];
    };
  }, [animate, resizeCanvas, handlePointerMove, handlePointerDown, handlePointerUp, handlePointerLeave]);

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`} style={{ zIndex: 1  }}>
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full" 
        // style={{ pointerEvents: 'auto' }}
        style={{ pointerEvents: 'none' }}
      />
    </div>
  );
}
