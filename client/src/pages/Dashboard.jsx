import { useState, useEffect } from 'react';
import { FaProjectDiagram, FaUsers, FaTasks, FaCalendarAlt, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axios';
import StatsCard from '../components/common/StatsCard';
import ProjectCard from '../components/project/ProjectCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  
  // Dashboard counters
  const [stats, setStats] = useState({
    projectsCount: 0,
    teamsCount: 0,
    tasksCount: 0,
    meetingsCount: 0,
  });

  const [recentProjects, setRecentProjects] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [progressChartData, setProgressChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Fetch projects
        const projectsRes = await axiosInstance.get('/projects');
        const projects = projectsRes.data || [];
        
        // 2. Fetch teams
        const teamsRes = await axiosInstance.get('/teams');
        const teams = teamsRes.data || [];

        // 3. For each project, fetch its tasks and meetings to aggregate counts
        let totalTasks = 0;
        let totalMeetings = 0;

        // Fetch in parallel for better performance
        await Promise.all(
          projects.map(async (p) => {
            try {
              const tasksRes = await axiosInstance.get(`/tasks/project/${p._id}`);
              totalTasks += (tasksRes.data || []).length;
            } catch (err) {
              console.error(`Error fetching tasks for project ${p._id}:`, err);
            }

            try {
              const meetingsRes = await axiosInstance.get(`/meetings/project/${p._id}`);
              totalMeetings += (meetingsRes.data || []).length;
            } catch (err) {
              console.error(`Error fetching meetings for project ${p._id}:`, err);
            }
          })
        );

        // 4. Set KPI counts
        setStats({
          projectsCount: projects.length,
          teamsCount: teams.length,
          tasksCount: totalTasks,
          meetingsCount: totalMeetings,
        });

        // 5. Sort and set recent projects (max 3)
        const sortedProjects = [...projects]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentProjects(sortedProjects);

        // 6. Aggregate project status for Pie Chart
        const statusCounts = projects.reduce((acc, curr) => {
          const s = curr.status || 'pending';
          acc[s] = (acc[s] || 0) + 1;
          return acc;
        }, {});

        const statusMap = {
          'pending': 'Pending',
          'approved': 'Approved',
          'in-progress': 'In Progress',
          'completed': 'Completed',
          'rejected': 'Rejected',
        };

        const pieData = Object.keys(statusCounts).map((key) => ({
          name: statusMap[key] || key,
          value: statusCounts[key],
        }));
        setStatusChartData(pieData);

        // 7. Map project progress for Bar Chart
        const barData = projects.slice(0, 8).map((p) => ({
          name: p.title.length > 15 ? p.title.slice(0, 15) + '...' : p.title,
          progress: p.progress || 0,
        }));
        setProgressChartData(barData);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const COLORS = {
    'Pending': '#f59e0b',
    'Approved': '#0284c7',
    'In Progress': '#8b5cf6',
    'Completed': '#10b981',
    'Rejected': '#ef4444',
  };

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow-lg shadow-indigo-600/10 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-black md:text-3xl">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm font-medium text-indigo-100">
            Here's a quick overview of your Final Year Project workspace.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-indigo-600 shadow-sm hover:bg-indigo-50 focus:outline-none transition dark:text-indigo-600 dark:hover:bg-indigo-50"
          >
            <FaPlus className="h-4 w-4" />
            New Project Proposal
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Projects" value={stats.projectsCount} icon={FaProjectDiagram} color="indigo" />
        <StatsCard title="Active Teams" value={stats.teamsCount} icon={FaUsers} color="purple" />
        <StatsCard title="Overall Tasks" value={stats.tasksCount} icon={FaTasks} color="amber" />
        <StatsCard title="Upcoming Meetings" value={stats.meetingsCount} icon={FaCalendarAlt} color="emerald" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Status Distribution (Pie Chart) */}
        <div className="flex flex-col rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Project Status Overview
          </h3>
          <div className="flex-1 min-h-[300px] flex items-center justify-center">
            {statusChartData.length === 0 ? (
              <span className="text-sm text-gray-400">No project status data</span>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusChartData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name] || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Progress Breakdown (Bar Chart) */}
        <div className="flex flex-col rounded-3xl border border-gray-150 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:col-span-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
            Project Progress (%)
          </h3>
          <div className="flex-1 min-h-[300px]">
            {progressChartData.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-gray-400">No projects to plot progress</span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="progress" fill="#8b5cf6" radius={[6, 6, 0, 0]}>
                    {progressChartData.map((entry, idx) => (
                      <Cell key={idx} fill={idx % 2 === 0 ? '#6366f1' : '#a855f7'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recently Added Projects
          </h2>
          <Link
            to="/projects"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
          >
            View all projects
          </Link>
        </div>

        {recentProjects.length === 0 ? (
          <EmptyState
            title="No projects available"
            description="You don't have any projects registered in the workspace yet."
            actionText="Create Project"
            onActionClick={() => navigate('/projects')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
