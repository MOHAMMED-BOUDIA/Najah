import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaFolderOpen, FaPlus, FaTrash, FaClock, FaMapMarkerAlt, FaNotesMedical } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { formatDate } from '../utils/helpers';

const Meetings = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meetingsLoading, setMeetingsLoading] = useState(false);

  // Form / Modal state
  const [isOpen, setIsOpen] = useState(false);
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

  // Fetch meetings when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
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
      const payload = {
        title,
        date,
        time,
        location,
        notes,
        project: selectedProjectId,
      };

      const response = await axiosInstance.post('/meetings', payload);
      setMeetings((prev) => [response.data, ...prev]);
      setIsOpen(false);
      resetForm();
      toast.success('Meeting scheduled successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to schedule meeting.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (!window.confirm('Are you sure you want to cancel this meeting?')) return;

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
            Meetings & Milestones
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Schedule project reviews, team sync-ups, and supervisor briefings.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
            <FaFolderOpen className="text-indigo-600 dark:text-indigo-400 h-4 w-4" />
            Project:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="block w-full max-w-[280px] rounded-xl border border-gray-250 bg-white px-4 py-2 text-sm outline-none focus:border-indigo-500 dark:border-gray-750 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Choose a Project</option>
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus:outline-none dark:bg-indigo-600 dark:hover:bg-indigo-500"
              title="Schedule Meeting"
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
          title="Select a project first"
          description="Please choose a Final Year Project to browse and manage scheduled meetings."
        />
      ) : meetingsLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader />
        </div>
      ) : meetings.length === 0 ? (
        <EmptyState
          icon={FaCalendarAlt}
          title="No meetings scheduled"
          description="Plan a meeting to touch base with your team or review progress with your supervisor."
          actionText="Schedule Meeting"
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
                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2">
                  {meeting.title}
                </h3>

                {/* Details */}
                <div className="mt-4 space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaClock className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{meeting.location}</span>
                  </div>
                </div>

                {/* Notes */}
                {meeting.notes && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-3 dark:bg-gray-800/40">
                    <p className="text-[10px] font-bold text-gray-400">NOTES</p>
                    <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 whitespace-pre-line italic">
                      "{meeting.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40 uppercase">
                  Scheduled
                </span>
                <button
                  onClick={() => handleDeleteMeeting(meeting._id)}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                  title="Cancel Meeting"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Meeting Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Schedule Meeting">
        <form onSubmit={handleCreateMeeting} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Meeting Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Mid-term Review Presentation"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Date */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Time *
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Location *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder="e.g. Lab 4B or Zoom Link"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Meeting Notes / Agenda
            </label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 block w-full rounded-xl border border-gray-250 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-gray-750 dark:bg-gray-800 dark:text-white"
              placeholder="Provide topics to discuss, prerequisites, or zoom links..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-5 dark:border-gray-800">
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 dark:border-gray-750 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:bg-indigo-400"
            >
              Schedule
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Meetings;
