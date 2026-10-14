export type DepartmentType = 'academic' | 'budget' | 'personnel' | 'general';

export type DocType = 
  | 'incoming'       // หนังสือรับภายนอก
  | 'outgoing'       // หนังสือส่งภายนอก
  | 'order'          // คำสั่งโรงเรียน
  | 'announcement'   // ประกาศ
  | 'memo'           // บันทึกข้อความภายใน
  | 'plan'           // แผนงาน / รายงานโครงการ
  | 'sar'            // รายงานประเมินตนเอง (SAR)
  | 'other';         // อื่นๆ

export type UrgencyLevel = 'normal' | 'urgent' | 'very_urgent' | 'most_urgent';
// ปกติ, ด่วน, ด่วนมาก, ด่วนที่สุด

export type SecrecyLevel = 'normal' | 'confidential' | 'secret' | 'top_secret';
// ปกติ, ลับ, ลับมาก, ลับที่สุด

export type DocumentStatus = 'draft' | 'pending_approval' | 'signed' | 'circulated' | 'archived';

export interface SignatureEntry {
  role: string;
  name: string;
  date: string;
  action: string;
  note?: string;
}

export interface DocumentItem {
  id: string;
  bookNumber: string;         // e.g. "ศธ 04225/ว 1042" หรือ "คำสั่งที่ 145/2569"
  registerNumber?: string;     // เลขทะเบียนรับ เช่น "142/2569"
  title: string;              // ชื่อเรื่อง
  departmentId: DepartmentType;
  subFolderId: string;
  date: string;               // วันที่ลงในหนังสือ เช่น "14 ต.ค. 2569"
  registeredAt: string;       // วันเวลาที่ลงทะเบียนในระบบ
  fromAgency: string;         // จาก เช่น "สพป. นครราชสีมา เขต 1", "กลุ่มบริหารวิชาการ"
  toAgency: string;           // ถึง เช่น "ผู้อำนวยการโรงเรียน", "คณะครูทุกคน"
  docType: DocType;
  urgency: UrgencyLevel;
  secrecy: SecrecyLevel;
  status: DocumentStatus;
  fiscalYear: string;         // เช่น "2569"
  tags: string[];
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx' | 'image';
  fileSize: string;
  fileName: string;
  contentSummary: string;     // สรุปสาระสำคัญ
  officialBodyContent?: string; // เนื้อหาหนังสือราชการจำลอง
  directorOrder?: string;     // เกษียณสั่งการของผู้อำนวยการ
  directorOrderDate?: string;
  assignedTo?: string;        // ผู้รับผิดชอบดำเนินการ
  signatures?: SignatureEntry[];
  isBookmarked?: boolean;
}

export interface SubFolder {
  id: string;
  departmentId: DepartmentType;
  name: string;
  description: string;
  iconName: string;
  documentCount?: number;
}

export interface DepartmentInfo {
  id: DepartmentType;
  thaiName: string;
  shortName: string;
  engName: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  description: string;
  subFolders: SubFolder[];
}

export interface UserRole {
  id: string;
  title: string;
  name: string;
  department?: DepartmentType;
  badge: string;
}
