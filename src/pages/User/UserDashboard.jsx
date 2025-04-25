import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { LuArrowRight } from 'react-icons/lu';

// Custom Hooks
import { useUserAuth } from '../../hooks/useUserAuth';
import { useCountUp } from '../../hooks/useCountUp';

// Context
import { UserContext } from '../../context/useContext';

// Components
import DashboardLayout from '../../components/layouts/DashboardLayout';
import InfoCard from '../../components/cards/InfoCard';
import TaskListTable from '../../components/layouts/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

// Utils
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { addThousandsSeparator } from '../../utils/helper';

const UserDashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // State
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Fetch (memoized callback)
  const getDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_USER_DASHBOARD_DATA);
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      // Handle error gracefully and log both network and API errors
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  // Task values (memoized before using in custom hook)
  const all = useMemo(() => dashboardData?.charts?.taskDistribution?.All || 0, [dashboardData]);
  const pending = useMemo(() => dashboardData?.charts?.taskDistribution?.Pending || 0, [dashboardData]);
  const inProgress = useMemo(() => dashboardData?.charts?.taskDistribution?.InProgress || 0, [dashboardData]);
  const completed = useMemo(() => dashboardData?.charts?.taskDistribution?.Completed || 0, [dashboardData]);

  const totalTasksCount = useCountUp(all, 2000);
  const pendingTasksCount = useCountUp(pending, 2000);
  const inProgressTasksCount = useCountUp(inProgress, 2000);
  const completedTasksCount = useCountUp(completed, 2000);

  // Charts
  const pieChartData = useMemo(() => {
    return [
      { name: 'Pending', value: pending },
      { name: 'In Progress', value: inProgress },
      { name: 'Completed', value: completed },
    ];
  }, [pending, inProgress, completed]);

  const barChartData = useMemo(() => {
    return dashboardData?.charts?.priorityLevels || [];
  }, [dashboardData]);

  // Navigation
  const onSeeMore = useCallback(() => navigate("/admin/tasks"), [navigate]);

  // Info cards
  const renderInfoCards = useCallback(() => (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
      <InfoCard 
        label="Total Tasks" 
        value={addThousandsSeparator(totalTasksCount)} 
        color="bg-purple-800 text-purple-500" 
      />
      <InfoCard
        label="Pending Tasks" 
        value={addThousandsSeparator(pendingTasksCount)}
        color="bg-yellow-500 text-yellow-500" 
      />
      <InfoCard 
        label="In Progress Tasks"
        value={addThousandsSeparator(inProgressTasksCount)} 
        color="bg-blue-500 text-blue-500" 
      />
      <InfoCard 
        label="Completed Tasks" 
        value={addThousandsSeparator(completedTasksCount)} 
        color="bg-green-500 text-green-500" 
      />
    </div>
  ), [totalTasksCount, pendingTasksCount, inProgressTasksCount, completedTasksCount]);

  // Chart Section
  const renderCharts = useCallback(() => (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4 md:my-6'>
      <div className='card'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg md:text-xl font-medium'>Task Distribution</h2>
        </div>
        {pieChartData.length > 0 ? (
          <CustomPieChart
            data={pieChartData}
            colors={["#4B5563", "#FBBF24", "#3B82F6"]}
          />
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p>No data available</p>
          </div>
        )}
      </div>

      <div className='card'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg md:text-xl font-medium'>Task Priority Levels</h2>
        </div>
        {barChartData.length > 0 ? (
          <CustomBarChart
            data={barChartData}
            xKey="priority"
            yKey="count"
            colors={["#A3E635", "#FACC15", "#EF4444"]}
          />
        ) : (
          <div className="flex items-center justify-center h-[300px]">
            <p>No data available</p>
          </div>
        )}
      </div>
    </div>
  ), [pieChartData, barChartData]);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div className='col-span-3'>
          <h2 className='text-xl md:text-2xl'>Good day! {user?.name}</h2>
          <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
            {moment().format("dddd Do MMM YYYY")}
          </p>
        </div>
        
        {loading ? (
          <p className='text-center my-4'>Loading dashboard...</p>
        ) : error ? (
          <p className='text-red-500 my-4 text-center'>{error}</p>
        ) : (
          renderInfoCards()
        )}
      </div>

      {!loading && !error && (
        <>
          {renderCharts()}
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg md:text-xl'>Recent Tasks</h2>
              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className='text-sm' />
              </button>
            </div>
            <TaskListTable 
              tableData={dashboardData?.recentTasks || []} 
              loading={loading}
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default UserDashboard;
