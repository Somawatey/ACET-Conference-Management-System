// In resources/js/Pages/Reviews/Show.jsx

import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

// A simple component for displaying scores
const ScoreDisplay = ({ score }) => {
    if (!score) return <span className="text-gray-400">Not rated</span>;
    
    const stars = [];
    const fullStars = Math.floor(score);
    
    for (let i = 1; i <= 10; i++) {
        if (i <= fullStars) {
            stars.push(
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            );
        } else {
            stars.push(
                <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
            );
        }
    }
    
    return (
        <div className="flex items-center space-x-2">
            <div className="flex">{stars.slice(0, Math.min(score, 5))}</div>
            <span className="text-sm font-semibold text-gray-700">({score}/10)</span>
        </div>
    );
};

// Status badge component
const StatusBadge = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-sm font-semibold rounded-full inline-block';
    const statusClasses = {
        Accept: 'bg-green-100 text-green-800',
        Reject: 'bg-red-100 text-red-800',
        Revise: 'bg-yellow-100 text-yellow-800',
    };
    return (
        <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
            {status || 'No Status'}
        </span>
    );
};

export default function ReviewDetails({ review, paper, allReviews = [] }) {
    return (
        <AdminLayout>
            <Head title={`Review Details - ${paper?.title || 'Paper'}`} />

            <div className="py-12" style={{ marginTop: '60px' }}>
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Back Link */}
                    <div className="mb-4">
                        <Link
                            href={route('paper-decision.show', { paper: paper?.id })}
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Paper Decision
                        </Link>
                    </div>

                    {/* Paper Information Section */}
                    <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Paper Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Paper Title</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-medium">
                                    {paper?.title || 'No title available'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                    {paper?.topic || 'No topic specified'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Track</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                    {paper?.track || 'No track specified'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Authors</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                    {paper?.authors || 'No authors specified'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Submission Date</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                    {paper?.submissionDate || 'No submission date'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
                                    <StatusBadge status={paper?.status} />
                                </div>
                            </div>
                            
                            {paper?.keywords && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                                    <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                        {paper.keywords}
                                    </div>
                                </div>
                            )}
                            
                            {paper?.pdf_path && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PDF Document</label>
                                    <div className="p-3">
                                        <a 
                                            href={`/storage/${paper.pdf_path}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            View PDF
                                        </a>
                                    </div>
                                </div>
                            )}
                            
                            {paper?.abstract && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Abstract</label>
                                    <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 text-sm leading-relaxed">
                                        {paper.abstract}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Details Section */}
                    <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Review Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Reviewer</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-medium">
                                    {review?.reviewer || 'Unknown Reviewer'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review Date</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                    {review?.reviewDate || 'No date available'}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
                                    <StatusBadge status={review?.recommendation} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
                                    <ScoreDisplay score={review?.score} />
                                </div>
                            </div>
                            
                            {review?.feedback && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Comments & Feedback</label>
                                    <div className="p-4 bg-gray-50 border border-gray-300 rounded-md text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                                        {review.feedback}
                                    </div>
                                </div>
                            )}
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Review Timeline</label>
                                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
                                    <div>Created: {review?.created_at || 'Unknown'}</div>
                                    {review?.updated_at && review.updated_at !== review.created_at && (
                                        <div>Last Updated: {review.updated_at}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* All Reviews Summary */}
                    {allReviews.length > 1 && (
                        <div className="p-6 bg-white shadow rounded-lg border border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">All Reviews for This Paper</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {allReviews.map((rev) => (
                                            <tr key={rev.id} className={rev.is_current ? 'bg-blue-50' : ''}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {rev.reviewer}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rev.reviewDate}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rev.score ? `${rev.score}/10` : 'Not rated'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={rev.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {rev.is_current && (
                                                        <span className="text-blue-600 font-medium">Current Review</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}