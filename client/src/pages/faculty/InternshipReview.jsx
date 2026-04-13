import { useState, useEffect } from 'react';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { HiEye, HiCheckCircle, HiXCircle, HiStar } from 'react-icons/hi';

const InternshipReview = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(null);
  const [evalModal, setEvalModal] = useState(null);
  const [evalForm, setEvalForm] = useState({ rating: 5, remarks: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const { data } = await api.get('/api/faculty/internships');
      setInternships(data);
    } catch (error) {
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/api/faculty/internships/${id}/status`, { status });
      toast.success(`Internship ${status.toLowerCase()}`);
      fetchInternships();
      setDetailModal(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!evalForm.rating) {
      toast.error('Please provide a rating');
      return;
    }
    setSubmitting(true);
    try {
      await api.put(`/api/faculty/internships/${evalModal._id}/evaluate`, evalForm);
      toast.success('Evaluation submitted');
      setEvalModal(null);
      setEvalForm({ rating: 5, remarks: '' });
      fetchInternships();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to evaluate');
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      key: 'student',
      header: 'Student',
      accessor: (row) => row.studentId?.name || 'N/A',
    },
    { key: 'companyName', header: 'Company', accessor: 'companyName' },
    {
      key: 'paid',
      header: 'Type',
      render: (row) => <StatusBadge status={row.paid ? 'Paid' : 'Unpaid'} />,
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
      key: 'evaluation',
      header: 'Rating',
      render: (row) =>
        row.evaluation?.rating ? (
          <span className="text-amber-400 font-medium">
            {'★'.repeat(row.evaluation.rating)}
            <span className="text-surface-600">{'★'.repeat(5 - row.evaluation.rating)}</span>
          </span>
        ) : (
          <span className="text-surface-500 text-sm">Not rated</span>
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setDetailModal(row)}
            className="p-2 rounded-lg hover:bg-primary-500/10 text-surface-400 hover:text-primary-400 transition-colors"
            title="View Details"
          >
            <HiEye className="w-4 h-4" />
          </button>
          {row.status === 'Pending' && (
            <>
              <button
                onClick={() => handleStatusUpdate(row._id, 'Accepted')}
                className="p-2 rounded-lg hover:bg-emerald-500/10 text-surface-400 hover:text-emerald-400 transition-colors"
                title="Accept"
              >
                <HiCheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStatusUpdate(row._id, 'Rejected')}
                className="p-2 rounded-lg hover:bg-red-500/10 text-surface-400 hover:text-red-400 transition-colors"
                title="Reject"
              >
                <HiXCircle className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={() => {
              setEvalModal(row);
              setEvalForm({
                rating: row.evaluation?.rating || 5,
                remarks: row.evaluation?.remarks || '',
              });
            }}
            className="p-2 rounded-lg hover:bg-amber-500/10 text-surface-400 hover:text-amber-400 transition-colors"
            title="Evaluate"
          >
            <HiStar className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Review Internships</h1>
        <p className="page-subtitle">{internships.length} internships assigned to you</p>
      </div>

      {loading ? (
        <div className="glass-card animate-pulse h-64" />
      ) : (
        <DataTable columns={columns} data={internships} />
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
                <p className="text-xs text-surface-400 mb-1">Student</p>
                <p className="text-white font-medium">{detailModal.studentId?.name}</p>
                <p className="text-xs text-surface-400">{detailModal.studentId?.email}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Company</p>
                <p className="text-white font-medium">{detailModal.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Type</p>
                <StatusBadge status={detailModal.paid ? 'Paid' : 'Unpaid'} />
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Status</p>
                <StatusBadge status={detailModal.status} />
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Start Date</p>
                <p className="text-white">{new Date(detailModal.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">End Date</p>
                <p className="text-white">{new Date(detailModal.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            {/* File links */}
            <div className="flex gap-4">
              {detailModal.certificate && (
                <a
                  href={detailModal.certificate}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  📄 View Certificate
                </a>
              )}
              {detailModal.lor && (
                <a
                  href={detailModal.lor}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  📄 View LOR
                </a>
              )}
            </div>

            {detailModal.evaluation?.rating && (
              <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
                <p className="text-xs text-surface-400 mb-2">Current Evaluation</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-amber-400">
                    {'★'.repeat(detailModal.evaluation.rating)}
                  </span>
                  <span className="text-surface-500">
                    {'★'.repeat(5 - detailModal.evaluation.rating)}
                  </span>
                  <span className="text-sm text-surface-400 ml-2">({detailModal.evaluation.rating}/5)</span>
                </div>
                {detailModal.evaluation.remarks && (
                  <p className="text-sm text-surface-300 mt-2">{detailModal.evaluation.remarks}</p>
                )}
              </div>
            )}

            {/* Action buttons */}
            {detailModal.status === 'Pending' && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => handleStatusUpdate(detailModal._id, 'Accepted')}
                  className="btn-success flex-1 flex items-center justify-center gap-2"
                >
                  <HiCheckCircle className="w-5 h-5" /> Accept
                </button>
                <button
                  onClick={() => handleStatusUpdate(detailModal._id, 'Rejected')}
                  className="btn-danger flex-1 flex items-center justify-center gap-2"
                >
                  <HiXCircle className="w-5 h-5" /> Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Evaluate Modal */}
      <Modal
        isOpen={!!evalModal}
        onClose={() => setEvalModal(null)}
        title="Evaluate Internship"
      >
        {evalModal && (
          <form onSubmit={handleEvaluate} className="space-y-4">
            <p className="text-sm text-surface-300">
              Evaluate <span className="text-white font-medium">{evalModal.studentId?.name}</span>'s
              internship at <span className="text-white font-medium">{evalModal.companyName}</span>
            </p>

            <div>
              <label className="input-label">Rating</label>
              <div className="flex items-center gap-2 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEvalForm({ ...evalForm, rating: star })}
                    className={`text-3xl transition-all duration-200 hover:scale-110 ${
                      star <= evalForm.rating ? 'text-amber-400' : 'text-surface-600'
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className="text-sm text-surface-400 ml-2">({evalForm.rating}/5)</span>
              </div>
            </div>

            <div>
              <label className="input-label">Remarks</label>
              <textarea
                className="input-field !h-24 resize-none"
                value={evalForm.remarks}
                onChange={(e) => setEvalForm({ ...evalForm, remarks: e.target.value })}
                placeholder="Your feedback on this internship..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting ? 'Submitting...' : 'Submit Evaluation'}
              </button>
              <button type="button" onClick={() => setEvalModal(null)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default InternshipReview;
