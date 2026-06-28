import { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaTasks, FaFolderOpen } from 'react-icons/fa';
import { DragDropContext } from '@hello-pangea/dnd';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import TaskColumn from '../components/task/TaskColumn';
import TaskForm from '../components/task/TaskForm';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { useConfirm } from '../context/ModalContext';
import { useTranslation } from 'react-i18next';

const Tasks = () => {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch list of projects on load
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/projects');
        const projData = response.data.data || [];
        setProjects(projData);
        // Automatically select the first project if available
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

  // Fetch tasks and team members when selected project changes
  useEffect(() => {
    if (!selectedProjectId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTasks([]);
      setTeamMembers([]);
      return;
    }

    const fetchProjectTasks = async () => {
      setTasksLoading(true);
      try {
        // Fetch project details to get team members
        const projRes = await axiosInstance.get(`/projects/${selectedProjectId}`);
        
        if (projRes.data.team?.members) {
          setTeamMembers(projRes.data.team.members);
        } else {
          setTeamMembers([]);
        }

        // Fetch project tasks
        const tasksRes = await axiosInstance.get(`/tasks/project/${selectedProjectId}`);
        setTasks(tasksRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load project tasks.');
      } finally {
        setTasksLoading(false);
      }
    };

    fetchProjectTasks();
  }, [selectedProjectId]);

  const handleCreateSubmit = async (taskData) => {
    setFormLoading(true);
    try {
      const response = await axiosInstance.post('/tasks', {
        ...taskData,
        project: selectedProjectId,
      });
      setTasks((prev) => [...prev, response.data]);
      setIsCreateOpen(false);
      toast.success('Task created successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (task) => {
    setCurrentTask(task);
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (taskData) => {
    setFormLoading(true);
    try {
      const response = await axiosInstance.put(`/tasks/${currentTask._id}`, taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === currentTask._id ? response.data : t))
      );
      setIsEditOpen(false);
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    const ok = await confirm({ title: 'Delete Task', message: 'Are you sure you want to delete this task?', confirmLabel: 'Delete', destructive: true });
    if (!ok) return;

    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success('Task deleted successfully!');
    } catch {
      toast.error('Failed to delete task.');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await axiosInstance.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: response.data.status || newStatus } : t))
      );
      toast.success('Task status updated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update task status.');
    }
  };

  const handleDragEnd = useCallback(async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;

    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      const response = await axiosInstance.patch(`/tasks/${draggableId}/status`, {
        status: newStatus,
      });
      setTasks((prev) =>
        prev.map((t) => (t._id === draggableId ? { ...t, status: response.data.status || newStatus } : t))
      );
      toast.success('Task moved to ' + destination.droppableId.replace('-', ' '));
    } catch {
      setTasks((prev) =>
        prev.map((t) => (t._id === draggableId ? { ...t, status: source.droppableId } : t))
      );
      toast.error('Failed to update task status.');
    }
  }, []);

  // Group tasks by column status
  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress');
  const reviewTasks = tasks.filter((t) => t.status === 'review');
  const doneTasks = tasks.filter((t) => t.status === 'done');

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            {t('tasks.title')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('tasks.subtitle')}
          </p>
        </div>
        
        {/* Project selector dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5 whitespace-nowrap">
            <FaFolderOpen className="text-[#0084D1] h-4 w-4" />
            {t('tasks.projectLabel')}
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="block w-full max-w-[280px] rounded-xl border border-gray-250 bg-white px-4 py-2 text-sm outline-none focus:border-[#0084D1] dark:border-gray-750 dark:bg-gray-800 dark:text-white"
          >
            <option value="">{t('tasks.chooseProject')}</option>
            {projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.title}
              </option>
            ))}
          </select>

          {selectedProjectId && (
            <button
              onClick={() => setIsCreateOpen(true)}
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#0084D1] text-white shadow-sm hover:bg-[#0277BD] focus:outline-none"
              title={t('tasks.createTask')}
            >
              <FaPlus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Kanban Content */}
      {!selectedProjectId ? (
        <EmptyState
          icon={FaTasks}
          title={t('tasks.selectProjectFirst')}
          description={t('tasks.selectProjectDesc')}
        />
      ) : tasksLoading ? (
        <div className="flex h-[40vh] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          <TaskColumn
            title={t('tasks.columnTodo')}
            status="todo"
            tasks={todoTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            teamMembers={teamMembers}
          />
          <TaskColumn
            title={t('tasks.columnInProgress')}
            status="in-progress"
            tasks={inProgressTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            teamMembers={teamMembers}
          />
          <TaskColumn
            title={t('tasks.columnReview')}
            status="review"
            tasks={reviewTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            teamMembers={teamMembers}
          />
          <TaskColumn
            title={t('tasks.columnDone')}
            status="done"
            tasks={doneTasks}
            onEdit={handleEditClick}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
            teamMembers={teamMembers}
          />
        </div>
        </DragDropContext>
      )}

      {/* Add Task Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title={t('tasks.newTask')}>
        <TaskForm
          teamMembers={teamMembers}
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateOpen(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={t('tasks.editTask')}>
        <TaskForm
          initialData={currentTask}
          teamMembers={teamMembers}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditOpen(false)}
          loading={formLoading}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default Tasks;
