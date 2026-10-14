import React, { useState } from 'react';
import { 
  GraduationCap, 
  Coins, 
  Users, 
  Building2, 
  Folder, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  LayoutDashboard, 
  Inbox, 
  Send, 
  ScrollText, 
  FileSpreadsheet, 
  Trash2, 
  HardDrive,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { DepartmentType, SubFolder, UserRole } from '../types/document';
import { OBEC_DEPARTMENTS } from '../data/departmentsData';

interface SidebarProps {
  currentView: string; // 'dashboard' | 'department' | 'folder' | 'register-in' | 'register-out' | 'register-orders'
  selectedDeptId: DepartmentType | null;
  selectedFolderId: string | null;
  onNavigateHome: () => void;
  onSelectDepartment: (deptId: DepartmentType) => void;
  onSelectFolder: (deptId: DepartmentType, folderId: string) => void;
  onSelectRegister: (regType: string) => void;
  onOpenCreateFolder: (deptId?: DepartmentType) => void;
  currentRole: UserRole;
  documentsCountByDept: Record<DepartmentType, number>;
  totalDocumentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedDeptId,
  selectedFolderId,
  onNavigateHome,
  onSelectDepartment,
  onSelectFolder,
  onSelectRegister,
  onOpenCreateFolder,
  currentRole,
  documentsCountByDept,
  totalDocumentsCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDepts, setExpandedDepts] = useState<Record<DepartmentType, boolean>>({
    academic: false,
    budget: false,
    personnel: false,
    general: true, // expanded by default as in screenshot
  });

  const toggleDept = (deptId: DepartmentType) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [deptId]: !prev[deptId],
    }));
  };

  const getDeptIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
      case 'Coins': return <Coins className="w-4 h-4" />;
      case 'Users': return <Users className="w-4 h-4" />;
      case 'Building2': return <Building2 className="w-4 h-4" />;
      default: return <Folder className="w-4 h-4" />;
    }
  };

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none h-[calc(100vh-4rem)]">
      {/* Sidebar Header Section matching user screenshot */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
            <Folder className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">
              ระบบสารบรรณอิเล็กทรอนิกส์
            </h2>
            <p className="text-[11px] text-blue-600 font-medium">
              ตามโครงสร้าง 4 ฝ่าย สพฐ.
            </p>
          </div>
        </div>

        {/* User Card / Chip matching screenshot (AS ผู้อำนวยการสถานศึกษา) */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80">
          <div className="w-6 h-6 rounded-full bg-blue-700 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
            AS
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-800 truncate">
              {currentRole.badge}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentRole.name}
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="ออนไลน์" />
        </div>

        {/* Search category input matching screenshot */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาหมวดหมู่..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs">
        {/* Main Dashboard Link */}
        <div>
          <button
            onClick={onNavigateHome}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left font-medium transition-colors cursor-pointer ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 ${currentView === 'dashboard' ? 'text-white' : 'text-slate-500'}`} />
              <span>ภาพรวมเอกสาร 4 ฝ่าย</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              currentView === 'dashboard' ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-600'
            }`}>
              {totalDocumentsCount}
            </span>
          </button>
        </div>

        {/* The 4 OBEC Departments Section */}
        <div>
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>โครงสร้าง 4 ฝ่าย</span>
            <button
              onClick={() => onOpenCreateFolder()}
              className="text-blue-600 hover:text-blue-700 p-0.5 rounded hover:bg-blue-50 transition-colors"
              title="สร้างแฟ้มใหม่"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1 mt-1">
            {OBEC_DEPARTMENTS.map((dept) => {
              const isExpanded = expandedDepts[dept.id] || searchQuery.length > 0;
              const isSelectedDept = selectedDeptId === dept.id && currentView === 'department';
              const filteredSubFolders = dept.subFolders.filter((sf) =>
                searchQuery ? sf.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
              );

              return (
                <div key={dept.id} className="rounded-xl overflow-hidden">
                  {/* Department Parent Item */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer group ${
                      isSelectedDept
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div
                      onClick={() => onSelectDepartment(dept.id)}
                      className="flex items-center gap-2.5 flex-1 min-w-0"
                    >
                      <span className={`p-1 rounded-md ${
                        dept.id === 'academic' ? 'text-emerald-600 bg-emerald-50' :
                        dept.id === 'budget' ? 'text-amber-600 bg-amber-50' :
                        dept.id === 'personnel' ? 'text-indigo-600 bg-indigo-50' :
                        'text-blue-600 bg-blue-50'
                      }`}>
                        {getDeptIcon(dept.iconName)}
                      </span>
                      <span className="truncate">{dept.thaiName}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-400 font-normal">
                        {documentsCountByDept[dept.id] || 0}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDept(dept.id);
                        }}
                        className="p-1 hover:bg-slate-200/60 rounded text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subfolders list */}
                  {isExpanded && (
                    <div className="ml-4 pl-3 border-l-2 border-slate-100 py-1 space-y-0.5">
                      {filteredSubFolders.map((sub) => {
                        const isFolderActive =
                          selectedDeptId === dept.id &&
                          selectedFolderId === sub.id &&
                          currentView === 'folder';

                        return (
                          <button
                            key={sub.id}
                            onClick={() => onSelectFolder(dept.id, sub.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                              isFolderActive
                                ? 'bg-blue-600 text-white font-medium shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Folder className={`w-3.5 h-3.5 shrink-0 ${
                                isFolderActive ? 'text-amber-300 fill-amber-300/30' : 'text-amber-500 fill-amber-500/20'
                              }`} />
                              <span className="truncate">{sub.name}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Registers section (ทะเบียนสารบรรณ) */}
        <div>
          <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            ทะเบียนหนังสือราชการ
          </div>
          <div className="space-y-0.5 mt-1">
            <button
              onClick={() => onSelectRegister('incoming')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                currentView === 'register-incoming'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Inbox className="w-3.5 h-3.5 text-blue-500" />
              <span>ทะเบียนหนังสือรับ</span>
            </button>
            <button
              onClick={() => onSelectRegister('outgoing')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                currentView === 'register-outgoing'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-emerald-500" />
              <span>ทะเบียนหนังสือส่ง</span>
            </button>
            <button
              onClick={() => onSelectRegister('orders')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                currentView === 'register-orders'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <ScrollText className="w-3.5 h-3.5 text-purple-500" />
              <span>ทะเบียนคำสั่งโรงเรียน</span>
            </button>
            <button
              onClick={() => onSelectRegister('memos')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                currentView === 'register-memos'
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
              <span>ทะเบียนประกาศ / บันทึก</span>
            </button>
          </div>
        </div>

        {/* Bottom Archive & Security note */}
        <div>
          <button
            onClick={() => onSelectRegister('archive')}
            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
              currentView === 'register-archive'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
            <span>เอกสารรอทำลาย (ระเบียบสารบรรณ)</span>
          </button>
        </div>
      </div>

      {/* Storage and Security Widget */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs shadow-2xs">
          <div className="flex items-center justify-between text-slate-600 mb-1.5">
            <span className="flex items-center gap-1.5 font-medium">
              <HardDrive className="w-3.5 h-3.5 text-blue-600" />
              <span>พื้นที่จัดเก็บระบบ</span>
            </span>
            <span className="text-[10px] text-slate-400">2.4 GB / 25 GB</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '12%' }} />
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3 h-3" />
              <span>สพฐ. ดิจิทัลปลอดภัย</span>
            </span>
            <span>ปี 2569</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
