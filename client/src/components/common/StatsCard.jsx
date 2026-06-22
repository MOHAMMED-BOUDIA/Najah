const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'indigo', 
  loading = false 
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-600 dark:text-indigo-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-600 dark:text-purple-400',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-600 dark:text-red-400',
    },
    sky: {
      bg: 'bg-sky-50 dark:bg-sky-950/30',
      text: 'text-sky-600 dark:text-sky-400',
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </p>
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        ) : (
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
        )}
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${scheme.bg} ${scheme.text}`}>
        {Icon && <Icon className="h-6 w-6" />}
      </div>
    </div>
  );
};

export default StatsCard;
