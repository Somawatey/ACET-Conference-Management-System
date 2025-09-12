import React, { useState, useEffect } from 'react';
import AdminLTELayout from '../Layouts/AdminLayout';
import { Head, router } from '@inertiajs/react';
import Breadcrumb from '@/Components/Breadcrumb';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    ArcElement,
    Title, 
    Tooltip, 
    Legend,
    Filler 
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    BarElement,
    ArcElement,
    Title, 
    Tooltip, 
    Legend,
    Filler
);

const Dashboard = ({ 
    totalConferences, 
    totalPapers, 
    totalSpeakers, 
    totalUsers,
    papersByTopic,
    totalOrganizers,
    totalReviewers,
    totalOthers, 
    recentPapers,
    recentUsers,
    paperStatusData,  // ✅ NEW
    monthlyData       // ✅ NEW
}) => {
    const format = (time) => {
        return new Date(time).toLocaleDateString();
    };
    
    const headWeb = 'Analytics Dashboard';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    
    // Date range state
    const [dateRange, setDateRange] = useState('thisWeek');

    // ✅ Use real chart data from backend
    const barChartData = paperStatusData || {
        labels: ['Pending', 'Accepted', 'Rejected'],
        datasets: [{
            label: 'Paper Count',
            data: [0, 0, 0],
            backgroundColor: ['rgba(251, 191, 36, 0.8)', 'rgba(34, 197, 94, 0.8)', 'rgba(239, 68, 68, 0.8)']
        }]
    };

    const lineChartData = monthlyData || {
        labels: [],
        datasets: []
    };

    // Doughnut chart for user roles
    const doughnutData = {
        labels: ['Organizers', 'Reviewers', 'Others'],
        datasets: [
            {
                data: [totalOrganizers, totalReviewers, totalOthers],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 146, 60, 0.8)',    
                ],
                borderColor: [
                    'rgb(99, 102, 241)',
                    'rgb(16, 185, 129)',
                    'rgb(251, 146, 60)',
                ],
                borderWidth: 1,
            }
        ]
    };

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    drawBorder: false,
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <AdminLTELayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} style={{ zIndex: 1 }}/>}>
            <div className="min-h-screen px-5 pb-10">
                {/* Date Range Selector */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div className="md:mt-0">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 rounded-md px-4 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="today">Today</option>
                            <option value="thisWeek">This Week</option>
                            <option value="thisMonth">This Month</option>
                            <option value="thisYear">This Year</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                    <p className="m-0 text-sm text-gray-500">Monitor your conference performance metrics</p>
                </div>
                
                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Conference Card */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center p-5">
                            <div className="flex items-center justify-center gap-5">
                                <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Conferences</p>
                                    <p className="text-2xl font-semibold text-gray-900 m-0">{totalConferences}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Paper Card */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center p-5">
                            <div className="flex items-center justify-center gap-5">
                                <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Papers</p>
                                    <p className="text-2xl font-semibold text-gray-900 m-0">{totalPapers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Users Card */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center p-5">
                            <div className="flex items-center justify-center gap-5">
                                <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Users</p>
                                    <p className="text-2xl font-semibold text-gray-900 m-0">{totalUsers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Speakers Card */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center p-5">
                            <div className="flex items-center gap-5">
                                <div className="flex-shrink-0 rounded-md bg-orange-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Events</p>
                                    <p className="text-2xl font-semibold text-gray-900 m-0">{totalSpeakers}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Line Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trends</h3>
                        <div className="h-[300px]">
                            {lineChartData.labels && lineChartData.labels.length > 0 ? (
                                <Line data={lineChartData} options={chartOptions} />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    No monthly data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Doughnut Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Distribution</h3>
                        <div className="h-[300px] flex justify-center items-center">
                            <Doughnut 
                                data={doughnutData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    cutout: '65%',
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                usePointStyle: true,
                                                padding: 20,
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* ✅ Bar Chart - Paper Status */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Paper Status Distribution</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                    <div className="h-[300px]">
                        {barChartData.labels && barChartData.labels.length > 0 ? (
                            <Bar data={barChartData} options={chartOptions} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500">
                                No paper status data available
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Recent Papers */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Papers</h3>
                        <div className="space-y-3">
                            {recentPapers && recentPapers.length > 0 ? (
                                recentPapers.map((paper, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {paper.message}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {format(paper.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    No recent papers
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Users */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Registrations</h3>
                        <div className="space-y-3">
                            {recentUsers && recentUsers.length > 0 ? (
                                recentUsers.map((user, index) => (
                                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-shrink-0">
                                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                                <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {user.message}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {format(user.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">
                                    No recent registrations
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLTELayout>
    );
};

export default Dashboard;