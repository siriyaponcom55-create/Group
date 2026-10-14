import React, { useState } from 'react';
import { 
  Folder, 
  Plus, 
  UploadCloud, 
  Search, 
  FileText, 
  Eye, 
  Download, 
  Clock, 
  Tag, 
  Trash2, 
  Edit3,
  CheckCircle2,
  AlertTriangle,
  LayoutGrid,
  List,
  Filter,
  FileCheck,
  FileSpreadsheet,
  Bookmark,
  Share2
} from 'lucide-react';
import { DocumentItem, SubFolder, UrgencyLevel, DocType } from '../types/document';

interface FolderWorkspaceProps {
  currentFolder: SubFolder | null;
  documents: DocumentItem[];
  subFolders: SubFolder[];
  onOpenUpload: () => void;
  onOpenCreateSubFolder: () => void;
  onSelectSubFolder: (subFolderId: string) => void;
  onViewDocument: (doc: DocumentItem) => void;
  onToggleBookmark: (docId: string) => void;
  onDeleteDocument: (docId: string) => void;
  onQuickEndorse: (doc: DocumentItem) => void;
}

export const FolderWorkspace: React.FC<FolderWorkspaceProps> = ({
  currentFolder,
  documents,
  subFolders,
  onOpenUpload,
  onOpenCreateSubFolder,
  onSelectSubFolder,
  onViewDocument,
  onToggleBookmark,
  onDeleteDocument,
  onQuickEndorse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedDocType, setSelectedDocType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Filter documents
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      searchQuery === '' ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.bookNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fromAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUrgency =
      selectedUrgency === 'all' || doc.urgency === selectedUrgency;

    const matchesDocType =
      selectedDocType === 'all' || doc.docType === selectedDocType;

    return matchesSearch && matchesUrgency && matchesDocType;
  });

  const getUrgencyBadge = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case 'most_urgent':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">ด่วนที่สุด</span>;
      case 'very_urgent':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-orange-50 text-orange-700 border border-orange-200">ด่วนมาก</span>;
      case 'urgent':
        return <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">ด่วน</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">ปกติ</span>;
    }
  };

  const getDocTypeBadge = (type: DocType) => {
    switch (type) {
      case 'incoming':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">หนังสือรับ</span>;
      case 'outgoing':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">หนังสือส่ง</span>;
      case 'order':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">คำสั่งโรงเรียน</span>;
      case 'memo':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">บันทึกข้อความ</span>;
      case 'sar':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">SAR / ประกันคุณภาพ</span>;
      case 'plan':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">แผนงาน/โครงการ</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">เอกสารทั่วไป</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Search Header Row (Top right as shown in screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>จำนวนเอกสารในแฟ้มนี้:</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredDocs.length} ฉบับ
          </span>
        </div>

        {/* Search Input matching screenshot "ค้นหาในแฟ้มนี้..." */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาในแฟ้มนี้..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ล้าง
            </button>
          )}
        </div>
      </div>

      {/* Main Folder Banner - Exactly matches screenshot */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          {/* Large Yellow Folder Icon matching screenshot */}
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-xs">
            <Folder className="w-9 h-9 text-amber-500 fill-amber-400/30" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {currentFolder ? currentFolder.name : 'งานธุรการ (รับ-ส่งหนังสือ)'}
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {currentFolder
                ? currentFolder.description
                : 'จัดการเอกสาร ระเบียบ คำสั่ง และหนังสือราชการที่เกี่ยวข้อง'}
            </p>
          </div>
        </div>

        {/* Action Buttons matching screenshot */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Create Sub-folder button */}
          <button
            onClick={onOpenCreateSubFolder}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>สร้างแฟ้มย่อย</span>
          </button>

          {/* Upload Document Primary Blue CTA button matching screenshot */}
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-blue-100" />
            <span>อัปโหลดเอกสาร</span>
          </button>
        </div>
      </div>

      {/* Sub-folders Grid (if any subfolders exist under this department) */}
      {subFolders.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>แฟ้มงานย่อยที่เกี่ยวข้อง ({subFolders.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subFolders.map((sf) => (
              <button
                key={sf.id}
                onClick={() => onSelectSubFolder(sf.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 group ${
                  currentFolder?.id === sf.id
                    ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Folder className="w-5 h-5 text-amber-500 fill-amber-400/20" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600">
                    {sf.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {sf.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters & View Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
        {/* Urgency & Type chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>กรอง:</span>
          </span>

          {/* Urgency filters */}
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'most_urgent', label: 'ด่วนที่สุด' },
            { id: 'very_urgent', label: 'ด่วนมาก' },
            { id: 'urgent', label: 'ด่วน' },
            { id: 'normal', label: 'ปกติ' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedUrgency(filter.id)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedUrgency === filter.id
                  ? 'bg-slate-800 text-white font-medium'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {filter.label}
            </button>
          ))}

          <span className="text-slate-300 mx-1">|</span>

          {/* Doc types */}
          {[
            { id: 'all', label: 'ทุกประเภท' },
            { id: 'incoming', label: 'หนังสือรับ' },
            { id: 'outgoing', label: 'หนังสือส่ง' },
            { id: 'order', label: 'คำสั่ง' },
            { id: 'memo', label: 'บันทึก' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedDocType(t.id)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                selectedDocType === t.id
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 shrink-0 self-end md:self-auto">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-slate-100 text-blue-600 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="แสดงแบบการ์ด"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              viewMode === 'table' ? 'bg-slate-100 text-blue-600 shadow-2xs font-semibold' : 'text-slate-400 hover:text-slate-600'
            }`}
            title="แสดงแบบตารางทะเบียน"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Documents List or Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-800">
            ยังไม่มีเอกสารในหมวดหมู่นี้
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            ท่านสามารถคลิกปุ่ม "อัปโหลดเอกสาร" เพื่อลงทะเบียนหนังสือราชการ คำสั่ง หรือบันทึกข้อความเข้าสู่ระบบ
          </p>
          <button
            onClick={onOpenUpload}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            <UploadCloud className="w-4 h-4" />
            <span>เริ่มอัปโหลดเอกสาร</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row: Doc Type & Urgency & Bookmark */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {getDocTypeBadge(doc.docType)}
                    {getUrgencyBadge(doc.urgency)}
                    {doc.secrecy !== 'normal' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {doc.secrecy === 'confidential' ? 'ลับ' : 'ลับมาก'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onToggleBookmark(doc.id)}
                    className="text-slate-300 hover:text-amber-500 transition-colors p-1"
                    title="ปักหมุดเอกสารสำคัญ"
                  >
                    <Bookmark className={`w-4 h-4 ${doc.isBookmarked ? 'text-amber-500 fill-amber-500' : ''}`} />
                  </button>
                </div>

                {/* Book Number & Date */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span className="font-semibold text-blue-700 bg-blue-50/60 px-2 py-0.5 rounded border border-blue-100">
                    {doc.bookNumber}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{doc.date}</span>
                  </span>
                </div>

                {/* Document Title */}
                <h3 
                  onClick={() => onViewDocument(doc)}
                  className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors mt-2"
                >
                  {doc.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {doc.contentSummary}
                </p>

                {/* Agencies: From -> To */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <span className="text-slate-400 text-[11px] shrink-0 w-8">จาก:</span>
                    <span className="font-medium truncate">{doc.fromAgency}</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-600">
                    <span className="text-slate-400 text-[11px] shrink-0 w-8">ถึง:</span>
                    <span className="font-medium truncate">{doc.toAgency}</span>
                  </div>
                </div>

                {/* Director order note if any */}
                {doc.directorOrder && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs">
                    <div className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-amber-600" />
                      <span>ข้อสั่งการ / เกษียณ ผอ.:</span>
                    </div>
                    <p className="text-amber-900 font-medium text-[11px] mt-0.5 line-clamp-2">
                      "{doc.directorOrder}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: File format & Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span className="uppercase font-semibold px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 text-[10px]">
                    {doc.fileType}
                  </span>
                  <span>{doc.fileSize}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onViewDocument(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>เปิดดู</span>
                  </button>

                  <button
                    onClick={() => onQuickEndorse(doc)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                    title="เกษียณหนังสือ / สั่งการ"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">เกษียณ</span>
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="ลบเอกสาร"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Official Table View */
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-3 w-12 text-center">ลำดับ</th>
                  <th className="py-3 px-4 w-32">เลขที่หนังสือ</th>
                  <th className="py-3 px-4">ชื่อเรื่อง</th>
                  <th className="py-3 px-3 w-28">วันที่</th>
                  <th className="py-3 px-3 w-36">จากหน่วยงาน</th>
                  <th className="py-3 px-3 w-24">ความเร็ว</th>
                  <th className="py-3 px-3 w-36">การปฏิบัติ / สั่งการ</th>
                  <th className="py-3 px-3 w-28 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-medium">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">
                      {doc.bookNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div 
                        onClick={() => onViewDocument(doc)}
                        className="font-bold text-slate-800 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {doc.contentSummary}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {doc.date}
                    </td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                      {doc.fromAgency}
                    </td>
                    <td className="py-3 px-3">
                      {getUrgencyBadge(doc.urgency)}
                    </td>
                    <td className="py-3 px-3">
                      {doc.directorOrder ? (
                        <span className="text-[11px] font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 line-clamp-1">
                          {doc.directorOrder}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">รอสั่งการ</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewDocument(doc)}
                          className="p-1 rounded hover:bg-blue-50 text-blue-600"
                          title="ดูเอกสาร"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onQuickEndorse(doc)}
                          className="p-1 rounded hover:bg-slate-100 text-slate-600"
                          title="เกษียณหนังสือ"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDocument(doc.id)}
                          className="p-1 rounded hover:bg-rose-50 text-rose-500"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
