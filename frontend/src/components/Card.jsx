import React from 'react';

const Card = ({ title, value, icon, trend, trendValue, subtitle, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </h3>
          
          {/* Value */}
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">
              {value}
            </p>
            
            {/* Trend Indicator (optional) */}
            {trend && trendValue && (
              <span className={`ml-2 text-sm font-semibold ${
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {trend === 'up' && '↑'}
                {trend === 'down' && '↓'}
                {trendValue}
              </span>
            )}
          </div>
          
          {/* Subtitle (optional) */}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Icon (optional) */}
        {icon && (
          <div className="flex-shrink-0 ml-2 sm:ml-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
