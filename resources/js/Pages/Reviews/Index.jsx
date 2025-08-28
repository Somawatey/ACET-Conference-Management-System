import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from "@/Components/Pagination";
import PaperList from "./Partial/PaperList";
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
import { Doughnut, Bar, Line } from 'react-chartjs-2';

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

export default function ReviewsIndex({ reviews }) {
    // Extract papers from reviews/assignments data
    const papers = Array.isArray(reviews.data)
        ? reviews.data
            .map(review => review.paper)
            .filter(Boolean)
            .map(paper => ({
                ...paper,
                assignment_status: paper.assignment_status,
                assignment_due_date: paper.assignment_due_date,
                assignment_notes: paper.assignment_notes,
                assigned_by_name: paper.assigned_by_name,
                status: paper.review_status || 'Pending',
            }))
        : [];

    const [searchTerm, setSearchTerm] = useState("");
    const [showCharts, setShowCharts] = useState(true);

    console.log('Papers with assignments:', papers);

    // Filter papers based on search term
    const filteredPapers = papers.filter(paper => 
        paper?.paper_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Calculate statistics
    const totalAssigned = papers.length;
    const acceptedCount = papers.filter(p => ['accept', 'accepted'].includes(p.status?.toLowerCase())).length;
    const rejectedCount = papers.filter(p => ['reject', 'rejected'].includes(p.status?.toLowerCase())).length;
    const reviseCount = papers.filter(p => ['revise', 'revision'].includes(p.status?.toLowerCase())).length;
    const pendingCount = papers.filter(p => p.status?.toLowerCase() === 'pending').length;
    const completedCount = acceptedCount + rejectedCount + reviseCount;

    // Chart data for review status distribution
    const statusDistributionData = {
        labels: ['Accepted', 'Rejected', 'Needs Revision', 'Pending'],
        datasets: [{
            data: [acceptedCount, rejectedCount, reviseCount, pendingCount],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',   // Green for accepted
                'rgba(239, 68, 68, 0.8)',   // Red for rejected
                'rgba(251, 191, 36, 0.8)',  // Yellow for revise
                'rgba(156, 163, 175, 0.8)', // Gray for pending
            ],
            borderColor: [
                'rgb(34, 197, 94)',
                'rgb(239, 68, 68)',
                'rgb(251, 191, 36)',
                'rgb(156, 163, 175)',
            ],
            borderWidth: 2,
        }]
    };

    // Chart data for completion progress
    const completionData = {
        labels: ['Completed', 'Pending'],
        datasets: [{
            data: [completedCount, pendingCount],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',  // Blue for completed
                'rgba(156, 163, 175, 0.8)', // Gray for pending
            ],
            borderColor: [
                'rgb(59, 130, 246)',
                'rgb(156, 163, 175)',
            ],
            borderWidth: 2,
        }]
    };

    // Bar chart for status comparison
    const statusBarData = {
        labels: ['Accepted', 'Rejected', 'Needs Revision', 'Pending'],
        datasets: [{
            label: 'Number of Papers',
            data: [acceptedCount, rejectedCount, reviseCount, pendingCount],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)',
                'rgba(251, 191, 36, 0.8)',
                'rgba(156, 163, 175, 0.8)',
            ],
            borderColor: [
                'rgb(34, 197, 94)',
                'rgb(239, 68, 68)',
                'rgb(251, 191, 36)',
                'rgb(156, 163, 175)',
            ],
            borderWidth: 1,
        }]
    };

    // Chart options
    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    usePointStyle: true,
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `${context.label}: ${context.parsed.y} paper(s)`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                }
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const headWeb = 'My Assigned Papers';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout>
            <Head title="My Assigned Papers" />
            <Breadcrumb title={headWeb} links={linksBreadcrumb} />
            
            <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">My Assigned Papers</h1>
                                <p className="text-blue-100">
                                    You have {pendingCount} pending review{pendingCount !== 1 ? 's' : ''} to complete
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold">
                                    {totalAssigned > 0 ? ((completedCount / totalAssigned) * 100).toFixed(1) : 0}%
                                </div>
                                <div className="text-blue-100 text-sm">Completion Rate</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{totalAssigned}</p>
                                <p className="text-gray-600">Total Assigned</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{acceptedCount}</p>
                                <p className="text-gray-600">Accepted</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{rejectedCount}</p>
                                <p className="text-gray-600">Rejected</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{reviseCount}</p>
                                <p className="text-gray-600">Needs Revision</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gray-100 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
                                <p className="text-gray-600">Pending</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Review Analytics</h2>
                        <button
                            onClick={() => setShowCharts(!showCharts)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className={`w-4 h-4 transition-transform duration-200 ${showCharts ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                            {showCharts ? 'Hide Charts' : 'Show Charts'}
                        </button>
                    </div>

                    {showCharts && totalAssigned > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Status Distribution Doughnut Chart */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Distribution</h3>
                                <div className="h-64">
                                    <Doughnut data={statusDistributionData} options={doughnutOptions} />
                                </div>
                            </div>

                            {/* Completion Progress Doughnut Chart */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h3>
                                <div className="h-64">
                                    <Doughnut data={completionData} options={doughnutOptions} />
                                </div>
                            </div>

                            {/* Status Comparison Bar Chart */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Comparison</h3>
                                <div className="h-64">
                                    <Bar data={statusBarData} options={barOptions} />
                                </div>
                            </div>
                        </div>
                    )}

                    {showCharts && totalAssigned === 0 && (
                        <div className="bg-white rounded-lg shadow p-8">
                            <div className="text-center text-gray-500">
                                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No Data Available</h3>
                                <p className="mt-2">Charts will appear when you have assigned papers to review.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search and Filter Section */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search papers by title, author, or topic..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {filteredPapers.length} paper(s) found
                                </span>
                            </div>
                        </div>

                        {/* Quick Filter Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <button 
                                onClick={() => setSearchTerm('')}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${searchTerm === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                All Papers
                            </button>
                            <button 
                                onClick={() => setSearchTerm('pending')}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${searchTerm === 'pending' ? 'bg-yellow-600 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                            >
                                Pending ({pendingCount})
                            </button>
                            <button 
                                onClick={() => setSearchTerm('accept')}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${searchTerm === 'accept' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                            >
                                Accepted ({acceptedCount})
                            </button>
                            <button 
                                onClick={() => setSearchTerm('reject')}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${searchTerm === 'reject' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                            >
                                Rejected ({rejectedCount})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Paper List Section */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Assigned Papers</h3>
                        <p className="text-gray-600 text-sm mt-1">Review and manage your assigned papers</p>
                    </div>
                    <div className="p-6">
                        <PaperList papers={searchTerm ? filteredPapers : papers} />
                    </div>
                </div>

                {/* Pagination */}
                {reviews.links && (
                    <div className="mt-8 flex justify-center">
                        <Pagination links={reviews.links} />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}