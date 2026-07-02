import { useState, useEffect } from "react";

interface ClubEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  studentCoordinator?: string;
}

interface Registration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  dept: string;
  year: string;
  email?: string;
  timestamp: string;
}

interface EventRegistrationProps {
  event: ClubEvent;
  memberInfo: { id: string; fullName: string; dept: string; year: string; email?: string; } | null;
  onShowPortal: () => void;
  onClose: () => void;
}

export default function EventRegistration({ event, memberInfo, onShowPortal, onClose }: EventRegistrationProps) {
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resolvedEmail, setResolvedEmail] = useState("");

  useEffect(() => {
    if (!memberInfo) return;
    const regs: Registration[] = JSON.parse(localStorage.getItem("alsRegistrations") || "[]");
    const alreadyRegistered = regs.some(r => r.eventId === event.id && r.studentId === memberInfo.id);
    setRegistered(alreadyRegistered);
  }, [event.id, memberInfo]);

  useEffect(() => {
    if (!memberInfo) return;
    let emailVal = memberInfo.email || "";
    if (!emailVal) {
      try {
        const membersList = JSON.parse(localStorage.getItem("alsMembers") || "[]");
        const found = membersList.find((m: any) => m.id === memberInfo.id);
        if (found && found.email) {
          emailVal = found.email;
        }
      } catch {}
    }
    setResolvedEmail(emailVal);
  }, [memberInfo]);

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

  const handleRegister = () => {
    if (!memberInfo) return;
    setLoading(true);
    setTimeout(() => {
      const regs: Registration[] = JSON.parse(localStorage.getItem("alsRegistrations") || "[]");
      const newReg: Registration = {
        id: `REG-${Date.now()}`,
        eventId: event.id,
        studentId: memberInfo.id,
        studentName: memberInfo.fullName,
        dept: memberInfo.dept,
        year: memberInfo.year,
        email: resolvedEmail,
        timestamp: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      regs.push(newReg);
      localStorage.setItem("alsRegistrations", JSON.stringify(regs));
      setRegistered(true);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[var(--ink)] border border-[var(--paper-hair)] rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] text-[var(--rose)] font-mono uppercase tracking-widest block mb-1">Event Details</span>
            <h3 className="text-xl font-heading italic text-[var(--paper)] leading-tight">{event.title}</h3>
            <p className="text-xs text-[var(--paper-dim)] font-mono mt-1">{event.date} · {event.venue}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--ink-soft)] hover:bg-[var(--ink-card)] text-[var(--paper)] cursor-pointer">
            <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Event Description Section with Scrollbar */}
        <div className="bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-xl p-4 mb-4 max-h-[140px] overflow-y-auto" data-lenis-prevent>
          {event.studentCoordinator && (
            <div className="mb-2 pb-2 border-b border-[var(--paper-hair)]">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--rose)] font-bold block">Organizer</span>
              <span className="text-xs text-[var(--paper)] font-mono leading-none">{event.studentCoordinator}</span>
            </div>
          )}
          <div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--rose)] font-bold block mb-1">Description</span>
            <p className="text-xs text-[var(--paper-dim)] leading-relaxed text-justify whitespace-pre-wrap break-words">{event.description || "No description provided."}</p>
          </div>
        </div>

        {memberInfo ? (
          <>
            <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-xl p-4 mb-6">
              <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--paper-dim)] mb-2">Registering as</p>
              <p className="font-semibold text-[var(--paper)] text-sm">{memberInfo.fullName}</p>
              <p className="text-xs text-[var(--paper-dim)] mt-0.5 font-mono">{memberInfo.dept} · {memberInfo.year}</p>
              {resolvedEmail && <p className="text-[10px] text-[var(--rose)] mt-1 font-mono font-semibold truncate">Email: {resolvedEmail}</p>}
              <p className="text-[10px] text-[var(--paper-faint)] mt-1 font-mono">ID: {memberInfo.id}</p>
            </div>

            {registered ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-950/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-emerald-600" stroke="currentColor" fill="none" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-[var(--paper)] font-semibold mb-1">You are registered!</p>
                <p className="text-xs text-[var(--paper-dim)] mb-4">Your seat has been confirmed for this event.</p>
                <button onClick={onClose} className="px-6 py-2.5 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-semibold text-[var(--paper)] bg-white/40 transition-all cursor-pointer">Close</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full py-3 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loading ? "Reserving Seat..." : "Reserve My Seat"}
                </button>
                <button onClick={onClose} className="w-full py-3 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-semibold text-[var(--paper)] bg-white/40 transition-all cursor-pointer">Cancel</button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--paper-dim)]">Please sign in to register a seat for this event.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  onClose();
                  onShowPortal();
                }}
                className="w-full py-3 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
              >
                Sign In to Register
              </button>
              <button onClick={onClose} className="w-full py-3 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-semibold text-[var(--paper)] bg-white/40 transition-all cursor-pointer">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
