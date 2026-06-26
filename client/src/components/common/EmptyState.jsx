import { FaInbox } from 'react-icons/fa';

const EmptyState = ({ 
  icon: Icon = FaInbox, 
  title = 'No data available', 
  description = 'There is currently no information to show in this section.',
  actionText,
  onActionClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900/50 md:p-12">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0084D1]/10 text-[#0084D1]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {description}
      </p>
      {actionText && onActionClick && (
        <button
          onClick={onActionClick}
          type="button"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0084D1] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0084D1] focus:outline-none"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
