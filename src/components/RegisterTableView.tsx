import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Search, 
  Printer, 
  Download, 
  Eye, 
  Inbox, 
  Send, 
  ScrollText, 
  Trash2, 
  FileText,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DocumentItem } from '../types/document';

interface RegisterTableViewProps {
  registerType: 'incoming' | 'outgoing' | 'orders' | 'memos' | 'archive';
  documents: DocumentItem[];
  onViewDocument: (doc: DocumentItem) => void;
  onOpenUpload: () => void;
  selectedYear: string;
}

export const RegisterTableView: React.FC<RegisterTableViewProps> = ({
  registerType,
  documents,
  onViewDocument,
  onOpenUpload,
  selectedYear,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getRegisterInfo = () => {
    switch (registerType) {
      case 'incoming':
        return {
          title: 'ทะเบียนหนังสือรับ (Incoming Official Register)',
          description: 'สมุดทะเบียนลงรับหนังสือราชการจากหน่วยงานภายนอก สำนักงานเขตพื้นที่การศึกษา (สพป./สพม.) และ สพฐ.',
          icon: <Inbox className="w-6 h-6 text-blue-600" />,
          filterType: (d: DocumentItem) => d.docType === 'incoming',
          color: 'blue',
        };
      case 'outgoing':
        return {
          title: 'ทะเบียนหนังสือส่ง (Outgoing Official Register)',
          description: 'สมุดทะเบียนส่งหนังสือราชการไปยังหน่วยงานภายนอก หน่วยงานต้นสังกัด และชุมชน',
          icon: <Send className="w-6 h-6 text-emerald-600" />,
          filterType: (d: DocumentItem) => d.docType === 'outgoing',
          color: 'emerald',
        };
      case 'orders':
        return {
          title: 'ทะเบียนคำสั่งโรงเรียน (School Orders Register)',
          description: 'สมุดทะเบียนคำสั่งโรงเรียนอนุบาลศึกษาพัฒนา ตามระเบียบกระทรวงศึกษาธิการ',
          icon: <ScrollText className="w-6 h-6 text-purple-600" />,
          filterType: (d: DocumentItem) => d.docType === 'order',
          color: 'purple',
        };
      case 'memos':
        return {
          title: 'ทะเบียนประกาศและบันทึกข้อความ (Memos & Notices Register)',
          description: 'สมุดทะเบียนบันทึกข้อความภายในสถานศึกษา ประกาศนโยบาย และรายงาน 4 ฝ่าย',
          icon: <FileSpreadsheet className="w-6 h-6 text-amber-600" />,
          filterType: (d: DocumentItem) => d.docType === 'memo' || d.docType === 'announcement' || d.docType === 'plan',
          color: 'amber',
        };
      case 'archive':
        return {
          title: 'บัญชีเอกสารรอทำลายและประเมินอายุการเก็บรักษา',
          description: 'เอกสารที่ครบกำหนดอายุการเก็บรักษาตามระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ (1 ปี, 5 ปี, 10 ปี หรือตลอดไป)',
          icon: <Trash2 className="w-6 h-6 text-slate-600" />,
          filterType: () => true,
          color: 'slate',
        };
    }
  };

  const info = getRegisterInfo();

  const filteredDocs = documents
    .filter(info.filterType)
    .filter((doc) => {
      if (!searchQuery) return true;
      return (
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.bookNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fromAgency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.toAgency.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const handleExportCsv = () => {
    const headers = ['ลำดับ', 'เลขทะเบียนรับ/ที่หนังสือ', 'ลงวันที่', 'จาก', 'ถึง', 'เรื่อง', 'การปฏิบัติ/สั่งการ', 'สถานะ'];
    const rows = filteredDocs.map((d, i) => [
      i + 1,
      `"${d.bookNumber}"`,
      `"${d.date}"`,
      `"${d.fromAgency}"`,
      `"${d.toAgency}"`,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.directorOrder || 'รอสั่งการ'}"`,
      `"${d.status}"`,
    ]);
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${info.title}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Title Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            {info.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {info.title}
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                ปี {selectedYear}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {info.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>ส่งออก Excel/CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>พิมพ์สมุดทะเบียน</span>
          </button>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
          >
            <span>+ ลงทะเบียนเล่มนี้</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          พบในทะเบียนทั้งหมด <span className="font-bold text-slate-800">{filteredDocs.length}</span> รายการ
        </div>
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเลขที่หนังสือ, เรื่อง, หน่วยงาน..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Official Government Register Table Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-bold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-3 w-12 text-center border-r border-slate-200">ลำดับ</th>
                <th className="py-3 px-3 w-28 border-r border-slate-200">ทะเบียนรับ / เลขที่</th>
                <th className="py-3 px-3 w-28 border-r border-slate-200">ลงวันที่</th>
                <th className="py-3 px-3 w-36 border-r border-slate-200">จาก (ผู้ส่ง)</th>
                <th className="py-3 px-3 w-36 border-r border-slate-200">ถึง (ผู้รับ)</th>
                <th className="py-3 px-4 border-r border-slate-200">เรื่อง</th>
                <th className="py-3 px-3 w-40 border-r border-slate-200">การปฏิบัติ / สั่งการ</th>
                <th className="py-3 px-3 w-24 text-center">ดูเอกสาร</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    ไม่พบรายการหนังสือในทะเบียนนี้
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc, idx) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-center font-medium text-slate-500 border-r border-slate-100">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-700 border-r border-slate-100">
                      {doc.registerNumber || doc.bookNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600 border-r border-slate-100 whitespace-nowrap">
                      {doc.date}
                    </td>
                    <td className="py-3 px-3 text-slate-700 border-r border-slate-100 truncate max-w-[150px]">
                      {doc.fromAgency}
                    </td>
                    <td className="py-3 px-3 text-slate-700 border-r border-slate-100 truncate max-w-[150px]">
                      {doc.toAgency}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-100">
                      <div 
                        onClick={() => onViewDocument(doc)}
                        className="font-semibold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-2 leading-snug"
                      >
                        {doc.title}
                      </div>
                    </td>
                    <td className="py-3 px-3 border-r border-slate-100">
                      {doc.directorOrder ? (
                        <div className="text-[11px] text-amber-900 font-medium bg-amber-50 p-1.5 rounded border border-amber-200 line-clamp-2">
                          {doc.directorOrder}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">
                          อยู่ระหว่างเสนอ ผอ.
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onViewDocument(doc)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>เปิด</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
