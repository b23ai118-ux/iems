import { useState, useEffect } from 'react';
import api from '../../services/api';
import MetricCard from '../../components/common/MetricCard';
import { StatsPieChart } from '../../components/charts/StatsChart';
import { HiClipboardList, HiCheckCircle, HiClock, HiXCircle, HiStar } from 'react-icons/hi';
import toast from 'react-hot-toast';

const FacultyDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/api/faculty/dashboard');
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

  const statusData = [
    { name: 'Pending', value: stats?.pendingReview || 0 },
    { name: 'Accepted', value: stats?.accepted || 0 },
    { name: 'Rejected', value: stats?.rejected || 0 },
  ];

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Faculty Dashboard</h1>
        <p className="page-subtitle">Manage and evaluate student internships</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Total Assigned" value={stats?.totalAssigned || 0} icon={HiClipboardList} color="primary" delay={0} />
        <MetricCard title="Evaluated" value={stats?.totalEvaluated || 0} icon={HiStar} color="amber" delay={100} />
        <MetricCard title="Pending Review" value={stats?.pendingReview || 0} icon={HiClock} color="blue" delay={200} />
        <MetricCard title="Accepted" value={stats?.accepted || 0} icon={HiCheckCircle} color="emerald" delay={300} />
        <MetricCard title="Rejected" value={stats?.rejected || 0} icon={HiXCircle} color="rose" delay={400} />
      </div>

      {/* Chart */}
      <div className="max-w-lg">
        <StatsPieChart data={statusData} title="Review Status Breakdown" />
      </div>
    </div>
  );
};

export default FacultyDashboard;
