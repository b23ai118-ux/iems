import { useState, useEffect } from 'react';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { HiEye, HiCheckCircle, HiXCircle, HiStar } from 'react-icons/hi';

const BASE_URL = "http://localhost:5000"; // ✅ backend URL

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
      toast.success('Evaluation submitted successfully');
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
          <span className="text-surface-700 text-sm">Not rated</span>
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
            className="p-2 rounded-lg hover:bg-primary-500/10 text-surface-700 hover:text-primary-400 transition"
          >
            <HiEye className="w-4 h-4" />
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

            {/* Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-surface-700 mb-1">Student</p>
                <p className="text-surface-900 font-medium">{detailModal.studentId?.name}</p>
                <p className="text-xs text-surface-700">{detailModal.studentId?.email}</p>
              </div>

              <div>
                <p className="text-xs text-surface-700 mb-1">Company</p>
                <p className="text-surface-900 font-medium">{detailModal.companyName}</p>
              </div>
            </div>

            {/* ✅ FIXED FILE LINKS */}
            <div className="flex gap-4">
              {detailModal.certificate && (
                <a
                  href={`${BASE_URL}/uploads/${detailModal.certificate}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  📄 View Certificate
                </a>
              )}

              {detailModal.lor && (
                <a
                  href={`${BASE_URL}/uploads/${detailModal.lor}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  📄 View LOR
                </a>
              )}
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
};

export default InternshipReview;