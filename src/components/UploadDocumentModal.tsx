import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  Sparkles,
  Building2,
  Calendar,
  Tag,
  ShieldAlert
} from 'lucide-react';
import { DepartmentType, DocType, DocumentItem, UrgencyLevel, SecrecyLevel } from '../types/document';
import { OBEC_DEPARTMENTS } from '../data/departmentsData';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDocument: (doc: DocumentItem) => void;
  defaultDeptId?: DepartmentType;
  defaultFolderId?: string;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onSaveDocument,
  defaultDeptId = 'general',
  defaultFolderId = 'gen-saraban',
}) => {
  if (!isOpen) return null;

  const [bookNumber, setBookNumber] = useState('ศธ 04225.12/ว ');
  const [registerNumber, setRegisterNumber] = useState('');
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState<DepartmentType>(defaultDeptId);
  const [subFolderId, setSubFolderId] = useState(defaultFolderId);
  const [docType, setDocType] = useState<DocType>('incoming');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [secrecy, setSecrecy] = useState<SecrecyLevel>('normal');
  const [fromAgency, setFromAgency] = useState('สำนักงานเขตพื้นที่การศึกษาประถมศึกษา');
  const [toAgency, setToAgency] = useState('ผู้อำนวยการโรงเรียนอนุบาลศึกษาพัฒนา');
  const [date, setDate] = useState('14 ต.ค. 2569');
  const [contentSummary, setContentSummary] = useState('');
  const [tags, setTags] = useState('สพฐ., เอกสาร 4 ฝ่าย');
  const [fileName, setFileName] = useState('document_attachment.pdf');
  const [fileSize, setFileSize] = useState('1.5 MB');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Selected department info & subfolders
  const currentDept = OBEC_DEPARTMENTS.find((d) => d.id === departmentId);

  const handleDeptChange = (newDeptId: DepartmentType) => {
    setDepartmentId(newDeptId);
    const dept = OBEC_DEPARTMENTS.find((d) => d.id === newDeptId);
    if (dept && dept.subFolders.length > 0) {
      setSubFolderId(dept.subFolders[0].id);
    }
  };

  const handleFillSample = () => {
    setBookNumber('ศธ 04001/ว ' + Math.floor(1000 + Math.random() * 9000));
    setRegisterNumber(Math.floor(120 + Math.random() * 50) + '/2569');
    setTitle('แนวทางการจัดกิจกรรมสัปดาห์วิทยาศาสตร์และคณิตศาสตร์พัฒนาสมรรถนะผู้เรียน ประจำปี 2569');
    setDepartmentId('academic');
    setSubFolderId('acad-lesson');
    setDocType('incoming');
    setUrgency('urgent');
    setFromAgency('สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)');
    setToAgency('ผู้อำนวยการสถานศึกษาทุกแห่ง');
    setContentSummary('แจ้งแนวทางการจัดกิจกรรมการเรียนรู้แบบโครงงานฐานสมรรถนะ (Active Learning) พร้อมเกณฑ์การขอรับเงินสนับสนุนกิจกรรมห้องเรียนวิทยาศาสตร์');
    setTags('Active Learning, วิทยาศาสตร์, สพฐ., แผนการสอน');
    setFileName('Science_Math_Competency_2569.pdf');
    setFileSize('2.6 MB');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !bookNumber.trim()) {
      alert('กรุณากรอกเลขที่หนังสือและชื่อเรื่อง');
      return;
    }

    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      bookNumber,
      registerNumber: registerNumber || undefined,
      title,
      departmentId,
      subFolderId: subFolderId || (currentDept?.subFolders[0]?.id ?? 'gen-saraban'),
      date,
      registeredAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      fromAgency,
      toAgency,
      docType,
      urgency,
      secrecy,
      status: 'pending_approval',
      fiscalYear: '2569',
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      fileType: fileName.endsWith('.xlsx') ? 'xlsx' : fileName.endsWith('.docx') ? 'docx' : 'pdf',
      fileSize,
      fileName,
      contentSummary: contentSummary || title,
      officialBodyContent: contentSummary,
      directorOrder: '',
      isBookmarked: false,
    };

    onSaveDocument(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                ลงทะเบียน / อัปโหลดเอกสารราชการ
              </h2>
              <p className="text-xs text-slate-500">
                ระบบสารบรรณและจัดเก็บเอกสาร 4 ฝ่าย สพฐ.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleFillSample}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1 rounded-lg hover:bg-blue-50 border border-blue-200 transition-colors"
            >
              กรอกข้อมูลตัวอย่าง
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* Target Department & Subfolder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ฝ่ายงานปลายทาง (4 ฝ่าย สพฐ.) *
              </label>
              <select
                value={departmentId}
                onChange={(e) => handleDeptChange(e.target.value as DepartmentType)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {OBEC_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.thaiName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                แฟ้มย่อย / กลุ่มงาน *
              </label>
              <select
                value={subFolderId}
                onChange={(e) => setSubFolderId(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {currentDept?.subFolders.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Book Number & Register Number */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                เลขที่หนังสือ (เช่น ศธ 04225.12/ว 450) *
              </label>
              <input
                type="text"
                required
                value={bookNumber}
                onChange={(e) => setBookNumber(e.target.value)}
                placeholder="ระบุเลขที่หนังสือราชการ..."
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                เลขทะเบียนรับ (ถ้ามี)
              </label>
              <input
                type="text"
                value={registerNumber}
                onChange={(e) => setRegisterNumber(e.target.value)}
                placeholder="เช่น 142/2569"
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Document Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              ชื่อเรื่องเอกสาร / หนังสือราชการ *
            </label>
            <textarea
              required
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ระบุชื่อเรื่อง เช่น ขอความอนุเคราะห์ส่งบุคลากรเข้าร่วมประชุม..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none font-medium"
            />
          </div>

          {/* Sender & Recipient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                จากหน่วยงาน (ผู้ส่ง) *
              </label>
              <input
                type="text"
                required
                value={fromAgency}
                onChange={(e) => setFromAgency(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ถึง (ผู้รับ) *
              </label>
              <input
                type="text"
                required
                value={toAgency}
                onChange={(e) => setToAgency(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Doc Type, Urgency, Secrecy, Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ประเภทหนังสือ
              </label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocType)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="incoming">หนังสือรับ (ภายนอก)</option>
                <option value="outgoing">หนังสือส่ง (ภายนอก)</option>
                <option value="order">คำสั่งโรงเรียน</option>
                <option value="memo">บันทึกข้อความ (ภายใน)</option>
                <option value="announcement">ประกาศ</option>
                <option value="plan">แผนงาน / โครงการ</option>
                <option value="sar">รายงาน SAR</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ชั้นความเร็ว
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="normal">ปกติ</option>
                <option value="urgent">ด่วน</option>
                <option value="very_urgent">ด่วนมาก</option>
                <option value="most_urgent">ด่วนที่สุด</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ชั้นความลับ
              </label>
              <select
                value={secrecy}
                onChange={(e) => setSecrecy(e.target.value as SecrecyLevel)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="normal">ปกติ</option>
                <option value="confidential">ลับ</option>
                <option value="secret">ลับมาก</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ลงวันที่
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>
          </div>

          {/* Content Summary */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700">
                สรุปสาระสำคัญของหนังสือ
              </label>
            </div>
            <textarea
              rows={3}
              value={contentSummary}
              onChange={(e) => setContentSummary(e.target.value)}
              placeholder="สรุปประเด็นสำคัญ เพื่อให้ผู้บริหารพิจารณาสั่งการได้อย่างรวดเร็ว..."
              className="w-full p-2.5 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          {/* File Attachment Dropzone (Simulated) */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
            <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
            <div className="font-medium text-slate-700">
              แนบไฟล์เอกสาร (PDF, Word, Excel)
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ไฟล์ปัจจุบัน: <span className="font-semibold text-blue-600">{fileName}</span> ({fileSize})
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              คำค้นหา / ป้ายกำกับ (คั่นด้วยจุลภาค)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="เช่น สพฐ., คำสั่ง, วิชาการ, อบรม"
              className="w-full p-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold transition-all shadow-xs cursor-pointer"
            >
              บันทึกและลงทะเบียนเอกสาร
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
