import { useState, useEffect } from 'react';
import { FaFileAlt, FaFolderOpen, FaPlus, FaTrash, FaDownload, FaFileUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../api/axios';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { useConfirm } from '../context/ModalContext';

const Documents = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [docsLoading, setDocsLoading] = useState(false);

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // File upload state
  const [name, setName] = useState('');
  const [type, setType] = useState('rapport');
  const [comment, setComment] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  // Fetch projects list
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/projects');
        const projData = response.data || [];
        setProjects(projData);
        if (projData.length > 0) {
          setSelectedProjectId(projData[0]._id);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load projects list.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch documents when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDocuments([]);
      return;
    }

    const fetchDocs = async () => {
      setDocsLoading(true);
      try {
        const response = await axiosInstance.get(`/documents/project/${selectedProjectId}`);
        setDocuments(response.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load documents.');
      } finally {
        setDocsLoading(false);
      }
    };

    fetchDocs();
  }, [selectedProjectId]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      // Auto fill name if empty
      if (!name) {
        setName(selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name);
      }
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setFormLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('type', type);
      formData.append('project', selectedProjectId);
      formData.append('comment', comment);
      formData.append('file', file);

      const response = await axiosInstance.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setDocuments((prev) => [response.data, ...prev]);
      setIsOpen(false);
      resetForm();
      toast.success('Document uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload document.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDoc = async (docId) => {
    const ok = await confirm({ title: t('documents.deleteDocument'), message: 'Are you sure you want to delete this document?', confirmLabel: t('documents.deleteDocument'), destructive: true });
    if (!ok) return;

    try {
      await axiosInstance.delete(`/documents/${docId}`);
      setDocuments((prev) => prev.filter((d) => d._id !== docId));
      toast.success('Document deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete document.');
    }
  };

  const resetForm = () => {
    setName('');
    setType('rapport');
    setComment('');
    setFile(null);
    setFileName('');
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {t('documents.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('documents.subtitle')}
          </p>
        </div>
        
        {/* Project Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
            <FaFolderOpen className="text-[#0084D1] h-4 w-4" />
            {t('documents.projectLabel')}
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="block w-full max-w-[280px] rounded-xl border border-gray-250 bg-white px-4 py-2 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
          >
            <option value="">{t('documents.chooseProject')}</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title}
              </option>
            ))}
          </select>

          {selectedProjectId && (
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0084D1] text-white shadow-sm hover:bg-[#0277BD] focus:outline-none"
              title={t('documents.uploadDocument')}
            >
              <FaPlus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Documents Registry */}
      {!selectedProjectId ? (
        <EmptyState
          icon={FaFileAlt}
          title={t('documents.selectProjectFirst')}
          description={t('documents.selectProjectDesc')}
        />
      ) : docsLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FaFileAlt}
          title={t('documents.noDocuments')}
          description={t('documents.noDocumentsDesc')}
          actionText={t('documents.uploadDocument')}
          onActionClick={() => setIsOpen(true)}
        />
      ) : (
        <div className="rounded-3xl border border-gray-150 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                  <th className="py-4 px-6">{t('documents.name')}</th>
                  <th className="py-4 px-6">{t('documents.type')}</th>
                  <th className="py-4 px-6">{t('documents.comments')}</th>
                  <th className="py-4 px-6">{t('documents.dateUploaded')}</th>
                  <th className="py-4 px-6 text-right">{t('documents.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850 text-sm">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50/40 dark:hover:bg-gray-850/20">
                    <td className="py-4 px-6 font-semibold text-gray-950 dark:text-white flex items-center gap-3">
                      <FaFileAlt className="h-5 w-5 text-[#0084D1] flex-shrink-0" />
                      <span className="truncate max-w-[200px]">{doc.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-block rounded-lg bg-[#0084D1]/10 px-2.5 py-0.5 text-xs font-bold text-[#0084D1] capitalize">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400 max-w-[250px] truncate">
                      {doc.comment || '-'}
                    </td>
                    <td className="py-4 px-6 text-xs text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-right space-x-1">
                      {doc.file && (
                        <a
                          href={`http://localhost:5000/uploads/${doc.file}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#0084D1] hover:bg-[#0084D1]/10"
                          title={t('documents.downloadFile')}
                        >
                          <FaDownload className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteDoc(doc._id)}
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        title={t('documents.deleteDocument')}
                      >
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={t('documents.uploadModal')}>
        <form onSubmit={handleUploadSubmit} className="space-y-5">
          {/* File Picker Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('documents.selectFile')}
            </label>
            <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 p-6 dark:border-gray-850 bg-gray-50/50 hover:bg-white transition-colors duration-200">
              <label className="flex flex-col items-center justify-center cursor-pointer text-center w-full">
                <FaFileUpload className="h-8 w-8 text-[#0084D1] mb-2" />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {fileName || t('documents.chooseFile')}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {t('documents.fileHint')}
                </span>
                <input
                  type="file"
                  required
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Document Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('documents.displayName')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder={t('documents.displayNamePlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('documents.documentType')}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              >
                <option value="rapport">{t('documents.typeReport')}</option>
                <option value="presentation">{t('documents.typePresentation')}</option>
                <option value="code">{t('documents.typeSourceCode')}</option>
                <option value="other">{t('documents.typeOther')}</option>
              </select>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('documents.comment')}
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder={t('documents.commentPlaceholder')}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-750 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-xl bg-[#0084D1] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0277BD] disabled:bg-[#0084D1]/50"
            >
              {t('common.upload')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Documents;
