import React, { useState, useEffect, Fragment } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';

export default function YourSubmissionPage({ papers }) {
    const [openId, setOpenId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const headWeb = 'Your Submissions';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    const normalizedPapers = Array.isArray(papers?.data) 
        ? papers.data 
        : Array.isArray(papers) 
            ? papers 
            : [];
    
    // Filter papers based on search term
    const filteredPapers = normalizedPapers.filter(paper => 
        paper?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.topic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.author_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        paper?.decision?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const rows = searchTerm ? filteredPapers : normalizedPapers;

    console.log("Your Submissions:", normalizedPapers);

    // Helper functions
    const getPaperTitle = (paper) => paper.title || '';
    const getTopicText = (paper) => paper.topic || '';
    const getAuthorName = (paper) => paper.author_name || '';
    const getDecision = (paper) => paper.decision || 'Pending';

    const decisionClass = (decision) => {
        const d = (decision || '').toString().toLowerCase();
        if (d.includes('accept') || d === 'accepted') return 'bg-green-100 text-green-800';
        if (d.includes('pend')) return 'bg-yellow-100 text-yellow-800';
        if (d.includes('reject')) return 'bg-red-100 text-red-800';
        if (d.includes('revise')) return 'bg-blue-100 text-blue-800';
        return 'bg-gray-100 text-gray-800';
    };

    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

    return (
        <AdminLayout>
            <Head title={headWeb} />
            <Breadcrumb title={headWeb} links={linksBreadcrumb} />
            
            <div className="bg-white min-h-screen">
                <div className="w-full">
                    <main className="mx-auto px-4 py-6 sm:px-6 lg:px-8 xl:px-12 
                                   max-w-full sm:max-w-7xl 
                                   transition-all duration-300 ease-in-out">
                        
                        {/* Header Section */}
                        <div className="mb-6 lg:mb-8">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl font-semibold text-blue-900 mb-2">
                                                Your Submissions
                                            </h1>
                                            <p className="text-gray-700 text-sm sm:text-base">
                                                Track your submitted papers and their review status
                                            </p>
                                        </div>
                                        
                                        {/* Stats */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                                                <div className="text-xl sm:text-2xl font-bold text-blue-600">{normalizedPapers.length}</div>
                                                <div className="text-xs sm:text-sm text-gray-600">Total Submitted</div>
                                            </div>
                                            <div className="text-center p-3 bg-green-50 rounded-lg">
                                                <div className="text-xl sm:text-2xl font-bold text-green-600">
                                                    {normalizedPapers.filter(p => ['accept', 'accepted'].includes(p.decision?.toLowerCase())).length}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-600">Accepted</div>
                                            </div>
                                            <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                                <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                                                    {normalizedPapers.filter(p => p.decision?.toLowerCase() === 'pending').length}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-600">Pending</div>
                                            </div>
                                            <div className="text-center p-3 bg-red-50 rounded-lg">
                                                <div className="text-xl sm:text-2xl font-bold text-red-600">
                                                    {normalizedPapers.filter(p => ['reject', 'rejected'].includes(p.decision?.toLowerCase())).length}
                                                </div>
                                                <div className="text-xs sm:text-sm text-gray-600">Rejected</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Search and Actions */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-4">
                                {/* Search input */}
                                <div className="relative w-1/4">
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
                                        placeholder="Search submissions..."
                                    />
                                </div>

                                {/* Action Button */}
                                <Link
                                    href={route('submissions.create')}
                                    className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300 flex items-center"
                                >
                                    <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                    </svg>
                                    New Submission
                                </Link>
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
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Topic</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author Name</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Decision</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Submitted</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sr-only">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {rows.length > 0 ? rows.map((paper, idx) => (
                                                <Fragment key={paper.id ?? `row-${idx}`}>
                                                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                                                            {paper.id}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900 font-medium max-w-xs truncate">
                                                            {getPaperTitle(paper)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                                                {getTopicText(paper)}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                                                            {getAuthorName(paper)}
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${decisionClass(getDecision(paper))}`}>
                                                                {getDecision(paper)}
                                                            </span>
                                                        </td>
                                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                            {paper.submitted_at ? new Date(paper.submitted_at).toLocaleDateString() : 'N/A'}
                                                        </td>
                                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                                                            <button
                                                                type="button"
                                                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                                                                onClick={() => toggleRow(paper.id)}
                                                            >
                                                                {openId === paper.id ? 'Hide Details' : 'View Details'}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    {openId === (paper.id ?? idx) && (
                                                        <tr className="bg-gray-50">
                                                            <td colSpan={7} className="px-4 py-6">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                    <div>
                                                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Paper Details</h4>
                                                                        <div className="space-y-3">
                                                                            <div>
                                                                                <span className="text-sm font-medium text-gray-600">Track:</span>
                                                                                <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                                                                                    {paper.track || 'N/A'}
                                                                                </span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-sm font-medium text-gray-600">Institute:</span>
                                                                                <span className="ml-2 text-sm text-gray-900">{paper.institute || 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-sm font-medium text-gray-600">Corresponding Email:</span>
                                                                                <span className="ml-2 text-sm text-gray-900">{paper.correspond_email || 'N/A'}</span>
                                                                            </div>
                                                                            <div>
                                                                                <span className="text-sm font-medium text-gray-600">Current Status:</span>
                                                                                <span className={`ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${decisionClass(paper.status)}`}>
                                                                                    {paper.status || 'Pending'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Available Actions</h4>
                                                                        <div className="flex flex-wrap gap-2">
                                                                            <Link
                                                                                href={route('review.history', { paper_id: paper.id })}
                                                                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                                            >
                                                                                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                                Review History
                                                                            </Link>
                                                                            <Link
                                                                                href={route('submissions.show', { id: paper.submission_id })}
                                                                                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                                                            >
                                                                                <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                </svg>
                                                                                View Submission
                                                                            </Link>
                                                                            {(paper.decision === 'Pending' || !paper.decision) && (
                                                                                <Link
                                                                                    href={route('submissions.edit', { id: paper.submission_id })}
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
                                                                            {paper.decision && paper.decision !== 'Pending' && (
                                                                                <Link
                                                                                    href={`#decision-${paper.id}`}
                                                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                                                >
                                                                                    <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                    </svg>
                                                                                    View Decision
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
                                                            <h3 className="text-sm font-medium text-gray-900">No submissions found</h3>
                                                            <p className="mt-1 text-sm text-gray-500">You haven't submitted any papers yet.</p>
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
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination */}
                                {papers?.links && (
                                    <div className="mt-8">
                                        <Pagination links={papers.links} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </AdminLayout>
    );
}
