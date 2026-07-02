import { useState, useEffect } from 'react';
import { 
  BookIcon, FolderIcon, PlusIcon, TrashIcon, EyeIcon, 
  CalendarIcon, RefreshIcon, EditIcon, DownloadIcon, FileIcon, MapPinIcon 
} from './Icons';
import { supabase } from '../supabaseClient';


interface Work {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  category: 'Stories' | 'Poetries' | 'Publications';
  fileName: string;
  fileSize: string;
  content: string;
  timestamp: string;
  status: 'Pending' | 'Reviewed' | 'Approved';
}

interface LibraryResource {
  id: string;
  title: string;
  category: string;
  language: string;
  access: 'Open' | 'Members';
  fileUrl?: string;
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

interface AdminPanelProps {
  onExit: () => void;
  onLogout: () => void;
}

export default function AdminPanel({ onExit, onLogout }: AdminPanelProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [members, setMembers] = useState<ClubMember[]>([]);
  const [activeTab, setActiveTab] = useState<'submissions' | 'library' | 'events' | 'members' | 'registrations'>('submissions');
  
  // Filters
  const [subFilter, setSubFilter] = useState<'All' | 'Stories' | 'Poetries' | 'Publications'>('All');
  const [eventFilter, setEventFilter] = useState<'All' | 'Past' | 'Ongoing' | 'Upcoming'>('All');
  const [libFilter, setLibFilter] = useState<'All' | 'Open' | 'Members'>('All');
  
  // Registrations state
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [regEventFilter, setRegEventFilter] = useState('all');
  const [regYearFilter, setRegYearFilter] = useState('all');
  const [regDeptFilter, setRegDeptFilter] = useState('all');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  // Library Form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newAccess, setNewAccess] = useState<'Open' | 'Members'>('Open');
  const [resourceFile, setResourceFile] = useState('');
  const [libError, setLibError] = useState('');

  // Event Form state
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventStatus, setEventStatus] = useState<'Past' | 'Ongoing' | 'Upcoming'>('Upcoming');
  const [eventImage, setEventImage] = useState('');
  const [eventReport, setEventReport] = useState('');
  const [eventStudentCoordinator, setEventStudentCoordinator] = useState('');
  const [eventError, setEventError] = useState('');

