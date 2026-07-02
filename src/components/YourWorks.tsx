import React, { useState, useEffect, useRef } from 'react';
import { UploadIcon, FileIcon, ClockIcon, BookIcon } from './Icons';
import { supabase } from '../supabaseClient';


interface Work {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  category: 'Stories' | 'Poetries' | 'Publications';
  fileName: string;
  fileSize: string;
  content: string; // Stored text content or file preview description
  timestamp: string;
  status: 'Pending' | 'Reviewed' | 'Approved';
}

interface YourWorksProps {
  member: {
    id: string;
    fullName: string;
  };
}

export default function YourWorks({ member }: YourWorksProps) {
  const [works, setWorks] = useState<Work[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Stories' | 'Poetries' | 'Publications'>('Stories');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadWorks();
  }, []);

  const loadWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('works')
        .select('*')
        .eq('student_id', member.id)
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
          status: w.status,
        })));
      }
    } catch (err) {
      console.error(err);
      setWorks([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!title.trim()) {
      setError('Please enter a title for your work.');
      return;
    }
    if (!selectedFile) {
      setError('Please upload a document file containing your work.');
      return;
    }

    const fileSizeStr = (selectedFile.size / 1024).toFixed(1) + ' KB';
    const fileName = selectedFile.name;

    const reader = new FileReader();
    reader.onload = (event) => {
      const textResult = event.target?.result as string;
      const fileTextContent = textResult || `Binary document upload [${selectedFile.type}]`;

      const newWork = {
        id: `WORK-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        student_id: member.id,
        student_name: member.fullName,
        title: title.trim(),
        category,
        file_name: fileName,
        file_size: fileSizeStr,
        content: fileTextContent || 'No preview available',
        timestamp: new Date().toLocaleString(),
        status: 'Pending',
      };

      const saveWork = async () => {
        try {
          const { error: insertError } = await supabase
            .from('works')
            .insert([newWork]);

          if (insertError) {
            setError(insertError.message || 'Failed to save file. Please try again.');
            return;
          }

          setTitle('');
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = '';
          setMessage('Your document has been uploaded and submitted for review!');
          loadWorks();
        } catch {
          setError('Failed to save file. Please try a smaller document.');
        }
      };

      saveWork();
    };

    reader.onerror = () => {
      setError('Error reading file. Please try another document.');
    };

    if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
      reader.readAsText(selectedFile);
    } else {
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24 select-none">
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold tracking-tight text-[var(--paper)] font-serif" style={{ fontFamily: "'Instrument Serif', serif" }}>
          Your <em className="not-italic text-[var(--paper-dim)]">Creative Portfolio</em>
        </h2>
        <p className="text-[var(--paper-dim)] text-xs sm:text-sm mt-1 font-medium">
          Upload document files (PDF, DOCX, TXT, MD) containing your poetry, stories, or translations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8">
        {/* Upload Form */}
        <div className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-2xl p-6 shadow-sm h-fit">
          <h3 className="text-lg font-semibold text-[var(--paper)] mb-4 flex items-center gap-2">
            <UploadIcon size={20} className="text-[var(--paper-dim)]" /> Submit Document
          </h3>

          {message && (
            <div className="mb-4 bg-emerald-950/10 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-center gap-2 font-medium">
              <span className="text-emerald-600 font-bold">✓</span> {message}
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-950/10 border border-red-500/20 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs font-semibold text-[var(--paper-dim)]">
            <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_0.8fr] gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Title of Work</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Whispers of the Old Banyan"
                  className="bg-white/40 border border-[var(--paper-hair)] rounded-xl px-4 py-2.5 text-[var(--paper)] placeholder-[var(--paper-faint)] focus:outline-none focus:border-[var(--paper-faint)]"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-[var(--ink-soft)] border border-[var(--paper-hair)] rounded-xl px-3 py-2.5 text-[var(--paper)] focus:outline-none focus:border-[var(--paper-faint)] cursor-pointer font-bold"
                >
                  <option value="Stories">Stories</option>
                  <option value="Poetries">Poetry</option>
                  <option value="Publications">Publication</option>
                </select>
              </div>
            </div>

            {/* File Upload Field */}
            <div className="flex flex-col gap-1.5">
              <label className="uppercase tracking-wider">Upload File (PDF, DOCX, TXT, MD)</label>
              <div className="relative group border border-dashed border-[var(--paper-hair)] hover:border-[var(--paper-faint)] rounded-xl p-6 bg-black/[0.02] transition-all flex flex-col items-center justify-center text-center cursor-pointer">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.doc,.txt,.md"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required
                />
                <UploadIcon size={24} className="text-[var(--paper-dim)] group-hover:text-[var(--paper)] transition-colors mb-2" />
                {selectedFile ? (
                  <div className="text-xs text-[var(--paper)] font-bold">
                    <span className="text-[var(--rose)]">{selectedFile.name}</span> ({ (selectedFile.size / 1024).toFixed(1) } KB)
                  </div>
                ) : (
                  <div className="text-xs text-[var(--paper-faint)] group-hover:text-[var(--paper-dim)] transition-colors">
                    Click to browse files or drag here
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 bg-[var(--paper)] text-[var(--ink)] font-bold rounded-xl py-3 text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow cursor-pointer"
            >
              Upload & Submit
            </button>
          </form>
        </div>

        {/* Existing Works List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-[var(--paper)] flex items-center gap-2">
            <BookIcon size={20} className="text-[var(--paper-dim)]" /> Your Submissions ({works.length})
          </h3>

          {works.length === 0 ? (
            <div className="border border-[var(--paper-hair)] border-dashed rounded-2xl p-8 text-center text-[var(--paper-dim)] text-xs leading-relaxed">
              No files uploaded yet. Submit your first piece to showcase it!
            </div>
          ) : (
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {works.map((work) => (
                <div 
                  key={work.id}
                  className="bg-[var(--ink-card)] border border-[var(--paper-hair)] rounded-xl p-4 flex flex-col gap-2 hover:border-[var(--paper-faint)] transition-all"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-semibold text-[var(--paper)] truncate text-sm sm:text-base leading-snug">{work.title}</h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded border font-mono font-bold uppercase ${
                      work.category === 'Stories' ? 'bg-blue-950/10 text-blue-700 border-blue-500/20' :
                      work.category === 'Poetries' ? 'bg-purple-950/10 text-purple-700 border-purple-500/20' :
                      'bg-[#c9a84c]/20 text-[#8c6b21] border-[#c9a84c]/40'
                    }`}>
                      {work.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--paper-dim)] mt-1">
                    <FileIcon size={12} className="text-[var(--rose)]" />
                    <span className="truncate max-w-[200px]" title={work.fileName}>{work.fileName}</span>
                    <span className="text-[10px] opacity-60">({work.fileSize})</span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-[var(--paper-dim)] mt-2 border-t border-[var(--paper-hair)] pt-2 font-mono">
                    <span className="flex items-center gap-1"><ClockIcon size={12} /> {work.timestamp}</span>
                    <span className={`font-semibold ${
                      work.status === 'Approved' ? 'text-emerald-700' :
                      work.status === 'Reviewed' ? 'text-blue-700' :
                      'text-amber-700'
                    }`}>
                      {work.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
