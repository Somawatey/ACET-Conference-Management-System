import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect, Fragment } from 'react';
import PageHeader from './partials/PageHeader';
import PaperRow from './partials/PaperRow';
import StatusBadge from './partials/StatusBadge';
import PaperActions from './partials/PaperActions';
import ReviewersModal from './partials/ReviewersModal';
import SubmissionModal from './partials/SubmissionModal';

export default function PaperPage({ users, papers, filters = {} }) {
    const headWeb = 'Paper List';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    // Extract reviewers from users
    const userList = users?.data || [];
    const [reviews, setReviews] = useState([]);
    const [assignedReviewers, setAssignedReviewers] = useState({});
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [selectedReviewers, setSelectedReviewers] = useState([]);
    
    // Search and filter state - Initialize from filters prop
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    // Handle search function
    const handleSearch = () => {
        router.get(route('papers.index'), {
            search: searchQuery,
            status: statusFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle status filter change
    const handleStatusChange = (status) => {
        setStatusFilter(status);
        router.get(route('papers.index'), {
            search: searchQuery,
            status: status,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        
        // Debounced search - search after user stops typing for 500ms
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(() => {
            router.get(route('papers.index'), {
                search: value,
                status: statusFilter,
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 500);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        router.get(route('papers.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Handle reviewer selection/deselection
    const toggleReviewer = (reviewer) => {
        const isAssigned = assignedReviewers[selectedPaper?.id]?.some(r => r.id === reviewer.id);

        if (isAssigned) {
            // Remove reviewer
            setAssignedReviewers(prev => ({
                ...prev,
                [selectedPaper.id]: prev[selectedPaper.id].filter(r => r.id !== reviewer.id)
            }));
        } else {
            // Add reviewer if less than 4 are assigned
            if (!assignedReviewers[selectedPaper?.id] || assignedReviewers[selectedPaper?.id].length < 4) {
                setAssignedReviewers(prev => ({
                    ...prev,
                    [selectedPaper.id]: [...(prev[selectedPaper?.id] || []), reviewer]
                }));
            } else {
                alert("Maximum 4 reviewers can be assigned to a paper.");
            }
        }
    };

    // Handle opening and closing of modals
    const openAssignReviewerModal = (paper) => {
        setSelectedPaper(paper);
        document.body.style.overflow = 'hidden';
    };

    const closeAssignReviewerModal = () => {
        setSelectedPaper(null);
        document.body.style.overflow = 'unset';
    };

    useEffect(() => {
        if (Array.isArray(userList)) {
            const reviewersData = userList.filter((user) =>
                user.roles && user.roles.some((role) => role.name.toLowerCase() === "reviewer")
            );
            setReviews(reviewersData);
        }
    }, [userList]);

    // Normalize papers
    const normalizedPapers = Array.isArray(papers?.data)
        ? papers.data
        : Array.isArray(papers)
            ? papers
            : [];
    const rows = normalizedPapers.length > 0 ? normalizedPapers : [];

    console.log(normalizedPapers);

    const [openId, setOpenId] = useState(null);
    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

    const statusClass = (status) => {
        const s = (status || '').toString().toLowerCase();
        if (s.includes('publish') || s === 'accepted') return 'bg-green-100 text-green-800';
        if (s.includes('pend')) return 'bg-yellow-100 text-yellow-800';
        if (s.includes('reject')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getAssignedReviewers = (paperId) => assignedReviewers[paperId] || [];
    const isReviewerAssigned = (paperId, reviewerId) =>
        getAssignedReviewers(paperId).some(r => r.id === reviewerId);

    const assignReviewer = (paperId, reviewerId) => {
        if (getAssignedReviewers(paperId).length >= 4) {
            alert("You can only assign up to 4 reviewers.");
            return;
        }
    };

    // Get unique statuses for filter options
    const uniqueStatuses = [...new Set(rows.map(paper => paper.status).filter(Boolean))];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb}/>
            <div className="bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {/* Page Header */}
                    <div className="mb-8">
                        <PageHeader />
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            {/* Search Input */}
                            <div className="flex-1 max-w-md">
                                <label htmlFor="search" className="sr-only">Search papers</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="h-5 w-5 text-gray-400" 
                                            viewBox="0 0 20 20" 
                                            fill="currentColor"
                                        >
                                            <path 
                                                fillRule="evenodd" 
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                                                clipRule="evenodd" 
                                            />
                                        </svg>
                                    </div>
                                    <input
                                        id="search"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="Search papers by title, author, or topic..."
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                router.get(route('papers.index'), {
                                                    status: statusFilter,
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                            
                            {/* Filters and Actions */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                {/* Status Filter */}
                                <select 
                                    value={statusFilter}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    className="block px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[140px]"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="accepted">Accepted</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="published">Published</option>
                                    <option value="under_review">Under Review</option>
                                    <option value="revision_required">Revision Required</option>
                                    {/* Add dynamic statuses from data */}
                                    {uniqueStatuses
                                        .filter(status => !['pending', 'accepted', 'rejected', 'published', 'under_review', 'revision_required'].includes(status.toLowerCase()))
                                        .map(status => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))
                                    }
                                </select>

                                {/* Clear Filters Button */}
                                {(searchQuery || statusFilter) && (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-3 py-2.5 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Clear
                                    </button>
                                )}
                                
                                {/* Add Paper Button */}
                                <Link
                                    href="/papers/create"
                                    className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                    </svg>
                                    Add Paper
                                </Link>
                            </div>
                        </div>

                        {/* Active Filters Display */}
                        {(searchQuery || statusFilter) && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-600">Active filters:</span>
                                {searchQuery && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Search: "{searchQuery}"
                                        <button
                                            onClick={() => {
                                                setSearchQuery('');
                                                router.get(route('papers.index'), {
                                                    status: statusFilter,
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="ml-1 inline-flex items-center"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                )}
                                {statusFilter && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                                        <button
                                            onClick={() => {
                                                setStatusFilter('');
                                                router.get(route('papers.index'), {
                                                    search: searchQuery,
                                                }, {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                });
                                            }}
                                            className="ml-1 inline-flex items-center"
                                        >
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="mt-4 text-sm text-gray-600">
                            {papers?.total ? (
                                `Showing ${papers.from || 0} to ${papers.to || 0} of ${papers.total} results`
                            ) : (
                                `${rows.length} paper${rows.length !== 1 ? 's' : ''} found`
                            )}
                        </div>
                    </div>

                    {/* Papers Table */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {rows.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Paper Title
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Topic
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Author
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    PDF
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Decision
                                                </th>
                                                <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {rows.map((paper, idx) => (
                                                <PaperRow
                                                    key={paper.id ?? idx}
                                                    paper={paper}
                                                    isOpen={openId === (paper.id ?? idx)}
                                                    onToggle={() => toggleRow(paper.id)}
                                                    onAssignReviewer={() => openAssignReviewerModal(paper)}
                                                >
                                                    <StatusBadge status={paper.status} />
                                                    <PaperActions 
                                                        paper={paper} 
                                                        onManageReviewers={() => openAssignReviewerModal(paper)} 
                                                    />
                                                </PaperRow>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                {/* Pagination */}
                                <div className="bg-white px-6 py-4 border-t border-gray-200">
                                    <Pagination links={papers?.links || []} />
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-16">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        className="h-12 w-12 text-gray-400" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                        strokeWidth={1.5}
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchQuery || statusFilter ? 'No papers match your criteria' : 'No papers found'}
                                </h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                    {searchQuery || statusFilter 
                                        ? 'Try adjusting your search or filter criteria.' 
                                        : 'Get started by submitting your first paper.'
                                    }
                                </p>
                                {searchQuery || statusFilter ? (
                                    <button
                                        onClick={clearFilters}
                                        className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    >
                                        Clear Filters
                                    </button>
                                ) : (
                                    <Link
                                        href="/papers/create"
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                        </svg>
                                        Create New Paper
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviewers Modal */}
                {selectedPaper && (
                    <ReviewersModal
                        paper={selectedPaper}
                        reviews={reviews}
                        onClose={closeAssignReviewerModal}
                        assignedReviewers={getAssignedReviewers(selectedPaper.id)}
                        onToggleReviewer={toggleReviewer}
                    />
                )}
            </div>
        </AdminLayout>
    );
}