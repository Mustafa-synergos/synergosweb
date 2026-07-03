'use client';

import { motion } from 'framer-motion';

type AnimatedSvgVectorProps = {
  viewBox: string;
  pathD: string;
  stroke?: string;
  strokeWidth?: string | number;
  strokeMiterlimit?: string | number;
  targetOpacity?: number;
  duration?: number;
  delay?: number;
  className?: string;
};

export default function AnimatedSvgVector({
  viewBox,
  pathD,
  stroke = '#AEAEAE',
  strokeWidth = 1,
  strokeMiterlimit = 10,
  targetOpacity = 0.4,
  duration = 2.4,
  delay = 0.2,
  className,
}: AnimatedSvgVectorProps) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d={pathD}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeMiterlimit={strokeMiterlimit}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: targetOpacity }}
        transition={{ duration, ease: 'easeInOut', delay }}
        viewport={{ once: true }}
      />
    </svg>
  );
}
