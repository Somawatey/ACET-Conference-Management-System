import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function PaperList({ papers = [] }) {
    const [openId, setOpenId] = useState(null);
    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

    const getTopicText = (p) => (typeof p?.topic === 'object' ? (p.topic?.name ?? '') : (p?.topic ?? ''));
    const getPaperTitle = (p) => (p?.paper_title ?? p?.title ?? '');
    const statusClass = (status) => {
        const s = (status || 'pending').toString().toLowerCase();
        if (s === 'accept' || s === 'accepted') return 'bg-green-100 text-green-800';
        if (s === 'reject' || s === 'rejected') return 'bg-red-100 text-red-800';
        if (s === 'revise' || s === 'revision') return 'bg-orange-100 text-orange-800';
        if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paper Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PDF</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {papers.map((paper, idx) => {
                            const uniqueKey = `paper-${paper.id || idx}`;
                            const uniqueId = paper.id || `temp-${idx}`;
                            
                            return (
                                <React.Fragment key={uniqueKey}> 
                                    <tr className="hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getPaperTitle(paper)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getTopicText(paper)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{paper.author_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClass(paper.status || paper.review_status)}`}>
                                                {paper.status || paper.review_status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {paper.url ? (
                                                <a href={paper.url.startsWith('http') ? paper.url : `/storage/${paper.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                                                    PDF
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">No PDF</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-1.5 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 transition duration-200"
                                                onClick={() => toggleRow(uniqueId)}
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                {openId === uniqueId ? 'Hide' : 'View'}
                                            </button>
                                        </td>
                                    </tr>
                                    {openId === uniqueId && (
                                    <tr className="bg-gray-50">
                                        <td colSpan={7} className="p-4">
                                            <div className="flex gap-3 flex-wrap">
                                                <Link 
                                                    href={typeof route === 'function' ? route('reviews.create', { paper: paper.id }) : '#'}
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Create Review
                                                </Link>
                                                <Link 
                                                    href={typeof route === 'function' ? route('reviews.edit', paper.id) : '#'}
                                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Edit Review
                                                </Link>
                                                <Link 
                                                    href={typeof route === 'function' ? route('review.history', { paper: paper.id }) : '#'}
                                                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition duration-200 shadow-sm"
                                                >
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Review History
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {papers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-lg">No papers found.</p>
                                        <p className="text-sm text-gray-400 mt-1">Papers will appear here when they are available for review.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
