import React from 'react';
import { Link } from '@inertiajs/react';

export default function ReviewDetailsSection({ review, className = "" }) {
    if (!review) {
        return null;
    }

    return (
        <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Review Details</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <strong className="text-gray-700">Score:</strong>
                        <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {review.score}/10
                        </span>
                    </div>
                    <div>
                        <strong className="text-gray-700">Recommendation:</strong>
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                            review.recommendation?.toLowerCase() === 'accept' ? 'bg-green-100 text-green-800' :
                            review.recommendation?.toLowerCase() === 'reject' ? 'bg-red-100 text-red-800' :
                            review.recommendation?.toLowerCase() === 'revise' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {review.recommendation || 'Not specified'}
                        </span>
                    </div>
                </div>
                
                {review.feedback && (
                    <div>
                        <strong className="text-gray-700">Feedback:</strong>
                        <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700 whitespace-pre-wrap">{review.feedback}</p>
                        </div>
                    </div>
                )}
                
                <div className="text-sm text-gray-500">
                    <strong>Review submitted:</strong> {new Date(review.created_at).toLocaleDateString()}
                </div>
            </div>
            
            <div className="mt-6 flex space-x-4">
                <Link 
                    href={route('reviews.edit', review.id)} 
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                >
                    Edit Review
                </Link>
                <Link 
                    href={route('reviews.reviewList')} 
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                >
                    Back to Assignments
                </Link>
            </div>
        </div>
    );
}
