import React from 'react';
import { Home, ChevronRight, Folder } from 'lucide-react';
import { DepartmentType } from '../types/document';
import { OBEC_DEPARTMENTS } from '../data/departmentsData';

interface BreadcrumbsProps {
  currentView: string;
  selectedDeptId: DepartmentType | null;
  selectedFolderId: string | null;
  onNavigateHome: () => void;
  onNavigateDept: (deptId: DepartmentType) => void;
  subFolderName?: string;
  registerTitle?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentView,
  selectedDeptId,
  selectedFolderId,
  onNavigateHome,
  onNavigateDept,
  subFolderName,
  registerTitle,
}) => {
  const currentDept = OBEC_DEPARTMENTS.find((d) => d.id === selectedDeptId);
  const currentSubFolder = currentDept?.subFolders.find((f) => f.id === selectedFolderId);

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 py-3 px-4 sm:px-6 bg-white border-b border-slate-200/70">
      {/* Home link */}
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer font-medium text-slate-600"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>หน้าแรก</span>
      </button>

      {/* Department breadcrumb */}
      {currentDept && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <button
            onClick={() => onNavigateDept(currentDept.id)}
            className={`hover:text-blue-600 transition-colors cursor-pointer truncate max-w-[200px] ${
              !selectedFolderId && currentView === 'department'
                ? 'font-semibold text-slate-800'
                : 'text-slate-600 font-medium'
            }`}
          >
            {currentDept.thaiName}
          </button>
        </>
      )}

      {/* Subfolder breadcrumb */}
      {(currentSubFolder || subFolderName) && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="font-semibold text-slate-800 truncate max-w-[280px] flex items-center gap-1">
            <Folder className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20 shrink-0" />
            <span>{subFolderName || currentSubFolder?.name}</span>
          </span>
        </>
      )}

      {/* Register title breadcrumb */}
      {registerTitle && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
          <span className="font-semibold text-slate-800 truncate">
            {registerTitle}
          </span>
        </>
      )}
    </nav>
  );
};
