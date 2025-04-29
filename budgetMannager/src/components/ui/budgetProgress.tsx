import React from 'react';

interface BudgetProgressProps {
  startDate: string;
  endDate: string;
  value: number;
  spent: number;
  currency: string;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ startDate, endDate, value, spent, currency }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  // Calculate time progress
  const totalDuration = end.getTime() - start.getTime();
  const elapsedDuration = now.getTime() - start.getTime();
  const timeProgress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  
  // Calculate budget progress
  const budgetProgress = Math.min(100, Math.max(0, (spent / value) * 100));
  
  // Determine progress bar color based on budget usage
  const getProgressColor = (progress: number) => {
    if (progress < 50) return 'bg-green-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(timeProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${timeProgress}%` }}
          />
        </div>
      </div>
      
      <div>
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Usage</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(budgetProgress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className={`${getProgressColor(budgetProgress)} h-2.5 rounded-full transition-all duration-300`}
            style={{ width: `${budgetProgress}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Total Budget</p>
          <p className="font-semibold text-gray-900 dark:text-white">{value.toLocaleString()} {currency}</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">Amount Spent</p>
          <p className="font-semibold text-gray-900 dark:text-white">{spent.toLocaleString()} {currency}</p>
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress; 