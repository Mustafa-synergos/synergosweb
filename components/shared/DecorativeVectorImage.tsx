'use client';

import { motion } from 'framer-motion';

type DecorativeVectorImageProps = {
  src: string;
  className?: string;
  imgClassName?: string;
  duration?: number;
  delay?: number;
};

export default function DecorativeVectorImage({
  src,
  className,
  imgClassName = 'w-full h-full object-contain',
  duration = 1.4,
  delay = 0,
}: DecorativeVectorImageProps) {
  return (
    <motion.div
      className={className}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: .3, scale: 1 }}
      transition={{ duration, ease: [0.22, 1, 0.36, 1], delay }}
      viewport={{ once: true }}
    >
      <img
        src={src}
        alt=""
        className={imgClassName}
      />
    </motion.div>
  );
}
