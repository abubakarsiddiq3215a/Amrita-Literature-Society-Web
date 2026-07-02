import FadingVideo from './FadingVideo';

export default function Capabilities() {
  const cards = [
    {
      iconPath: 'M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21H5Zm1-4h12l-3.75-5-3 4L9 13l-3 4Z',
      title: 'AI Scenery',
      tags: ['Natural Context', 'Photo Realism', 'Infinite Settings', 'Eco-Vibe'],
      body: 'AI analyzes your product to create indistinguishable natural environments — from Icelandic cliffs to misty forests.'
    },
    {
      iconPath: 'M4 6.47 5.76 10H20v8H4V6.47M22 4h-4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.89-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4Z',
      title: 'Batch Production',
      tags: ['Scale Fast', 'Visual Consistency', 'Time Saver', 'Ready to Post'],
      body: 'Style your entire product line in minutes. Create a unified visual identity for catalogues and social media without weeks of retouching.'
    },
    {
      iconPath: 'M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1Zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7Z',
      title: 'Smart Lighting',
      tags: ['Ray Tracing', 'Physical Shadows', 'Studio Quality', 'Sunlight Sync'],
      body: 'Automatic lighting and material adjustment. Achieve flawless integration with realistic shadows and sunlight.'
    }
  ];

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-black py-24 px-8 md:px-16 lg:px-20" id="capabilities">
      {/* Background Video - full bleed, no 120% scale */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <FadingVideo
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_094631_d30ab262-45ee-4b7d-99f3-5d5848c8ef13.mp4"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full max-w-7xl mx-auto flex-1">
        {/* Header */}
        <div className="text-left select-none">
          <span className="text-sm font-body text-white/80 block mb-4 uppercase tracking-wider">
            // Capabilities
          </span>
          <h2 
            className="font-heading italic text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.95] tracking-[-3px]"
          >
            Production<br />evolved
          </h2>
        </div>

        {/* Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {cards.map((card, idx) => (
            <div 
              key={idx}
              className="liquid-glass rounded-[1.25rem] p-6 min-h-[360px] flex flex-col justify-between hover:border-white/20 transition-all duration-300"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                {/* Icon square */}
                <div className="w-11 h-11 rounded-[0.75rem] bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-6 h-6 text-white"
                  >
                    <path d={card.iconPath} />
                  </svg>
                </div>

                {/* Tag pills */}
                <div className="flex flex-wrap justify-end gap-1.5 max-w-[70%]">
                  {card.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx}
                      className="liquid-glass rounded-full px-2.5 py-0.5 text-[9px] sm:text-[10px] text-white/90 font-body whitespace-nowrap font-medium border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom text */}
              <div className="mt-8 text-left">
                <h3 className="font-heading italic text-white text-3xl md:text-4xl tracking-[-1px] leading-none mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-white/85 font-body font-light leading-snug max-w-[32ch]">
                  {card.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
