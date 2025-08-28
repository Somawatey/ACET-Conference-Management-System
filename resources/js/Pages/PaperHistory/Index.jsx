import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';
import { Head, Link } from '@inertiajs/react';
import { useState, Fragment } from 'react';

export default function PaperHistoryPage({ histories = [], sidebarOpen = true }) {
    const [openId, setOpenId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const headWeb = 'Paper Submission History';
    const linksBreadcrumb = [
        { title: 'Home', url: '/' },
        { title: 'Papers', url: '/papers' },
        { title: headWeb, url: '' }
    ];

    // Normalize data
    const normalizedHistories = Array.isArray(histories?.data)
        ? histories.data
        : Array.isArray(histories)
            ? histories
            : [];

    // Filter histories based on search term and status
    const filteredHistories = normalizedHistories.filter(history => {
        const matchesSearch = history?.paper_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            history?.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            history?.corresponding_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            history?.status?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' ||
            history?.status?.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearch && matchesStatus;
    });

    const rows = searchTerm || filterStatus !== 'all' ? filteredHistories : normalizedHistories;

    const statusClass = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('accept') || s === 'accepted') return 'bg-green-100 text-green-800';
        if (s.includes('revise') || s.includes('resubmit')) return 'bg-yellow-100 text-yellow-800';
        if (s.includes('reject') || s === 'rejected') return 'bg-red-100 text-red-800';
        if (s.includes('pend') || s === 'pending') return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

    // Get unique statuses for filter
    const uniqueStatuses = [...new Set(normalizedHistories.map(h => h.status).filter(Boolean))];

    return (
        <AdminLayout>
            <Head title={headWeb} />
            <Breadcrumb title={headWeb} links={linksBreadcrumb} />

            <div className="bg-white min-h-screen max-w-full">
                <main className="mx-auto px-5 py-8 sm:px-8 lg:px-16 xl:px-24 
                                   max-w-full 2xl:max-w-9xl
                                   transition-all duration-300 ease-in-out">
                    {/* Header Section */}
                    <div className="mb-6 lg:mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900 mb-2">
                                            Paper Submission History
                                        </h1>
                                        <p className="text-gray-700 text-sm sm:text-base">
                                            Complete history of all paper submissions and their current status
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-blue-600">{normalizedHistories.length}</div>
                                            <div className="text-xs sm:text-sm text-gray-600">Total Papers</div>
                                        </div>
                                        <div className="text-center p-3 bg-green-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-green-600">
                                                {normalizedHistories.filter(h => ['accept', 'accepted'].includes(h.status?.toLowerCase())).length}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-600">Accepted</div>
                                        </div>
                                        <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                                                {normalizedHistories.filter(h => ['pending', 'revise', 'resubmit'].includes(h.status?.toLowerCase())).length}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-600">In Review</div>
                                        </div>
                                        <div className="text-center p-3 bg-red-50 rounded-lg">
                                            <div className="text-xl sm:text-2xl font-bold text-red-600">
                                                {normalizedHistories.filter(h => ['reject', 'rejected'].includes(h.status?.toLowerCase())).length}
                                            </div>
                                            <div className="text-xs sm:text-sm text-gray-600">Rejected</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                            {/* Search input */}
                            <div className="relative flex-1 max-w-md">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-[#FFFFFF] border border-gray-600 rounded-md py-2 pl-10 pr-4 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search submission history..."
                                />
                            </div>

                            {/* Status Filter and Results */}
                            <div className="flex items-center gap-4">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="border border-gray-600 rounded-md py-2 px-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    {uniqueStatuses.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>

                                <span className="text-sm text-gray-600 whitespace-nowrap">
                                    {rows.length} record{rows.length !== 1 ? 's' : ''} found
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Table section */}
                    <div className="overflow-x-auto relative sm:rounded-lg">
                        <div className="inline-block min-w-full">
                            <div className="overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Paper Title</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Corresponding Email</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created At</th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sr-only">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {rows.length > 0 ? rows.map((history, idx) => (
                                            <Fragment key={history.id ?? `history-${idx}`}>
                                                <tr className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                                        {history.id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                                                        {history.paper_title}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                        {history.author_name}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {history.corresponding_email || '—'}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(history.status)}`}>
                                                            {history.status}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {history.created_at ? new Date(history.created_at).toLocaleDateString() : '—'}
                                                    </td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                                        <button
                                                            type="button"
                                                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                            onClick={() => toggleRow(history.id)}
                                                        >
                                                            {openId === history.id ? 'Hide Details' : 'View Details'}
                                                        </button>
                                                    </td>
                                                </tr>
                                                {openId === (history.id ?? idx) && (
                                                    <tr className="bg-gray-50">
                                                        <td colSpan={7} className="px-4 py-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h4>
                                                                    <div className="space-y-3">
                                                                        <div>
                                                                            <span className="text-sm font-medium text-gray-600">Submitted By:</span>
                                                                            <span className="ml-2 text-sm text-gray-900">{history.submitted_by || '—'}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-sm font-medium text-gray-600">Email:</span>
                                                                            <span className="ml-2 text-sm text-gray-900">{history.corresponding_email || '—'}</span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-sm font-medium text-gray-600">Submission Date:</span>
                                                                            <span className="ml-2 text-sm text-gray-900">
                                                                                {history.created_at ? new Date(history.created_at).toLocaleDateString() : '—'}
                                                                            </span>
                                                                        </div>
                                                                        <div>
                                                                            <span className="text-sm font-medium text-gray-600">Current Status:</span>
                                                                            <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClass(history.status)}`}>
                                                                                {history.status}
                                                                            </span>
                                                                        </div>
                                                                        {history.institute && (
                                                                            <div>
                                                                                <span className="text-sm font-medium text-gray-600">Institute:</span>
                                                                                <span className="ml-2 text-sm text-gray-900">{history.institute}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h4>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        <Link
                                                                            href={route('papers.show', { id: history.paper_id || history.id })}
                                                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                                        >
                                                                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                            </svg>
                                                                            View Paper
                                                                        </Link>
                                                                        <Link
                                                                            href={route('review.history', { paper_id: history.paper_id || history.id })}
                                                                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                                        >
                                                                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                            </svg>
                                                                            Review History
                                                                        </Link>
                                                                        {['pending', 'revise', 'resubmit'].includes(history.status?.toLowerCase()) && (
                                                                            <Link
                                                                                href={route('submissions.edit', { id: history.submission_id || history.id })}
                                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
                                                                            >
                                                                                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                                </svg>
                                                                                Edit Submission
                                                                            </Link>
                                                                        )}
                                                                        <button
                                                                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-400 bg-white cursor-not-allowed"
                                                                            disabled
                                                                        >
                                                                            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            Download PDF
                                                                        </button>
                                                                        {['accepted', 'published'].includes(history.status?.toLowerCase()) && (
                                                                            <Link
                                                                                href={`#certificate-${history.id}`}
                                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                                            >
                                                                                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                                Download Certificate
                                                                            </Link>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        )) : (
                                            <tr>
                                                <td colSpan={7} className="text-center py-12">
                                                    <div className="flex flex-col items-center">
                                                        <div className="rounded-full bg-gray-100 p-3 mb-4">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-sm font-medium text-gray-900">No submission history found</h3>
                                                        <p className="mt-1 text-sm text-gray-500">
                                                            {searchTerm || filterStatus !== 'all'
                                                                ? 'Try adjusting your search or filter criteria.'
                                                                : 'No paper submission history available yet.'
                                                            }
                                                        </p>
                                                        {(!searchTerm && filterStatus === 'all') && (
                                                            <div className="mt-6">
                                                                <Link
                                                                    href={route('submissions.create')}
                                                                    className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                                                                >
                                                                    <svg className="-ml-0.5 mr-1.5 h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                                                    </svg>
                                                                    Submit Your First Paper
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {histories?.links && (
                                <div className="mt-8">
                                    <Pagination links={histories.links} />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </AdminLayout>
    );
}
