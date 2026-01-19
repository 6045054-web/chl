
import React, { useState, useEffect } from 'react';
import { Project, User, UserRole, Announcement, AttendanceRecord, Report, ReportStatus, ReportType } from '../types';
import { 
  Building2, Users, Megaphone, Plus, Trash2, UserPlus, AlertTriangle, 
  CheckCircle2, ShieldCheck, UserCheck, Zap, MessageCircle, X, Send, 
  PieChart, Save, Loader2, Info, Activity, Database, ChevronRight, Edit3,
  MapPin
} from 'lucide-react';
import { dbService } from '../dbService';
import { summarizeSafetyHazards } from '../geminiService';

interface AdminProps {
  initialTab?: 'projects' | 'users' | 'ann' | 'attendance' | 'reports';
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  attendanceSummary: AttendanceRecord[];
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  onPublishAnnouncement: (ann: Announcement) => void;
  importantReports: Report[];
  onUpdateReport: (report: Report) => void;
}

const AdminView: React.FC<AdminProps> = ({ 
  initialTab = 'reports', 
  projects, setProjects, 
  users, setUsers, 
  attendanceSummary, 
  announcements, setAnnouncements, 
  onPublishAnnouncement, 
  importantReports,
  onUpdateReport
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'projects' | 'users' | 'ann' | 'attendance' | 'reports'>(initialTab);
  const [showModal, setShowModal] = useState<'project' | 'user' | 'ann' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState('');

  // 表单临时状态
  const [projectForm, setProjectForm] = useState<Partial<Project>>({ status: 'IN_PROGRESS' });
  const [userForm, setUserForm] = useState<Partial<User>>({ role: UserRole.ENGINEER });
  const [annForm, setAnnForm] = useState<Partial<Announcement>>({ title: '', content: '' });

  useEffect(() => { 
    if (initialTab) setActiveSubTab(initialTab); 
  }, [initialTab]);

  // 保存项目
  const handleSaveProject = async () => {
    if (!projectForm.name) return;
    const newProj = { ...projectForm, id: projectForm.id || `P${Date.now()}` } as Project;
    await dbService.saveProject(newProj);
    setProjects(prev => {
        const index = prev.findIndex(p => p.id === newProj.id);
        if (index > -1) return prev.map(p => p.id === newProj.id ? newProj : p);
        return [...prev, newProj];
    });
    setShowModal(null);
  };

  // 保存人员
  const handleSaveUser = async () => {
    if (!userForm.username || !userForm.password) return;
    const newUser = { ...userForm, id: userForm.id || `U${Date.now()}` } as User;
    await dbService.saveUser(newUser);
    setUsers(prev => {
        const index = prev.findIndex(u => u.id === newUser.id);
        if (index > -1) return prev.map(u => u.id === newUser.id ? newUser : u);
        return [...prev, newUser];
    });
    setShowModal(null);
  };

  // 发布公告
  const handleSaveAnn = async () => {
    if (!annForm.title) return;
    const newAnn = { 
        ...annForm, 
        id: `A${Date.now()}`, 
        publishDate: new Date().toISOString().split('T')[0],
        author: '管理总部'
    } as Announcement;
    await dbService.saveAnnouncement(newAnn);
    onPublishAnnouncement(newAnn);
    setShowModal(null);
  };

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in">
      {/* 顶部决策面板 */}
      <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-widest">
                <Zap className="w-5 h-5 text-blue-400" /> AI 风险预警中心
              </h3>
              <button 
                onClick={async () => {
                    setIsLoading(true);
                    const result = await summarizeSafetyHazards(importantReports);
                    setAiSummary(result);
                    setIsLoading(false);
                }} 
                disabled={isLoading || importantReports.length === 0} 
                className="bg-blue-600 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 disabled:opacity-30 flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : <><Activity className="w-4 h-4" /> 深度研判</>}
              </button>
            </div>
            {aiSummary ? (
              <div className="bg-white/5 border border-white/10 p-5 rounded-3xl text-xs leading-relaxed font-medium text-slate-300 animate-in fade-in border-l-4 border-l-blue-500">
                {aiSummary}
              </div>
            ) : (
              <div className="flex items-center gap-3 text-slate-500 bg-white/5 p-5 rounded-3xl border border-white/5">
                <Info className="w-5 h-5 text-blue-400" />
                <p className="text-[11px] font-bold">
                  {importantReports.length > 0 
                    ? `检测到 ${importantReports.length} 个重大风险点需立即处理。` 
                    : '当前所有项目运行平稳，暂无重大安全预警。'}
                </p>
              </div>
            )}
        </div>
      </div>

      {/* 模块切换导航 */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 px-1">
        {[
          { id: 'reports', label: '待办审批', icon: CheckCircle2 },
          { id: 'projects', label: '项目档案', icon: Building2 },
          { id: 'users', label: '人员架构', icon: Users },
          { id: 'ann', label: '公告管理', icon: Megaphone },
          { id: 'attendance', label: '考勤全景', icon: PieChart },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 rounded-[24px] text-[11px] font-black transition-all shrink-0 ${
              activeSubTab === tab.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <div className="space-y-4">
        {/* 1. 事项审批 */}
        {activeSubTab === 'reports' && (
          <div className="space-y-4">
            {importantReports.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-slate-200 opacity-40">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">所有重大事项已办结</p>
                </div>
            )}
            {importantReports.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-[36px] border border-slate-50 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-inner">
                        <AlertTriangle className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800">{r.details?.eventCategory || '风险报告'}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{r.authorName} · {r.date}</p>
                    </div>
                  </div>
                  <span className="bg-red-600 text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{r.details?.urgency || '特急'}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl italic">"{r.details?.eventDesc || r.content}"</p>
                <div className="flex gap-2">
                  <button onClick={() => onUpdateReport({ ...r, status: ReportStatus.APPROVED })} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">核准指令下达</button>
                  <button onClick={() => onUpdateReport({ ...r, status: ReportStatus.REJECTED, auditComment: '需补充现场照片和具体防范方案' })} className="px-6 bg-slate-100 text-slate-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95">驳回</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 2. 项目管理 */}
        {activeSubTab === 'projects' && (
          <div className="space-y-4">
            <button onClick={() => { setProjectForm({status: 'IN_PROGRESS'}); setShowModal('project'); }} className="w-full bg-blue-50 text-blue-600 py-5 rounded-[24px] border-2 border-dashed border-blue-200 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                <Plus className="w-5 h-5" /> 新增监理项目档案
            </button>
            {projects.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800">{p.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><MapPin className="w-3 h-3" />{p.location}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => { setProjectForm(p); setShowModal('project'); }} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={async () => { if(confirm('确定删除项目？')) { await dbService.deleteProject(p.id); setProjects(prev => prev.filter(it => it.id !== p.id)); } }} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. 人员管理 */}
        {activeSubTab === 'users' && (
          <div className="space-y-4">
            <button onClick={() => { setUserForm({role: UserRole.ENGINEER}); setShowModal('user'); }} className="w-full bg-emerald-50 text-emerald-600 py-5 rounded-[24px] border-2 border-dashed border-emerald-200 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                <UserPlus className="w-5 h-5" /> 录入新监理人员
            </button>
            {users.map(u => (
              <div key={u.id} className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800">{u.name} <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded text-slate-400 ml-2">{u.role}</span></h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">工号: {u.username} · 项目ID: {u.projectId || '待分配'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => { setUserForm(u); setShowModal('user'); }} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={async () => { if(confirm('确定注销此人员？')) { await dbService.deleteUser(u.id); setUsers(prev => prev.filter(it => it.id !== u.id)); } }} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. 考勤监控 */}
        {activeSubTab === 'attendance' && (
          <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">今日出勤</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{new Set(attendanceSummary.map(a => a.userId)).size}</p>
                  </div>
                  <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">活跃项目</p>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{new Set(attendanceSummary.map(a => a.projectId)).size}</p>
                  </div>
              </div>
              <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                  <div className="p-4 bg-slate-50 border-b border-slate-100">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500">实时考勤流 (前20条)</h5>
                  </div>
                  <div className="divide-y divide-slate-50">
                      {attendanceSummary.slice(0, 20).map(a => (
                          <div key={a.id} className="p-4 flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-700">{a.userName}</span>
                              <span className="text-slate-400">{a.type === 'CLOCK_IN' ? '签到' : '签退'}</span>
                              <span className="text-blue-500 font-mono text-[10px]">{a.time.split(' ')[1]}</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
        )}

        {/* 5. 公告发布列表 */}
        {activeSubTab === 'ann' && (
          <div className="space-y-4">
               <button onClick={() => { setAnnForm({title: '', content: ''}); setShowModal('ann'); }} className="w-full bg-slate-900 text-white py-5 rounded-[24px] shadow-xl flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">
                  <Megaphone className="w-5 h-5 text-blue-400" /> 发布全员通知
              </button>
              {announcements.map(ann => (
                <div key={ann.id} className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-slate-800">{ann.title}</h4>
                      <span className="text-[9px] text-slate-400 font-bold">{ann.publishDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* 各种弹窗 */}
      {showModal === 'project' && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
           <div className="bg-white w-full max-w-sm rounded-t-[40px] sm:rounded-[40px] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20">
              <div className="flex justify-between items-center"><h3 className="text-xl font-black">项目信息</h3><button onClick={() => setShowModal(null)}><X /></button></div>
              <input value={projectForm.name || ''} onChange={e => setProjectForm({...projectForm, name: e.target.value})} placeholder="项目名称" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20" />
              <input value={projectForm.location || ''} onChange={e => setProjectForm({...projectForm, location: e.target.value})} placeholder="地理位置" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none focus:ring-2 focus:ring-blue-500/20" />
              <button onClick={handleSaveProject} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-200">确认保存</button>
           </div>
        </div>
      )}

      {showModal === 'user' && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
           <div className="bg-white w-full max-w-sm rounded-t-[40px] sm:rounded-[40px] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20">
              <div className="flex justify-between items-center"><h3 className="text-xl font-black">人员档案</h3><button onClick={() => setShowModal(null)}><X /></button></div>
              <input value={userForm.name || ''} onChange={e => setUserForm({...userForm, name: e.target.value})} placeholder="姓名" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none" />
              <input value={userForm.username || ''} onChange={e => setUserForm({...userForm, username: e.target.value})} placeholder="登录工号" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none" />
              <input value={userForm.password || ''} onChange={e => setUserForm({...userForm, password: e.target.value})} placeholder="登录密码" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold border-none outline-none" />
              <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as UserRole})} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none">
                <option value={UserRole.ENGINEER}>监理工程师 (专监)</option>
                <option value={UserRole.CHIEF}>总监理工程师 (总监)</option>
                <option value={UserRole.LEADER}>公司领导 (管理层)</option>
              </select>
              <select value={userForm.projectId || ''} onChange={e => setUserForm({...userForm, projectId: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none">
                <option value="">待分配项目 (领导可不选)</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button onClick={handleSaveUser} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200">确认保存</button>
           </div>
        </div>
      )}

      {showModal === 'ann' && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
           <div className="bg-white w-full max-w-sm rounded-t-[40px] sm:rounded-[40px] p-8 space-y-6 shadow-2xl animate-in slide-in-from-bottom-20">
              <div className="flex justify-between items-center"><h3 className="text-xl font-black">发布公告</h3><button onClick={() => setShowModal(null)}><X /></button></div>
              <input value={annForm.title} onChange={e => setAnnForm({...annForm, title: e.target.value})} placeholder="公告标题" className="w-full p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" />
              <textarea value={annForm.content} onChange={e => setAnnForm({...annForm, content: e.target.value})} placeholder="通知内容正文..." className="w-full h-40 p-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none resize-none" />
              <button onClick={handleSaveAnn} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">立即全员发布</button>
           </div>
        </div>
      )}

      {/* 底部装饰 */}
      <div className="text-center py-6 opacity-20 flex flex-col items-center gap-1">
          <Database className="w-4 h-4" />
          <p className="text-[8px] font-black uppercase tracking-[4px]">Xinjiang Chenghui Data Center</p>
      </div>
    </div>
  );
};

export default AdminView;
