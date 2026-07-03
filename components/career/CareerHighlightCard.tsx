import type { CareerHighlightCardData } from '@/types/career-sections';

type CareerHighlightCardProps = {
  data: CareerHighlightCardData;
};

const ACCENT_STYLES: Record<string, string> = {
  primary: 'bg-[#FF0000] text-white border-transparent',
  secondary: 'bg-[#1A1A1A] text-white border-white/10',
  default: 'bg-[#101010] text-white border-white/10',
};

export default function CareerHighlightCard({ data }: CareerHighlightCardProps) {
  const accent = data.Accent ?? 'default';
  const accentClass = ACCENT_STYLES[accent] ?? ACCENT_STYLES.default;

  return (
    <div
      className={`flex h-full min-h-[200px] flex-col rounded-[32px] border p-7 shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all duration-300 sm:min-h-[300px] ${accentClass}`}
    >
      <h3 className="text-[18px] font-semibold normal-case leading-tight sm:text-[20px]">
        {data.Title}
      </h3>
      <p className="mt-4 text-sm font-light leading-[1.8] text-current/80 sm:text-base">
        {data.Description}
      </p>
    </div>
  );
}
