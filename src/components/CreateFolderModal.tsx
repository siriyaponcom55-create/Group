import React, { useState } from 'react';
import { X, FolderPlus, Folder } from 'lucide-react';
import { DepartmentType, SubFolder } from '../types/document';
import { OBEC_DEPARTMENTS } from '../data/departmentsData';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFolder: (folder: SubFolder) => void;
  defaultDeptId?: DepartmentType;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  onSaveFolder,
  defaultDeptId = 'general',
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState<DepartmentType>(defaultDeptId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newFolder: SubFolder = {
      id: 'sub-' + Date.now(),
      departmentId,
      name: name.trim(),
      description: description.trim() || 'จัดการเอกสารและหนังสือราชการที่เกี่ยวข้อง',
      iconName: 'Folder',
    };

    onSaveFolder(newFolder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">สร้างแฟ้มงานย่อยใหม่</h3>
              <p className="text-[11px] text-slate-500">จัดหมวดหมู่เอกสารตามโครงสร้าง 4 ฝ่าย สพฐ.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              สังกัดฝ่ายงาน (4 ฝ่าย สพฐ.) *
            </label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value as DepartmentType)}
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
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
              ชื่อแฟ้มงานย่อย *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น งานทะเบียนนักเรียน, งานจัดซื้อ e-GP, งานประกัน SAR..."
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              คำอธิบายหน้าที่ / รายละเอียดเอกสาร
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุประเภทเอกสารที่จะจัดเก็บในแฟ้มนี้..."
              className="w-full p-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold cursor-pointer shadow-xs"
            >
              สร้างแฟ้มงาน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
