import { useState, useEffect } from 'react';
import api from '../../services/api';
import MetricCard from '../../components/common/MetricCard';
import { StatsBarChart } from '../../components/charts/StatsChart';
import { HiClipboardList, HiClock, HiCheckCircle, HiXCircle, HiCalendar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/api/student/dashboard');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card h-32 animate-pulse">
              <div className="h-4 w-20 bg-surface-700 rounded mb-4" />
              <div className="h-8 w-16 bg-surface-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const chartData = [
    { name: 'Total', value: stats?.totalInternships || 0 },
    { name: 'Completed', value: stats?.totalCompleted || 0 },
    { name: 'Pending', value: stats?.totalPending || 0 },
    { name: 'Rejected', value: stats?.totalRejected || 0 },
  ];

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Student Dashboard</h1>
        <p className="page-subtitle">Track your internship progress</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Total Internships" value={stats?.totalInternships || 0} icon={HiClipboardList} color="primary" delay={0} />
        <MetricCard title="Completed" value={stats?.totalCompleted || 0} icon={HiCheckCircle} color="emerald" delay={100} />
        <MetricCard title="Pending" value={stats?.totalPending || 0} icon={HiClock} color="amber" delay={200} />
        <MetricCard title="Rejected" value={stats?.totalRejected || 0} icon={HiXCircle} color="rose" delay={300} />
        <MetricCard title="Total Days" value={stats?.totalDurationDays || 0} icon={HiCalendar} color="blue" delay={400} />
      </div>

      {/* Chart */}
      <div className="max-w-2xl">
        <StatsBarChart data={chartData} title="Internship Overview" />
      </div>

      {/* Tips Card */}
      <div className="glass-card">
        <h3 className="text-lg font-semibold text-surface-900 mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-sm text-surface-700">
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-0.5">•</span>
            Submit your internship details along with your certificate and LOR for faster review.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-0.5">•</span>
            Track your internship status in the "My Internships" section.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400 mt-0.5">•</span>
            Once evaluated by faculty, you can view your rating and feedback.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;
