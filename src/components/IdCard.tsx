import React, { useState, useRef } from 'react';

interface IdCardProps {
  member: {
    id: string;
    fullName: string;
    first: string;
    last: string;
    dept: string;
    sec: string;
    year: string;
    spec: string;
  };
}

export default function IdCard({ member }: IdCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [transform, setTransform] = useState('');
  const [shinePos, setShinePos] = useState({ x: '50%', y: '50%' });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setShinePos({ x: `${px}%`, y: `${py}%` });

    if (!flipped) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -(y - centerY) / 10;
      const rotateY = (x - centerX) / 15;
      setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    }
  };

  const handleMouseLeave = () => {
    if (!flipped) {
      setTransform('rotateX(0deg) rotateY(0deg)');
    }
  };

  const handleCardClick = () => {
    setFlipped(!flipped);
    setTransform('');
  };

  return (
    <div className="flex flex-col items-center select-none">
      <div className="card-scene">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCardClick}
          className={`card-wrap-el w-[340px] h-[200px] sm:w-[480px] sm:h-[280px] ${
            flipped ? 'flipped' : ''
          }`}
          style={{ transform }}
        >
          {/* FRONT */}
          <div className="card-face-el card-front-el bg-[#FAF7F0] border-2 border-[#D8D2C2] rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden shadow-xl justify-between">
            {/* Card Shine */}
            <div
              className="card-shine absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 rounded-3xl"
              style={{
                background: `radial-gradient(circle at ${shinePos.x} ${shinePos.y}, rgba(255, 255, 255, 0.45) 0%, transparent 60%)`,
              }}
            ></div>
            
            {/* Header */}
            <div className="flex justify-between items-center z-10">
              <div className="text-[9px] sm:text-xs text-[#8F3623] font-bold tracking-[3px] uppercase font-mono">
                Amrita Literature Society
              </div>
              <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-full border border-[#D8D2C2] flex items-center justify-center bg-white overflow-hidden shadow-sm">
                <img src="/als_logo.png" className="w-full h-full object-contain" alt="Logo" />
              </div>
            </div>

            {/* Name/Role */}
            <div className="flex-1 flex flex-col justify-center z-10 my-2">
              <div className="text-[8px] sm:text-[9px] text-stone-500 tracking-[2px] uppercase font-mono font-semibold mb-1">
                Academic Fellow
              </div>
              <div
                className="font-normal text-2xl sm:text-4xl text-stone-900 truncate pb-1 font-heading italic"
              >
                {member.fullName}
              </div>
              <div className="text-[8px] sm:text-[10px] text-stone-600 tracking-wide font-mono">
                {member.dept} · {member.spec}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end border-t border-[#D8D2C2] pt-3 z-10">
              <div>
                <div className="text-[6px] sm:text-[7px] text-stone-500 uppercase tracking-[2px] font-mono leading-none">Member ID</div>
                <div className="text-[10px] sm:text-xs text-stone-900 font-mono font-medium mt-1 leading-none">{member.id}</div>
              </div>
              <div className="text-right">
                <div className="text-[6px] sm:text-[7px] text-stone-500 uppercase tracking-[2px] font-mono leading-none">Institution</div>
                <div className="text-[10px] sm:text-xs text-stone-900 font-mono font-medium mt-1 leading-none">Amrita Vishwa Vidyapeetham</div>
                <div className="text-[7px] sm:text-[9px] text-[#8F3623] font-mono font-bold leading-none mt-0.5">Nagercoil Campus</div>
              </div>
            </div>
          </div>

          {/* BACK */}
          <div className="card-face-el card-back-el bg-[#FAF7F0] border-2 border-[#D8D2C2] rounded-3xl p-6 sm:p-8 flex flex-col overflow-hidden shadow-xl justify-between">
            {/* Magnetic Stripe */}
            <div className="w-[120%] h-6 sm:h-9 bg-stone-800 -mx-8 -mt-2 sm:-mt-3 opacity-95"></div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:gap-y-3 z-10 px-2 mt-2">
              <div>
                <div className="text-[6px] sm:text-[7px] text-stone-500 uppercase tracking-[2px] font-mono leading-none">Full Name</div>
                <div className="text-[10px] sm:text-xs text-stone-900 font-mono font-medium truncate mt-0.5">{member.fullName}</div>
              </div>
              <div>
                <div className="text-[6px] sm:text-[7px] text-stone-500 uppercase tracking-[2px] font-mono leading-none">Status</div>
                <div className="text-[10px] sm:text-xs text-[#8F3623] font-mono font-bold mt-0.5">● Verified Member</div>
              </div>
              <div>
                <div className="text-[6px] sm:text-[7px] text-stone-500 uppercase tracking-[2px] font-mono leading-none">Dept · Sec</div>
                <div className="text-[10px] sm:text-xs text-stone-900 font-mono font-medium truncate mt-0.5">
                  {member.dept} · {member.sec}
                </div>
              </div>
              <div>
                <div className="text-[6px] sm:text-[7px] text-stone-500 uppercase tracking-[2px] font-mono leading-none">Year</div>
                <div className="text-[10px] sm:text-xs text-stone-900 font-mono font-medium mt-0.5">{member.year}</div>
              </div>
            </div>

            {/* Signature & QR Box */}
            <div className="grid grid-cols-[1fr_60px] sm:grid-cols-[1fr_72px] items-end gap-4 z-10 px-2 pb-1">
              <div className="border-b border-stone-300 pb-1">
                <div className="text-[6px] sm:text-[7px] text-stone-500 uppercase tracking-[2px] font-mono mb-2">
                  Authorized Signature
                </div>
                <div
                  className="text-lg sm:text-2xl text-[#8F3623] leading-none font-heading italic"
                >
                  {member.last || member.fullName.split(' ').pop()}
                </div>
              </div>

              {/* QR Code Container */}
              <div className="w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] bg-white border border-[#D8D2C2] rounded-lg p-1 flex items-center justify-center overflow-hidden">
                <img src="/ALS_qrcode.svg" className="w-full h-full object-contain" alt="QR Code" />
              </div>
            </div>

            <div className="text-[5.5px] text-stone-400 uppercase tracking-[2px] font-mono text-center z-10 mt-1">
              Secure Academic Document · © 2026 Amrita Literature Society
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-[var(--paper-dim)] mt-6 select-none animate-pulse">
        ✦ <span className="text-[var(--rose)] font-semibold">Click Card</span> to flip · Hover to slide shine
      </p>
    </div>
  );
}
