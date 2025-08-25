import React, { useState } from 'react';
import AdminLTELayout from '../Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Head } from '@inertiajs/react';
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
import moment from 'moment';

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

const Dashboard = ( { 
    totalConferences, 
    totalPapers, 
    totalSpeakers, 
    totalUsers,
    papersByTopic,
    totalOrganizers,
    totalReviewers,
    totalAttendees,
    totalAuthors,
    recentPapers,
    recentUsers
}) => {
    const format = (time) => {
        return moment(time, "HH:mm:ss").format("hh:mm A");
    };
    const headWeb = 'Analytics Dashboard';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    
    // Date range state
    const [dateRange, setDateRange] = useState('thisWeek');
    
    const lineChartData = {
        labels: ['Conferences', 'Papers', 'Speakers', 'Users'],
        datasets: [
            {
                label: 'Totals',
                data: [totalConferences, totalPapers, totalSpeakers, totalUsers],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)',
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(239, 68, 68, 0.7)',
                    'rgba(239, 233, 68, 1)',
                ],

                borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                    'rgb(239, 68, 68)',
                    'rgba(239, 233, 68, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const barChartData = {
        labels: ['AI/ML', 'Security', 'Web Dev', 'Mobile', 'IoT', 'Blockchain', 'Cloud'],
        datasets: [
            {
                label: 'Accepted Papers',
                data: papersByTopic.map(topic => topic.total),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
            },
            {
                label: 'Rejected Papers',
                data: papersByTopic.map(topic => topic.total),
                backgroundColor: 'rgba(239, 68, 68, 0.7)',
            }
        ]
    };

    // const doughnutData = {
    //     labels: ['Conferences', 'Papers', 'Speakers'],
    //     datasets: [
    //         {
    //         data: [totalConferences, totalPapers, totalSpeakers],
    //         backgroundColor: [
    //             'rgba(99, 102, 241, 0.8)',
    //             'rgba(16, 185, 129, 0.8)',
    //             'rgba(251, 146, 60, 0.8)',
    //         ],
    //         },
    //     ],
    // };

    const doughnutData = {
        labels: ['Organizers', 'Reviewers', 'Attendees', 'Authors'],
        datasets: [
            {
                label: 'Total Users',
                data: [totalOrganizers, totalReviewers, totalAttendees, totalAuthors],
                backgroundColor: [
                    'rgba(99, 102, 241, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(251, 146, 60, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgb(99, 102, 241)',
                    'rgb(16, 185, 129)',
                    'rgb(251, 146, 60)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 1,
            }
        ]
    };
    
    return (
        <AdminLTELayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} style={{ zIndex: 1 }}/>}>
            {/* <Head title={headWeb} /> */}

            <div className="min-h-screen px-5 pb-10">
                {/* Date Range Selector and Overview */}
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
                    {/* Conference Card - FIXED */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="flex items-center justify-center gap-5">
                                <div className="flex-shrink-0 rounded-md bg-purple-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Conferences</p>
                                    <div className="flex items-baseline">
                                        <p className="text-2xl font-semibold text-gray-900 m-0">{totalConferences}</p>
                                        <p className="ml-2 text-sm text-green-600 font-medium flex items-center m-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                            18.9%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm text-gray-500 flex justify-between items-center">
                                <span>3 active now</span>
                                <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">View details</span>
                            </div>
                        </div> */}
                    </div>
                    
                    {/* Paper Submissions Card - FIXED */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="flex items-center justify-center gap-5">
                                <div className="flex-shrink-0 rounded-md bg-blue-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Paper Submissions</p>
                                    <div className="flex items-baseline">
                                        <p className="text-2xl font-semibold text-gray-900 m-0">{totalPapers}</p>
                                        <p className="ml-2 text-sm text-green-600 font-medium flex items-center m-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                            12.5%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className=" bg-gray-50 px-5 py-3">
                            <div className="text-sm text-gray-500 flex justify-between items-center">
                                <span>81 accepted</span>
                                <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">View all</span>
                            </div>
                        </div> */}
                    </div>

                    {/* Registrations Card - FIXED */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center p-5">
                            <div className="flex items-center justify-center gap-5">
                                <div className="flex-shrink-0 rounded-md bg-green-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Registrations</p>
                                    <div className="flex items-baseline">
                                        <p className="text-2xl font-semibold text-gray-900 m-0">{totalUsers}</p>
                                        <p className="ml-2 text-sm text-green-600 font-medium flex items-center m-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                            8.2%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm text-gray-500 flex justify-between items-center">
                                <span>42 new this week</span>
                                <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">View all</span>
                            </div>
                        </div> */}
                    </div>

                    {/* Speakers Card - FIXED */}
                    <div className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden h-full">
                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="flex items-center  gap-5">
                                <div className="flex-shrink-0 rounded-md bg-orange-100 p-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <div className="">
                                    <p className="text-gray-500 text-[15px] font-medium uppercase m-0">Speakers</p>
                                    <div className="flex items-baseline">
                                        <p className="text-2xl font-semibold text-gray-900 m-0">{totalSpeakers}</p>
                                        <p className="ml-2 text-sm text-red-600 font-medium flex items-center m-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                            2.3%
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="bg-gray-50 px-5 py-3">
                            <div className="text-sm text-gray-500 flex justify-between items-center">
                                <span>8 keynotes</span>
                                <span className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">View all</span>
                            </div>
                        </div> */}
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Line Chart */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Submissions & Registrations</h3>
                            {/* <div className="flex space-x-2">
                                <button className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700">Monthly</button>
                                <button className="px-3 py-1 text-xs font-medium rounded text-gray-500 hover:bg-gray-100">Weekly</button>
                                <button className="px-3 py-1 text-xs font-medium rounded text-gray-500 hover:bg-gray-100">Daily</button>
                            </div> */}
                        </div>
                        <div className="h-[300px]">
                            <Line 
                                data={lineChartData} 
                                options={{
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
                                }}
                            />
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

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Papers by Topic</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                    </div>
                    <div className="h-[300px]">
                        <Bar 
                            data={barChartData} 
                            options={{
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
                            }}
                        />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="flex flex-col justify-between bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flow-root">
                            <ul className="-mb-8">
                                <li>
                                    <div className="relative pb-8">
                                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div className="relative flex items-start space-x-3">
                                            <div className="relative">
                                                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center ring-8 ring-white">
                                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div>
                                                    <p className="text-sm text-gray-500">{recentPapers[0]?.message} <span className="font-bold text-gray-900">{recentPapers[0]?.paper_title}</span></p>
                                                    <p className="mt-0.5 text-sm text-gray-500">{recentPapers[0]?.created_at ? format(new Date(recentPapers[0].created_at), "HH:mm") : ""}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="relative pb-8">
                                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div className="relative flex items-start space-x-3">
                                            <div className="relative">
                                                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div>
                                                    <p className="text-sm text-gray-500">New Registration: {recentUsers[0]?.message}</p>
                                                    <p className="mt-0.5 text-sm text-gray-500">{recentUsers[0]?.created_at ? format(new Date(recentUsers[0].created_at), "HH:mm") : ""}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="relative pb-8">
                                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                        <div className="relative flex items-start space-x-3">
                                            <div className="relative">
                                                <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center ring-8 ring-white">
                                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div>
                                                    <p className="text-sm text-gray-500">Paper review completed <span className="font-medium text-gray-900">Blockchain Security Analysis</span></p>
                                                    <p className="mt-0.5 text-sm text-gray-500">3 hours ago</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="relative">
                                        <div className="relative flex items-start space-x-3">
                                            <div className="relative">
                                                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white">
                                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div>
                                                    <p className="text-sm text-gray-500">New payment received <span className="font-medium text-gray-900">$750.00</span></p>
                                                    <p className="mt-0.5 text-sm text-gray-500">Yesterday at 11:42 PM</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLTELayout>
    );
};

export default Dashboard;