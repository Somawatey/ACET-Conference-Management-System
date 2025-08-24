// In resources/js/Pages/Reviews/Show.jsx

import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

// A simple component for displaying scores
const ScoreDisplay = ({ label, score }) => (
    <div className="flex justify-between items-center py-2 border-b">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-indigo-600">{score || 'N/A'} / 10</span>
    </div>
);

export default function ReviewDetails({ review }) {
    const paper = review.paper;
    const reviewer = review.reviewer;

    return (
        <AdminLayout>
            <Head title={`Review Details for Paper #${paper.id}`} />

            <div className="py-12" style={{ marginTop: '60px' }}>
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Back Link */}
                    <div className="mb-4">
                        <Link
                            href={route('paper-decision.show', { id: paper.id })} // Link back to the decision page
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            &larr; Back to Final Decision Page
                        </Link>
                    </div>

                    {/* Paper Information Section */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Paper Information</h3>
                        <div className="space-y-2 text-gray-700">
                            <p><strong>Title:</strong> {paper.title || paper.paper_title}</p>
                            <p><strong>Track:</strong> {paper.track || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Review Details Section */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Review Details</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-gray-800">Reviewer</h4>
                                <p className="text-gray-600">{reviewer.name}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800">Recommendation</h4>
                                <p className="text-gray-600">{review.recommendation || 'No recommendation provided'}</p>
                            </div>

                            {/* Scores Section */}
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2">Scores</h4>
                                <div className="space-y-1">
                                    <ScoreDisplay label="Originality" score={review.originality_score} />
                                    <ScoreDisplay label="Significance" score={review.significance_score} />
                                    <ScoreDisplay label="Clarity" score={review.clarity_score} />
                                    <ScoreDisplay label="Relevance" score={review.relevance_score} />
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div>
                                <h4 className="font-semibold text-gray-800">Comments for Author</h4>
                                <div className="mt-2 p-3 bg-gray-50 border rounded-md text-gray-700 whitespace-pre-wrap">
                                    {review.comments_for_author || 'No comments provided.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}