
import React, { useState } from 'react';
import { User, Announcement, UserRole } from '../types';
import { FileCheck, ClipboardList, Activity, ClipboardCheck, Users, Lock, Building2, ShieldCheck, Megaphone, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  projectName?: string;
  announcements: Announcement[];
  stats: { pending: number; total: number; important?: number };
  onNavigate: (tab: string) => void;
  onNavigateToAdminSub?: (sub: 'projects' | 'users' | 'ann' | 'attendance' | 'reports') => void;
  onUpdatePassword: (newPass: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, projectName, announcements, stats, onNavigate, onNavigateToAdminSub, onUpdatePassword }) => {
  const isLeader = user.role === UserRole.LEADER;
  const isChief = user.role === UserRole.CHIEF;
  
  // 根据角色展示不同的快捷操作
  const getQuickActions = () => {
    if (isLeader) return [
      { label: '风险预警', icon: ShieldCheck, color: 'bg-red-50 text-red-600', tab: 'audit' },
      { label: '全员考勤', icon: Users, color: 'bg-indigo-50 text-indigo-600', tab: 'staff_attendance' },
      { label: '发布公告', icon: Megaphone, color: 'bg-blue-50 text-blue-600', adminSub: 'ann' },
      { label: '档案管理', icon: Building2, color: 'bg-slate-50 text-slate-600', adminSub: 'projects' },
    ];
    if (isChief) return [
      { label: '待办审批', icon: ClipboardCheck, color: 'bg-orange-50 text-orange-600', tab: 'field' },
      { label: '项目台账', icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600', tab: 'ledger' },
      { label: '现场办公', icon: FileCheck, color: 'bg-blue-50 text-blue-600', tab: 'field' },
      { label: '智慧考勤', icon: Activity, color: 'bg-violet-50 text-violet-600', tab: 'attendance' },
    ];
    // 监理员与工程师
    return [
      { label: '现场填报', icon: FileCheck, color: 'bg-blue-50 text-blue-600', tab: 'field' },
      { label: '数字台账', icon: ClipboardList, color: 'bg-emerald-50 text-emerald-600', tab: 'ledger' },
      { label: '入场签到', icon: Activity, color: 'bg-violet-50 text-violet-600', tab: 'attendance' },
      { label: '修改密码', icon: Lock, color: 'bg-slate-50 text-slate-400', action: () => {} },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <div className="p-5 space-y-8 animate-in fade-in duration-700">
      <div className={`rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden ${isLeader ? 'bg-slate-900' : 'bg-gradient-to-br from-blue-700 to-indigo-600'}`}>
        <div className="relative z-10 space-y-4">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[2px]">Supervision Smart Platform</p>
          <h2 className="text-3xl font-black tracking-tighter">您好, {user.name}</h2>
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-[10px] font-bold inline-block border border-white/10">
            派驻项目：{projectName || '新疆成汇·管理总部'}
          </div>
        </div>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
          <div className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">本月文书</div>
          <div className="text-3xl font-black text-slate-900">{stats.total}</div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
          <div className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">待办/警报</div>
          <div className="text-3xl font-black text-orange-500">{stats.pending}</div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-6 px-1">
           <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
           <h3 className="font-black text-slate-900 text-xs uppercase tracking-[2px]">数字办公中枢</h3>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <button 
              key={idx} 
              onClick={() => {
                if (action.adminSub && onNavigateToAdminSub) {
                  onNavigateToAdminSub(action.adminSub as any);
                } else if (action.tab) {
                  onNavigate(action.tab);
                } else {
                  action.action?.();
                }
              }} 
              className="flex flex-col items-center gap-2 group active:scale-90 transition-all"
            >
              <div className={`${action.color} w-full aspect-square rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:-translate-y-1`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-slate-500">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-[2px] flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-blue-500" /> 企业资讯
          </h3>
          <ArrowUpRight className="w-3 h-3 text-slate-300" />
        </div>
        <div className="space-y-3">
          {announcements.length > 0 ? announcements.slice(0, 1).map(ann => (
            <div key={ann.id} className="p-4 bg-slate-50 rounded-2xl">
               <div className="font-bold text-[12px] text-slate-800 mb-1">{ann.title}</div>
               <p className="text-[10px] text-slate-500 line-clamp-1">{ann.content}</p>
            </div>
          )) : (
            <p className="text-[10px] text-slate-300 italic text-center py-4">暂无最新公告</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
