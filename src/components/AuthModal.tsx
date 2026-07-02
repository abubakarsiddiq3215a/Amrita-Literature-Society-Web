import { useState, useEffect } from 'react';
import { XIcon } from './Icons';

interface AuthModalProps {
  onSuccess: (member: any) => void;
  onClose: () => void;
}

export default function AuthModal({ onSuccess, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  // Login State
  const [loginId, setLoginId] = useState('');
  const [loginName, setLoginName] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [dept, setDept] = useState('');
  const [section, setSection] = useState('');
  const [year, setYear] = useState('');
  const [spec, setSpec] = useState('');
  const [signupError, setSignupError] = useState('');

  const [sectionsList, setSectionsList] = useState<string[]>([]);

  // Update dynamic sections list based on dept
  useEffect(() => {
    if (dept === 'CSE') {
      setSectionsList(['Section A', 'Section B', 'Section C']);
    } else if (dept === 'AI&DS' || dept === 'ECE') {
      setSectionsList(['Section A']);
    } else {
      setSectionsList([]);
    }
    setSection('');
  }, [dept]);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    const emailTrim = val.trim();
    const parts = emailTrim.split('@');
    const possibleRoll = parts[0].toUpperCase();
    if (possibleRoll) {
      setRollNo(possibleRoll);
      const regex = /^NC\.(?:SC|EN)\.U(\d)([A-Z]+)(\d{2}\d{3})$/i;
      const match = possibleRoll.match(regex);
      if (match) {
        const batchNum = match[1];
        const deptCode = match[2].toUpperCase();
        if (deptCode === 'CSE') setDept('CSE');
        else if (deptCode === 'AID') setDept('AI&DS');
        else if (deptCode === 'ECE') setDept('ECE');
        if (batchNum === '4') setYear('3rd Year');
        else if (batchNum === '5') setYear('2nd Year');
        else if (batchNum === '6') setYear('1st Year');
        else setYear('4th Year');
      }
    }
  };

  const handleRollChange = (val: string) => {
    const rollUpper = val.trim().toUpperCase();
    setRollNo(rollUpper);
    setEmail(rollUpper ? `${rollUpper}@NC.STUDENTS.AMRITA.EDU` : '');
    const regex = /^NC\.(?:SC|EN)\.U(\d)([A-Z]+)(\d{2}\d{3})$/i;
    const match = rollUpper.match(regex);
    if (match) {
      const batchNum = match[1];
      const deptCode = match[2].toUpperCase();
      if (deptCode === 'CSE') setDept('CSE');
      else if (deptCode === 'AID') setDept('AI&DS');
      else if (deptCode === 'ECE') setDept('ECE');
      if (batchNum === '4') setYear('3rd Year');
      else if (batchNum === '5') setYear('2nd Year');
      else if (batchNum === '6') setYear('1st Year');
      else setYear('4th Year');
    }
  };

  const getMembers = () => {
    try {
      const stored = localStorage.getItem('alsMembers');
      if (stored) {
        // Find if it is array or object format
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // convert list to key-value object map
          const map: any = {};
          parsed.forEach((m: any) => {
            map[m.id] = m;
          });
          return map;
        }
        return parsed;
      }
      return {};
    } catch {
      return {};
    }
  };

  const saveMembers = (membersMap: any) => {
    // convert map back to list format to stay synchronized with admin panel and other lists
    const membersList = Object.values(membersMap);
    localStorage.setItem('alsMembers', JSON.stringify(membersList));
  };

  const generateAlsId = (roll: string) => {
    const clean = roll.trim().toUpperCase();
    const match = clean.match(/\d{5}$/);
    if (match) {
      return `ALS-${match[0]}`;
    }
    const num = String(Math.floor(10000 + Math.random() * 89999));
    return `ALS-${num}`;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const formattedId = loginId.trim().toUpperCase();
    const formattedName = loginName.trim().toLowerCase();

    if (!formattedId) {
      setLoginError('Please enter your Member ID.');
      return;
    }

    const members = getMembers();

    // Check for ADMIN login
    if (formattedId === 'ADMIN' && (formattedName === 'admin' || !formattedName)) {
      const adminMember = {
        id: 'ADMIN',
        fullName: 'Admin',
        first: 'Admin',
        last: 'Officer',
        dept: 'Linguistics Council',
        sec: 'Headquarters',
        year: 'Senior Fellow',
        spec: 'System Director',
        isAdmin: true,
      };
      onSuccess(adminMember);
      return;
    }

    const member = members[formattedId];
    if (!member) {
      setLoginError('Member ID not found. Please try again or join now.');
      return;
    }

    // Validate name ONLY if provided (making name optional)
    if (formattedName && member.name.toLowerCase() !== formattedName && member.fullName?.toLowerCase() !== formattedName) {
      setLoginError('The name entered does not match our records for this Member ID.');
      return;
    }

    // Standardize naming
    const normalized = {
      ...member,
      fullName: member.fullName || member.name,
      first: member.first || member.name.split(' ')[0],
      last: member.last || member.name.split(' ').slice(1).join(' ') || 'Fellow'
    };

    onSuccess(normalized);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!firstName.trim() || !lastName.trim()) {
      setSignupError('Please enter both your first and last name.');
      return;
    }
    if (!email.trim()) {
      setSignupError('Please enter your email address.');
      return;
    }
    if (!rollNo.trim()) {
      setSignupError('Please enter your roll number.');
      return;
    }
    if (!dept) {
      setSignupError('Please select your department.');
      return;
    }
    if (!section) {
      setSignupError('Please select your section.');
      return;
    }
    if (!year) {
      setSignupError('Please select your year.');
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;
    const id = generateAlsId(rollNo);
    const newMember = {
      id,
      name: fullName,
      fullName,
      first: firstName.trim(),
      last: lastName.trim(),
      email: email.trim(),
      rollNo: rollNo.trim().toUpperCase(),
      dept,
      sec: section,
      year,
      spec: spec.trim() || 'Creative Writing & Literature',
      isAdmin: false,
    };

    const members = getMembers();
    members[id] = newMember;
    saveMembers(members);
    onSuccess(newMember);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Main Auth Container */}
      <div className="relative z-10 w-full max-w-[460px] bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-8 shadow-2xl flex flex-col">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[var(--paper-dim)] hover:text-[var(--paper)] hover:bg-black/5 rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <XIcon size={18} />
        </button>

        {/* Header */}
        <div className="text-center mb-6 select-none">
          <div className="text-xl font-bold tracking-wide flex items-center justify-center gap-2 mb-1 font-serif italic">
            <span className="text-[var(--rose)] text-2xl">✦</span> Amrita Literature Society
          </div>
          <p className="text-[9px] text-[var(--paper-dim)] tracking-widest uppercase font-mono">Member Portal</p>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-2 border border-[var(--paper-hair)] p-1 rounded-xl mb-6 bg-[var(--ink-soft)] font-mono text-xs">
          <button
            onClick={() => {
              setActiveTab('login');
              setLoginError('');
            }}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[var(--paper)] shadow-sm'
                : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setSignupError('');
            }}
            className={`py-2 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-white text-[var(--paper)] shadow-sm'
                : 'text-[var(--paper-dim)] hover:text-[var(--paper)]'
            }`}
          >
            Join Now
          </button>
        </div>

        {/* Form rendering */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            {loginError && (
              <div className="bg-red-950/10 border border-red-500/20 text-red-700 text-xs px-4 py-2.5 rounded-lg">
                {loginError}
              </div>
            )}
            
            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Member ID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="e.g. ALS-2026-48291 or ADMIN"
                className="w-full bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-3 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)] transition-all"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Full Name <span className="text-[10px] text-[var(--paper-faint)] lowercase">(optional)</span></label>
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                placeholder="Your registered name"
                className="w-full bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-3 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow cursor-pointer"
            >
              Sign In →
            </button>

            <div className="text-center text-xs text-[var(--paper-dim)] mt-4">
              Not a member yet?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-[var(--paper)] underline font-semibold hover:text-[var(--rose)] cursor-pointer"
              >
                Create an ID Card
              </button>
            </div>
            
            <div className="border-t border-[var(--paper-hair)] mt-4 pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setLoginId('ADMIN');
                  setLoginName('Admin');
                }}
                className="text-[10px] text-[var(--paper-faint)] hover:text-[var(--paper)] tracking-wider uppercase transition-colors"
              >
                Quick Admin Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            {signupError && (
              <div className="bg-red-950/10 border border-red-500/20 text-red-700 text-xs px-4 py-2.5 rounded-lg">
                {signupError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. ABUBAKAR"
                  className="w-full bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-3 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. SIDDIQ"
                  className="w-full bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-3 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Roll Number</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => handleRollChange(e.target.value)}
                  placeholder="e.g. NC.SC.U4CSE24229"
                  className="w-full bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-3 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  placeholder="e.g. NC.SC.U4CSE24229@NC.STUDENTS.AMRITA.EDU"
                  className="w-full bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-3 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Department</label>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-xl px-3 py-3 text-[var(--paper)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                >
                  <option value="" className="text-[var(--paper-faint)]">e.g. CSE</option>
                  <option value="CSE">CSE</option>
                  <option value="AI&DS">AI & DS</option>
                  <option value="ECE">ECE</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  disabled={!dept}
                  className="w-full bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-xl px-3 py-3 text-[var(--paper)] focus:outline-none focus:border-[var(--paper-faint)] disabled:opacity-40"
                  required
                >
                  <option value="">e.g. C Section</option>
                  {sectionsList.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Academic Year</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-xl px-3 py-3 text-[var(--paper)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                >
                  <option value="">e.g. 3rd Year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <label className="font-semibold text-[var(--paper-dim)] uppercase tracking-wider">Literary Focus</label>
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => setSpec(e.target.value)}
                  placeholder="e.g. Poetry, Fiction"
                  className="w-full bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-3 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow cursor-pointer"
            >
              Generate ID & Join →
            </button>

            <div className="text-center text-xs text-[var(--paper-dim)] mt-4">
              Already have an ID?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-[var(--paper)] underline font-semibold hover:text-[var(--rose)] cursor-pointer"
              >
                Sign In here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
