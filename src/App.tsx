/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DepartmentType, DocumentItem, SubFolder, UserRole } from './types/document';
import { OBEC_DEPARTMENTS, INITIAL_DOCUMENTS, USER_ROLES } from './data/departmentsData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { FolderWorkspace } from './components/FolderWorkspace';
import { OfficialDocumentViewerModal } from './components/OfficialDocumentViewerModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { CreateFolderModal } from './components/CreateFolderModal';
import { RegisterTableView } from './components/RegisterTableView';
import { DashboardOverview } from './components/DashboardOverview';
import { GeminiSchoolAssistant } from './components/GeminiSchoolAssistant';

export default function App() {
  // Persistent documents state
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem('obec_documents_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DOCUMENTS;
  });

  // Persistent custom subfolders
  const [customFolders, setCustomFolders] = useState<SubFolder[]>(() => {
    try {
      const saved = localStorage.getItem('obec_custom_folders_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Active view states
  // Default to folder view with 'general' and 'gen-saraban' ("งานธุรการ (รับ-ส่งหนังสือ)") as in user screenshot!
  const [currentView, setCurrentView] = useState<string>('folder');
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentType | null>('general');
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>('gen-saraban');
  const [selectedYear, setSelectedYear] = useState<string>('2569');
  const [currentRole, setCurrentRole] = useState<UserRole>(USER_ROLES[0]);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<DocumentItem | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('obec_documents_v1', JSON.stringify(documents));
    } catch (e) {
      console.error(e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('obec_custom_folders_v1', JSON.stringify(customFolders));
    } catch (e) {
      console.error(e);
    }
  }, [customFolders]);

  // Combine standard and custom subfolders
  const getAllSubFolders = (deptId: DepartmentType) => {
    const defaultList = OBEC_DEPARTMENTS.find((d) => d.id === deptId)?.subFolders || [];
    const customList = customFolders.filter((f) => f.departmentId === deptId);
    return [...defaultList, ...customList];
  };

  // Counts by department
  const documentsCountByDept = {
    academic: documents.filter((d) => d.departmentId === 'academic').length,
    budget: documents.filter((d) => d.departmentId === 'budget').length,
    personnel: documents.filter((d) => d.departmentId === 'personnel').length,
    general: documents.filter((d) => d.departmentId === 'general').length,
  };

  const pendingApprovalsCount = documents.filter(
    (d) => !d.directorOrder && d.status === 'pending_approval'
  ).length;

  // Navigation handlers
  const handleNavigateHome = () => {
    setCurrentView('dashboard');
    setSelectedDeptId(null);
    setSelectedFolderId(null);
  };

  const handleSelectDepartment = (deptId: DepartmentType) => {
    setSelectedDeptId(deptId);
    const subfolders = getAllSubFolders(deptId);
    if (subfolders.length > 0) {
      setSelectedFolderId(subfolders[0].id);
      setCurrentView('folder');
    } else {
      setSelectedFolderId(null);
      setCurrentView('department');
    }
  };

  const handleSelectFolder = (deptId: DepartmentType, folderId: string) => {
    setSelectedDeptId(deptId);
    setSelectedFolderId(folderId);
    setCurrentView('folder');
  };

  const handleSelectRegister = (regType: string) => {
    setCurrentView('register-' + regType);
    setSelectedDeptId(null);
    setSelectedFolderId(null);
  };

  // Document actions
  const handleSaveDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const handleSaveFolder = (newFolder: SubFolder) => {
    setCustomFolders((prev) => [...prev, newFolder]);
    if (selectedDeptId === newFolder.departmentId) {
      setSelectedFolderId(newFolder.id);
      setCurrentView('folder');
    }
  };

  const handleSaveDirectorOrder = (docId: string, orderText: string) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            directorOrder: orderText,
            directorOrderDate: new Date().toLocaleDateString('th-TH'),
            status: orderText.trim() ? 'signed' : doc.status,
          };
        }
        return doc;
      })
    );
    if (viewingDoc && viewingDoc.id === docId) {
      setViewingDoc((prev) => prev ? { ...prev, directorOrder: orderText, status: 'signed' } : null);
    }
  };

  const handleToggleBookmark = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === docId ? { ...doc, isBookmarked: !doc.isBookmarked } : doc))
    );
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('คุณต้องการลบเอกสารฉบับนี้ออกจากระบบใช่หรือไม่?')) {
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (viewingDoc && viewingDoc.id === docId) {
        setViewingDoc(null);
      }
    }
  };

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(documents, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `OBEC_Documents_Backup_${selectedYear}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Get active subfolder info
  const activeSubFolders = selectedDeptId ? getAllSubFolders(selectedDeptId) : [];
  const currentSubFolder = activeSubFolders.find((f) => f.id === selectedFolderId) || null;

  // Filter documents for the current folder
  const currentFolderDocs = documents.filter((d) => {
    if (currentView === 'folder') {
      if (selectedFolderId) {
        return d.subFolderId === selectedFolderId || (selectedDeptId && d.departmentId === selectedDeptId && !d.subFolderId);
      }
      return selectedDeptId ? d.departmentId === selectedDeptId : true;
    }
    if (currentView === 'department') {
      return selectedDeptId ? d.departmentId === selectedDeptId : true;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Sarabun',sans-serif] text-slate-800">
      {/* Top Application Header */}
      <Header
        currentRole={currentRole}
        onSelectRole={setCurrentRole}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAiAssistant={() => setIsAiOpen(true)}
        pendingApprovalsCount={pendingApprovalsCount}
        onExportAll={handleExportAll}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Tree Navigator / Sidebar */}
        <Sidebar
          currentView={currentView}
          selectedDeptId={selectedDeptId}
          selectedFolderId={selectedFolderId}
          onNavigateHome={handleNavigateHome}
          onSelectDepartment={handleSelectDepartment}
          onSelectFolder={handleSelectFolder}
          onSelectRegister={handleSelectRegister}
          onOpenCreateFolder={(deptId) => {
            if (deptId) setSelectedDeptId(deptId);
            setIsCreateFolderOpen(true);
          }}
          currentRole={currentRole}
          documentsCountByDept={documentsCountByDept}
          totalDocumentsCount={documents.length}
        />

        {/* Central Workspace */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
          {/* Breadcrumb Trail */}
          <Breadcrumbs
            currentView={currentView}
            selectedDeptId={selectedDeptId}
            selectedFolderId={selectedFolderId}
            onNavigateHome={handleNavigateHome}
            onNavigateDept={handleSelectDepartment}
            subFolderName={currentSubFolder?.name}
            registerTitle={
              currentView.startsWith('register-')
                ? currentView === 'register-incoming'
                  ? 'ทะเบียนหนังสือรับ'
                  : currentView === 'register-outgoing'
                  ? 'ทะเบียนหนังสือส่ง'
                  : currentView === 'register-orders'
                  ? 'ทะเบียนคำสั่งโรงเรียน'
                  : currentView === 'register-memos'
                  ? 'ทะเบียนประกาศ/บันทึก'
                  : 'เอกสารรอทำลาย'
                : undefined
            }
          />

          {/* View Router */}
          {currentView === 'dashboard' ? (
            <DashboardOverview
              documents={documents}
              onSelectDepartment={handleSelectDepartment}
              onSelectFolder={handleSelectFolder}
              onViewDocument={(doc) => setViewingDoc(doc)}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenAiAssistant={() => setIsAiOpen(true)}
              selectedYear={selectedYear}
            />
          ) : currentView.startsWith('register-') ? (
            <RegisterTableView
              registerType={
                currentView === 'register-incoming'
                  ? 'incoming'
                  : currentView === 'register-outgoing'
                  ? 'outgoing'
                  : currentView === 'register-orders'
                  ? 'orders'
                  : currentView === 'register-memos'
                  ? 'memos'
                  : 'archive'
              }
              documents={documents}
              onViewDocument={(doc) => setViewingDoc(doc)}
              onOpenUpload={() => setIsUploadOpen(true)}
              selectedYear={selectedYear}
            />
          ) : (
            <FolderWorkspace
              currentFolder={currentSubFolder}
              documents={currentFolderDocs}
              subFolders={activeSubFolders}
              onOpenUpload={() => setIsUploadOpen(true)}
              onOpenCreateSubFolder={() => setIsCreateFolderOpen(true)}
              onSelectSubFolder={(fId) => selectedDeptId && handleSelectFolder(selectedDeptId, fId)}
              onViewDocument={(doc) => setViewingDoc(doc)}
              onToggleBookmark={handleToggleBookmark}
              onDeleteDocument={handleDeleteDocument}
              onQuickEndorse={(doc) => setViewingDoc(doc)}
            />
          )}
        </main>
      </div>

      {/* Official Thai Letter Simulation / Viewer Modal */}
      {viewingDoc && (
        <OfficialDocumentViewerModal
          document={viewingDoc}
          onClose={() => setViewingDoc(null)}
          onSaveOrder={handleSaveDirectorOrder}
          currentRole={currentRole}
        />
      )}

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSaveDocument={handleSaveDocument}
        defaultDeptId={selectedDeptId || 'general'}
        defaultFolderId={selectedFolderId || 'gen-saraban'}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        onSaveFolder={handleSaveFolder}
        defaultDeptId={selectedDeptId || 'general'}
      />

      {/* Floating Gemini AI Assistant - Matching the Bubblegum Sparkles button in screenshot */}
      <GeminiSchoolAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onOpen={() => setIsAiOpen(true)}
      />
    </div>
  );
}
