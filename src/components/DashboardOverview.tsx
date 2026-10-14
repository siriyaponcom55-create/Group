import React from 'react';
import { 
  GraduationCap, 
  Coins, 
  Users, 
  Building2, 
  FileText, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles, 
  Inbox, 
  Send, 
  ScrollText,
  UploadCloud,
  Folder
} from 'lucide-react';
import { DepartmentType, DocumentItem } from '../types/document';
import { OBEC_DEPARTMENTS } from '../data/departmentsData';

interface DashboardOverviewProps {
  documents: DocumentItem[];
  onSelectDepartment: (deptId: DepartmentType) => void;
  onSelectFolder: (deptId: DepartmentType, folderId: string) => void;
  onViewDocument: (doc: DocumentItem) => void;
  onOpenUpload: () => void;
  onOpenAiAssistant: () => void;
  selectedYear: string;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  documents,
  onSelectDepartment,
  onSelectFolder,
  onViewDocument,
  onOpenUpload,
  onOpenAiAssistant,
  selectedYear,
}) => {
  // Stats calculations
  const totalCount = documents.length;
  const pendingCount = documents.filter((d) => !d.directorOrder && d.status === 'pending_approval').length;
  const urgentCount = documents.filter((d) => d.urgency === 'most_urgent' || d.urgency === 'very_urgent').length;
  const ordersCount = documents.filter((d) => d.docType === 'order').length;

  const countByDept = (deptId: DepartmentType) =>
    documents.filter((d) => d.departmentId === deptId).length;

  const getDeptColor = (deptId: DepartmentType) => {
    switch (deptId) {
      case 'academic': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: <GraduationCap className="w-5 h-5 text-emerald-600" /> };
      case 'budget': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Coins className="w-5 h-5 text-amber-600" /> };
      case 'personnel': return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: <Users className="w-5 h-5 text-indigo-600" /> };
      case 'general': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <Building2 className="w-5 h-5 text-blue-600" /> };
    }
  };

  const recentDocs = [...documents].slice(0, 6);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Top Welcome & Quick Action Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-blue-200 backdrop-blur-xs border border-white/10 mb-3">
            <span>✨ ระบบสารบรรณและจัดเก็บเอกสาร 4 ฝ่าย สพฐ.</span>
            <span>•</span>
            <span>ปี {selectedYear}</span>
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            ระบบบริหารจัดการเอกสารโรงเรียนดิจิทัล
          </h2>
          <p className="text-blue-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
            เชื่อมโยงและจัดระเบียบงาน 4 ฝ่าย (วิชาการ งบประมาณ บุคคล บริหารทั่วไป) ลดภาระงานธุรการของครู พร้อมระบบทะเบียนรับ-ส่ง และผู้ช่วย AI สรุป-ร่างหนังสือราชการ
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>ลงทะเบียน / อัปโหลดเอกสารใหม่</span>
            </button>
            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold backdrop-blur-xs border border-white/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-300" />
              <span>ผู้ช่วย AI ร่างหนังสือราชการ</span>
            </button>
          </div>
        </div>

        {/* Background decorative circles */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>เอกสารทั้งหมด</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">4 ฝ่ายครบถ้วน</span>
            <span>• ปี {selectedYear}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>รอเกษียณ / สั่งการ</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            รอ ผอ. หรือผู้บริหารลงนาม
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>ด่วน / ด่วนที่สุด</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-rose-600">{urgentCount}</div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">
            ต้องดำเนินการตามกำหนด
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>คำสั่งโรงเรียน</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ScrollText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{ordersCount}</div>
          <div className="text-[11px] text-slate-400 mt-1">
            คำสั่งแต่งตั้งและประกาศ
          </div>
        </div>
      </div>

      {/* The 4 OBEC Departments Grid Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              โครงสร้างการจัดเก็บเอกสาร 4 ฝ่าย สพฐ.
            </h3>
            <p className="text-xs text-slate-500">
              คลิกเพื่อเข้าสู่แฟ้มเอกสารและระเบียบคำสั่งของแต่ละฝ่าย
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {OBEC_DEPARTMENTS.map((dept) => {
            const count = countByDept(dept.id);
            const color = getDeptColor(dept.id);
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

            return (
              <div
                key={dept.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.bg} ${color.border} border`}>
                        {color.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {dept.thaiName}
                        </h4>
                        <span className="text-xs text-slate-400">{dept.engName}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectDepartment(dept.id)}
                      className="p-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="เข้าสู่ฝ่ายนี้"
                    >
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {dept.description}
                  </p>

                  {/* Subfolders Quick Links (first 4) */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-400 mb-2">
                      แฟ้มงานย่อย ({dept.subFolders.length} แฟ้ม):
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {dept.subFolders.slice(0, 4).map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => onSelectFolder(dept.id, sub.id)}
                          className="text-left text-xs text-slate-600 hover:text-blue-600 flex items-center gap-1.5 truncate p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                        >
                          <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{sub.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{count}</span>
                    <span className="text-slate-400">ฉบับ ({pct}%)</span>
                  </div>
                  <button
                    onClick={() => onSelectDepartment(dept.id)}
                    className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                  >
                    <span>เปิดแฟ้มฝ่ายนี้</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              เอกสารและหนังสือเข้าล่าสุด
            </h3>
            <p className="text-xs text-slate-500">
              หนังสือราชการที่ลงทะเบียนเข้าสู่ระบบล่าสุดตามลำดับเวลา
            </p>
          </div>
          <button
            onClick={onOpenUpload}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>+ เพิ่มเอกสาร</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onViewDocument(doc)}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-blue-700 text-xs">
                    {doc.bookNumber}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {doc.docType === 'incoming' ? 'หนังสือรับ' : doc.docType === 'order' ? 'คำสั่ง' : 'บันทึก'}
                  </span>
                  {doc.urgency === 'most_urgent' && (
                    <span className="text-[11px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold border border-rose-200">
                      ด่วนที่สุด
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400">
                    {doc.date}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-800 text-xs sm:text-sm group-hover:text-blue-600 truncate">
                  {doc.title}
                </h4>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  จาก: {doc.fromAgency} → ถึง: {doc.toAgency}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                {doc.directorOrder ? (
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                    สั่งการแล้ว
                  </span>
                ) : (
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                    รอสั่งการ
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
