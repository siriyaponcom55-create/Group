import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Share2, 
  Edit3, 
  FileText, 
  Clock, 
  Building, 
  User, 
  QrCode,
  Save,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { DocumentItem, UserRole } from '../types/document';

interface OfficialDocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
  onSaveOrder: (docId: string, orderText: string) => void;
  currentRole: UserRole;
}

export const OfficialDocumentViewerModal: React.FC<OfficialDocumentViewerModalProps> = ({
  document,
  onClose,
  onSaveOrder,
  currentRole,
}) => {
  if (!document) return null;

  const [directorOrderText, setDirectorOrderText] = useState(document.directorOrder || '');
  const [isSavedAlert, setIsSavedAlert] = useState(false);

  const handleSave = () => {
    onSaveOrder(document.id, directorOrderText);
    setIsSavedAlert(true);
    setTimeout(() => setIsSavedAlert(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm truncate">
                  {document.bookNumber}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  {document.docType === 'incoming' ? 'หนังสือรับ' : document.docType === 'order' ? 'คำสั่งโรงเรียน' : 'บันทึกข้อความ'}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5">
                {document.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium cursor-pointer transition-colors"
              title="พิมพ์เอกสารราชการ"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>พิมพ์</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100/50 space-y-6">
          {/* Simulated Authentic Thai Official Letter Sheet */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 sm:p-12 max-w-3xl mx-auto font-['Sarabun',sans-serif] text-slate-900 leading-relaxed print:p-0 print:border-none print:shadow-none">
            {/* Royal Thai Garuda Crest (ตราครุฑ) */}
            <div className="text-center mb-6">
              <div className="inline-block">
                {/* Clean vector representation of the Royal Garuda Emblem */}
                <div className="w-16 h-16 mx-auto mb-2 flex items-center justify-center text-red-700">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 fill-current" aria-label="ตราครุฑ">
                    <path d="M50 10 C45 20, 30 22, 20 28 C25 35, 32 38, 38 38 C32 46, 22 55, 12 58 C22 62, 34 58, 42 50 C40 60, 35 75, 45 88 C47 78, 50 68, 50 62 C50 68, 53 78, 55 88 C65 75, 60 60, 58 50 C66 58, 78 62, 88 58 C78 55, 68 46, 62 38 C68 38, 75 35, 80 28 C70 22, 55 20, 50 10 Z" />
                  </svg>
                </div>
                <div className="text-xs font-semibold text-slate-500 tracking-wider">
                  {document.docType === 'memo' ? 'บันทึกข้อความ' : 'หนังสือราชการ'}
                </div>
              </div>
            </div>

            {/* Header Metadata block according to Thai Saraban Standard */}
            <div className="border-b border-slate-200 pb-4 mb-6 text-sm space-y-2">
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <span className="font-bold">ส่วนราชการ: </span>
                  <span>{document.fromAgency}</span>
                </div>
                <div>
                  <span className="font-bold">วันที่: </span>
                  <span>{document.date}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-between">
                <div>
                  <span className="font-bold">ที่: </span>
                  <span className="font-medium text-blue-800">{document.bookNumber}</span>
                </div>
                {document.registerNumber && (
                  <div>
                    <span className="font-bold">เลขทะเบียนรับ: </span>
                    <span className="text-slate-700">{document.registerNumber}</span>
                  </div>
                )}
              </div>
              <div>
                <span className="font-bold">เรื่อง: </span>
                <span className="font-semibold">{document.title}</span>
              </div>
              <div>
                <span className="font-bold">เรียน: </span>
                <span>{document.toAgency}</span>
              </div>
            </div>

            {/* Official Letter Body Text */}
            <div className="text-sm sm:text-base leading-relaxed space-y-4 text-justify indent-8">
              {document.officialBodyContent ? (
                document.officialBodyContent.split('\n\n').map((para, i) => (
                  <p key={i} className="indent-8 leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <p className="indent-8 leading-relaxed">
                  {document.contentSummary}
                </p>
              )}
            </div>

            {/* Signatures block */}
            <div className="mt-10 pt-6 flex flex-col sm:flex-row items-end justify-end gap-6 text-sm text-right">
              <div>
                <div className="h-10 flex items-center justify-end">
                  <span className="font-serif italic text-blue-900 font-bold border-b border-dashed border-slate-400 px-4">
                    {document.signatures?.[0]?.name || 'วิภาดา ใจดี'}
                  </span>
                </div>
                <div className="font-medium">
                  ({document.signatures?.[0]?.name || 'นางสาววิภาดา ใจดี'})
                </div>
                <div className="text-xs text-slate-500">
                  {document.signatures?.[0]?.role || 'เจ้าหน้าที่ผู้เสนอ'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {document.signatures?.[0]?.date || document.date}
                </div>
              </div>
            </div>

            {/* Director's Endorsement / Order Box (ช่องเกษียณหนังสือ ผอ.) */}
            <div className="mt-8 p-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-900 uppercase flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                  <span>บันทึกความเห็น / ข้อสั่งการผู้อำนวยการสถานศึกษา (เกษียณหนังสือ)</span>
                </span>
                <span className="text-[11px] text-amber-700 font-medium">
                  {currentRole.name} ({currentRole.title})
                </span>
              </div>

              <textarea
                value={directorOrderText}
                onChange={(e) => setDirectorOrderText(e.target.value)}
                rows={3}
                placeholder="ระบุข้อสั่งการ เช่น 'ทราบ ดำเนินการตามระเบียบ', 'มอบฝ่ายวิชาการแจ้งครูผู้รับผิดชอบ', 'อนุมัติตามเสนอ'..."
                className="w-full text-xs sm:text-sm p-3 rounded-lg border border-amber-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-800 placeholder:text-slate-400 leading-relaxed"
              />

              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>บันทึกผ่านระบบ e-Saraban รับรองความถูกต้อง</span>
                </div>
                <div className="flex items-center gap-2">
                  {isSavedAlert && (
                    <span className="text-xs text-emerald-600 font-semibold animate-fade-in flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>บันทึกเกษียณสั่งการแล้ว</span>
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs cursor-pointer transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>บันทึกข้อสั่งการ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* e-Saraban Verification QR & Security Footnote */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-slate-500" />
                <div>
                  <div className="font-semibold text-slate-600">e-Saraban Verification Code</div>
                  <div>เลขที่ตรวจสอบ: OBEC-{document.id.toUpperCase()}-2569</div>
                </div>
              </div>
              <div className="text-right">
                <div>ระบบเก็บเอกสารโรงเรียน 4 ฝ่าย สพฐ.</div>
                <div>โรงเรียนอนุบาลศึกษาพัฒนา • สพป. นครราชสีมา เขต 1</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>ไฟล์แนบ:</span>
            <span className="font-semibold text-slate-700">{document.fileName}</span>
            <span>({document.fileSize})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
