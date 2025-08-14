import { Head } from "@inertiajs/react";
import PaperInfo from "./Partial/PaperInfo";
import ReviewerBlock from "./Partial/Feedback";
import ReviewSummary from "./Partial/Summary";
import Pagination from "@/Components/Pagination";

export default function ReviewHistory({ paper, reviews, filters, topics, tracks }) {
    const items = reviews?.data ?? [];
    
    console.log("Review History Items:", items);
    console.log("Paper Info:", paper);

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <Head title="Review History" />
            <section>
                <header className="bg-[#12284B] shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow">Review History</h2>
                    </div>
                </header>
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {/* Paper Search and Selection */}
                    <form method="get" action="/review-history" className="bg-white shadow rounded-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search Papers</label>
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters?.search || ""}
                                    placeholder="Search by paper title..."
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Track</label>
                                <select
                                    name="track"
                                    defaultValue={filters?.track || ""}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Tracks</option>
                                    {tracks?.map((track) => (
                                        <option key={track} value={track}>{track}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Topic</label>
                                <select
                                    name="topic"
                                    defaultValue={filters?.topic || ""}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">All Topics</option>
                                    {topics?.map((topic) => (
                                        <option key={topic} value={topic}>{topic}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Search and filter papers
                            </div>
                            <div className="flex gap-3">
                                <a href="/review-history" className="px-4 py-2 rounded-md border text-gray-700 hover:bg-gray-50">Reset</a>
                                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Search Papers</button>
                            </div>
                        </div>
                    </form>



                    {/* Paper Information */}
                    {paper && (
                        <div className="mb-8">
                            <PaperInfo 
                                paper={paper} 
                                className="bg-white shadow rounded-lg p-6"
                            />
                        </div>
                    )}

                    {/* Review Filters */}
                    <form method="get" action="/review-history" className="bg-white shadow rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Hidden paper ID to maintain current paper */}
                        <input type="hidden" name="paper_id" value={paper?.id} />
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Search by Reviewer</label>
                            <input
                                type="text"
                                name="reviewer"
                                defaultValue={filters?.reviewer || ""}
                                placeholder="Enter reviewer name..."
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Review Status</label>
                            <select
                                name="status"
                                defaultValue={filters?.status || ""}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="accept">Accepted</option>
                                <option value="revise">Needs Revision</option>
                                <option value="reject">Rejected</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                            <select
                                name="rating"
                                defaultValue={filters?.rating || ""}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>
                        </div>
                        <div className="md:col-span-4 flex justify-end gap-3">
                            <a href={`/review-history?paper_id=${paper?.id}`} className="px-4 py-2 rounded-md border text-gray-700">Reset</a>
                            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Apply</button>
                        </div>
                    </form>

                    {/* Reviews Section Header */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Review History ({items.length} reviews)
                        </h3>
                        <p className="text-sm text-gray-600">
                            All reviews submitted for this paper
                        </p>
                    </div>

                    {/* Review History */}
                    <div className="space-y-6 mb-8">
                        {items.map((review) => (
                            <ReviewerBlock key={review.id} review={review} />
                        ))}
                        {items.length === 0 && (
                            <div className="bg-white shadow rounded-lg p-6 text-gray-600">
                                No reviews found for this paper.
                            </div>
                        )}
                    </div>

                    {/* Summary Section */}
                    {items.length > 0 && <ReviewSummary reviewData={items} />}

                    {/* Pagination */}
                    <div className="mt-6 flex justify-end">
                        <Pagination links={reviews?.links} />
                    </div>
                </main>
            </section>
        </div>
    );
}