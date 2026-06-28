import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFolderOpen, FaPlus, FaTrash, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/helpers';
import { useConfirm } from '../context/ModalContext';

const Meetings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const confirm = useConfirm();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  // Form / Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch projects list
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/projects');
        const projData = response.data.data || [];
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

  // Fetch meetings when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMeetings([]);
      return;
    }

    const fetchMeetings = async () => {
      setMeetingsLoading(true);
      try {
        const response = await axiosInstance.get(`/meetings/project/${selectedProjectId}`);
        setMeetings(response.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load meetings.');
      } finally {
        setMeetingsLoading(false);
      }
    };

    fetchMeetings();
  }, [selectedProjectId]);

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    if (!title.trim() || !date || !time || !location.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setFormLoading(true);
    try {
      const payload = { title, date, time, location, notes };

      if (editingMeeting) {
        const response = await axiosInstance.put(`/meetings/${editingMeeting._id}`, payload);
        setMeetings((prev) => prev.map((m) => (m._id === editingMeeting._id ? response.data : m)));
        toast.success('Meeting updated successfully!');
      } else {
        const response = await axiosInstance.post('/meetings', { ...payload, project: selectedProjectId });
        setMeetings((prev) => [response.data, ...prev]);
        toast.success('Meeting scheduled successfully!');
      }
      setIsOpen(false);
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save meeting.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (meeting) => {
    setEditingMeeting(meeting);
    setTitle(meeting.title);
    setDate(meeting.date ? meeting.date.slice(0, 10) : '');
    setTime(meeting.time || '');
    setLocation(meeting.location || '');
    setNotes(meeting.notes || '');
    setIsOpen(true);
  };

  const handleDeleteMeeting = async (meetingId) => {
    const ok = await confirm({ title: t('meetings.cancelTitle'), message: 'Are you sure you want to cancel this meeting?', confirmLabel: t('meetings.cancelTitle'), destructive: true });
    if (!ok) return;

    try {
      await axiosInstance.delete(`/meetings/${meetingId}`);
      setMeetings((prev) => prev.filter((m) => m._id !== meetingId));
      toast.success('Meeting cancelled successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to cancel meeting.');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setTime('');
    setLocation('');
    setNotes('');
    setEditingMeeting(null);
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
            {t('meetings.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('meetings.subtitle')}
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
            <FaFolderOpen className="text-[#0084D1] h-4 w-4" />
            {t('meetings.projectLabel')}
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="block w-full max-w-[280px] rounded-xl border border-gray-250 bg-white px-4 py-2 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
          >
            <option value="">{t('meetings.chooseProject')}</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title}
              </option>
            ))}
          </select>

          {selectedProjectId && user?.role !== 'student' && (
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0084D1] text-white shadow-sm hover:bg-[#0277BD] focus:outline-none"
              title={t('meetings.scheduleMeeting')}
            >
              <FaPlus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Meetings Dashboard Grid */}
      {!selectedProjectId ? (
        <EmptyState
          icon={FaCalendarAlt}
          title={t('meetings.selectProjectFirst')}
          description={t('meetings.selectProjectDesc')}
        />
      ) : meetingsLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader />
        </div>
      ) : meetings.length === 0 ? (
        <EmptyState
          icon={FaCalendarAlt}
          title={t('meetings.noMeetings')}
          description={t('meetings.noMeetingsDesc')}
          actionText={t('meetings.scheduleMeeting')}
          onActionClick={() => setIsOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="flex flex-col justify-between rounded-2xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div>
                {/* Badges */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                    {meeting.title}
                  </h3>
                  <div className="flex shrink-0 gap-1.5">
                    {meeting.createdAt === meeting.updatedAt || !meeting.updatedAt ? (
                      <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
                        {t('meetings.new')}
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-bold text-white">
                        {t('meetings.updated')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-[#0084D1] flex-shrink-0" />
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="h-4 w-4 text-[#0084D1] flex-shrink-0" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-[#0084D1] flex-shrink-0" />
                    <span className="truncate">{meeting.location}</span>
                  </div>
                </div>

                {/* Notes */}
                {meeting.notes && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/40">
                    <p className="text-[10px] font-bold text-gray-400">{t('meetings.notes')}</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line italic">
                      "{meeting.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 uppercase">
                  {t('meetings.scheduled')}
                </span>
                {user?.role !== 'student' && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEditClick(meeting)}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/20 dark:hover:text-blue-400"
                      title={t('meetings.editMeeting')}
                    >
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMeeting(meeting._id)}
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                      title={t('meetings.cancelTitle')}
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule / Edit Meeting Modal */}
      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); resetForm(); }} title={editingMeeting ? t('meetings.editModal') : t('meetings.scheduleModal')}>
        <form onSubmit={handleCreateMeeting} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('meetings.meetingTitle')}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder={t('meetings.meetingTitlePlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('meetings.date')}
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('meetings.time')}
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('meetings.location')}
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder={t('meetings.locationPlaceholder')}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              {t('meetings.meetingNotes')}
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder={t('meetings.notesPlaceholder')}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <button
              onClick={() => { setIsOpen(false); resetForm(); }}
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
              {editingMeeting ? t('meetings.saveChanges') : t('common.submit')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Meetings;
