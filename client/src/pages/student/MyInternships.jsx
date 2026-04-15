import { useState, useEffect } from 'react';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { HiEye } from 'react-icons/hi';

const MyInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data } = await api.get('/api/student/internships');
      setInternships(data);
    } catch (error) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const filteredInternships =
    filter === 'All'
      ? internships
      : internships.filter((i) => i.status === filter);

  const columns = [
    { key: 'companyName', header: 'Company', accessor: 'companyName' },
    {
      key: 'paid',
      header: 'Type',
      render: (row) => <StatusBadge status={row.paid ? 'Paid' : 'Unpaid'} />,
    },
    {
      key: 'startDate',
      header: 'Start Date',
      accessor: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: 'endDate',
      header: 'End Date',
      accessor: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    {
      key: 'duration',
      header: 'Duration',
      accessor: (row) => {
        const days = Math.ceil(
          (new Date(row.endDate) - new Date(row.startDate)) / (1000 * 60 * 60 * 24)
        );
        return `${days} days`;
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (row) =>
        row.evaluation?.rating ? (
          <span className="text-amber-400 font-medium">
            {'★'.repeat(row.evaluation.rating)}
            <span className="text-surface-600">{'★'.repeat(5 - row.evaluation.rating)}</span>
          </span>
        ) : (
          <span className="text-surface-500 text-sm">—</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => setDetailModal(row)}
          className="p-2 rounded-lg hover:bg-primary-500/10 text-surface-400 hover:text-primary-400 transition-colors"
          title="View Details"
        >
          <HiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">My Internships</h1>
          <p className="page-subtitle">{internships.length} internships submitted</p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {['All', 'Pending', 'Accepted', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                ${
                  filter === status
                    ? status === 'Pending'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : status === 'Accepted'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : status === 'Rejected'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                      : 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                    : 'text-surface-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
            >
              {status}
              {status !== 'All' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({internships.filter((i) => (status === 'All' ? true : i.status === status)).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="glass-card animate-pulse h-64" />
      ) : (
        <DataTable columns={columns} data={filteredInternships} />
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={!!detailModal}
        onClose={() => setDetailModal(null)}
        title="Internship Details"
        size="lg"
      >
        {detailModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-surface-400 mb-1">Company</p>
                <p className="text-white font-medium">{detailModal.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Type</p>
                <StatusBadge status={detailModal.paid ? 'Paid' : 'Unpaid'} />
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Start Date</p>
                <p className="text-white">{new Date(detailModal.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">End Date</p>
                <p className="text-white">{new Date(detailModal.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Duration</p>
                <p className="text-white">{detailModal.durationDays} days</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Status</p>
                <StatusBadge status={detailModal.status} />
              </div>
            </div>

            {/* Faculty info */}
            {detailModal.facultyId && (
              <div>
                <p className="text-xs text-surface-400 mb-1">Assigned Faculty</p>
                <p className="text-white font-medium">{detailModal.facultyId.name}</p>
                <p className="text-xs text-surface-400">{detailModal.facultyId.email}</p>
              </div>
            )}

            {/* Files */}
            <div className="flex gap-4">
              {detailModal.certificate && (
                <a
                  href={detailModal.certificate}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/30
                             text-primary-400 hover:bg-primary-500/20 transition-all text-sm font-medium"
                >
                  📄 Certificate
                </a>
              )}
              {detailModal.lor && (
                <a
                  href={detailModal.lor}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/30
                             text-primary-400 hover:bg-primary-500/20 transition-all text-sm font-medium"
                >
                  📄 LOR
                </a>
              )}
            </div>

            {/* Evaluation */}
            {detailModal.evaluation?.rating && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
                  Faculty Evaluation
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-amber-400">
                    {'★'.repeat(detailModal.evaluation.rating)}
                  </span>
                  <span className="text-2xl text-surface-600">
                    {'★'.repeat(5 - detailModal.evaluation.rating)}
                  </span>
                  <span className="text-sm text-surface-400 ml-2">
                    ({detailModal.evaluation.rating}/5)
                  </span>
                </div>
                {detailModal.evaluation.remarks && (
                  <div className="mt-3 p-3 rounded-lg bg-surface-200">
                    <p className="text-xs text-surface-400 mb-1">Remarks</p>
                    <p className="text-sm text-surface-200 leading-relaxed">
                      {detailModal.evaluation.remarks}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyInternships;
