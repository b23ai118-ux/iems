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
            className="p-2 rounded-lg hover:bg-primary-500/10 text-surface-700 hover:text-primary-400 transition-colors"
            title="View Details"
          >
            <HiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setAssignModal(row);
              setSelectedFaculty(row.facultyId?._id || '');
            }}
            className="p-2 rounded-lg hover:bg-emerald-500/10 text-surface-700 hover:text-emerald-400 transition-colors"
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
        <>
          {/* Quick Info Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4">
              <p className="text-xs text-surface-700 mb-1">Pending Assignment</p>
              <p className="text-2xl font-bold text-primary-400">
                {internships.filter(i => !i.facultyId).length}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-surface-700 mb-1">Assigned</p>
              <p className="text-2xl font-bold text-emerald-400">
                {internships.filter(i => i.facultyId).length}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="text-xs text-surface-700 mb-1">Evaluated</p>
              <p className="text-2xl font-bold text-amber-400">
                {internships.filter(i => i.evaluation?.rating).length}
              </p>
            </div>
          </div>

          <DataTable columns={columns} data={internships} />
        </>
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
                <p className="text-xs text-surface-700 mb-1">Student</p>
                <p className="text-surface-900 font-medium">{detailModal.studentId?.name}</p>
              </div>
              <div>
                <p className="text-xs text-surface-700 mb-1">Company</p>
                <p className="text-surface-900 font-medium">{detailModal.companyName}</p>
              </div>
              <div>
                <p className="text-xs text-surface-700 mb-1">Type</p>
                <StatusBadge status={detailModal.paid ? 'Paid' : 'Unpaid'} />
              </div>
              <div>
                <p className="text-xs text-surface-700 mb-1">Status</p>
                <StatusBadge status={detailModal.status} />
              </div>
              <div>
                <p className="text-xs text-surface-700 mb-1">Start Date</p>
                <p className="text-surface-900">{new Date(detailModal.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-700 mb-1">End Date</p>
                <p className="text-surface-900">{new Date(detailModal.endDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-surface-700 mb-1">Faculty Assigned</p>
                <p className="text-surface-900">{detailModal.facultyId?.name || 'Not assigned'}</p>
              </div>
              <div>
                <p className="text-xs text-surface-700 mb-1">Duration</p>
                <p className="text-surface-900">{detailModal.durationDays} days</p>
              </div>
            </div>
            {detailModal.certificate && (
              <div>
                <p className="text-xs text-surface-700 mb-1">Certificate</p>
                <a href={detailModal.certificate} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 text-sm">
                  View Certificate →
                </a>
              </div>
            )}
            {detailModal.lor && (
              <div>
                <p className="text-xs text-surface-700 mb-1">LOR</p>
                <a href={detailModal.lor} target="_blank" rel="noreferrer" className="text-primary-400 hover:text-primary-300 text-sm">
                  View LOR →
                </a>
              </div>
            )}
            {detailModal.evaluation?.rating && (
              <div className="p-4 rounded-xl bg-surface-100 border border-surface-300">
                <p className="text-xs text-surface-700 mb-2">Evaluation</p>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-amber-400">{'★'.repeat(detailModal.evaluation.rating)}</span>
                  <span className="text-sm text-surface-700">{'★'.repeat(5 - detailModal.evaluation.rating)}</span>
                </div>
                <p className="text-sm text-surface-700">{detailModal.evaluation.remarks}</p>
              </div>
            )}

            {/* Admin Workflow Guide */}
            <div className="p-4 rounded-xl bg-primary-500/10 border border-primary-400/30">
              <p className="text-xs text-primary-300 font-medium mb-2">ADMIN WORKFLOW:</p>
              <ol className="text-xs text-primary-200 space-y-1 ml-2">
                <li>1. Review internship details</li>
                <li>2. Click the 👤 button to assign faculty member</li>
                <li>3. Faculty will review and evaluate</li>
                <li>4. Track status and evaluation progress</li>
              </ol>
            </div>
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
          <div className="p-3 rounded-lg bg-accent-500/10 border border-accent-400/30">
            <p className="text-xs text-accent-300 font-medium mb-2">INTERNSHIP DETAILS:</p>
            <div className="text-sm text-accent-200 space-y-1">
              <p><span className="text-accent-300 font-medium">Student:</span> {assignModal?.studentId?.name}</p>
              <p><span className="text-accent-300 font-medium">Company:</span> {assignModal?.companyName}</p>
              <p><span className="text-accent-300 font-medium">Current Faculty:</span> {assignModal?.facultyId?.name || 'Not assigned'}</p>
            </div>
          </div>
          <div>
            <label className="input-label">Select Faculty to Assign</label>
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
              Assign Faculty
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
