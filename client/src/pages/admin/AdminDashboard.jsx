import { useState, useEffect } from 'react';
import api from '../../services/api';
import MetricCard from '../../components/common/MetricCard';
import { StatsPieChart, StatsBarChart } from '../../components/charts/StatsChart';
import { HiAcademicCap, HiUserGroup, HiClipboardList, HiCheckCircle, HiClock, HiXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/api/admin/dashboard');
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
    { name: 'Pending', value: stats?.pendingInternships || 0 },
    { name: 'Accepted', value: stats?.acceptedInternships || 0 },
    { name: 'Rejected', value: stats?.rejectedInternships || 0 },
  ];

  const overviewData = [
    { name: 'Students', value: stats?.totalStudents || 0 },
    { name: 'Faculty', value: stats?.totalFaculty || 0 },
    { name: 'Internships', value: stats?.totalInternships || 0 },
    { name: 'Evaluated', value: stats?.evaluatedInternships || 0 },
  ];

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of the internship management system</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Students" value={stats?.totalStudents || 0} icon={HiAcademicCap} color="primary" delay={0} />
        <MetricCard title="Total Faculty" value={stats?.totalFaculty || 0} icon={HiUserGroup} color="accent" delay={100} />
        <MetricCard title="Total Internships" value={stats?.totalInternships || 0} icon={HiClipboardList} color="emerald" delay={200} />
        <MetricCard title="Evaluated" value={stats?.evaluatedInternships || 0} icon={HiCheckCircle} color="amber" delay={300} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsBarChart data={overviewData} title="System Overview" />
        <StatsPieChart data={statusData} title="Internship Status Distribution" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/15 text-amber-400">
            <HiClock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-700">Pending Review</p>
            <p className="text-2xl font-bold text-surface-900">{stats?.pendingInternships || 0}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-400">
            <HiCheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-700">Accepted</p>
            <p className="text-2xl font-bold text-surface-900">{stats?.acceptedInternships || 0}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/15 text-red-400">
            <HiXCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-700">Rejected</p>
            <p className="text-2xl font-bold text-surface-900">{stats?.rejectedInternships || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
