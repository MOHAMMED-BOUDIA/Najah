import { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaLayerGroup } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useConfirm } from '../context/ModalContext';
import axiosInstance from '../api/axios';
import { TableSkeleton } from '../components/common/Skeleton';
import { useTranslation } from 'react-i18next';

const AdminDepartments = () => {
  const confirm = useConfirm();
  const { t } = useTranslation();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get('/departments');
      setDepartments(res.data || []);
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const openCreate = () => {
    setEditing(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  const openEdit = (dept) => {
    setEditing(dept);
    setFormData({ name: dept.name });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Department name is required');
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await axiosInstance.put(`/departments/${editing._id}`, { name: formData.name });
        toast.success('Department updated!');
        fetchDepartments();
      } else {
        await axiosInstance.post('/departments', { name: formData.name });
        toast.success('Department created!');
        fetchDepartments();
      }
      setShowForm(false);
      setEditing(null);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dept) => {
    if (!await confirm({ title: 'Delete Department', message: `Delete "${dept.name}"? ${dept.instructorCount > 0 ? `\n${dept.instructorCount} instructor(s) assigned.` : ''}`, confirmLabel: 'Delete', destructive: true })) return;
    try {
      await axiosInstance.delete(`/departments/${dept._id}`);
      setDepartments(prev => prev.filter(d => d._id !== dept._id));
      toast.success('Department deleted');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <div className="p-6"><TableSkeleton rows={5} cols={3} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('admin.manageDepartments', { count: departments.length })}</h2>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-xl bg-[#0084D1] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0277BD]">
          <FaPlus className="h-4 w-4" /> {t('admin.addDepartment')}
        </button>
      </div>

      {showForm && (
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{editing ? t('admin.editDepartment') : t('admin.addDepartment')}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><FaTimes className="h-5 w-5" /></button>
          </div>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('admin.deptName')}</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder={t('admin.deptPlaceholder')}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button onClick={() => setShowForm(false)} className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400">{t('common.cancel')}</button>
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#0084D1] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0277BD] disabled:opacity-50">
              <FaSave className="h-4 w-4" /> {saving ? t('admin.saving') : editing ? t('admin.update') : t('admin.create')}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-gray-150 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
              <th className="py-4 px-6">{t('admin.deptName')}</th>
              <th className="py-4 px-6">{t('admin.deptInstructors')}</th>
              <th className="py-4 px-6">{t('admin.deptCreated')}</th>
              <th className="py-4 px-6 text-right">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-850 text-sm">
            {departments.map((dept) => (
              <tr key={dept._id} className="hover:bg-gray-50/40 dark:hover:bg-gray-850/20">
                <td className="py-4 px-6 font-bold text-gray-950 dark:text-white flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0084D1]/10 text-[#0084D1] font-bold text-xs">
                    <FaLayerGroup className="h-4 w-4" />
                  </div>
                  {dept.name}
                </td>
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{dept.instructorCount}</td>
                <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{new Date(dept.createdAt).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => openEdit(dept)} className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 hover:text-[#0084D1] dark:hover:bg-gray-800" title={t('common.edit')}>
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(dept)} className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20" title={t('common.delete')}>
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDepartments;
