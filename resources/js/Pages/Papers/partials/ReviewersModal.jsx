import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function ReviewersModal({ paper, reviews, onClose, assignedReviewers, onToggleReviewer }) {
    // Get existing assignments from paper data
    const existingAssignments = paper.assignments || [];
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showHelp, setShowHelp] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        paper_id: paper.id,
        reviewer_ids: [],
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
    });

    // Update reviewer_ids whenever assignedReviewers changes
    React.useEffect(() => {
        const reviewerIds = assignedReviewers.map(r => r.id);
        setData('reviewer_ids', reviewerIds);
    }, [assignedReviewers]);

    // Filter reviewers based on search query
    const filteredReviewers = reviews.filter(reviewer => {
        const searchString = searchQuery.toLowerCase();
        return (
            reviewer.name.toLowerCase().includes(searchString) ||
            reviewer.email.toLowerCase().includes(searchString)
        );
    });

    // Group reviewers by status
    const groupedReviewers = {
        assigned: assignedReviewers,
        alreadyAssigned: filteredReviewers.filter(reviewer => 
            existingAssignments.some(a => a.reviewer_id === reviewer.id && a.status !== 'cancelled') &&
            !assignedReviewers.some(r => r.id === reviewer.id)
        ),
        available: filteredReviewers.filter(reviewer => 
            !existingAssignments.some(a => a.reviewer_id === reviewer.id && a.status !== 'cancelled') &&
            !assignedReviewers.some(r => r.id === reviewer.id)
        )
    };
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
                        {/* Help Button */}
                        <button
                            onClick={() => setShowHelp(!showHelp)}
                            className="absolute top-4 right-16 text-gray-400 hover:text-gray-600"
                            title="Show help"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </button>

                        {/* Help Panel */}
                        {showHelp && (
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded">
                                <h4 className="text-blue-800 font-medium mb-2">How to Assign Reviewers</h4>
                                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                                    <li>You can assign up to 4 reviewers per paper</li>
                                    <li>Click on an available reviewer to assign them</li>
                                    <li>Click 'Remove' to unassign a reviewer</li>
                                    <li>Use the search box to filter reviewers</li>
                                    <li>Set a due date for the reviews</li>
                                </ul>
                            </div>
                        )}

                        {/* Paper Info */}
                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <h4 className="font-medium text-gray-900">{paper.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">Author: {getAuthorName(paper)}</p>
                            <p className="text-sm text-gray-600">Topic: {getTopicText(paper)}</p>
                        </div>

                        {/* Search Box */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search reviewers by name or email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Current Assignments */}
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <h5 className="text-sm font-medium text-gray-700">
                                    Selected Reviewers
                                </h5>
                                <span className={`text-sm font-medium ${
                                    assignedReviewers.length === 4 ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                    {assignedReviewers.length}/4 assigned
                                </span>
                            </div>
                            <div className="space-y-2">
                                {assignedReviewers.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic text-center py-4">
                                        No reviewers selected yet
                                    </p>
                                ) : (
                                    assignedReviewers.map((reviewer) => (
                                        <div key={reviewer.id} className="flex justify-between items-center p-3 bg-blue-50 border border-blue-200 rounded-lg group hover:bg-blue-100 transition-colors">
                                            <div>
                                                <p className="font-medium text-blue-900">{reviewer.name}</p>
                                                <p className="text-sm text-blue-600">{reviewer.email}</p>
                                            </div>
                                            <button
                                                onClick={() => onToggleReviewer(reviewer)}
                                                className="text-red-600 hover:text-red-800 focus:outline-none text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Available Reviewers */}
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Available Reviewers</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredReviewers.length === 0 ? (
                                    <div className="col-span-2 text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No reviewers found</h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Try adjusting your search terms
                                        </p>
                                    </div>
                                ) : (
                                    groupedReviewers.available.map((reviewer) => (
                                        <div
                                            key={reviewer.id}
                                            onClick={() => onToggleReviewer(reviewer)}
                                            className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all duration-200 hover:shadow-md group"
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-gray-900">{reviewer.name}</p>
                                                    <p className="text-sm text-gray-500">{reviewer.email}</p>
                                                </div>
                                                <div className="text-blue-600 transform group-hover:scale-110 transition-transform">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* Already Assigned Section */}
                                {groupedReviewers.alreadyAssigned.length > 0 && (
                                    <div className="col-span-2 mt-6">
                                        <h6 className="text-sm font-medium text-gray-500 mb-3">Already Assigned to This Paper</h6>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {groupedReviewers.alreadyAssigned.map((reviewer) => (
                                                <div
                                                    key={reviewer.id}
                                                    className="p-4 rounded-lg border border-gray-300 bg-gray-50"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-medium text-gray-900">{reviewer.name}</p>
                                                            <p className="text-sm text-gray-500">{reviewer.email}</p>
                                                            <p className="text-xs text-gray-600 mt-1">Already reviewing this paper</p>
                                                        </div>
                                                        <div className="text-gray-400">
                                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Due Date Input */}
                    <div className=" px-4 mt-6 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <label htmlFor="due_date" className="block text-sm font-semibold text-gray-900">
                                Review Due Date
                            </label>
                            <span className="text-xs text-gray-500">Required *</span>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <input
                                type="date"
                                id="due_date"
                                name="due_date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="pl-10 block w-full rounded-md border border-gray-300 bg-white py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 sm:text-sm transition duration-150 ease-in-out"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        {errors.due_date && (
                            <p className="mt-2 text-sm text-red-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                {errors.due_date}
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSaving(true);
                                setData('reviewer_ids', assignedReviewers.map(r => r.id));
                                post(route('paper-assignments.store'), {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        setSaving(false);
                                        onClose();
                                    },
                                    onError: () => {
                                        setSaving(false);
                                    }
                                });
                            }}
                            disabled={saving || processing || assignedReviewers.length === 0}
                            className={`px-4 py-2 text-white rounded-md ${
                                saving || processing || assignedReviewers.length === 0
                                    ? 'bg-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {saving || processing ? 'Saving...' : 'Save Assignments'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
