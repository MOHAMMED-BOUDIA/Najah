import { getStatusColorClasses } from '../../utils/helpers';

const StatusBadge = ({ status }) => {
  const classes = getStatusColorClasses(status);
  
  // Replace hyphens/underscores with spaces and capitalize
  const displayStatus = (status || '')
    .replace(/[_-]/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${classes.bg} ${classes.text} ${classes.border}`}
    >
      {displayStatus || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
