
import React, { useState } from 'react';
import { User, UserRole, Report, ReportType, ReportStatus, Project } from '../types';
import { REPORT_ICONS } from '../constants';
import { X, Loader2, Camera, MessageSquare, Check } from 'lucide-react';
import { generateReportDraft } from '../geminiService';

interface FieldWorkProps {
  user: User;
  projects: Project[];
  reports: Report[];
  onAddReport: (r: Report) => void;
  onUpdateReport: (r: Report) => void;
}

const FieldWorkView: React.FC<FieldWorkProps> = ({ user, projects, reports, onAddReport, onUpdateReport }) => {
  const [showEditor, setShowEditor] = useState(false);
  const [editingType, setEditingType] = useState<ReportType | null>(null);
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tab, setTab] = useState<'write' | 'review'>(user.role === UserRole.CHIEF ? 'review' : 'write');

  const canWrite = (type: ReportType) => {
    if (user.role === UserRole.ASSISTANT) return type === ReportType.DAILY_LOG;
    if (user.role === UserRole.ENGINEER) return [ReportType.DAILY_LOG, ReportType.SIDE_STATION, ReportType.WITNESS, ReportType.NOTICE].includes(type);
    if (user.role === UserRole.CHIEF) return true;
    return false;
  };

  const handleAISuggest = async () => {
    if (!editingType) return;
    setIsGenerating(true);
    const draft = await generateReportDraft(editingType, "施工现场正常进行，安全防护到位");
    setContent(draft);
    setIsGenerating(false);
  };

  const handleSubmit = () => {
    if (!editingType) return;
    onAddReport({
      id: `R${Date.now()}`,
      type: editingType,
      projectId: user.projectId || 'P001',
      authorId: user.id,
      authorName: user.name,
      content,
      details: {},
      date: new Date().toISOString().split('T')[0],
      status: ReportStatus.PENDING,
      isImportant: editingType === ReportType.MAJOR_EVENT
    });
    setShowEditor(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex bg-slate-200/50 p-1 rounded-2xl">
        {(user.role === UserRole.CHIEF || user.role === UserRole.LEADER) && (
          <button onClick={() => setTab('review')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'review' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>待我审批</button>
        )}
        <button onClick={() => setTab('write')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tab === 'write' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}>现场填报</button>
      </div>

      {tab === 'write' && (
        <div className="grid grid-cols-2 gap-4">
          {Object.values(ReportType).map(type => canWrite(type) && (
            <button key={type} onClick={() => { setEditingType(type); setContent(''); setShowEditor(true); }} className="bg-white p-6 rounded-[32px] border border-slate-100 flex flex-col items-center gap-2 active:scale-95 transition-all">
              <div className="p-3 bg-slate-50 rounded-2xl">{REPORT_ICONS[type]}</div>
              <span className="text-[10px] font-black text-slate-700">{type}</span>
            </button>
          ))}
        </div>
      )}

      {tab === 'review' && (
        <div className="space-y-3">
          {reports.filter(r => r.status === ReportStatus.PENDING).map(r => (
            <div key={r.id} className="bg-white p-5 rounded-[24px] border border-slate-50 shadow-sm flex justify-between items-center">
              <div>
                <div className="text-xs font-black text-slate-800">{r.type}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase">{r.authorName} · {r.date}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onUpdateReport({...r, status: ReportStatus.APPROVED})} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg"><Check className="w-4 h-4" /></button>
                <button onClick={() => onUpdateReport({...r, status: ReportStatus.REJECTED})} className="p-2 bg-slate-100 text-slate-400 rounded-xl"><X className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-end">
          <div className="bg-white w-full rounded-t-[40px] p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black">{editingType}</h3>
              <button onClick={() => setShowEditor(false)}><X /></button>
            </div>
            <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="写下监理发现的情况..." className="w-full h-40 bg-slate-50 p-4 rounded-2xl text-sm border-none outline-none" />
            <div className="flex justify-between items-center">
               <button className="flex items-center gap-2 text-slate-400 text-xs font-bold"><Camera className="w-4 h-4" /> 现场拍照</button>
               <button onClick={handleAISuggest} disabled={isGenerating} className="text-blue-600 bg-blue-50 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1">
                 {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <MessageSquare className="w-3 h-3" />} AI 润色
               </button>
            </div>
            <button onClick={handleSubmit} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-200">提交审核</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldWorkView;
