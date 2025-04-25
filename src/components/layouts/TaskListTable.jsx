import React from 'react';
import moment from 'moment';

const TaskListTable = ({tableData}) => {
    const getStatusBadgeColor = (status) => {
        if (!status) {
            return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    
        switch (status.trim()) {
            case 'Completed':
                return 'bg-green-100 text-green-500 border border-green-200'; // Fixed color classes
            case 'Pending':
                return 'bg-yellow-100 text-yellow-500 border border-yellow-200'; // Fixed color classes
            case 'In Progress':
                return 'bg-blue-100 text-blue-500 border border-blue-200'; // Fixed color classes
            default:
                return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    };
    
    
    const getPriorityBadgeColor = (priority) => {
        switch (priority) {
            case 'High':
                return 'text-red-500 bg-red-100 border border-red-200';
            case 'Medium':
                return 'text-amber-500 text-amber-100 border border-amber-200';
            case 'Low':
                return 'text-green-500 text-green-100 border border-green-200';
            default:
                return 'bg-gray-100 text-gray-500 border border-gray-200';
        }
    }
  return (
    <div className='overflow-x-auto p-0 rounded-lg mt-3'>
        <table className='min-w-full'>
            <thead>
                <tr className='text-left'>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'> Name</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Status</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px]'>Priority</th>
                    <th className='py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell'>Created On</th>
                </tr>
            </thead>
           <tbody>
                {tableData.map((task) => (
                   <tr key={task._id} className='border-t border-gray-200'>
                   <td className='py-4 px-4 text-gray-700 text-[13px] line-clamp-1'>{task.title}</td>
                 
                   <td className='py-4 px-4'>
                        <span className={`px-2 py-1 text-xs rounded inline-block ${getStatusBadgeColor(task.status)}`}> 
                       {task.status}
                     </span>
                   </td>
                 
                   <td className='py-4 px-4'>
                     <span className={`px-2 py-1 text-xs rounded inline-block ${getPriorityBadgeColor(task.priority)}`}>
                       {task.priority}
                     </span>
                   </td>
                 
                   <td className='py-4 px-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell'>
                     {moment(task.createdAt).format('DD/MM/YYYY')}
                   </td>
                 </tr>
                 
                ))}
            </tbody>    
        </table>
      
    </div>
  )
}

export default TaskListTable
