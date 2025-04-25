import React from 'react';

const InfoCard = ({ label, value, color, textColor, icon }) => {
  const getIcon = () => {
    switch (icon) {
      case 'tasks':
        return <LuListTodo className="w-6 h-6" />;
      case 'pending':
        return <LuClock className="w-6 h-6" />;
      case 'progress':
        return <LuLoader className="w-6 h-6" />;
      case 'completed':
        return <LuCheckCircle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <h4 className={`text-xl md:text-2xl font-semibold ${textColor}`}>
            {value}
          </h4>
        </div>
        <div className={`${color} bg-opacity-10 p-2 rounded-lg`}>
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
