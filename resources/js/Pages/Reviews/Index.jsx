import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import Pagination from "@/Components/Pagination";
import PaperList from "./Partial/PaperList";
export default function ReviewsIndex({ reviews }) {
    // Extract unique papers from reviews
    // Deduplicate papers by id
    const papers = Array.isArray(reviews.data)
        ? Object.values(
            reviews.data
                .map(r => r.paper)
                .filter(Boolean)
                .reduce((acc, paper) => {
                    if (paper && paper.id && !acc[paper.id]) {
                        acc[paper.id] = paper;
                    }
                    return acc;
                }, {})
        )
        : [];
    const [searchTerm, setSearchTerm] = useState("");

    console.log(papers);

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
                        {/* Paper List Table below search bar */}
                        <PaperList papers={papers} />
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