  // Member Form state
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberDesignation, setMemberDesignation] = useState('');
  const [memberYear, setMemberYear] = useState('');
  const [memberDept, setMemberDept] = useState('');
  const [memberInstagram, setMemberInstagram] = useState('');
  const [memberLinkedIn, setMemberLinkedIn] = useState('');
  const [memberWhatsApp, setMemberWhatsApp] = useState('');
  const [memberType, setMemberType] = useState<'Faculty' | 'Student'>('Student');
  const [memberAvatar, setMemberAvatar] = useState('');
  const [memberError, setMemberError] = useState('');

  // Selected work for detailed view
  const [viewingWork, setViewingWork] = useState<Work | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Load student works
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setWorks(data.map((w: any) => ({
          id: w.id,
          studentId: w.student_id,
          studentName: w.student_name,
          title: w.title,
          category: w.category,
          fileName: w.file_name,
          fileSize: w.file_size,
          content: w.content,
          timestamp: w.timestamp,
          status: w.status
        })));
      }
    } catch (err) {
      console.error(err);
      setWorks([]);
    }

    // Load library resources
    try {
      const { data, error } = await supabase
        .from('library')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setResources(data.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          language: r.language,
          access: r.access,
          fileUrl: r.file_url || undefined
        })));
      }
    } catch (err) {
      console.error(err);
      setResources([]);
    }

    // Load Events
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setEvents(data.map((ev: any) => ({
          id: ev.id,
          title: ev.title,
          date: ev.date,
          venue: ev.venue,
          description: ev.description,
          status: ev.status,
          image: ev.image,
          reportPdf: ev.report_pdf || undefined,
          studentCoordinator: ev.student_coordinator || undefined
        })));
      }
    } catch (err) {
      console.error(err);
      setEvents([]);
    }

    // Load Core Members
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setMembers(data.map((m: any) => ({
          id: m.id,
          name: m.name,
          designation: m.designation || '',
          year: m.year || undefined,
          dept: m.dept || undefined,
          instagram: m.instagram || undefined,
          linkedin: m.linkedin || undefined,
          whatsapp: m.whatsapp || undefined,
          avatarUrl: m.avatar_url || undefined,
          type: (m.type as any) || undefined
        })));
      }
    } catch (err) {
      console.error(err);
      setMembers([]);
    }

    // Load Registrations
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        setRegistrations(data.map((r: any) => ({
          id: r.id,
          eventId: r.event_id,
          studentId: r.student_id,
          studentName: r.student_name,
          dept: r.dept,
          year: r.year,
          email: r.email || undefined,
          timestamp: r.timestamp
        })));
      }
    } catch (err) {
      console.error(err);
      setRegistrations([]);
    }
  };

  // Status updates for submissions
  const handleUpdateStatus = async (id: string, newStatus: 'Pending' | 'Reviewed' | 'Approved') => {
    try {
      const { error } = await supabase
        .from('works')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      setWorks(prev => prev.map(w => w.id === id ? { ...w, status: newStatus } : w));
      if (viewingWork && viewingWork.id === id) {
        setViewingWork({ ...viewingWork, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  // Delete submission
  const handleDeleteSubmission = async (id: string) => {
    if (!window.confirm('Delete this student submission permanently?')) return;
    try {
      const { error } = await supabase
        .from('works')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWorks(prev => prev.filter(w => w.id !== id));
      if (viewingWork && viewingWork.id === id) setViewingWork(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete submission.');
    }
  };

  // Create Library Resource
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setLibError('');

    if (!newTitle.trim() || !newCategory.trim() || !newLanguage.trim()) {
      setLibError('Please fill out all fields.');
      return;
    }

    const newRes = {
      id: `RES-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory.trim(),
      language: newLanguage.trim(),
      access: newAccess,
      file_url: resourceFile || null
    };

    try {
      const { error } = await supabase
        .from('library')
        .insert([newRes]);

      if (error) throw error;

      loadData();

      setNewTitle('');
      setNewCategory('');
      setNewLanguage('');
      setNewAccess('Open');
      setResourceFile('');
    } catch (err: any) {
      console.error(err);
      setLibError(err.message || 'Could not save resource.');
    }
  };

  // Delete Library Resource
  const handleDeleteResource = async (id: string) => {
    if (!window.confirm('Delete this library resource?')) return;
    try {
      const { error } = await supabase
        .from('library')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setResources(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete resource.');
    }
  };

  // Event CRUD Management
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setEventError('');

    if (!eventTitle.trim() || !eventDate.trim() || !eventVenue.trim()) {
      setEventError('Title, Date, and Venue are required.');
      return;
    }

    const eventPayload = {
      title: eventTitle.trim(),
      date: eventDate.trim(),
      venue: eventVenue.trim(),
      description: eventDesc.trim(),
      status: eventStatus,
      image: eventImage.trim() || 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600',
      report_pdf: eventReport.trim() || null,
      student_coordinator: eventStudentCoordinator.trim() || null
    };

    try {
      if (editingEventId) {
        const { error } = await supabase
          .from('events')
          .update(eventPayload)
          .eq('id', editingEventId);

        if (error) throw error;
        setEditingEventId(null);
      } else {
        const newId = `EV-${Date.now()}`;
        const { error } = await supabase
          .from('events')
          .insert([{ id: newId, ...eventPayload }]);

        if (error) throw error;
      }

      loadData();

      setEventTitle('');
      setEventDate('');
      setEventVenue('');
      setEventDesc('');
      setEventStatus('Upcoming');
      setEventImage('');
      setEventReport('');
      setEventStudentCoordinator('');
    } catch (err: any) {
      console.error(err);
      setEventError(err.message || 'Failed to save event.');
    }
  };

  const handleEditEventClick = (ev: ClubEvent) => {
    setEditingEventId(ev.id);
    setEventTitle(ev.title || '');
    setEventDate(ev.date || '');
    setEventVenue(ev.venue || '');
    setEventDesc(ev.description || '');
    setEventStatus(ev.status || 'Upcoming');
    setEventImage(ev.image || '');
    setEventReport(ev.reportPdf || '');
    setEventStudentCoordinator(ev.studentCoordinator || '');
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEvents(prev => prev.filter(ev => ev.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete event.');
    }
  };

  // Member CRUD Management
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberError('');

    if (!memberName.trim() || !memberDesignation.trim()) {
      setMemberError('Name and Designation are required.');
      return;
    }

    const memberPayload = {
      name: memberName.trim(),
      full_name: memberName.trim(),
      designation: memberDesignation.trim(),
      year: memberType === 'Faculty' ? null : memberYear.trim(),
      dept: memberDept.trim(),
      instagram: memberInstagram.trim() || null,
      linkedin: memberLinkedIn.trim() || null,
      whatsapp: memberWhatsApp.trim() || null,
      type: memberType,
      avatar_url: memberAvatar || null
    };

    try {
      if (editingMemberId) {
        const { error } = await supabase
          .from('members')
          .update(memberPayload)
          .eq('id', editingMemberId);

        if (error) throw error;
        setEditingMemberId(null);
      } else {
        const newId = `MEM-${Date.now()}`;
        const { error } = await supabase
          .from('members')
          .insert([{ id: newId, ...memberPayload }]);

        if (error) throw error;
      }

      loadData();

      setMemberName('');
      setMemberDesignation('');
      setMemberYear('');
      setMemberDept('');
      setMemberInstagram('');
      setMemberLinkedIn('');
      setMemberWhatsApp('');
      setMemberType('Student');
      setMemberAvatar('');
    } catch (err: any) {
      console.error(err);
      setMemberError(err.message || 'Failed to save member.');
    }
  };

  const getEmailForRegistration = (reg: Registration) => {
    if (reg.email) return reg.email;
    return '-';
  };

  const handleDeleteRegistration = async (regId: string) => {
    if (window.confirm("Are you sure you want to delete this event registration?")) {
      try {
        const { error } = await supabase
          .from('registrations')
          .delete()
          .eq('id', regId);

        if (error) throw error;
        loadData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete registration.');
      }
    }
  };

  const handleEditMemberClick = (m: ClubMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name || '');
    setMemberDesignation(m.designation || '');
    setMemberYear(m.year || '');
    setMemberDept(m.dept || '');
    setMemberInstagram(m.instagram || '');
    setMemberLinkedIn(m.linkedin || '');
    setMemberWhatsApp(m.whatsapp || '');
    setMemberType(m.type || 'Student');
    setMemberAvatar(m.avatarUrl || '');
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Delete this core member from list?')) return;
    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMembers(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete member.');
    }
  };

  // Filtered Submissions
  const filteredWorks = works.filter(w => {
    if (subFilter === 'All') return true;
    if (subFilter === 'Stories' && w.category === 'Stories') return true;
    if (subFilter === 'Poetries' && w.category === 'Poetries') return true;
    if (subFilter === 'Publications' && w.category === 'Publications') return true;
    return false;
  });

  // Filtered Events
  const filteredEvents = events.filter(ev => {
    if (eventFilter === 'All') return true;
    return ev.status === eventFilter;
  });

  // Filtered Library Resources
  const filteredResources = resources.filter(res => {
    if (libFilter === 'All') return true;
    return res.access === libFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-24 select-none">
      {/* Admin Title & Back/Logout Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-[var(--paper)] font-serif" style={{ fontFamily: "'Instrument Serif', serif" }}>
            Admin <em className="not-italic text-[var(--paper-dim)]">Management Panel</em>
          </h2>
          <p className="text-[var(--paper-dim)] text-xs uppercase tracking-widest mt-1">Amrita Literature Society Council</p>
        </div>
        
        {/* Buttons to return back to website or sign out */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onExit}
            className="px-4 py-2 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-semibold text-[var(--paper)] bg-white/40 transition-all cursor-pointer shadow-sm"
          >
            Back to Website
          </button>
          <button 
            onClick={onLogout}
            className="px-4 py-2 border border-red-500/20 hover:border-red-500/40 rounded-xl text-xs font-semibold text-red-700 bg-red-50 transition-all cursor-pointer shadow-sm"
          >
            Sign Out
          </button>
          <button 
            onClick={loadData}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--paper-hair)] text-xs text-[var(--paper-dim)] hover:text-[var(--paper)] bg-white/40 transition-all cursor-pointer"
            title="Refresh Database"
          >
            <RefreshIcon size={12} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 md:gap-6 border-b border-[var(--paper-hair)] mb-8 font-mono text-xs uppercase select-none">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`pb-3 font-semibold tracking-wide border-b-2 cursor-pointer ${
            activeTab === 'submissions' 
              ? 'text-[var(--paper)] border-[var(--paper)]' 
              : 'text-[var(--paper-dim)] border-transparent hover:text-[var(--paper)]'
          }`}
        >
          Submissions ({works.length})
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`pb-3 font-semibold tracking-wide border-b-2 cursor-pointer ${
            activeTab === 'events' 
              ? 'text-[var(--paper)] border-[var(--paper)]' 
              : 'text-[var(--paper-dim)] border-transparent hover:text-[var(--paper)]'
          }`}
        >
          Manage Events ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('library')}
          className={`pb-3 font-semibold tracking-wide border-b-2 cursor-pointer ${
            activeTab === 'library' 
              ? 'text-[var(--paper)] border-[var(--paper)]' 
              : 'text-[var(--paper-dim)] border-transparent hover:text-[var(--paper)]'
          }`}
        >
          Manage Library ({resources.length})
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`pb-3 font-semibold tracking-wide border-b-2 cursor-pointer ${
            activeTab === 'members' 
              ? 'text-[var(--paper)] border-[var(--paper)]' 
              : 'text-[var(--paper-dim)] border-transparent hover:text-[var(--paper)]'
          }`}
        >
          Manage Members ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          className={`pb-3 font-semibold tracking-wide border-b-2 cursor-pointer ${
            activeTab === 'registrations' 
              ? 'text-[var(--paper)] border-[var(--paper)]' 
              : 'text-[var(--paper-dim)] border-transparent hover:text-[var(--paper)]'
          }`}
        >
          Registrations ({registrations.length})
        </button>
      </div>

      {/* SUBMISSIONS TAB */}
      {activeTab === 'submissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          {/* Submissions List & Filters */}
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm h-fit">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-[var(--paper)] flex items-center gap-2">
                <FolderIcon size={20} className="text-[var(--paper-dim)]" /> Submitted Works
              </h3>
              
              {/* Category Filter for Submissions */}
              <div className="flex bg-[var(--ink-soft)] p-0.5 rounded-lg border border-[var(--paper-hair)] text-[10px] font-mono uppercase">
                {['All', 'Stories', 'Poetries', 'Publications'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSubFilter(cat as any)}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                      subFilter === cat ? 'bg-[var(--paper)] text-[var(--ink)] font-semibold' : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
                    }`}
                  >
                    {cat === 'Poetries' ? 'Poetry' : cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredWorks.length === 0 ? (
              <div className="border border-[var(--paper-hair)] border-dashed rounded-2xl p-12 text-center text-[var(--paper-dim)] text-sm">
                No submissions matching this filter category.
              </div>
            ) : (
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[600px] pr-2">
                {filteredWorks.map((work: Work) => (
                  <div 
                    key={work.id}
                    onClick={() => setViewingWork(work)}
                    className={`p-5 border rounded-xl flex flex-col gap-3 hover:border-[var(--paper-faint)] transition-all cursor-pointer ${
                      viewingWork?.id === work.id ? 'bg-white/50 border-[var(--paper-faint)]' : 'bg-black/[0.01] border-[var(--paper-hair)]'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-[var(--paper)] text-base truncate leading-snug">{work.title}</h4>
                        <div className="flex flex-col gap-0.5 mt-2 text-xs text-[var(--paper-dim)]">
                          <div>
                            <span className="text-[var(--rose)] font-medium">{work.studentName}</span>
                          </div>
                          <div className="font-mono text-[10px] opacity-60">
                            ID: {work.studentId}
                          </div>
                        </div>
                      </div>

                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-mono font-bold tracking-wider uppercase ${
                        work.category === 'Stories' ? 'bg-blue-950/10 text-blue-700 border border-blue-500/20' :
                        work.category === 'Poetries' ? 'bg-purple-950/10 text-purple-700 border border-purple-500/20' :
                        'bg-[#c9a84c]/20 text-[#8c6b21] border border-[#c9a84c]/40'
                      }`}>
                        {work.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[var(--paper-dim)] bg-white/40 p-2 rounded-lg border border-[var(--paper-hair)] truncate">
                      <FileIcon size={12} className="text-[var(--rose)]" />
                      <span className="truncate">{work.fileName}</span>
                      <span className="text-[10px] opacity-50">({work.fileSize})</span>
                    </div>

                    <div className="flex justify-between items-center text-[10px] text-[var(--paper-dim)] mt-2 border-t border-[var(--paper-hair)] pt-2 font-mono">
                      <span className="flex items-center gap-1"><CalendarIcon size={12} /> {work.timestamp}</span>
                      <span className={`font-semibold px-2 py-0.5 rounded ${
                        work.status === 'Approved' ? 'bg-emerald-950/10 text-emerald-700 border border-emerald-500/20' :
                        work.status === 'Reviewed' ? 'bg-blue-950/10 text-blue-700 border border-blue-500/20' :
                        'bg-amber-950/10 text-amber-700 border border-amber-500/20'
                      }`}>
                        {work.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submission Details View with Overflow Limits */}
          <div className="flex flex-col gap-6">
            {viewingWork ? (
              <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm sticky top-24 flex flex-col gap-4 max-w-full">
                <div className="flex justify-between items-start gap-4 border-b border-[var(--paper-hair)] pb-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-[var(--paper)] leading-tight truncate">{viewingWork.title}</h3>
                    <p className="text-xs text-[var(--paper-dim)] mt-1.5 flex flex-wrap items-center gap-2 min-w-0 font-medium">
                      <span>Submitted by:</span>
                      <strong className="text-[var(--rose)] font-semibold truncate">{viewingWork.studentName}</strong>
                      <span className="font-mono bg-white/40 px-2 py-0.5 rounded text-[10px] border border-[var(--paper-hair)] truncate">{viewingWork.studentId}</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => handleDeleteSubmission(viewingWork.id)}
                    className="p-2 text-[var(--paper-dim)] hover:text-red-600 hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
                    title="Delete Submission"
                  >
                    <TrashIcon size={18} />
                  </button>
                </div>

                {/* Uploaded File Details Panel */}
                <div className="bg-[var(--ink-soft)] p-4 rounded-xl border border-[var(--paper-hair)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 max-w-full">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileIcon size={28} className="text-[var(--rose)] flex-shrink-0" />
                    <div className="min-w-0 flex-1 font-semibold">
                      <div className="text-xs text-[var(--paper)] truncate" title={viewingWork.fileName}>{viewingWork.fileName}</div>
                      <div className="text-[10px] text-[var(--paper-dim)] font-mono mt-0.5">{viewingWork.fileSize} Â· Document Upload</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([viewingWork.content], {type: 'text/plain'});
                      element.href = URL.createObjectURL(file);
                      element.download = viewingWork.fileName;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                    className="flex items-center justify-center gap-1 px-3 py-1.5 bg-white/55 hover:bg-white/90 border border-[var(--paper-hair)] rounded-lg text-xs font-semibold text-[var(--paper)] transition-all cursor-pointer whitespace-nowrap shadow-sm"
                  >
                    <DownloadIcon size={12} /> Download
                  </button>
                </div>

                {/* Body Preview */}
                <div className="flex-1 max-h-[300px] overflow-y-auto overflow-x-hidden pr-1 bg-[var(--ink-soft)]/50 p-4 border border-[var(--paper-hair)] rounded-xl max-w-full">
                  <div className="text-[10px] text-[var(--paper-dim)] font-mono uppercase tracking-wider mb-2 border-b border-[var(--paper-hair)] pb-1 font-semibold">File Preview</div>
                  <pre className="text-sm text-[var(--paper)] font-sans whitespace-pre-wrap break-all break-words leading-relaxed max-w-full overflow-hidden font-light">
                    {viewingWork.content}
                  </pre>
                </div>

                {/* Editorial Actions */}
                <div className="border-t border-[var(--paper-hair)] pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="text-xs text-[var(--paper-dim)] font-semibold">
                    Review Status: <span className="font-semibold text-[var(--paper)] font-mono bg-white/40 px-2 py-0.5 rounded border border-[var(--paper-hair)]">{viewingWork.status}</span>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleUpdateStatus(viewingWork.id, 'Reviewed')}
                      disabled={viewingWork.status === 'Reviewed'}
                      className="flex-1 sm:flex-none px-3.5 py-2 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-semibold text-[var(--paper)] bg-white/40 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(viewingWork.id, 'Approved')}
                      disabled={viewingWork.status === 'Approved'}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl text-xs hover:opacity-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                    >
                      Approve Work
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-[var(--paper-hair)] border-dashed rounded-2xl p-12 text-center text-[var(--paper-dim)] text-sm h-full flex flex-col justify-center items-center gap-2 bg-black/[0.01]">
                <EyeIcon size={36} className="opacity-20 mb-2" />
                Select a submission on the left to review.
              </div>
            )}
          </div>
        </div>
      )}

      {/* EVENTS TAB */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
          {/* Add / Edit Event Form */}
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-[var(--paper)] mb-4 flex items-center gap-2">
              {editingEventId ? <EditIcon size={20} className="text-[var(--rose)]" /> : <PlusIcon size={20} className="text-[var(--paper-dim)]" />} 
              {editingEventId ? 'Edit Event Details' : 'Create New Event'}
            </h3>

            {eventError && (
              <div className="mb-4 bg-red-950/10 border border-red-500/20 text-red-700 text-sm px-4 py-2.5 rounded-lg font-semibold">
                {eventError}
              </div>
            )}

            <form onSubmit={handleSaveEvent} className="flex flex-col gap-4 text-xs font-semibold text-[var(--paper-dim)]">
              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Event Title</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Dialogue & Drama: Slam Poetry"
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider">Date & Time</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. 19 Apr 2026 Â· 3:00 PM"
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider">Venue</label>
                  <input
                    type="text"
                    value={eventVenue}
                    onChange={(e) => setEventVenue(e.target.value)}
                    placeholder="e.g. Room 204, Seminar Hall"
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider">Timeline Status</label>
                  <select
                    value={eventStatus}
                    onChange={(e) => setEventStatus(e.target.value as any)}
                    className="bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-xl px-3 py-2.5 text-[var(--paper)] focus:outline-none focus:border-[var(--paper-faint)] font-bold"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing (This Week)</option>
                    <option value="Past">Past (Archived)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider">Event Poster / Image</label>
                  <div className="relative group border border-dashed border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl p-2 bg-black/[0.01] transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[46px]">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setEventImage(event.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <PlusIcon size={14} className="text-[var(--paper-dim)] group-hover:text-[var(--paper)] transition-colors mb-0.5" />
                    {eventImage ? (
                      <div className="text-[10px] text-emerald-700 font-bold truncate max-w-[180px]">
                        Poster Loaded!
                      </div>
                    ) : (
                      <div className="text-[10px] text-[var(--paper-faint)] group-hover:text-[var(--paper-dim)] transition-colors">
                        Upload Image
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider">Student Coordinator</label>
                  <input
                    type="text"
                    value={eventStudentCoordinator}
                    onChange={(e) => setEventStudentCoordinator(e.target.value)}
                    placeholder="e.g. Amar Maruti Kate (NC.SC.U4CSE25203)"
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none placeholder-[var(--paper-faint)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase tracking-wider">Event Report PDF (Optional)</label>
                  <input
                    type="text"
                    value={eventReport}
                    onChange={(e) => setEventReport(e.target.value)}
                    placeholder="e.g. /Events/AMLS/AMLS/AMLS_1_Inaguration/Literacy Society Inauguration.pdf"
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none placeholder-[var(--paper-faint)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Description</label>
                <textarea
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Summarize the agenda, topics, speakers, or certifications available..."
                  rows={4}
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none resize-none placeholder-[var(--paper-faint)] font-light"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                >
                  {editingEventId ? 'Update Event' : 'Create Event'}
                </button>
                {editingEventId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setEventTitle('');
                      setEventDate('');
                      setEventVenue('');
                      setEventDesc('');
                      setEventStatus('Upcoming');
                      setEventImage('');
                      setEventReport('');
                      setEventStudentCoordinator('');
                    }}
                    className="px-4 py-3 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-bold text-[var(--paper)] bg-white/40 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Events Catalog List & Filters */}
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-[var(--paper)] flex items-center gap-2">
                <CalendarIcon size={20} className="text-[var(--paper-dim)]" /> Events Directory
              </h3>

              {/* Event Filter */}
              <div className="flex bg-[var(--ink-soft)] p-0.5 rounded-lg border border-[var(--paper-hair)] text-[10px] font-mono uppercase">
                {['All', 'Past', 'Ongoing', 'Upcoming'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setEventFilter(status as any)}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                      eventFilter === status ? 'bg-[var(--paper)] text-[var(--ink)] font-semibold' : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="border border-[var(--paper-hair)] border-dashed rounded-2xl p-12 text-center text-[var(--paper-dim)] text-sm">
                No events match this timeline filter.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredEvents.map((ev: ClubEvent) => (
                  <div 
                    key={ev.id}
                    className="bg-black/[0.01] border border-[var(--paper-hair)] rounded-xl p-4 flex flex-col gap-2 hover:border-[var(--paper-faint)] transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="font-semibold text-[var(--paper)] text-sm sm:text-base leading-snug">{ev.title}</h4>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 text-[11px] text-[var(--paper-dim)] mt-1 font-semibold">
                          <span className="flex items-center gap-1 text-[var(--rose)]"><CalendarIcon size={12} /> {ev.date}</span>
                          <span className="flex items-center gap-1"><MapPinIcon size={12} /> {ev.venue}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleEditEventClick(ev)}
                          className="p-1.5 text-[var(--paper-dim)] hover:text-[var(--paper)] rounded transition-colors cursor-pointer"
                          title="Edit Event"
                        >
                          <EditIcon size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="p-1.5 text-[var(--paper-dim)] hover:text-red-600 rounded transition-colors cursor-pointer"
                          title="Delete Event"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[var(--paper-dim)] leading-relaxed line-clamp-2 font-light break-words break-all">{ev.description}</p>

                    <div className="flex justify-between items-center text-[10px] mt-2 border-t border-[var(--paper-hair)] pt-2 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold border uppercase ${
                        ev.status === 'Past' ? 'bg-white/40 text-[var(--paper-faint)] border-[var(--paper-hair)]' :
                        ev.status === 'Ongoing' ? 'bg-emerald-950/10 text-emerald-700 border-emerald-500/20' :
                        'bg-blue-950/10 text-blue-700 border-blue-500/20'
                      }`}>
                        {ev.status}
                      </span>
                      {ev.reportPdf && (
                        <span className="text-[10px] text-[var(--rose)] italic">Contains PDF Report</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIBRARY TAB */}
      {activeTab === 'library' && (
        <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">
          {/* Add Resource Form */}
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-[var(--paper)] mb-4 flex items-center gap-2">
              <PlusIcon size={20} className="text-[var(--paper-dim)]" /> Add Club Resource
            </h3>

            {libError && (
              <div className="mb-4 bg-red-950/10 border border-red-500/20 text-red-700 text-sm px-4 py-2.5 rounded-lg font-semibold">
                {libError}
              </div>
            )}

            <form onSubmit={handleAddResource} className="flex flex-col gap-4 text-xs font-semibold text-[var(--paper-dim)]">
              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Title / Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Dravidian Phonetics Guide"
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="e.g. Workshop Notes, Study Kit"
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Language Coverage</label>
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="e.g. Telugu / Tamil, English"
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Upload Resource Document</label>
                <div className="relative group border border-dashed border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl p-2 bg-black/[0.01] transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[46px]">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setResourceFile(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <PlusIcon size={14} className="text-[var(--paper-dim)] group-hover:text-[var(--paper)] transition-colors mb-0.5" />
                  {resourceFile ? (
                    <div className="text-[10px] text-emerald-700 font-bold truncate max-w-[180px]">
                      Document Loaded!
                    </div>
                  ) : (
                    <div className="text-[10px] text-[var(--paper-faint)] group-hover:text-[var(--paper-dim)] transition-colors">
                      Choose PDF/Doc File
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Access Scope</label>
                <div className="flex gap-4 mt-1 font-semibold text-[var(--paper)]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="access"
                      checked={newAccess === 'Open'}
                      onChange={() => setNewAccess('Open')}
                      className="accent-[var(--paper)]"
                    />
                    Open Public
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="access"
                      checked={newAccess === 'Members'}
                      onChange={() => setNewAccess('Members')}
                      className="accent-[var(--paper)]"
                    />
                    Members Only
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow cursor-pointer"
              >
                Add Resource
              </button>
            </form>
          </div>

          {/* Resources List Table & Filters */}
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold text-[var(--paper)] flex items-center gap-2">
                <BookIcon size={20} className="text-[var(--paper-dim)]" /> Club Resource Library
              </h3>

              {/* Access scope Filter */}
              <div className="flex bg-[var(--ink-soft)] p-0.5 rounded-lg border border-[var(--paper-hair)] text-[10px] font-mono uppercase font-semibold">
                {['All', 'Open', 'Members'].map((scope) => (
                  <button
                    key={scope}
                    onClick={() => setLibFilter(scope as any)}
                    className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                      libFilter === scope ? 'bg-[var(--paper)] text-[var(--ink)] font-bold' : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
                    }`}
                  >
                    {scope === 'Members' ? 'Members-Only' : scope}
                  </button>
                ))}
              </div>
            </div>

            {filteredResources.length === 0 ? (
              <div className="border border-[var(--paper-hair)] border-dashed rounded-2xl p-12 text-center text-[var(--paper-dim)] text-sm">
                No resources match this access filter.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-[var(--paper-hair)] bg-black/[0.01]">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-medium">
                  <thead>
                    <tr className="bg-[var(--ink-soft)] border-b border-[var(--paper-hair)] text-[9px] sm:text-[10px] font-semibold text-[var(--paper-dim)] uppercase tracking-wider font-mono">
                      <th className="p-4">Resource Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Language</th>
                      <th className="p-4">Access</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--paper-hair)] text-[var(--paper)]">
                    {filteredResources.map((res: LibraryResource) => (
                      <tr key={res.id} className="hover:bg-white/50 transition-colors">
                        <td className="p-4 font-semibold text-[var(--paper)]">{res.title}</td>
                        <td className="p-4 text-[var(--paper-dim)]">{res.category}</td>
                        <td className="p-4 text-[var(--paper-dim)]">{res.language}</td>
                        <td className="p-4">
                          <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold uppercase ${
                            res.access === 'Open' 
                              ? 'bg-emerald-950/10 text-emerald-700 border-emerald-500/20' 
                              : 'bg-amber-950/10 text-amber-700 border-amber-500/20'
                          }`}>
                            {res.access}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteResource(res.id)}
                            className="p-1 text-[var(--paper-dim)] hover:text-red-600 rounded transition-colors cursor-pointer"
                            title="Delete Resource"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
          {/* Add / Edit Member Form */}
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm h-fit">
            <h3 className="text-lg font-semibold text-[var(--paper)] mb-4 flex items-center gap-2">
              {editingMemberId ? <EditIcon size={20} className="text-[var(--rose)]" /> : <PlusIcon size={20} className="text-[var(--paper-dim)]" />} 
              {editingMemberId ? 'Edit Core Member' : 'Add Core Member'}
            </h3>

            {memberError && (
              <div className="mb-4 bg-red-950/10 border border-red-500/20 text-red-700 text-sm px-4 py-2.5 rounded-lg font-semibold">
                {memberError}
              </div>
            )}

            <form onSubmit={handleSaveMember} className="flex flex-col gap-4 text-xs font-semibold text-[var(--paper-dim)]">
              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Member Type</label>
                <div className="flex gap-4 mt-1 font-semibold text-[var(--paper)]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="memberType"
                      checked={memberType === 'Student'}
                      onChange={() => setMemberType('Student')}
                      className="accent-[var(--paper)]"
                    />
                    Student
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="memberType"
                      checked={memberType === 'Faculty'}
                      onChange={() => setMemberType('Faculty')}
                      className="accent-[var(--paper)]"
                    />
                    Faculty / Teacher
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Member Name</label>
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Abubakar Siddiq"
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Designation / Role</label>
                <input
                  type="text"
                  value={memberDesignation}
                  onChange={(e) => setMemberDesignation(e.target.value)}
                  placeholder="e.g. President, Creative Lead"
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {memberType === 'Student' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="uppercase tracking-wider">Year of Study</label>
                    <input
                      type="text"
                      value={memberYear}
                      onChange={(e) => setMemberYear(e.target.value)}
                      placeholder="e.g. 4th Year, 3rd Year"
                      className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5" style={{ gridColumn: memberType === 'Faculty' ? 'span 2' : 'span 1' }}>
                  <label className="uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    value={memberDept}
                    placeholder={memberType === 'Faculty' ? "e.g. Humanities, English" : "e.g. CSE, AI & DS, ECE"}
                    onChange={(e) => setMemberDept(e.target.value)}
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Core Member Photo</label>
                <div className="relative group border border-dashed border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl p-3 bg-black/[0.01] transition-all flex flex-col items-center justify-center text-center cursor-pointer min-h-[64px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setMemberAvatar(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {memberAvatar ? (
                    <div className="flex items-center gap-3 w-full">
                      <img src={memberAvatar} className="w-10 h-10 object-cover rounded-full border border-[var(--rose)]/30" alt="Preview" />
                      <div className="text-[10px] text-emerald-700 font-bold truncate">Photo Loaded Successfully!</div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 text-[var(--paper-dim)] mb-1" stroke="currentColor" fill="none" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <div className="text-[10px] text-[var(--paper-faint)] group-hover:text-[var(--paper-dim)] transition-colors">Choose Core Member Photo</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social links inputs */}
              <div className="border-t border-[var(--paper-hair)] pt-4 flex flex-col gap-3">
                <span className="text-[10px] text-[var(--rose)] font-mono uppercase tracking-wider font-bold">Social Handles</span>
                
                <div className="flex flex-col gap-1.5">
                  <label className="uppercase">Instagram URL</label>
                  <input
                    type="url"
                    value={memberInstagram}
                    onChange={(e) => setMemberInstagram(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-3 py-2 text-[var(--paper)] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="uppercase">LinkedIn URL</label>
                  <input
                    type="url"
                    value={memberLinkedIn}
                    onChange={(e) => setMemberLinkedIn(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-3 py-2 text-[var(--paper)] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="uppercase">WhatsApp Link</label>
                  <input
                    type="text"
                    value={memberWhatsApp}
                    onChange={(e) => setMemberWhatsApp(e.target.value)}
                    placeholder="e.g. https://wa.me/91XXXXXXXXXX"
                    className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-3 py-2 text-[var(--paper)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-all cursor-pointer"
                >
                  {editingMemberId ? 'Update Member' : 'Save Member'}
                </button>
                {editingMemberId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMemberId(null);
                      setMemberName('');
                      setMemberDesignation('');
                      setMemberYear('');
                      setMemberDept('');
                      setMemberInstagram('');
                      setMemberLinkedIn('');
                      setMemberWhatsApp('');
                      setMemberType('Student');
                      setMemberAvatar('');
                    }}
                    className="px-4 py-3 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl text-xs font-bold text-[var(--paper)] bg-white/40 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Members List Table */}
          <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[var(--paper)] mb-4 flex items-center gap-2">
              <PlusIcon size={20} className="text-[var(--paper-dim)] animate-pulse" /> Core Members Directory
            </h3>

            {members.length === 0 ? (
              <div className="border border-[var(--paper-hair)] border-dashed rounded-2xl p-12 text-center text-[var(--paper-dim)] text-sm">
                No core members defined yet.
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {members.map((m: ClubMember) => (
                  <div 
                    key={m.id}
                    className="bg-black/[0.01] border border-[var(--paper-hair)] rounded-xl p-4 flex justify-between items-center gap-4 hover:border-[var(--paper-faint)] transition-all"
                  >
                    <div className="min-w-0 font-semibold">
                      <h4 className="font-semibold text-[var(--paper)] text-sm sm:text-base leading-snug">{m.name}</h4>
                      <p className="text-[var(--rose)] text-xs mt-0.5">{m.designation || "Registered Member (Regular)"}</p>
                      
                      <div className="flex items-center gap-2 text-[10px] text-[var(--paper-dim)] mt-2 font-mono">
                        <span>{m.year || 'N/A'}</span>
                        <span>Â·</span>
                        <span>{m.dept || 'N/A'}</span>
                      </div>

                      {/* Social chips display */}
                      <div className="flex gap-2.5 mt-3 text-[10px] font-mono text-[var(--paper-faint)]">
                        {m.instagram && (
                          <a href={m.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--paper)] transition-colors">
                            Instagram
                          </a>
                        )}
                        {m.linkedin && (
                          <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--paper)] transition-colors">
                            LinkedIn
                          </a>
                        )}
                        {m.whatsapp && (
                          <a href={m.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--paper)] transition-colors">
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleEditMemberClick(m)}
                        className="p-1.5 text-[var(--paper-dim)] hover:text-[var(--paper)] rounded transition-colors cursor-pointer"
                        title="Edit Member"
                      >
                        <EditIcon size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(m.id)}
                        className="p-1.5 text-[var(--paper-dim)] hover:text-red-600 rounded transition-colors cursor-pointer"
                        title="Remove Member"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* REGISTRATIONS TAB */}
      {activeTab === 'registrations' && (() => {
        const uniqueEventIds = Array.from(new Set(registrations.map((r: Registration) => r.eventId)));
        const uniqueYears = Array.from(new Set(registrations.map((r: Registration) => r.year).filter(Boolean)));
        const uniqueDepts = Array.from(new Set(registrations.map((r: Registration) => r.dept).filter(Boolean)));
        const eventTitles: Record<string, string> = {};
        events.forEach(ev => { eventTitles[ev.id] = ev.title; });

        const filteredRegs = registrations.filter((r: Registration) => {
          const evMatch = regEventFilter === 'all' || r.eventId === regEventFilter;
          const yrMatch = regYearFilter === 'all' || r.year === regYearFilter;
          const deptMatch = regDeptFilter === 'all' || r.dept === regDeptFilter;
          return evMatch && yrMatch && deptMatch;
        });

        return (
          <div className="flex flex-col gap-6">
            <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[var(--paper)] mb-4 flex items-center gap-2">
                <CalendarIcon size={20} className="text-[var(--paper-dim)]" /> Event Registrations
              </h3>
              <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--paper-dim)]">Event</label>
                  <select value={regEventFilter} onChange={e => setRegEventFilter(e.target.value)} className="bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-lg px-3 py-2 text-[var(--paper)] focus:outline-none text-xs">
                    <option value="all">All Events</option>
                    {uniqueEventIds.map((eid: string) => <option key={eid} value={eid}>{eventTitles[eid] || eid}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--paper-dim)]">Year</label>
                  <select value={regYearFilter} onChange={e => setRegYearFilter(e.target.value)} className="bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-lg px-3 py-2 text-[var(--paper)] focus:outline-none text-xs">
                    <option value="all">All Years</option>
                    {uniqueYears.map((yr: string) => <option key={yr} value={yr}>{yr}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--paper-dim)]">Department</label>
                  <select value={regDeptFilter} onChange={e => setRegDeptFilter(e.target.value)} className="bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-lg px-3 py-2 text-[var(--paper)] focus:outline-none text-xs">
                    <option value="all">All Depts</option>
                    {uniqueDepts.map((dept: string) => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <span className="text-[10px] font-mono text-[var(--paper-dim)] bg-[var(--ink-soft)] px-3 py-2 rounded-lg border border-[var(--paper-hair)]">{filteredRegs.length} found</span>
                </div>
              </div>
              {filteredRegs.length === 0 ? (
                <div className="border border-[var(--paper-hair)] border-dashed rounded-2xl p-12 text-center text-[var(--paper-dim)] text-sm">No registrations match selected filters.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-[var(--paper-hair)]">
                  <table className="w-full text-left border-collapse text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-[var(--ink-soft)] border-b border-[var(--paper-hair)] text-[9px] font-semibold text-[var(--paper-dim)] uppercase tracking-wider font-mono">
                        <th className="p-4">Student</th>
                        <th className="p-4">ID</th>
                        <th className="p-4">Dept</th>
                        <th className="p-4">Year</th>
                        <th className="p-4">Event</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--paper-hair)] text-[var(--paper)]">
                      {filteredRegs.map((reg: Registration) => (
                        <tr key={reg.id} onClick={() => setSelectedReg(reg)} className="hover:bg-white/50 transition-colors cursor-pointer" title="Click to view details / delete">
                          <td className="p-4 font-semibold">{reg.studentName}</td>
                          <td className="p-4 font-mono text-[10px] text-[var(--paper-dim)]">{reg.studentId}</td>
                          <td className="p-4 text-[var(--paper-dim)]">{reg.dept || '-'}</td>
                          <td className="p-4 text-[var(--paper-dim)]">{reg.year || '-'}</td>
                          <td className="p-4 text-[var(--paper-dim)] max-w-[160px] truncate">{eventTitles[reg.eventId] || reg.eventId}</td>
                          <td className="p-4 text-[var(--paper-dim)] font-mono text-[10px]">{getEmailForRegistration(reg)}</td>
                          <td className="p-4 text-[10px] font-mono text-[var(--paper-dim)]">{reg.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Registration Details Modal */}
            {selectedReg && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setSelectedReg(null); }}>
                <div className="bg-[var(--ink)] border border-[var(--paper-hair)] rounded-2xl p-6 max-w-md w-full shadow-2xl">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] text-[var(--rose)] font-mono uppercase tracking-widest block mb-1">Registration Details</span>
                      <h3 className="text-xl font-heading italic text-[var(--paper)] leading-tight">{selectedReg.studentName}</h3>
                    </div>
                    <button onClick={() => setSelectedReg(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--ink-soft)] hover:bg-[var(--ink-card)] text-[var(--paper)] cursor-pointer">
                      <svg viewBox="0 0 24 24" className="w-4 h-4" stroke="currentColor" fill="none" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <div className="flex flex-col gap-4 text-xs">
                    <div className="bg-[var(--ink-soft)] p-4 rounded-xl border border-[var(--paper-hair)] grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] uppercase text-[var(--paper-dim)] block font-mono">Member ID</span>
                        <span className="font-semibold text-sm text-[var(--paper)]">{selectedReg.studentId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[var(--paper-dim)] block font-mono">Event Name</span>
                        <span className="font-semibold text-sm text-[var(--paper)]">{eventTitles[selectedReg.eventId] || selectedReg.eventId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[var(--paper-dim)] block font-mono">Department</span>
                        <span className="font-semibold text-sm text-[var(--paper)]">{selectedReg.dept || "-"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[var(--paper-dim)] block font-mono">Academic Year</span>
                        <span className="font-semibold text-sm text-[var(--paper)]">{selectedReg.year || "-"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase text-[var(--paper-dim)] block font-mono">Email Address</span>
                        <span className="font-mono text-xs text-[var(--rose)] font-bold">{getEmailForRegistration(selectedReg)}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] uppercase text-[var(--paper-dim)] block font-mono">Registered On</span>
                        <span className="font-semibold text-[var(--paper)]">{selectedReg.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button
                        onClick={() => {
                          handleDeleteRegistration(selectedReg.id);
                          setSelectedReg(null);
                        }}
                        className="flex-1 py-3 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 transition-all cursor-pointer text-center text-xs uppercase tracking-wider"
                      >
                        Delete Registration
                      </button>
                      <button onClick={() => setSelectedReg(null)} className="flex-1 py-3 border border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl font-semibold text-[var(--paper)] bg-white/40 transition-all cursor-pointer text-xs">Close</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

