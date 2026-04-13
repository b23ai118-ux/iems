import { useState, useEffect } from 'react';
import api from '../../services/api';
import DataTable from '../../components/common/DataTable';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { HiEye, HiUserAdd } from 'react-icons/hi';

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(null);
  const [assignModal, setAssignModal] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [intRes, facRes] = await Promise.all([
        api.get('/api/admin/internships'),
        api.get('/api/admin/faculty'),
      ]);
      setInternships(intRes.data);
      setFaculty(facRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedFaculty) {
      toast.error('Please select a faculty member');
      return;
    }
    try {
      await api.put(`/api/admin/internships/${assignModal._id}/assign`, {
        facultyId: selectedFaculty,
      });
      toast.success('Faculty assigned successfully');
      setAssignModal(null);
      setSelectedFaculty('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign');
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
      key: 'faculty',
      header: 'Faculty',
      accessor: (row) => row.facultyId?.name || '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDetailModal(row)}
            className="p-2 rounded-lg hover:bg-primary-500/10 text-surface-400 hover:text-primary-400 transition-colors"
            title="View Details"
          >
            <HiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setAssignModal(row);
              setSelectedFaculty(row.facultyId?._id || '');
            }}
            className="p-2 rounded-lg hover:bg-emerald-500/10 text-surface-400 hover:text-emerald-400 transition-colors"
            title="Assign Faculty"
          >
            <HiUserAdd className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">All Internships</h1>
        <p className="page-subtitle">{internships.length} internship records</p>
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
              <div>
                <p className="text-xs text-surface-400 mb-1">Faculty Assigned</p>
                <p className="text-white">{detailModal.facultyId?.name || 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-xs text-surface-400 mb-1">Duration</p>
                <p className="text-white">{detailModal.durationDays} days</p>
              </div>
            </div>
            {detailModal.certificate && (
              <div>
                <p className="text-xs text-surface-400 mb-1">Certificate</p>
                <a href={detailModal.certificate} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 text-sm">
                  View Certificate →
                </a>
              </div>
            )}
            {detailModal.lor && (
              <div>
                <p className="text-xs text-surface-400 mb-1">LOR</p>
                <a href={detailModal.lor} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 text-sm">
                  View LOR →
                </a>
              </div>
            )}
            {detailModal.evaluation?.rating && (
              <div className="p-4 rounded-xl bg-surface-800/50 border border-surface-700">
                <p className="text-xs text-surface-400 mb-2">Evaluation</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-amber-400">{'★'.repeat(detailModal.evaluation.rating)}</span>
                  <span className="text-sm text-surface-400">{'★'.repeat(5 - detailModal.evaluation.rating)}</span>
                </div>
                <p className="text-sm text-surface-300">{detailModal.evaluation.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Assign Faculty Modal */}
      <Modal
        isOpen={!!assignModal}
        onClose={() => setAssignModal(null)}
        title="Assign Faculty"
      >
        <div className="space-y-4">
          <p className="text-sm text-surface-300">
            Assign a faculty member to review{' '}
            <span className="text-white font-medium">{assignModal?.companyName}</span> internship by{' '}
            <span className="text-white font-medium">{assignModal?.studentId?.name}</span>
          </p>
          <div>
            <label className="input-label">Select Faculty</label>
            <select
              className="input-field"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
            >
              <option value="">-- Select Faculty --</option>
              {faculty.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name} ({f.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleAssign} className="btn-primary flex-1">
              Assign
            </button>
            <button onClick={() => setAssignModal(null)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InternshipList;
