import { Head, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import PaperInfo from "../ReviewHistory/Partial/PaperInfo";
import ReviewerBlock from "../ReviewHistory/Partial/Feedback";
import ReviewSummary from "../ReviewHistory/Partial/Summary";
import Pagination from '@/Components/Pagination';

function getCustomLinks(links) {
    // Find the active page
    const activeIndex = links.findIndex(link => link.active);
    let start = Math.max(0, activeIndex - 2);
    let end = Math.min(links.length, start + 5);

    // Adjust start if we're at the end
    if (end - start < 5) {
        start = Math.max(0, end - 5);
    }

    // Only keep page number links (not prev/next)
    const pageLinks = links.filter(link => !isNaN(Number(link.label)));
    const customLinks = pageLinks.slice(start, end);

    // Optionally, add prev/next if you want
    const prev = links.find(link => link.label.includes('&laquo;'));
    const next = links.find(link => link.label.includes('&raquo;'));

    let result = [];
    if (prev) result.push(prev);
    result = result.concat(customLinks);
    if (next) result.push(next);

    return result;
}

export default function YourReview({ paper, papers, reviews, filters }) {
    const { auth } = usePage().props;
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const items = reviews ?? [];

    // Get review_id from URL parameters
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const reviewId = params.get('review_id');
            if (reviewId) {
                setSelectedReviewId(parseInt(reviewId));
                // Scroll to the review after a short delay to ensure DOM is ready
                setTimeout(() => {
                    const reviewElement = document.getElementById(`review-${reviewId}`);
                    if (reviewElement) {
                        reviewElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }, 100);
            }
        }
    }, []);

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

    console.log("Your Review Items:", items);
    console.log("Paper Info:", paper);

    const headWeb = 'Your Reviews';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout>
            <Head title="Your Reviews" />
            <Breadcrumb title={headWeb} links={linksBreadcrumb} />

            <div className="bg-white min-h-screen">
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Info Banner for Reviewers */}
                    <div className="mb-6">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-sm font-medium text-blue-800">Your Review History</h4>
                                    <p className="text-sm text-blue-700 mt-1">
                                        Here you can view all papers assigned to you and the reviews you have submitted for each paper.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Paper Information */}
                    {paper && (
                        <div className="mb-8">
                            <PaperInfo
                                paper={paper}
                                className="bg-white shadow rounded-lg p-6"
                            />
                        </div>
                    )}

                    {/* Review Filters - Simplified for reviewers */}
                    {showHistory && (
                        <form method="get" action="/your-reviews" className="bg-white shadow rounded-lg p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="hidden" name="show" value={showHistory ? 1 : 0} />
                            <input type="hidden" name="page" value={papers?.current_page ?? 1} />

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
                                    <option value="10">10 Points</option>
                                    <option value="9">9 Points</option>
                                    <option value="8">8 Points</option>
                                    <option value="7">7 Points</option>
                                    <option value="6">6 Points</option>
                                    <option value="5">5 Points</option>
                                    <option value="4">4 Points</option>
                                    <option value="3">3 Points</option>
                                    <option value="2">2 Points</option>
                                    <option value="1">1 Point</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <div className="flex gap-3 w-full">
                                    <a href={`/your-reviews?page=${papers?.current_page ?? 1}&show=${showHistory ? 1 : 0}`} className="px-4 py-2 rounded-md border text-gray-700 flex-1 text-center">Reset</a>
                                    <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex-1">Apply</button>
                                </div>
                            </div>
                        </form>
                    )}

                    {/* Reviews Section Header */}
                    <div className="mb-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Your Reviews ({items.length} reviews)
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Reviews you have submitted for papers assigned to you
                                </p>
                            </div>
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm font-medium bg-white hover:bg-gray-50"
                                >
                                    {showHistory ? 'Showing' : 'Hidden'} Reviews
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
                                            Show Your Reviews
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowHistory(false); setMenuOpen(false); }}
                                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Hide Your Reviews
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
                                    <ReviewerBlock
                                        key={review.id}
                                        review={review}
                                        isSelected={selectedReviewId === review.id}
                                        onToggle={(reviewId) => {
                                            setSelectedReviewId(selectedReviewId === reviewId ? null : reviewId);
                                        }}
                                    />
                                ))}
                                {items.length === 0 && (
                                    <div className="bg-white shadow rounded-lg p-8 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="rounded-full bg-gray-100 p-3 mb-4">
                                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                                            <p className="text-gray-600 mb-4">
                                                You haven't submitted any reviews yet for papers assigned to you.
                                            </p>
                                            <div className="flex gap-3">
                                                <Link
                                                    href={route('reviews.reviewList')}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                                                >
                                                    View Assigned Papers
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Summary Section - Only show if there are reviews */}
                            {items.length > 0 && <ReviewSummary reviewData={items} />}
                        </>
                    )}
                    
                    {/* Pagination */}
                    {papers?.links && (
                        <div className="mt-6 flex justify-end">
                            <Pagination links={getCustomLinks(papers?.links)} />
                        </div>
                    )}
                </main>
            </div>
        </AdminLayout>
    );
}
