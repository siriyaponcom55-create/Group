import React, { useState } from 'react';
import { 
  Building2, 
  Bell, 
  Calendar, 
  ChevronDown, 
  FileText, 
  Sparkles,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types/document';
import { USER_ROLES } from '../data/departmentsData';

interface HeaderProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  selectedYear: string;
  onSelectYear: (year: string) => void;
  onOpenUpload: () => void;
  onOpenAiAssistant: () => void;
  pendingApprovalsCount: number;
  onExportAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  selectedYear,
  onSelectYear,
  onOpenUpload,
  onOpenAiAssistant,
  pendingApprovalsCount,
  onExportAll,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Branding & School Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100 shrink-0">
            {/* Thai Garuda / School Crest Silhouette */}
            <Building2 className="w-5 h-5 text-amber-300" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight truncate">
                ระบบเก็บเอกสารโรงเรียน 4 ฝ่าย สพฐ.
              </h1>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                e-Saraban EDMS
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5">
              <span>โรงเรียนอนุบาลศึกษาพัฒนา</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">สพป. นครราชสีมา เขต 1</span>
            </p>
          </div>
        </div>

        {/* Right: Actions, Year Selector, Notifications & Current Role */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Year selector */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 transition-colors px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">ปีการศึกษา:</span>
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="2569">2569</option>
              <option value="2568">2568</option>
              <option value="2567">2567</option>
            </select>
          </div>

          {/* Quick Upload Button */}
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">ลงรับ/อัปโหลด</span>
          </button>

          {/* Export Report */}
          <button
            onClick={onExportAll}
            title="ส่งออกรายงานข้อมูลสารบรรณ"
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>ออกรายงาน</span>
          </button>

          {/* AI School Helper Trigger */}
          <button
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-medium border border-purple-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden md:inline">ผู้ช่วย AI 4 ฝ่าย</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="การแจ้งเตือน"
            >
              <Bell className="w-4 h-4" />
              {pendingApprovalsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {pendingApprovalsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 text-xs"
                onClick={() => setShowNotifMenu(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="font-bold text-slate-800">การแจ้งเตือนหนังสือ</span>
                  <span className="text-[11px] text-blue-600 font-medium">รอการเกษียณ {pendingApprovalsCount} ฉบับ</span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-snug">ขออนุมัติจัดซื้อจัดจ้าง e-GP คอมพิวเตอร์</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">รอ ผอ. ลงนามอนุมัติแต่งตั้งกรรมการ TOR</p>
                        <span className="text-[10px] text-slate-400">ฝ่ายบริหารงานงบประมาณ</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-snug">นโยบาย "เรียนดี มีความสุข" ภาคเรียนที่ 2/2569</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">หนังสือเวียนเข้าใหม่ รอเกษียณสั่งการ</p>
                        <span className="text-[10px] text-slate-400">ฝ่ายบริหารงานทั่วไป</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-slate-800 leading-snug">หลักสูตรสถานศึกษา พ.ศ. 2569 กลุ่มวิทย์</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">ผู้อำนวยการลงนามประกาศใช้แล้ว</p>
                        <span className="text-[10px] text-slate-400">ฝ่ายบริหารงานวิชาการ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher - Matches the AS ผู้อำนวยการสถานศึกษา badge from user screenshot! */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                AS
              </div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-slate-800 leading-tight">
                  {currentRole.name}
                </div>
                <div className="text-[11px] text-blue-600 font-medium leading-tight">
                  {currentRole.title}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">สลับบทบาทผู้ใช้งาน (RBAC)</div>
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {USER_ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        onSelectRole(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-start justify-between hover:bg-slate-50 cursor-pointer ${
                        currentRole.id === role.id ? 'bg-blue-50/70 text-blue-700 font-medium' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{role.title}</div>
                        <div className="text-[11px] text-slate-500">{role.name}</div>
                      </div>
                      {currentRole.id === role.id && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
