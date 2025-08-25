import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect, Fragment } from 'react';
import PageHeader from './partials/PageHeader';
import PaperRow from './partials/PaperRow';
import StatusBadge from './partials/StatusBadge';
import PaperActions from './partials/PaperActions';
import ReviewersModal from './partials/ReviewersModal';
import SubmissionModal from './partials/SubmissionModal';

export default function PaperPage({ users, papers }) {
    const headWeb = 'Paper List';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    // Extract reviewers from users
    const userList = users?.data || [];
    const [reviews, setReviews] = useState([]);
    const [assignedReviewers, setAssignedReviewers] = useState({});
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [selectedReviewers, setSelectedReviewers] = useState([]);

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

    const [openId, setOpenId] = useState(null);
    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

    const getTopicText = (p) => (typeof p?.topic === 'object' ? (p.topic?.name ?? '') : (p?.topic ?? ''));
    const getPaperTitle = (p) => (p?.paper_title ?? p?.title ?? '');
    const getAuthorName = (p) => {
        if (p?.author_info?.author_name) {
            return p.author_info.author_name;
        }
        return 'No Author';
    };

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
    // const isReviewerAssigned = (paperId, reviewerId) => false;
    // const getAssignedReviewers = (paperId) => [];
    // const assignReviewer = (paperId, reviewerId) => { };

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />
            <div className="bg-white min-h-screen font-sans">
                <div className="max-w-screen-xl mx-auto">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            {/* Search input */}
                            <div className="relative w-1/4">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="bg-[#FFFFFF] border border-gray-600 rounded-md py-2 pl-10 pr-4 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search papers..."
                                />
                            </div>

                            <PageHeader />
                        </div>

                        {/* Table section */}
                        <div className="overflow-x-auto relative  sm:rounded-lg">
                            <div className="inline-block min-w-full">
                                <div className="overflow-hidden  ring-1 ring-black ring-opacity-5 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">ID</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Paper Title</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Topic</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author Name</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Review Status</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Decision</th>
                                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sr-only">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {rows.length > 0 ? rows.map((paper, idx) => (
                                                <PaperRow
                                                    key={paper.id ?? idx}
                                                    paper={paper}
                                                    isOpen={openId === (paper.id ?? idx)}
                                                    onToggle={() => toggleRow(paper.id)}
                                                    onAssignReviewer={() => openAssignReviewerModal(paper)}
                                                >
                                                    <StatusBadge status={paper.status} />
                                                    <PaperActions paper={paper} onManageReviewers={() => openAssignReviewerModal(paper)} />
                                                </PaperRow>
                                            )) : (
                                                <tr>
                                                    <td colSpan={7} className="text-center py-12">
                                                        <div className="flex flex-col items-center">
                                                            <div className="rounded-full bg-gray-100 p-3 mb-4">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <h3 className="text-sm font-medium text-gray-900">No papers</h3>
                                                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new paper submission.</p>
                                                            <div className="mt-6">
                                                                <Link
                                                                    href="/papers/create"
                                                                    className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                                                                >
                                                                    <svg className="-ml-0.5 mr-1.5 h-5 w-5 inline" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                                                                    </svg>
                                                                    New Paper
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-8">
                                    <Pagination links={papers?.links || []} />
                                </div>
                            </div>
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
            </div>
        </AdminLayout>
    );
}
