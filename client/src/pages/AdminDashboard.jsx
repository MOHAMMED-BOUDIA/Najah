import { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import {
  FiUsers, FiUser, FiUserCheck, FiLayers,
  FiTrendingUp, FiTarget, FiAward, FiActivity
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm flex items-center gap-3 min-h-[100px]">
    <div className={`${color} w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-white text-lg md:text-xl shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs md:text-sm text-gray-500 truncate">{label}</p>
      <p className="text-2xl md:text-3xl font-bold mt-0.5">{value}</p>
    </div>
  </div>
);

const CompletionCard = ({ title, rate, icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-xl md:text-2xl" style={{ color }}>{icon}</div>
      <h3 className="text-sm md:text-base font-semibold break-words">{title}</h3>
    </div>
    <div className="flex items-end gap-2 mb-3">
      <span className="text-3xl md:text-4xl font-bold" style={{ color }}>{rate}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-1000"
        style={{ width: `${rate}%`, backgroundColor: color }}
      />
    </div>
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let mounted = true;
    axiosInstance.get('/analytics')
      .then(res => { if (mounted) setData(res.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;
  if (!data) return <div className="p-8 text-center text-gray-500">{t('common.noData')}</div>;

  const growthData = data.userGrowth.map(item => ({
    month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    Students: item.students,
    Instructors: item.instructors,
    Total: item.total
  }));

  const projectStatusData = [
    { name: t('common.statusCompleted'), value: data.stats.completedProjects, color: '#10b981' },
    { name: t('common.statusInProgress'), value: data.stats.inProgressProjects, color: '#0084D1' },
    { name: t('common.statusPending'), value: data.stats.pendingProjects, color: '#FFB900' },
  ];

  const endDate = new Date();
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  const chartHeight = isMobile ? 180 : 280;
  const tickFontSize = isMobile ? 10 : 12;
  const axisWidth = isMobile ? 30 : 50;
  const pieOuterRadius = isMobile ? 70 : 100;
  const chartMargin = isMobile ? { top: 5, right: 5, bottom: 20, left: -15 } : { top: 10, right: 20, bottom: 10, left: 0 };
  const tooltipStyle = isMobile ? { fontSize: '11px', padding: '6px 10px' } : undefined;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">{t('admin.dashboard')}</h1>
        <p className="text-gray-500">{t('admin.systemOverview')}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={<FiUsers />} label={t('admin.totalUsers')} value={data.stats.totalUsers} color="bg-[#0084D1]" />
        <StatCard icon={<FiUser />} label={t('admin.students')} value={data.stats.totalStudents} color="bg-green-500" />
        <StatCard icon={<FiUserCheck />} label={t('admin.instructors')} value={data.stats.totalInstructors} color="bg-[#FFB900]" />
        <StatCard icon={<FiLayers />} label={t('admin.totalGroups')} value={data.stats.totalGroups} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <CompletionCard title={t('admin.projectCompletionRate')} rate={data.stats.completionRate} icon={<FiTarget />} color="#0084D1" />
        <CompletionCard title={t('admin.taskCompletionRate')} rate={data.stats.taskCompletionRate} icon={<FiAward />} color="#FFB900" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm">
        <h3 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-[#0084D1]" /> {t('admin.userGrowth')}
        </h3>
        <ResponsiveContainer width="100%" height={chartHeight}>
          <AreaChart data={growthData} margin={chartMargin}>
            <defs>
              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0084D1" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#0084D1" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInstructors" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFB900" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FFB900" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: tickFontSize }} />
            <YAxis tick={{ fontSize: tickFontSize }} width={axisWidth} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: tickFontSize }} />
            <Area type="monotone" dataKey="Students" stroke="#0084D1" fillOpacity={1} fill="url(#colorStudents)" />
            <Area type="monotone" dataKey="Instructors" stroke="#FFB900" fillOpacity={1} fill="url(#colorInstructors)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm">
          <h3 className="text-sm md:text-base font-semibold mb-4">{t('admin.projectStatus')}</h3>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <PieChart>
              <Pie data={projectStatusData} cx="50%" cy="50%" outerRadius={pieOuterRadius} dataKey="value"
                label={isMobile ? false : ({ name, value }) => `${name}: ${value}`}>
                {projectStatusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: tickFontSize }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm">
          <h3 className="text-sm md:text-base font-semibold mb-4">{t('admin.usersByDepartment')}</h3>
          <ResponsiveContainer width="100%" height={chartHeight}>
            <BarChart data={data.departmentStats} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" tick={{ fontSize: tickFontSize }} angle={-45} textAnchor="end" height={isMobile ? 80 : 40} />
              <YAxis tick={{ fontSize: tickFontSize }} width={axisWidth} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#0084D1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm">
        <h3 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
          <FiActivity className="text-[#FFB900]" /> {t('admin.activityHeatmap')}
        </h3>
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-[600px] w-full px-3 md:px-0">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={data.activityData}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                if (value.count >= 10) return 'color-scale-4';
                if (value.count >= 5) return 'color-scale-3';
                if (value.count >= 2) return 'color-scale-2';
                return 'color-scale-1';
              }}
              tooltipDataAttrs={(value) => ({
                'data-tip': value?.date ? `${value.date}: ${value.count} ${t('admin.activityHeatmap')}` : t('common.noData')
              })}
            />
          </div>
        </div>
        <style>{`
          .color-empty { fill: #ebedf0; }
          .color-scale-1 { fill: #c6e6f5; }
          .color-scale-2 { fill: #7cc3e3; }
          .color-scale-3 { fill: #2196f3; }
          .color-scale-4 { fill: #0084D1; }
        `}</style>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-3 md:p-6 shadow-sm">
        <h3 className="text-sm md:text-base font-semibold mb-4 flex items-center gap-2">
          <FiAward className="text-[#FFB900]" /> {t('admin.topInstructors')}
        </h3>
        <div className="overflow-x-auto -mx-3 md:mx-0">
          <div className="inline-block min-w-full align-middle px-3 md:px-0">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">{t('admin.rank')}</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">{t('admin.instructor')}</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">{t('admin.department')}</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">{t('admin.groups')}</th>
                <th className="px-3 md:px-4 py-3 text-left text-xs md:text-sm font-medium whitespace-nowrap">{t('admin.students')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.topInstructors.map((inst, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap text-xs md:text-sm">
                    {i === 0 && <span>🥇</span>}
                    {i === 1 && <span>🥈</span>}
                    {i === 2 && <span>🥉</span>}
                    {i > 2 && <span className="text-gray-500">#{i + 1}</span>}
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-xs md:text-sm">{inst.name}</div>
                      <div className="text-xs text-gray-500">{inst.email}</div>
                    </div>
                  </td>
                  <td className="px-3 md:px-4 py-3 text-xs md:text-sm whitespace-nowrap">{inst.department || '-'}</td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {inst.groupsCount}
                    </span>
                  </td>
                  <td className="px-3 md:px-4 py-3 whitespace-nowrap">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {inst.studentsCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
