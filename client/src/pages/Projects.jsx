import { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import ProjectCard from '../components/project/ProjectCard';
import ProjectForm from '../components/project/ProjectForm';
import Modal from '../components/common/Modal';
import { CardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { useConfirm } from '../context/ModalContext';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [projects, setProjects] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Form Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchProjects = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true); else setLoading(true);
      const res = await axiosInstance.get(`/projects?page=${pageNum}&limit=20`);
      const result = res.data.data || [];
      setProjects(prev => append ? [...prev, ...result] : result);
      setTotalPages(res.data.totalPages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load projects.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const fetchFormMetadata = async () => {
    try {
      const supervisorsRes = await axiosInstance.get('/users/instructors');
      setSupervisors(supervisorsRes.data.data || []);
      const teamsRes = await axiosInstance.get('/teams');
      setTeams(teamsRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const initPage = async () => {
      setLoading(true);
      await Promise.all([fetchProjects(), fetchFormMetadata()]);
      setLoading(false);
    };
    initPage();
  }, []);

  const handleCreateSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const response = await axiosInstance.post('/projects', formData);
      setProjects((prev) => [response.data, ...prev]);
      setIsCreateOpen(false);
      toast.success('Project proposed successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create project proposal.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (project) => {
    setCurrentProject(project);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (formData) => {
    setFormLoading(true);
    try {
      const response = await axiosInstance.put(`/projects/${currentProject._id}`, formData);
      setProjects((prev) =>
        prev.map((proj) => (proj._id === currentProject._id ? response.data : proj))
      );
      setIsEditOpen(false);
      toast.success('Project updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update project.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteClick = async (projectId) => {
    const ok = await confirm({
      title: 'Delete Project',
      message: 'Are you sure you want to delete this project? This will delete associated tasks, meetings, and documents.',
      confirmLabel: 'Delete',
      destructive: true,
    });
    if (!ok) return;

    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
      toast.success('Project deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete project.');
    }
  };

  // Filter projects by search query and status filter
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? project.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {t('projects.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('projects.subtitle')}
          </p>
        </div>
        <div>
          <button
            onClick={() => setIsCreateOpen(true)}
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0084D1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0277BD] sm:w-auto"
          >
            <FaPlus className="h-4 w-4" />
            {t('projects.newProject')}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-150 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:flex-row md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaSearch className="h-4 w-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm outline-none focus:border-[#0084D1] focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white"
            placeholder={t('projects.searchPlaceholder')}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Filter status */}
        <div className="relative min-w-[200px]">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <FaFilter className="h-3.5 w-3.5" />
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-xl border border-gray-250 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
          >
            <option value="">{t('projects.allStatuses')}</option>
            <option value="pending">{t('common.statusPending')}</option>
            <option value="approved">{t('common.statusApproved')}</option>
            <option value="in-progress">{t('common.statusInProgress')}</option>
            <option value="completed">{t('common.statusCompleted')}</option>
            <option value="rejected">{t('common.statusRejected')}</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          title={t('projects.noProjectsFound')}
          description={t('projects.noProjectsDesc')}
          actionText={searchQuery || statusFilter ? t('projects.clearFilters') : t('projects.newProject')}
          onActionClick={() => {
            if (searchQuery || statusFilter) {
              setSearchQuery('');
              setStatusFilter('');
            } else {
              setIsCreateOpen(true);
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project._id} className="relative group h-full">
              <ProjectCard project={project} />
              
              {/* Overlay controls for Edit/Delete (visible on hover) */}
              <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                {(user.role === 'admin' || user.role === 'instructor' || project.supervisor?._id === user.id) && (
                  <>
                    <button
                      onClick={() => handleEditClick(project)}
                      className="rounded-lg bg-white p-2 text-gray-600 shadow-sm border border-gray-100 hover:bg-[#0084D1]/10 hover:text-[#0084D1] transition dark:bg-gray-800 dark:text-gray-300 dark:border-gray-750"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project._id)}
                      className="rounded-lg bg-white p-2 text-red-600 shadow-sm border border-gray-100 hover:bg-red-50 hover:text-red-700 transition dark:bg-gray-800 dark:text-red-400 dark:border-gray-750 dark:hover:bg-red-950/30"
                    >
                      {t('common.delete')}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {page < totalPages && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchProjects(page + 1, true)}
            disabled={loadingMore}
            className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-750 disabled:opacity-50 transition"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-[#0084D1] border-t-transparent rounded-full" />
                Loading...
              </span>
            ) : (
              `Load More (${page}/${totalPages})`
            )}
          </button>
        </div>
      )}

      {/* Propose Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title={t('projects.newProjectModal')}>
        <ProjectForm
          supervisors={supervisors}
          teams={teams}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateOpen(false)}
          loading={formLoading}
          userRole={user.role}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={t('projects.editProjectModal')}>
        <ProjectForm
          initialData={currentProject}
          supervisors={supervisors}
          teams={teams}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          loading={formLoading}
          isEdit={true}
          userRole={user.role}
        />
      </Modal>
    </div>
  );
};

export default Projects;
