import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { HiOfficeBuilding, HiCalendar, HiCurrencyDollar, HiDocumentAdd, HiUpload } from 'react-icons/hi';

const SubmitInternship = () => {
  const [form, setForm] = useState({
    companyName: '',
    paid: false,
    startDate: '',
    endDate: '',
  });
  const [certificate, setCertificate] = useState(null);
  const [lor, setLor] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.companyName || !form.startDate || !form.endDate) {
      toast.error('Please fill all required fields');
      return;
    }

    if (new Date(form.endDate) <= new Date(form.startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('companyName', form.companyName);
      formData.append('paid', form.paid);
      formData.append('startDate', form.startDate);
      formData.append('endDate', form.endDate);
      if (certificate) formData.append('certificate', certificate);
      if (lor) formData.append('lor', lor);

      await api.post('/api/student/internships', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Internship submitted successfully!');
      navigate('/student/internships');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  const FileUpload = ({ label, file, onChange, id }) => (
    <div>
      <label className="input-label">{label}</label>
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-surface-600
                   rounded-xl cursor-pointer hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-300"
      >
        {file ? (
          <div className="text-center">
            <HiDocumentAdd className="w-8 h-8 text-primary-400 mx-auto mb-2" />
            <p className="text-sm text-surface-900 font-medium truncate max-w-[200px]">{file.name}</p>
            <p className="text-xs text-surface-700 mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <HiUpload className="w-8 h-8 text-surface-700 mx-auto mb-2" />
            <p className="text-sm text-surface-700">Click to upload</p>
            <p className="text-xs text-surface-700 mt-1">PDF, PNG, JPG (Max 5MB)</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => onChange(e.target.files[0])}
        />
      </label>
    </div>
  );

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Submit Internship</h1>
        <p className="page-subtitle">Add details of your internship experience</p>
      </div>

      <div className="max-w-2xl">
        <div className="glass-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="input-label">Company Name *</label>
              <div className="relative">
                <HiOfficeBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-700 w-5 h-5" />
                <input
                  type="text"
                  className="input-field !pl-11"
                  placeholder="e.g., Google, Microsoft..."
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                />
              </div>
            </div>

            {/* Paid/Unpaid Toggle */}
            <div>
              <label className="input-label">Internship Type</label>
              <div className="flex items-center gap-4 mt-1">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, paid: true })}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${
                      form.paid
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        : 'bg-surface-200 border-surface-300 text-surface-700 hover:border-surface-400'
                    }`}
                >
                  <HiCurrencyDollar className="w-5 h-5" />
                  Paid
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, paid: false })}
                  className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2
                    ${
                      !form.paid
                        ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        : 'bg-surface-200 border-surface-300 text-surface-700 hover:border-surface-400'
                    }`}
                >
                  Unpaid
                </button>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="input-label">Start Date *</label>
                <div className="relative">
                  <HiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-700 w-5 h-5" />
                  <input
                    type="date"
                    className="input-field !pl-11"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">End Date *</label>
                <div className="relative">
                  <HiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-700 w-5 h-5" />
                  <input
                    type="date"
                    className="input-field !pl-11"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload
                label="Internship Certificate"
                file={certificate}
                onChange={setCertificate}
                id="certificate-upload"
              />
              <FileUpload
                label="Letter of Recommendation"
                file={lor}
                onChange={setLor}
                id="lor-upload"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !py-3 text-base"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <HiDocumentAdd className="w-5 h-5" />
                  Submit Internship
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitInternship;
