
import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Eye, 
  ClipboardList, 
  Bell, 
  Clock, 
  Users, 
  LayoutDashboard,
  Zap
} from 'lucide-react';
import { ReportType } from './types';

export const ROLE_LABELS = {
  ASSISTANT: '监理员',
  ENGINEER: '专业监理工程师',
  CHIEF: '总监理工程师',
  LEADER: '公司领导'
};

export const REPORT_ICONS: Record<string, React.ReactNode> = {
  [ReportType.DAILY_LOG]: <FileText className="w-5 h-5 text-blue-500" />,
  [ReportType.SIDE_STATION]: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
  [ReportType.WITNESS]: <Eye className="w-5 h-5 text-green-500" />,
  [ReportType.NOTICE]: <ClipboardList className="w-5 h-5 text-orange-500" />,
  [ReportType.MINUTES]: <Users className="w-5 h-5 text-purple-500" />,
  [ReportType.MONTHLY]: <LayoutDashboard className="w-5 h-5 text-pink-500" />,
  [ReportType.MAJOR_EVENT]: <Zap className="w-5 h-5 text-red-600 animate-pulse" />
};
