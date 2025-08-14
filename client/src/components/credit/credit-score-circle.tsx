interface CreditScoreCircleProps {
  score: number;
  size?: number;
}

export default function CreditScoreCircle({ score, size = 128 }: CreditScoreCircleProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return "#10b981"; // green-500
    if (score >= 75) return "#3b82f6"; // blue-500
    if (score >= 65) return "#f59e0b"; // yellow-500
    if (score >= 55) return "#f97316"; // orange-500
    return "#ef4444"; // red-500
  };

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <div className="absolute inset-0">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            fill="none" 
            stroke="#e2e8f0" 
            strokeWidth="8"
          />
          <circle 
            cx="60" 
            cy="60" 
            r={radius} 
            fill="none" 
            stroke={getScoreColor(score)} 
            strokeWidth="8" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold text-financial-primary">{Math.round(score)}</div>
        <div className="text-sm text-slate-600">Score</div>
      </div>
    </div>
  );
}
