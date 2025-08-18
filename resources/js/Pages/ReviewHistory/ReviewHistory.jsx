import { Head } from "@inertiajs/react";
import { useState } from "react";
import PaperInfo from "./Partial/PaperInfo";
import ReviewerBlock from "./Partial/Feedback";
import ReviewSummary from "./Partial/Summary";
import Pagination from "@/Components/Pagination";

export default function ReviewHistory({ paper, papers, reviews, filters }) {
    const items = reviews ?? [];

    // Initialize show/hide from query param (?show=1|0), default to show
    const initialShow = (() => {
        if (typeof window === 'undefined') return true;
        const params = new URLSearchParams(window.location.search);
        const v = params.get('show');
        if (v === '0') return false;
        if (v === '1') return true;
        return true;
    })();
    const [showHistory, setShowHistory] = useState(initialShow);
    const [menuOpen, setMenuOpen] = useState(false);

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
                    {}
                    {showHistory && (
                        <form method="get" action="/review-history" className="bg-white shadow rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input type="hidden" name="show" value={showHistory ? 1 : 0} />
                            <input type="hidden" name="page" value={papers?.current_page ?? 1} />
    
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
                                <a href={`/review-history?page=${papers?.current_page ?? 1}&show=${showHistory ? 1 : 0}`} className="px-4 py-2 rounded-md border text-gray-700">Reset</a>
                                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">Apply</button>
                            </div>
                        </form>
                    )}

                    {/* Reviews Section Header */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Review History ({items.length} reviews)
                                </h3>
                                <p className="text-sm text-gray-600">
                                    All reviews submitted for this paper
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium bg-white hover:bg-gray-50"
                                >
                                    {showHistory ? 'Showing' : 'Hidden'} History
                                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white shadow-lg z-10">
                                        <button
                                            type="button"
                                            onClick={() => { setShowHistory(true); setMenuOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Show Review History
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowHistory(false); setMenuOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Hide Review History
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Review History */}
                    {showHistory && (
                        <>
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
                        </>
                    )}
                    {/* Pagination */}
                    <div className="mt-6 flex justify-end">
                        <Pagination links={papers?.links} />
                    </div>
                </main>
            </section>
        </div>
    );
}