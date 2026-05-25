import { Service } from '../../data/services';
import PremiumCTA from '../PremiumCTA';

interface ServiceCardProps {
  service: Service;
  isActive: boolean;
  index: number;
}

export default function ServiceCard({ service, isActive, index }: ServiceCardProps) {
  return (
    <div className="w-full h-full">
      <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden h-full">
        {/* Subtle glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
        
        <div className="relative z-10 p-12 lg:p-16">
          <div className="flex items-start justify-between">
            {/* Left Content */}
            <div className="flex-1 max-w-2xl">
              {/* Number */}
              <div className="text-6xl lg:text-8xl font-thin text-white/20 mb-6">
                {service.number}
              </div>
              
              {/* Title */}
              <h3 className="text-3xl lg:text-5xl font-light text-white mb-6 leading-tight">
                {service.title}
              </h3>
              
              {/* Description */}
              <p className="responsive-paragraph text-white/60 mb-8 leading-relaxed max-w-xl">
                {service.description}
              </p>
              
              {/* Explore Button */}
              <PremiumCTA title="EXPLORE" hoverTitle="EXPLORE" />
            </div>
            
            {/* Right Illustration */}
            <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 w-80 h-80 opacity-60">
              <img 
                src={service.illustration} 
                alt={service.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to placeholder if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center">
                        <svg class="w-32 h-32 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    `;
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Subtle border gradient */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-30 pointer-events-none" />
      </div>
    </div>
  );
}
