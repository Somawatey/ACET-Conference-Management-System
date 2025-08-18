import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import Pagination from "@/Components/Pagination";

export default function ReviewsIndex({ reviews }) {
    const [searchTerm, setSearchTerm] = useState("");

    // Filter reviews based on search term
    const filteredReviews = reviews.data?.filter(review => 
        review.paper?.paper_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.feedback?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const getStatusColor = (recommendation) => {
        switch (recommendation?.toLowerCase()) {
            case 'accept':
                return 'bg-green-100 text-green-800';
            case 'reject':
                return 'bg-red-100 text-red-800';
            case 'revise':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStarRating = (score) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < score ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <Head title="My Reviews" />
            
            <section>
                <header className="bg-[#12284B] shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow">
                            My Reviews
                        </h2>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-3xl font-semibold text-blue-900 mb-2">
                                    Review Management
                                </h1>
                                <p className="text-gray-700">
                                    Manage and track all your paper reviews
                                </p>
                            </div>
                            <Link 
                                href={route('reviews.create')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Create New Review
                            </Link>
                        </div>

                        {/* Search Bar */}
                        <div className="bg-white shadow rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Search reviews by paper title or feedback..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="text-sm text-gray-600">
                                    {filteredReviews.length} review(s) found
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-6">
                        {filteredReviews.length === 0 ? (
                            <div className="bg-white shadow rounded-lg p-8 text-center">
                                <div className="text-gray-500 mb-4">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm ? 'No reviews match your search criteria.' : 'You haven\'t submitted any reviews yet.'}
                                </p>
                                <Link 
                                    href={route('reviews.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Create Your First Review
                                </Link>
                            </div>
                        ) : (
                            filteredReviews.map((review) => (
                                <div key={review.id} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition duration-200">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {review.paper?.paper_title || 'Untitled Paper'}
                                            </h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <span>Review Date: {new Date(review.created_at).toLocaleDateString()}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(review.recommendation)}`}>
                                                    {review.recommendation || 'No Recommendation'}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <span>Rating:</span>
                                                    <div className="flex">
                                                        {getStarRating(review.score || 0)}
                                                    </div>
                                                    <span className="ml-1">({review.score || 0}/5)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link 
                                                href={route('reviews.show', review.id)}
                                                className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                View
                                            </Link>
                                            <Link 
                                                href={route('reviews.edit', review.id)}
                                                className="px-3 py-1 text-green-600 hover:text-green-800 text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <div className="border-t pt-4">
                                        <h4 className="text-sm font-medium text-gray-900 mb-2">Feedback:</h4>
                                        <p className="text-gray-700 text-sm line-clamp-3">
                                            {review.feedback || 'No feedback provided'}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Pagination */}
                    {reviews.links && (
                        <div className="mt-8 flex justify-center">
                            <Pagination links={reviews.links} />
                        </div>
                    )}
                </main>
            </section>
        </div>
    );
}
