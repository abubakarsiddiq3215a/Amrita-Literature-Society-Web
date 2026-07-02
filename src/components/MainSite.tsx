import { useState, useEffect } from "react";
import { ArrowLeftIcon, ArrowRightIcon, SearchIcon, FileIcon, MapPinIcon, DownloadIcon } from "./Icons";
import EventGallery from "./EventGallery";
import EventRegistration from "./EventRegistration";

interface ClubMember {
  id: string;
  name: string;
  designation: string;
  year?: string;
  dept?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
  avatarUrl?: string;
  type?: 'Faculty' | 'Student';
}

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  status: 'Past' | 'Ongoing' | 'Upcoming';
  image: string;
  reportPdf?: string;
  studentCoordinator?: string;
}

interface LibraryResource {
  id: string;
  title: string;
  category: string;
  language: string;
  access: 'Open' | 'Members';
  fileUrl?: string;
}

interface MainSiteProps {
  isLoggedIn: boolean;
  onShowPortal: () => void;
  currentMember?: { id: string; fullName: string; dept: string; year: string; email?: string; } | null;
}

export default function MainSite({ isLoggedIn, onShowPortal, currentMember }: MainSiteProps) {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [selectedEventTab, setSelectedEventTab] = useState<"Upcoming" | "Ongoing" | "Past">("Upcoming");
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [galleryEvent, setGalleryEvent] = useState<ClubEvent | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<ClubEvent | null>(null);

  const filteredEvents = events.filter((ev) => ev.status === selectedEventTab);

  const handleResourceClick = (res: LibraryResource) => {
    if (res.access === "Members" && !isLoggedIn) {
      onShowPortal();
      return;
    }
    if (res.fileUrl) {
      if (res.fileUrl.startsWith("data:")) {
        const newWindow = window.open();
        if (newWindow) {
          newWindow.document.write(
            `<iframe src="${res.fileUrl}" style="width:100%; height:100%; border:none;"></iframe>`
          );
        }
      } else {
        window.open(res.fileUrl, "_blank");
      }
    } else {
      alert("This is a mock resource template. Add custom resources using the admin panel to upload actual files.");
    }
  };

  useEffect(() => {
    const loadAllData = () => {
      try {
        let allRes = JSON.parse(localStorage.getItem("alsLibrary") || "[]");
        if (allRes.length === 0) {
          allRes = [
            { id: "RES-1", title: "Phonetic Starter Handbook", category: "Workshop Notes", language: "English", access: "Open" },
            { id: "RES-2", title: "Introduction to Dravidian Scripts", category: "Reading Pack", language: "Tamil / Telugu", access: "Open" },
            { id: "RES-3", title: "Hindi Conversation Prompt Deck", category: "Practice Kit", language: "Hindi", access: "Members" },
            { id: "RES-4", title: "Malayalam Etymology Notes", category: "Research Digest", language: "Malayalam", access: "Members" }
          ];
          localStorage.setItem("alsLibrary", JSON.stringify(allRes));
        }
        setResources(allRes);
      } catch { setResources([]); }

      try {
        let allEvents = JSON.parse(localStorage.getItem("alsEvents") || "[]");
        if (!Array.isArray(allEvents)) allEvents = [];
        
        const defaultEvents = [
          { id: "EV-1", title: "Amrita Literature Society Inauguration", date: "14 Feb 2026", venue: "Main Seminar Hall", description: "The official inauguration ceremony of the Amrita Literature Society, launching regional study paths.", status: "Past", image: "/Events/AMLS/AMLS/AMLS_1_Inaguration/image.png", reportPdf: "/Events/AMLS/AMLS/AMLS_1_Inaguration/Literacy Society Inauguration.pdf" },
          { id: "EV-2", title: "Bilingual Debate Competition", date: "28 Feb 2026", venue: "Room 302, Language Block", description: "An engaging regional debate exploring local dialects, cultural literature, and preservation.", status: "Past", image: "/Events/AMLS/AMLS/AMLS_2_Debate/Banner.jpeg", reportPdf: "/Events/AMLS/AMLS/AMLS_2_Debate/Event report - Tamil debate.pdf" },
          { id: "EV-3", title: "Just A Minute (JAM) Challenge", date: "10 Mar 2026", venue: "Seminar Hall B", description: "A fast-paced verbal challenge focusing on speech fluency, vocabulary choice, and syntax speed.", status: "Past", image: "/Events/AMLS/AMLS/AMLS_3_JAM/JAM- Brouchur.jpeg" },
          { id: "EV-4", title: "Women's Day Special Assembly", date: "06 Mar 2026", venue: "Main Auditorium", description: "Commemorating Women's Day with creative student skit performances and literature certifications.", status: "Past", image: "/Events/AMLS/AMLS/AMLS_4_Womensday/brouchur.jpeg", reportPdf: "/Events/AMLS/AMLS/AMLS_4_Womensday/Programme Agenda-Womens Day-06-03-26.pdf" },
          { id: "EV-PDF-1", title: "Walk & Talk (QR Code Scanning)", date: "11 Jul 2026 · 9:00 AM – 11:00 AM", venue: "Outdoor & Acharya Hall", description: "A walking and scanning event connecting literature and movement. Faculty Coordinator: Dr. K. S. Priya", status: "Upcoming", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=600", studentCoordinator: "" },
          { id: "EV-PDF-2", title: "Multi-Lingual Poetry Reading — poems in different languages", date: "11 Jul 2026 · 11:00 AM – 2:30 PM", venue: "Amriteshwari Hall", description: "A poetry recitation session exploring diverse expressions. Faculty Coordinator: Mrs. Rejini K", status: "Upcoming", image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?q=80&w=600", studentCoordinator: "Amar Maruti Kate (NC.SC.U4CSE25203)" },
          { id: "EV-PDF-3", title: "English – Talk with Nature (Modelled on TEDx Talk)", date: "08 Aug 2026 · 2:30 PM – 4:25 PM", venue: "Amriteshwari Hall", description: "The Trial of Humanity. Faculty Coordinator: Dr. Akhila Ajith", status: "Upcoming", image: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=600", studentCoordinator: "Shaik Mohammed Abubakar Siddiq (NC.SC.U4CSE24229) And K Mounesh (NC.SC.U4CSE24207)" },
          { id: "EV-PDF-4", title: "Touching the Sky", date: "22 Aug 2026 · 9:00 AM – 11:00 AM", venue: "Outdoor & Acharya Hall", description: "Photography + Poem Writing. Faculty Coordinator: Dr. K. S. Priya", status: "Upcoming", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600", studentCoordinator: "Akshayasri Baskar (NC.SC.U4CSE24106)" },
          { id: "EV-PDF-5", title: "Guruvandhanam – A Literary Tribute to Teachers", date: "19 Sep 2026 · 1:30 PM – 2:45 PM", venue: "Amriteshwari Hall", description: "Skit, open talk (felicitating their favourite teacher), debate between teachers and students. Faculty Coordinator: Mrs. Rejini K", status: "Upcoming", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600", studentCoordinator: "Archanna A (NC.EN.U4ECE25005)" },
          { id: "EV-PDF-6", title: "Winter Breeze", date: "19 Sep 2026 · 9:00 AM – 11:00 AM", venue: "Outdoor & Acharya Hall", description: "(Autumn Breeze). Faculty Coordinator: Dr. Akhila Ajith", status: "Upcoming", image: "https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?q=80&w=600", studentCoordinator: "S P SANITHA (NC.SC.U4CSE24128)" }
        ];

        let updated = [...allEvents];
        let changed = false;
        defaultEvents.forEach(def => {
          if (!updated.some(ev => ev.id === def.id)) {
            updated.push(def);
            changed = true;
          }
        });

        if (changed || allEvents.length === 0) {
          localStorage.setItem("alsEvents", JSON.stringify(updated));
        }
        setEvents(updated);
      } catch { setEvents([]); }

      try {
        let allMembers = JSON.parse(localStorage.getItem("alsMembers") || "[]");
        if (!Array.isArray(allMembers)) {
          if (typeof allMembers === 'object' && allMembers !== null) {
            allMembers = Object.values(allMembers);
          } else {
            allMembers = [];
          }
        }
        
        const defaultCoreMembers = [
          { id: "MEM-1", name: "Abubakar Siddiq", designation: "President", year: "4th Year", dept: "CSE", instagram: "https://instagram.com", linkedin: "https://linkedin.com", whatsapp: "https://wa.me" },
          { id: "MEM-2", name: "Ananya R.", designation: "Vice President", year: "3rd Year", dept: "AI & DS", instagram: "https://instagram.com", linkedin: "https://linkedin.com", whatsapp: "https://wa.me" },
          { id: "MEM-3", name: "Rahul Dev", designation: "Secretary", year: "3rd Year", dept: "English Lit", instagram: "https://instagram.com", linkedin: "https://linkedin.com", whatsapp: "https://wa.me" },
          { id: "MEM-4", name: "Dr. K. S. Priya", designation: "Faculty Coordinator", year: "Faculty", dept: "English", instagram: "https://instagram.com", linkedin: "https://linkedin.com", whatsapp: "https://wa.me" },
          { id: "MEM-5", name: "Mrs. Rejini K", designation: "Faculty Coordinator", year: "Faculty", dept: "English", instagram: "https://instagram.com", linkedin: "https://linkedin.com", whatsapp: "https://wa.me" },
          { id: "MEM-6", name: "Dr. Akhila Ajith", designation: "Faculty Coordinator", year: "Faculty", dept: "English", instagram: "https://instagram.com", linkedin: "https://linkedin.com", whatsapp: "https://wa.me" }
        ];

        let hasDefaults = defaultCoreMembers.every(def => allMembers.some((m: any) => m.id === def.id));
        if (!hasDefaults) {
          const missing = defaultCoreMembers.filter(def => !allMembers.some((m: any) => m.id === def.id));
          allMembers = [...missing, ...allMembers];
          localStorage.setItem("alsMembers", JSON.stringify(allMembers));
        }
        setMembers(allMembers);
      } catch { setMembers([]); }
    };
    loadAllData();
    window.addEventListener("storage", loadAllData);
    const interval = setInterval(loadAllData, 2000);
    return () => { window.removeEventListener("storage", loadAllData); clearInterval(interval); };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxSlide = Math.max(0, filteredEvents.length - visibleCount);

  useEffect(() => {
    if (filteredEvents.length <= visibleCount) {
      setActiveSlide(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % (maxSlide + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [filteredEvents.length, visibleCount, maxSlide]);

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + (maxSlide + 1)) % (maxSlide + 1));
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % (maxSlide + 1));
  };

  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = selectedLanguage === "all" || res.language.toLowerCase().includes(selectedLanguage.toLowerCase());
    return matchesSearch && matchesLang;
  });

  const handleEventClick = (ev: ClubEvent) => {
    if (ev.status === "Past") {
      setGalleryEvent(ev);
    } else {
      setRegisteringEvent(ev);
    }
  };

  return (
    <div className="w-full text-[var(--paper)] bg-[var(--ink)] select-none">

      {/* ABOUT SECTION (REWRITTEN FROM FORMS) */}
      <section id="about" className="py-24 border-t border-[var(--paper-hair)] relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
          <div className="absolute top-20 left-10 text-9xl font-serif text-[var(--paper)] animate-float select-none">త</div>
          <div className="absolute bottom-20 right-20 text-9xl font-serif text-[var(--paper)] animate-float select-none" style={{ animationDelay: "2s" }}>अ</div>
          <div className="absolute top-40 right-1/3 text-7xl font-serif text-[var(--paper)] animate-float select-none" style={{ animationDelay: "4s" }}>அ</div>
          <div className="absolute bottom-10 left-1/4 text-8xl font-serif text-[var(--paper)] animate-float select-none" style={{ animationDelay: "6s" }}>ക</div>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 select-none">
            <span className="font-mono text-[var(--rose)] uppercase tracking-widest text-xs block mb-2">About</span>
            <h2 className="text-4xl sm:text-5xl font-heading italic text-[var(--paper)]">Amrita Literature Society</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                tags: ["Writing", "Poetry"], 
                title: "Creative Sanctuary", 
                desc: "A dedicated sanctuary for writers and poets to hone their craft, hosting weekly peer workshops, prose readings, and feedback labs to cultivate fresh literary perspectives.",
                bg: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80"
              },
              { 
                tags: ["Languages", "Translation"], 
                title: "Bilingual Translation", 
                desc: "Exploring and translating rich regional vernacular writing from Hindi, Tamil, Malayalam, and Telugu into English, preserving cultural metaphors and stylistic nuance.",
                bg: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80"
              },
              { 
                tags: ["Research", "Linguistics"], 
                title: "Comparative Studies", 
                desc: "Analyzing structural frameworks, phonetic lineages, and character archetypes across classic literature, modern poetry, and post-colonial drama.",
                bg: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80"
              },
              { 
                tags: ["Performance", "Dialogue"], 
                title: "Polyglot Showcases", 
                desc: "Staging live theatrical play readings, spoken-word poetry slams, and multi-lingual dialogues that bring stories from the page to the auditorium stage.",
                bg: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80"
              },
              { 
                tags: ["Calligraphy", "Scribes"], 
                title: "Calligraphy & Lit Art", 
                desc: "Studying script geometries, letterform layout design, and vintage typesetting, reviving traditional writing styles through hands-on visual art workshops.",
                bg: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80"
              },
              { 
                tags: ["Editorial", "Archives"], 
                title: "Discourse & Publications", 
                desc: "Documenting our collective voices by archiving manuscripts, editing the periodic society newsletter, and publishing student anthologies.",
                bg: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80"
              }
            ].map((item, i) => (
              <div key={i} className="relative bg-[var(--ink-card)] rounded-[1.1rem] p-6 min-h-[280px] flex flex-col justify-between hover:border-[var(--rose)]/30 border border-[var(--paper-hair)] transition-all duration-500 overflow-hidden group shadow-lg">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-[0.16] group-hover:opacity-[0.24] transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundImage: `url(${item.bg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink-card)] via-[var(--ink-soft)]/90 to-transparent pointer-events-none" />
                <div className="relative z-10 flex justify-end gap-1.5 flex-wrap">
                  {item.tags.map(t => <span key={t} className="liquid-glass px-2.5 py-0.5 text-[10px] rounded-full text-[var(--paper-dim)]">{t}</span>)}
                </div>
                <div className="relative z-10 mt-6">
                  <h3 className="text-xl font-heading italic mb-2 text-[var(--paper)]">{item.title}</h3>
                  <p className="text-sm text-[var(--paper-dim)] leading-relaxed text-justify">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="hairline" />

      {/* EVENTS / SCHEDULE */}
      <section className="py-24" id="events">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 select-none">
            <div>
              <span className="font-mono text-[var(--rose)] uppercase tracking-widest text-xs block mb-2">Schedule</span>
              <h2 className="text-4xl sm:text-5xl font-heading italic text-[var(--paper)]">Club Events</h2>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <div className="flex bg-[var(--ink-soft)] p-0.5 border border-[var(--paper-hair)] rounded-xl font-mono text-[10px] uppercase">
                {(["Upcoming", "Ongoing", "Past"] as const).map((tab) => (
                  <button key={tab} onClick={() => { setSelectedEventTab(tab); setActiveSlide(0); }} className={"px-3 py-2 rounded-lg font-bold cursor-pointer transition-all " + (selectedEventTab === tab ? "bg-[var(--paper)] text-[var(--ink)] font-semibold" : "text-[var(--paper-dim)] hover:text-[var(--paper)]")}>
                    {tab} Events
                  </button>
                ))}
              </div>
              {filteredEvents.length > visibleCount && (
                <div className="flex gap-2">
                  <button onClick={handlePrevSlide} className="p-2 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-full text-[var(--paper)] bg-white/40 transition-all cursor-pointer"><ArrowLeftIcon size={14} /></button>
                  <button onClick={handleNextSlide} className="p-2 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-full text-[var(--paper)] bg-white/40 transition-all cursor-pointer"><ArrowRightIcon size={14} /></button>
                </div>
              )}
            </div>
          </div>
          {filteredEvents.length === 0 ? (
            <div className="border border-[var(--paper-hair)] border-dashed rounded-3xl p-16 text-center text-[var(--paper-dim)] text-sm">
              No {selectedEventTab.toLowerCase()} volumes catalogued at this hour.
            </div>
          ) : (
            <div className="relative w-full overflow-hidden pt-4 pb-6">
              <div 
                className="flex gap-6 transition-transform duration-500 ease-in-out pt-6"
                style={{ transform: `translateX(-${activeSlide * 324}px)` }}
              >
                {filteredEvents.map((e) => (
                  <div key={e.id} onClick={() => handleEventClick(e)} className="flex-shrink-0 w-[300px] rounded-[1.1rem] bg-[var(--ink-card)] border border-[var(--paper-hair)] overflow-hidden shadow-sm flex flex-col justify-between hover:border-[var(--rose)]/30 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl transition-all duration-[400ms] ease-out cursor-pointer">
                    <div className="h-[180px] bg-cover bg-center p-4 flex flex-col justify-between" style={{ backgroundImage: "linear-gradient(rgba(26,22,17,0.3) 0%, rgba(26,22,17,0.7) 100%), url(" + e.image + ")" }}>
                      {e.status === "Past" && <span className="self-start text-[9px] font-mono uppercase tracking-wider text-white/70 bg-black/30 px-2 py-0.5 rounded border border-white/20">View photos</span>}
                      <div className="text-[10px] text-white/95 font-mono uppercase tracking-wider flex items-center gap-1"><MapPinIcon size={10} className="text-[#e8cb7a]" />{e.venue}</div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-heading italic text-xl text-[var(--paper)] mb-1 leading-snug">{e.title}</h3>
                        <span className="text-[10px] font-mono font-bold text-[var(--rose)] uppercase tracking-wider block mb-2">{e.date}</span>
                        <p className="text-xs text-[var(--paper-dim)] leading-relaxed line-clamp-3 text-justify">{e.description}</p>
                        {e.studentCoordinator && (
                          <div className="mt-2 text-[10px] font-mono text-[var(--paper-dim)] truncate">
                            <span className="text-[var(--rose)] font-semibold">Organizer:</span> {e.studentCoordinator}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-[var(--paper-hair)]">
                        {e.status === "Past" ? (
                          <div className="flex gap-2">
                            <button onClick={(evt) => { evt.stopPropagation(); setGalleryEvent(e); }} className="flex-1 flex items-center justify-center gap-2 bg-[var(--paper)] text-[var(--ink)] font-bold text-[10px] uppercase tracking-wider py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer">
                              <svg viewBox="0 0 24 24" className="w-3 h-3" stroke="currentColor" fill="none" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                              View Photos
                            </button>
                            {e.reportPdf && (
                              <a href={e.reportPdf} download onClick={(evt) => evt.stopPropagation()} className="px-3 py-2 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-lg flex items-center gap-1 text-[10px] text-[var(--paper)] font-bold transition-all cursor-pointer">
                                <DownloadIcon size={10} />
                              </a>
                            )}
                          </div>
                        ) : (
                          <button onClick={(evt) => { evt.stopPropagation(); handleEventClick(e); }} className="w-full border border-[var(--paper-hair)] hover:border-[var(--rose)]/50 hover:bg-[var(--rose)]/5 rounded-lg py-2 text-[10px] text-[var(--paper-90)] font-bold uppercase tracking-wider bg-white/30 cursor-pointer transition-all">
                            Register Seat
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <hr className="hairline" />

      {/* RESOURCE LIBRARY */}
      <section className="py-24 bg-black/[0.01]" id="resources">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 select-none">
            <span className="font-mono text-[var(--rose)] uppercase tracking-widest text-xs block mb-2">Study Desk</span>
            <h2 className="text-4xl sm:text-5xl font-heading italic text-[var(--paper)]">Resource Archive</h2>
            <p className="text-[var(--paper-dim)] text-xs sm:text-sm mt-2 max-w-md mx-auto">Access curated handbooks, practice sheets, and bilingual templates compiled by the council.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-stretch md:items-center">
            <div className="flex-1 relative h-11">
              <SearchIcon className="absolute left-4 top-3 text-[var(--paper-faint)]" size={16} />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search literature resource database..." className="w-full h-full bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-xl pl-11 pr-4 text-sm focus:outline-none focus:border-[var(--paper-faint)] placeholder-[var(--paper-faint)] transition-all"/>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 md:pb-0 font-mono text-[10px] uppercase h-11">
              {["all", "English", "Hindi", "Telugu", "Tamil", "Malayalam"].map((lang) => (
                <button key={lang} onClick={() => setSelectedLanguage(lang)} className={"h-full px-4 rounded-xl border capitalize whitespace-nowrap cursor-pointer transition-all flex items-center " + (selectedLanguage === lang ? "bg-[var(--paper)] text-[var(--ink)] border-[var(--paper)] font-bold" : "bg-white/40 border-[var(--paper-hair)] text-[var(--paper-dim)] hover:text-[var(--paper)]")}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl overflow-hidden shadow-sm max-w-4xl mx-auto">
            <div className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr] gap-4 bg-[var(--ink-soft)] p-4 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider font-mono text-[var(--paper-dim)] border-b border-[var(--paper-hair)]">
              <div>Resource Document</div><div>Category</div><div>Languages</div><div className="text-right">Access</div>
            </div>
            {filteredResources.length === 0 ? (
              <div className="p-8 text-center text-[var(--paper-dim)] text-sm">No matching resources found.</div>
            ) : (
              <div className="divide-y divide-[var(--paper-hair)] text-xs sm:text-sm font-medium">
                {filteredResources.map((res) => (
                  <div key={res.id} onClick={() => handleResourceClick(res)} className="grid grid-cols-[1.5fr_1fr_1fr_0.8fr] gap-4 p-4 items-center hover:bg-[var(--ink-soft)]/50 transition-colors cursor-pointer">
                    <div className="font-semibold text-[var(--paper)] flex items-center gap-2 truncate"><FileIcon size={14} className="text-[var(--paper-dim)] flex-shrink-0" /><span className="truncate">{res.title}</span></div>
                    <div className="text-[var(--paper-dim)] truncate">{res.category}</div>
                    <div className="text-[var(--paper-dim)] truncate">{res.language}</div>
                    <div className="text-right">
                      {res.access === "Open" ? (
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/10 text-emerald-700 border border-emerald-500/20 font-bold uppercase tracking-wider">Open</span>
                      ) : (
                        <button onClick={() => { if (!isLoggedIn) onShowPortal(); }} className={"text-[9px] font-mono px-2 py-0.5 rounded border font-bold uppercase tracking-wider cursor-pointer " + (isLoggedIn ? "bg-blue-950/10 text-blue-700 border-blue-500/20" : "bg-[#8f3623]/10 text-[var(--rose)] border-[#8f3623]/20 animate-pulse")}>
                          {isLoggedIn ? "Access" : "Sign In"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="hairline" />

      {/* CORE MEMBERS */}
      {members.filter(m => m.designation && m.designation.trim() !== "").length > 0 && (
        <section className="py-24" id="members">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12 select-none">
              <span className="font-mono text-[var(--rose)] uppercase tracking-widest text-xs block mb-2">Council</span>
              <h2 className="text-4xl sm:text-5xl font-heading italic text-[var(--paper)]">Amrita Literature Society</h2>
              <p className="text-[var(--paper-dim)] text-sm mt-2 max-w-md mx-auto">Meet the core team driving ALS forward.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {members
                .filter(m => m.designation && m.designation.trim() !== "")
                .sort((a, b) => {
                  const typeA = a.type || (a.year === 'Faculty' || !a.year ? 'Faculty' : 'Student');
                  const typeB = b.type || (b.year === 'Faculty' || !b.year ? 'Faculty' : 'Student');
                  if (typeA === 'Faculty' && typeB !== 'Faculty') return -1;
                  if (typeA !== 'Faculty' && typeB === 'Faculty') return 1;
                  return 0;
                })
                .map((m) => (
                <div 
                  key={m.id} 
                  className="relative h-[260px] bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl overflow-hidden hover:border-[var(--rose)]/30 hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl transition-all duration-[400ms] ease-out group cursor-pointer"
                >
                  {/* Front/Default State: Clean & Minimalist */}
                  <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:scale-95 group-hover:opacity-0 group-hover:pointer-events-none">
                    <div className="w-20 h-20 rounded-full border border-[var(--rose)]/15 flex items-center justify-center mb-4 shadow-md overflow-hidden bg-[var(--ink-soft)]">
                      {m.avatarUrl ? (
                        <img src={m.avatarUrl} className="w-full h-full object-cover" alt={m.name} />
                      ) : (
                        <span className="font-heading italic text-4xl text-[var(--rose)]">{m.name.charAt(0)}</span>
                      )}
                    </div>
                    <h4 className="font-heading text-2xl italic text-[var(--paper)] leading-tight">{m.name}</h4>
                    <p className="text-xs text-[var(--rose)] font-mono uppercase tracking-wider mt-1">{m.designation}</p>
                    <span className="text-[9px] font-mono text-[var(--paper-faint)] mt-4 tracking-widest uppercase">Hover to reveal details</span>
                  </div>

                  {/* Hover Revealed State */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between bg-[var(--ink-soft)] border border-[var(--rose)]/10 rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto">
                    <div>
                      <span className="text-[10px] text-[var(--rose)] font-mono uppercase tracking-widest block mb-1">Council Profile</span>
                      <h4 className="font-heading text-3xl italic text-[var(--paper)] leading-tight">{m.name}</h4>
                      <p className="text-sm text-[var(--rose)] font-medium mt-0.5">{m.designation}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--paper-dim)] bg-white/60 px-2.5 py-1 rounded-md border border-[var(--paper-hair)]">
                          {m.year || 'Faculty'}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--paper-dim)] bg-white/60 px-2.5 py-1 rounded-md border border-[var(--paper-hair)]">
                          {m.dept || 'Linguistics'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--paper-hair)] flex gap-4">
                      {m.instagram && (
                        <a 
                          href={m.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-[11px] font-mono text-[var(--paper-dim)] hover:text-[#e1306c] transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="1.5">
                            <rect x="2" y="2" width="20" height="20" rx="5"/>
                            <circle cx="12" cy="12" r="4"/>
                            <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                          </svg>
                          Instagram
                        </a>
                      )}
                      {m.linkedin && (
                        <a 
                          href={m.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-[11px] font-mono text-[var(--paper-dim)] hover:text-[#0A66C2] transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="1.5">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                            <rect x="2" y="9" width="4" height="12"/>
                            <circle cx="4" cy="4" r="2"/>
                          </svg>
                          LinkedIn
                        </a>
                      )}
                      {m.whatsapp && (
                        <a 
                          href={m.whatsapp} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1 text-[11px] font-mono text-[var(--paper-dim)] hover:text-[#25D366] transition-colors"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="1.5">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                          </svg>
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <hr className="hairline" />

      {/* FAQ */}
      <section className="py-24" id="faq">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="font-mono text-[var(--rose)] uppercase tracking-widest text-xs block mb-2">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-heading italic text-[var(--paper)]">Frequently Asked Questions</h2>
          </div>
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="divide-y divide-[var(--paper-hair)] text-xs sm:text-sm font-medium">
              {[
                { q: "Who can join the Amrita Literature Society?", a: "Any student or scholar at Amrita Vishwa Vidyapeetham with a passion for creative writing, literary criticism, translation, or linguistics is welcome to sign up." },
                { q: "Do I need to be a literature major to join?", a: "Not at all. Many of our active fellows come from Engineering, AI, and Science departments, bringing unique perspectives to translation work and digital writing." },
                { q: "How do I upload stories and poetry?", a: 'Once you sign in with your generated ALS ID card, a "Your Works" tab will appear. Upload your document directly.' },
                { q: "How often does the society gather?", a: "We host weekly creative labs, bi-weekly translation circles, and monthly masterclasses. We also stage the flagship Polyglot Showcase every semester." }
              ].map((faq, idx) => (
                <div key={idx} className="py-4">
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex justify-between items-center text-left text-[var(--paper)] font-semibold cursor-pointer py-1.5 focus:outline-none">
                    <span className="pr-4">{faq.q}</span>
                    <span className="text-lg text-[var(--rose)] font-light leading-none">{openFaq === idx ? "−" : "+"}</span>
                  </button>
                  {openFaq === idx && <div className="mt-3 text-[var(--paper-dim)] leading-relaxed pl-1 text-justify">{faq.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="py-28 relative text-center border-t border-[var(--paper-hair)] overflow-hidden" id="join">
        <div className="absolute inset-0 bg-[#8f3623]/5 pointer-events-none z-0"/>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] sm:text-[10vw] font-serif italic text-[var(--paper-hair)] font-bold select-none z-0">W R I T I N G</div>
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <span className="font-mono text-[var(--rose)] uppercase tracking-widest text-xs block mb-4">Join</span>
          <h2 className="text-4xl sm:text-5xl font-heading italic text-[var(--paper)] mb-4">Amrita Literature Society</h2>
          <p className="text-[var(--paper-dim)] text-sm sm:text-base leading-relaxed mb-8 max-w-md mx-auto text-justify">One dispatch a week — a volume worth your evening, and the note that came with it. No noise, no algorithm.</p>
          <button onClick={onShowPortal} className="px-10 py-4 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-full hover:opacity-90 text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer shadow-md">Enter the Archive</button>
        </div>
      </section>

      {/* PROFESSIONAL FOOTER */}
      <footer className="border-t border-[var(--paper-hair)] bg-[#1a1611]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-sm">
                  <img src="/als_logo.png" className="w-full h-full object-contain" alt="ALS Logo" />
                </div>
                <div>
                  <div className="text-white font-heading italic text-lg leading-none">Amrita Literature Society</div>
                  <div className="text-white/40 text-[10px] font-mono uppercase tracking-wider mt-0.5">Literary Archive - AMLS</div>
                </div>
              </div>
              <p className="text-white/50 text-xs leading-relaxed max-w-xs">
                A creative sanctuary for bilingual scholars, translators, and storytellers at Amrita Vishwa Vidyapeetham. Where student voices find a permanent home.
              </p>
              <div className="flex gap-4 mt-5">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
                </a>
                <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                </a>
                <a href="mailto:als@amrita.edu" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors cursor-pointer">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white/70 text-[10px] font-mono uppercase tracking-wider mb-4">Navigate</h4>
              <div className="flex flex-col gap-2.5">
                {[["About", "#about"], ["Programs", "#programs"], ["Events", "#events"], ["Resources", "#resources"], ["FAQ", "#faq"]].map(([label, href]) => (
                  <a key={label} href={href} className="text-white/40 hover:text-white transition-colors text-xs">{label}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white/70 text-[10px] font-mono uppercase tracking-wider mb-4">Society</h4>
              <div className="flex flex-col gap-2.5">
                {["Amrita Vishwa Vidyapeetham", "Nagercoil Campus", "Department of Languages", "Creative Arts Division"].map((item) => (
                  <span key={item} className="text-white/40 text-xs">{item}</span>
                ))}
              </div>
              <div className="mt-6 p-3 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider mb-1">Contact</p>
                <p className="text-xs text-white/50">als@amrita.edu</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
            <div className="text-[10px] text-white/25 font-mono uppercase tracking-wider">Copyright 2026 Amrita Literature Society - All Rights Reserved</div>
            <div className="flex gap-5 text-[10px] font-mono text-white/25 uppercase tracking-wider">
              <a href="#" className="hover:text-white/60 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/60 transition-colors">Archive</a>
              <a href="#" className="hover:text-white/60 transition-colors">Gazette</a>
            </div>
          </div>
        </div>
      </footer>

      {galleryEvent && <EventGallery event={galleryEvent} onClose={() => setGalleryEvent(null)} />}
      {registeringEvent && <EventRegistration event={registeringEvent} memberInfo={currentMember || null} onShowPortal={onShowPortal} onClose={() => setRegisteringEvent(null)} />}
    </div>
  );
}
