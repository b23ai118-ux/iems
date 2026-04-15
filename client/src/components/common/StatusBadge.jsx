const StatusBadge = ({ status }) => {
  const classMap = {
    Pending: 'badge-pending',
    Accepted: 'badge-accepted',
    Rejected: 'badge-rejected',
    Paid: 'badge-paid',
    Unpaid: 'badge-unpaid',
  };

  return (
    <span className={classMap[status] || 'badge bg-surface-300 text-surface-900'}>
      {status}
    </span>
  );
};

export default StatusBadge;
