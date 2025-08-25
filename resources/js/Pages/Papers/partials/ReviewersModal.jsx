import React from 'react';

export default function ReviewersModal({ paper, reviews, onClose, assignedReviewers, onToggleReviewer }) {
    const getTopicText = (p) => (typeof p?.topic === 'object' ? (p.topic?.name ?? '') : (p?.topic ?? ''));
    const getAuthorName = (p) => {
        if (p?.author_info?.author_name) {
            return p.author_info.author_name;
        }
        return 'No Author';
    };

    const isReviewerAssigned = (reviewerId) =>
        assignedReviewers.some(r => r.id === reviewerId);

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                
                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full">
                    {/* Header */}
                    <div className="flex items-start justify-between p-4 border-b">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Manage Paper Reviewers
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <span className="text-2xl">×</span>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {/* Paper Info */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h4 className="font-medium text-gray-900">{paper.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">Author: {getAuthorName(paper)}</p>
                            <p className="text-sm text-gray-600">Topic: {getTopicText(paper)}</p>
                        </div>

                        {/* Current Assignments */}
                        <div className="mb-6">
                            <h5 className="text-sm font-medium text-gray-700 mb-3">
                                Current Assignments ({assignedReviewers.length}/4)
                            </h5>
                            <div className="space-y-2">
                                {assignedReviewers.map((reviewer) => (
                                    <div key={reviewer.id} className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-green-800">{reviewer.name}</p>
                                        </div>
                                        <button
                                            onClick={() => onToggleReviewer(reviewer)}
                                            className="text-red-600 hover:text-red-800 focus:outline-none text-sm"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Available Reviewers */}
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Available Reviewers</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {reviews
                                    .filter(reviewer => !isReviewerAssigned(reviewer.id))
                                    .map((reviewer) => (
                                        <div
                                            key={reviewer.id}
                                            onClick={() => onToggleReviewer(reviewer)}
                                            className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900">{reviewer.name}</p>
                                                    <p className="text-sm text-gray-500">{reviewer.email}</p>
                                                </div>
                                                <div className="text-blue-600">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
