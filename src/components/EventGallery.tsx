import { useState, useEffect, useRef } from "react";

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  status: "Past" | "Ongoing" | "Upcoming";
  image: string;
  reportPdf?: string;
  photos?: string[];
  studentCoordinator?: string;
}

interface EventGalleryProps {
  event: ClubEvent;
  onClose: () => void;
}

const EVENT_PHOTO_DIRS: Record<string, string[]> = {
  "EV-1": [
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1269.JPG",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1272.jpg",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1292.jpg",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1296.jpg",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1299.jpg",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1302.jpg",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1307.jpg",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1317.jpg",
    "/Events/AMLS/AMLS/AMLS_1_Inaguration/AMLS_1_Photos/IMG_1324.jpg",
  ],
  "EV-2": [
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_7860.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_7865.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_7909.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_7949.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_7970.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_7985.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_8005.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_8045.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_8049.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_8072.JPG",
    "/Events/AMLS/AMLS/AMLS_2_Debate/AMLS_2_Photos/IMG_8082.JPG",
  ],
  "EV-3": [
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0644.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0651.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0688.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0691.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0700.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0716.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0718.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0751.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0761.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0779.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0805.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0832.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0845.JPG",
    "/Events/AMLS/AMLS/AMLS_3_JAM/AMLS_3_Photos/IMG_0850.JPG",
  ],
  "EV-4": [
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9023.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9029.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9036.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9037.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9044.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9050.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9052.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9058.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9071.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9075.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9081.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9088.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9101.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9102.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9111.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9112.JPG",
    "/Events/AMLS/AMLS/AMLS_4_Womensday/AMLS_4_Photos/IMG_9115.JPG",
  ],
};

export { EVENT_PHOTO_DIRS };

export default function EventGallery({ event, onClose }: EventGalleryProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const photos = EVENT_PHOTO_DIRS[event.id] || event.photos || [];
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxIdx !== null) setLightboxIdx(null);
        else onClose();
      }
      if (lightboxIdx !== null) {
        if (e.key === "ArrowRight") setLightboxIdx((prev) => ((prev ?? 0) + 1) % photos.length);
        if (e.key === "ArrowLeft") setLightboxIdx((prev) => ((prev ?? 0) - 1 + photos.length) % photos.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIdx, photos.length, onClose]);

  useEffect(() => {
    const originalBody = document.body.style.overflow;
    const originalHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalBody;
      document.documentElement.style.overflow = originalHtml;
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        onWheel={(e) => {
          if (scrollContainerRef.current && !scrollContainerRef.current.contains(e.target as Node)) {
            scrollContainerRef.current.scrollTop += e.deltaY;
          }
        }}
      >
        <div className="max-w-6xl w-full mx-auto flex flex-col h-full py-8 px-4 sm:px-8">
          <div className="flex justify-between items-start mb-6 flex-shrink-0">
            <div>
              <span className="text-[10px] text-[var(--rose)] font-mono uppercase tracking-widest block mb-1">Event Gallery</span>
              <h2 className="text-2xl sm:text-3xl font-heading italic text-white leading-tight">{event.title}</h2>
              <p className="text-white/60 text-xs font-mono mt-1">{event.date} · {event.venue}</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex flex-wrap gap-3 mb-6 flex-shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 bg-white/10 px-3 py-1.5 rounded-full">{photos.length} Photos</span>
            {event.reportPdf && (
              <a href={event.reportPdf} download className="text-[10px] font-mono uppercase tracking-wider text-white/70 bg-white/10 hover:bg-white/20 transition-colors px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer">
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" stroke="currentColor" fill="none" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Report
              </a>
            )}
          </div>
          {photos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white/40 text-sm font-mono">No photos available for this event.</div>
          ) : (
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-4">
                {photos.map((src, idx) => (
                  <button key={idx} onClick={() => setLightboxIdx(idx)} className="aspect-square overflow-hidden rounded-xl bg-white/5 hover:opacity-90 transition-all cursor-pointer group relative">
                    <img src={src} alt={`Event photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).src = event.image; }}/>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl"/>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {lightboxIdx !== null && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setLightboxIdx(null); }}>
          <button onClick={() => setLightboxIdx(null)} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer z-10">
            <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button onClick={() => setLightboxIdx((prev) => ((prev ?? 0) - 1 + photos.length) % photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer z-10">
            <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => setLightboxIdx((prev) => ((prev ?? 0) + 1) % photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer z-10">
            <svg viewBox="0 0 24 24" className="w-5 h-5" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div className="max-w-5xl max-h-[85vh] w-full flex items-center justify-center px-16">
            <img src={photos[lightboxIdx]} alt={`Photo ${lightboxIdx + 1}`} className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl" onError={(e) => { (e.target as HTMLImageElement).src = event.image; }}/>
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 text-xs font-mono">{lightboxIdx + 1} / {photos.length}</div>
        </div>
      )}
    </>
  );
}
