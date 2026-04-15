import { useState, useEffect, useRef } from 'react';

const MetricCard = ({ title, value, icon: Icon, color = 'primary', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  const colorClasses = {
    primary: {
      bg: 'from-primary-500/20 to-primary-600/10',
      border: 'border-primary-500/30',
      icon: 'text-primary-400 bg-primary-500/15',
      glow: 'shadow-primary-500/10',
    },
    accent: {
      bg: 'from-accent-500/20 to-accent-600/10',
      border: 'border-accent-500/30',
      icon: 'text-accent-400 bg-accent-500/15',
      glow: 'shadow-accent-500/10',
    },
    secondary: {
      bg: 'from-secondary-500/20 to-secondary-600/10',
      border: 'border-secondary-500/30',
      icon: 'text-secondary-400 bg-secondary-500/15',
      glow: 'shadow-secondary-500/10',
    },
    emerald: {
      bg: 'from-emerald-500/20 to-emerald-600/10',
      border: 'border-emerald-500/30',
      icon: 'text-emerald-400 bg-emerald-500/15',
      glow: 'shadow-emerald-500/10',
    },
    amber: {
      bg: 'from-amber-500/20 to-amber-600/10',
      border: 'border-amber-500/30',
      icon: 'text-amber-400 bg-amber-500/15',
      glow: 'shadow-amber-500/10',
    },
    rose: {
      bg: 'from-rose-500/20 to-rose-600/10',
      border: 'border-rose-500/30',
      icon: 'text-rose-400 bg-rose-500/15',
      glow: 'shadow-rose-500/10',
    },
    blue: {
      bg: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/30',
      icon: 'text-blue-400 bg-blue-500/15',
      glow: 'shadow-blue-500/10',
    },
  };

  const c = colorClasses[color] || colorClasses.primary;

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible || typeof value !== 'number') {
      setDisplayValue(value);
      return;
    }

    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value, isVisible]);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} p-6
        transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${c.glow}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
    >
      {/* Background decoration */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-surface-700">{title}</p>
          <p className="text-3xl font-bold text-surface-900">{displayValue}</p>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${c.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
