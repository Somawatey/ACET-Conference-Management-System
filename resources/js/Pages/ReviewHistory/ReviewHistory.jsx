import { Head, usePage, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import PaperInfo from "./Partial/PaperInfo";
import ReviewerBlock from "./Partial/Feedback";
import ReviewSummary from "./Partial/Summary";
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

export default function ReviewHistory({ paper, papers, reviews, filters }) {
    const { auth } = usePage().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

    // Check if user came from Paper Decision page
    const isFromPaperDecision = () => {
        if (typeof window === 'undefined') return false;
        const params = new URLSearchParams(window.location.search);
        return params.get('source') === 'paper-decision' && params.get('paper_id');
    };

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
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 100); // Show enhanced button after scrolling 100px
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#user-menu-button')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Generate user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    // Check if user has a profile photo
    const hasProfilePhoto = () => {
        return auth?.user?.profile_photo_url;
    };

    console.log("Review History Items:", items);
    console.log("Paper Info:", paper);

    const headWeb = 'Review History';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout>
            <Head title="Review History" />
            <Breadcrumb title={headWeb} links={linksBreadcrumb} />

            <div className="bg-white min-h-screen">
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* Sticky Back Button when coming from Paper Decision */}
                    {isFromPaperDecision() && (
                        <div className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
                                ? '-translate-x-24 mr-5'
                                : ''
                            }`}>
                            <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
                                <div className={`inline-block transition-all duration-300 ${isScrolled
                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl px-4 py-2 border border-blue-200 shadow-sm'
                                        : ''
                                    }`}>
                                    <Link
                                        href={route('paper-decision.show', { paper: filters.paper_id })}
                                        className={`inline-flex items-center text-sm font-medium transition-all duration-200 ${isScrolled
                                                ? 'text-blue-700 hover:text-blue-900'
                                                : 'text-indigo-600 hover:text-indigo-800'
                                            }`}
                                    >
                                        <svg className={`mr-2 transition-all duration-200 ${isScrolled ? 'w-5 h-5' : 'w-4 h-4'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        <span className="whitespace-nowrap">{isScrolled ? 'Back' : 'Back to Paper Decision'}</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

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
                        { }
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
                            <Pagination links={getCustomLinks(papers?.links)} />
                        </div>
                </main>
            </div>
        </AdminLayout>
    );
}