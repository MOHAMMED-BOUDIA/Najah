import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaChalkboardTeacher, 
  FaUsers, 
  FaTasks, 
  FaFileAlt, 
  FaCalendarCheck, 
  FaArrowLeft, 
  FaTrash, 
  FaDownload, 
  FaPlus 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import { formatDate } from '../utils/helpers';
import { useConfirm } from '../context/ModalContext';
import { useTranslation } from 'react-i18next';

const ProjectDetails = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status/Progress editing states
  const [statusVal, setStatusVal] = useState('pending');
  const [progressVal, setProgressVal] = useState(0);
  const [updating, setUpdating] = useState(false);

  const fetchProjectData = async () => {
    try {
      const res = await axiosInstance.get(`/projects/${id}`);
      setProject(res.data);
      setStatusVal(res.data.status || 'pending');
      setProgressVal(res.data.progress || 0);

      // Fetch related data
      const [tasksRes, docsRes, meetingsRes] = await Promise.all([
        axiosInstance.get(`/tasks/project/${id}`).catch(() => ({ data: [] })),
        axiosInstance.get(`/documents/project/${id}`).catch(() => ({ data: [] })),
        axiosInstance.get(`/meetings/project/${id}`).catch(() => ({ data: [] }))
      ]);

      setTasks(tasksRes.data || []);
      setDocuments(docsRes.data || []);
      setMeetings(meetingsRes.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load project details.');
      navigate('/projects');
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchProjectData();
    setLoading(false);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await axiosInstance.patch(`/projects/${id}/status`, { status: newStatus });
      setStatusVal(newStatus);
      setProject(prev => ({ ...prev, status: newStatus }));
      toast.success('Status updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateProgress = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axiosInstance.patch(`/projects/${id}/progress`, { progress: progressVal });
      setProject(prev => ({ ...prev, progress: progressVal }));
      toast.success('Progress updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update progress.');
    } finally {
      setUpdating(false);
    }
  };

  // Delete document
  const handleDeleteDoc = async (docId) => {
    const ok = await confirm({ title: 'Delete Document', message: 'Delete this document?', confirmLabel: 'Delete', destructive: true });
    if (!ok) return;
    try {
      await axiosInstance.delete(`/documents/${docId}`);
      setDocuments(prev => prev.filter(d => d._id !== docId));
      toast.success('Document deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete document.');
    }
  };

  // Delete meeting
  const handleDeleteMeeting = async (meetId) => {
    const ok = await confirm({ title: 'Delete Meeting', message: 'Delete this meeting?', confirmLabel: 'Delete', destructive: true });
    if (!ok) return;
    try {
      await axiosInstance.delete(`/meetings/${meetId}`);
      setMeetings(prev => prev.filter(m => m._id !== meetId));
      toast.success('Meeting deleted!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete meeting.');
    }
  };

  if (loading || !project) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  // Calculate task counts by status
  const taskCounts = tasks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    { todo: 0, 'in-progress': 0, review: 0, done: 0 }
  );

  const isSupervisorOrAdmin = user.role === 'admin' || user.role === 'instructor';

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <FaArrowLeft className="h-4 w-4" />
        {t('projects.backToProjects')}
      </Link>

      {/* Main Project Overview Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Core Info */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {project.title}
            </h1>
            <StatusBadge status={project.status} />
          </div>

          <div className="space-y-1">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('projects.description')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">{t('projects.technologies')}</h3>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map(tech => (
                  <span
                    key={tech}
                    className="rounded-lg bg-[#0084D1]/10 px-2.5 py-1 text-xs font-semibold text-[#0084D1]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Timeline & Metadata */}
          <div className="grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 dark:border-gray-800 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 dark:bg-gray-800">
                <FaCalendarAlt className="h-5 w-5 text-[#0084D1]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">{t('projects.projectTimeline')}</p>
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </p>
              </div>
            </div>

            {project.supervisor && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 dark:bg-gray-800">
                  <FaChalkboardTeacher className="h-5 w-5 text-[#0084D1]" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">{t('projects.supervisor')}</p>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {project.supervisor.name} ({project.supervisor.department})
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress & Controls Card */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
          <div className="space-y-6">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">{t('projects.projectProgress')}</h3>
            
            {/* Progress Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400">{t('projects.completion')}</span>
                <span className="font-bold text-[#0084D1]">{project.progress}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFB900] to-[#0084D1] transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Controls for status updates */}
            {isSupervisorOrAdmin && (
              <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('projects.updateProjectStatus')}
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updating}
                  className="block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] disabled:bg-gray-50 dark:border-gray-750 dark:bg-gray-800 dark:text-white"
                >
                  <option value="pending">{t('common.statusPending')}</option>
                  <option value="approved">{t('common.statusApproved')}</option>
                  <option value="in-progress">{t('common.statusInProgress')}</option>
                  <option value="completed">{t('common.statusCompleted')}</option>
                  <option value="rejected">{t('common.statusRejected')}</option>
                </select>
              </div>
            )}

            {/* Progress updating form (for everyone, but typically team/supervisor handles it) */}
            <form onSubmit={handleUpdateProgress} className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {t('projects.updateProgress', { val: progressVal })}
                </label>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progressVal}
                onChange={(e) => setProgressVal(parseInt(e.target.value, 10))}
                className="h-2 w-full cursor-pointer rounded-lg bg-gray-200 accent-[#0084D1] dark:bg-gray-800"
              />
              <button
                type="submit"
                disabled={updating || progressVal === project.progress}
                className="w-full rounded-xl bg-[#0084D1]/10 py-2.5 text-sm font-bold text-[#0084D1] hover:bg-[#0084D1]/20 disabled:opacity-50 transition"
              >
                {t('projects.saveProgress')}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Grid: Team & Tasks */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Team Members card */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaUsers className="h-5 w-5 text-[#0084D1]" />
              {t('projects.assignedTeam')}
            </h3>
            {project.team && (
              <span className="text-xs font-semibold text-gray-400">{project.team.name}</span>
            )}
          </div>

          {!project.team ? (
            <div className="text-center py-6 text-sm text-gray-400">
              {t('projects.noTeamAssigned')}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {project.team.members && project.team.members.map((member) => (
                <div key={member._id || member.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0084D1]/10 text-[#0084D1] font-bold text-xs">
                    {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
                      {member.name} {member._id === project.team.leader?._id && <span className="ml-1 text-[10px] bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">{t('projects.leader')}</span>}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.email} • {member.department}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tasks Summary card */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaTasks className="h-5 w-5 text-[#0084D1]" />
              {t('projects.tasksSummary')}
            </h3>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-[#0084D1] hover:text-[#0277BD]"
            >
              {t('projects.openKanban')}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/40 text-center space-y-1">
              <span className="text-xs font-bold text-gray-500">{t('projects.toDo')}</span>
              <p className="text-2xl font-black text-gray-800 dark:text-white">{taskCounts.todo}</p>
            </div>
            <div className="rounded-2xl bg-[#0084D1]/10 p-4 text-center space-y-1">
              <span className="text-xs font-bold text-[#0084D1]">{t('projects.inProgress')}</span>
              <p className="text-2xl font-black text-[#0084D1]">{taskCounts['in-progress']}</p>
            </div>
            <div className="rounded-2xl bg-amber-50/50 p-4 dark:bg-amber-950/20 text-center space-y-1">
              <span className="text-xs font-bold text-amber-500">{t('projects.inReview')}</span>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{taskCounts.review}</p>
            </div>
            <div className="rounded-2xl bg-emerald-50/50 p-4 dark:bg-emerald-950/20 text-center space-y-1">
              <span className="text-xs font-bold text-emerald-500">{t('projects.completed')}</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{taskCounts.done}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Documents & Meetings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Documents panel */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaFileAlt className="h-5 w-5 text-[#0084D1]" />
              {t('projects.documentsList')}
            </h3>
            <Link
              to="/documents"
              className="text-xs font-semibold text-[#0084D1] hover:text-[#0277BD] inline-flex items-center gap-1"
            >
              <FaPlus className="h-3 w-3" /> {t('projects.upload')}
            </Link>
          </div>

          {documents.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              {t('projects.noDocuments')}
            </div>
          ) : (
            <div className="divide-y divide-gray-150 dark:divide-gray-800 max-h-[300px] overflow-y-auto pr-1">
              {documents.map((doc) => (
                <div key={doc._id} className="flex items-center justify-between py-3">
                  <div className="flex items-start gap-2.5 overflow-hidden pr-4">
                    <FaFileAlt className="h-5 w-5 mt-0.5 text-[#0084D1] flex-shrink-0" />
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-gray-400 capitalize">
                        {doc.type} • {doc.comment || t('projects.noComment')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {doc.file && (
                      <a
                        href={`http://localhost:5000/uploads/${doc.file}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg p-2 text-[#0084D1] hover:bg-[#0084D1]/10"
                        title={t('projects.downloadFile')}
                      >
                        <FaDownload className="h-3.5 w-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDeleteDoc(doc._id)}
                      className="rounded-lg p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      title={t('projects.deleteDocument')}
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meetings panel */}
        <div className="rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FaCalendarCheck className="h-5 w-5 text-[#0084D1]" />
              {t('projects.scheduledMeetings')}
            </h3>
            <Link
              to="/meetings"
              className="text-xs font-semibold text-[#0084D1] hover:text-[#0277BD] inline-flex items-center gap-1"
            >
              <FaPlus className="h-3 w-3" /> {t('projects.schedule')}
            </Link>
          </div>

          {meetings.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              {t('projects.noMeetings')}
            </div>
          ) : (
            <div className="divide-y divide-gray-150 dark:divide-gray-800 max-h-[300px] overflow-y-auto pr-1">
              {meetings.map((meet) => (
                <div key={meet._id} className="flex items-center justify-between py-3">
                  <div className="flex items-start gap-2.5">
                    <FaCalendarAlt className="h-5 w-5 mt-0.5 text-[#0084D1] flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                        {meet.title}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(meet.date)} at {meet.time} ({meet.location})
                      </p>
                      {meet.notes && (
                        <p className="text-[11px] text-gray-400 italic">
                          {t('projects.notes')} {meet.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleDeleteMeeting(meet._id)}
                      className="rounded-lg p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      title={t('projects.cancelMeeting')}
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
