import { useState, useEffect } from 'react';
import { FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useConfirm } from '../context/ModalContext';
import axiosInstance from '../api/axios';
import { TableSkeleton } from '../components/common/Skeleton';
import { useTranslation } from 'react-i18next';

const AdminStudents = () => {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get('/users/students');
        setStudents(res.data.data || []);
      } catch {
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleDelete = async (student) => {
    if (!await confirm({ title: 'Delete Student', message: `Delete ${student.name}?`, confirmLabel: 'Delete', destructive: true })) return;
    try {
      await axiosInstance.delete(`/users/${student._id}`);
      setStudents(prev => prev.filter(s => s._id !== student._id));
      toast.success('Student deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggleStatus = async (student) => {
    try {
      const res = await axiosInstance.put(`/users/${student._id}`, { isVerified: !student.isVerified });
      setStudents(prev => prev.map(s => s._id === student._id ? { ...s, isVerified: res.data.isVerified } : s));
      toast.success(res.data.isVerified ? 'Student activated' : 'Student deactivated');
    } catch {
      toast.error('Failed to toggle status');
    }
  };

  if (loading) return <div className="p-6"><TableSkeleton rows={8} cols={5} /></div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.manageStudents', { count: students.length })}</h2>

      <div className="rounded-3xl border border-gray-150 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        {/* Desktop: Table view */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                <th className="py-4 px-6">{t('admin.studentName')}</th>
                <th className="py-4 px-6">{t('admin.studentEmail')}</th>
                <th className="py-4 px-6">{t('admin.studentDepartment')}</th>
                <th className="py-4 px-6">{t('admin.studentPhone')}</th>
                <th className="py-4 px-6">{t('admin.status')}</th>
                <th className="py-4 px-6 text-right">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-850 text-sm">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50/40 dark:hover:bg-gray-850/20">
                  <td className="py-4 px-6 font-bold text-gray-950 dark:text-white flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-xs dark:bg-emerald-950/40 dark:text-emerald-400">
                      {student.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    {student.name}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-300">{student.email}</td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{student.department || '-'}</td>
                  <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{student.phone || '-'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${student.isVerified ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'}`}>
                      {student.isVerified ? t('admin.active') : t('admin.inactive')}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleToggleStatus(student)} className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-[#0084D1] dark:hover:bg-gray-800" title={t('admin.toggleStatus')}>
                        {student.isVerified ? <FaToggleOn className="h-4 w-4 text-emerald-500" /> : <FaToggleOff className="h-4 w-4" />}
                      </button>
                      <button onClick={() => handleDelete(student)} className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" title={t('common.delete')}>
                        <FaTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: Card view */}
        <div className="divide-y divide-gray-100 dark:divide-gray-850 md:hidden">
          {students.map((student) => (
            <div key={student._id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm dark:bg-emerald-950/40 dark:text-emerald-400">
                    {student.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-950 dark:text-white">{student.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{student.email}</p>
                  </div>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold shrink-0 ${student.isVerified ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400' : 'bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400'}`}>
                  {student.isVerified ? t('admin.active') : t('admin.inactive')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-gray-400">{t('admin.studentDepartment')}</span>
                  <p className="text-gray-700 dark:text-gray-300">{student.department || '-'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-400">{t('admin.studentPhone')}</span>
                  <p className="text-gray-700 dark:text-gray-300">{student.phone || '-'}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={() => handleToggleStatus(student)} className="flex h-9 min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 text-xs font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">
                  {student.isVerified ? <FaToggleOn className="h-4 w-4 text-emerald-500" /> : <FaToggleOff className="h-4 w-4" />}
                  {student.isVerified ? t('admin.active') : t('admin.inactive')}
                </button>
                <button onClick={() => handleDelete(student)} className="flex h-9 min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-gray-700">
                  <FaTrash className="h-4 w-4" />
                  {t('common.delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;
