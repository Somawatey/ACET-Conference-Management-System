import { Fragment, useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import Pagination from '@/Components/Pagination';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';

export default function PaperPage({ users, papers }) {
    const userList = users?.data || [];
    const [reviews, setReviews] = useState([]); // reviewers state
    const [openId, setOpenId] = useState(null);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignedReviewers, setAssignedReviewers] = useState({});
    const [assignments, setAssignments] = useState({});

    useEffect(() => {
        if (userList && Array.isArray(userList)) {
            const reviewersData = userList.filter((user) =>
                user.roles.some((role) => role.name.toLowerCase() === "reviewer")
            );
            setReviews(reviewersData);
        }
    }, [userList]);

    const headWeb = 'Paper List';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    const normalizedPapers = Array.isArray(papers?.data)
        ? papers.data
        : Array.isArray(papers)
            ? papers
            : [];
    const rows = normalizedPapers;
    console.log("Papers:", normalizedPapers);

    // Dummy implementations for missing functions
    const getPaperTitle = (paper) => paper.title || '';
    const getTopicText = (paper) => paper.topic || '';
    const getAuthorName = (paper) => paper.author_name || '';
    const getDecision = (paper) => paper.decision || 'Pending';
    const decisionClass = (decision) => {
        switch (decision) {
            case 'Accept':
            case 'Accepted':
                return 'px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-full shadow-sm';
            case 'Reject':
            case 'Rejected':
                return 'px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-full shadow-sm';
            case 'Revise':
            case 'Needs Revision':
                return 'px-3 py-1 text-sm font-medium text-white bg-yellow-500 rounded-full shadow-sm';
            default:
                return 'px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-full shadow-sm';
        }
    };
    const isReviewerAssigned = (paperId, reviewerId) => false;
    const getAssignedReviewers = (paperId) => [];
    const assignReviewer = (paperId, reviewerId) => { };

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body table-responsive p-0">
                        <table className="table table-hover text-nowrap">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Paper Title</th>
                                    <th>Topic</th>
                                    <th>Author Name</th>
                                    <th>Decision</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((paper, idx) => (
                                    <Fragment key={paper.id ?? `row-${idx}`}>
                                        <tr>
                                            <td>{paper.id}</td>
                                            <td className="font-medium">{getPaperTitle(paper)}</td>
                                            <td>{getTopicText(paper)}</td>
                                            <td>{getAuthorName(paper)}</td>
                                            <td><span className={decisionClass(getDecision(paper))}>{getDecision(paper)}</span></td>
                                            <td className="space-x-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => setOpenId(paper.id)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                        {openId === (paper.id ?? idx) && (
                                            <tr className="bg-light">
                                                <td colSpan={7} className="p-3">
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <Link href="#" className="btn btn-sm btn-secondary">Check Review</Link>
                                                        <button className="btn btn-sm btn-info text-white" onClick={() => setSelectedPaper(paper)}>Assign Reviewer</button>
                                                        <button className="btn btn-sm btn-warning" onClick={() => setShowAssignmentModal(true)}>Bulk Assignment</button>
                                                        <Link
                                                            href={typeof route === 'function' && route().has && route().has('reviews.create') ? route('reviews.create') : '#'}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                                        >
                                                            Create New Review
                                                        </Link>
                                                        <Link href="#" className="btn btn-sm btn-outline-secondary">View History</Link>
                                                        <Link href={typeof route === 'function' ? route('paper-decision.show', { paper: paper.id }) : '#'} className="btn btn-sm btn-primary">Edit Decision</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-gray-500 p-4">No papers found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="card-footer flex items-center justify-end w-full ">
                        <div className="d-flex gap-2">
                            {papers?.prev_page_url ? (
                                <Link href={papers.prev_page_url} className="btn btn-sm btn-outline-primary" preserveScroll>
                                    Previous
                                </Link>
                            ) : (
                                <span className="btn btn-sm btn-outline-primary disabled">Previous</span>
                            )}
                            {papers?.next_page_url ? (
                                <Link href={papers.next_page_url} className="btn btn-sm btn-outline-primary" preserveScroll>
                                    Next
                                </Link>
                            ) : (
                                <span className="btn btn-sm btn-outline-primary disabled">Next</span>
                            )}
                        </div>
                    </div>
                </div>
                {/* Assign Reviewers Modal */}
                {selectedPaper && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Assign Reviewers to Paper</h5>
                                    <button type="button" className="close" onClick={() => setSelectedPaper(null)}><span>&times;</span></button>
                                </div>
                                <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                                    <h6 className="font-weight-bold">{selectedPaper.title}</h6>
                                    <p className="text-muted mb-0">Author: {selectedPaper.author_name}</p>
                                    <p className="text-muted">Topic: {selectedPaper.topic}</p>
                                    <div className="row">
                                        {reviews.map((reviewer) => (
                                            <div key={reviewer.id} className="col-md-6 mb-2">
                                                <div className={`card ${isReviewerAssigned(selectedPaper.id, reviewer.id) ? 'border-success' : ''}`}>
                                                    <div className="card-body p-3">
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <h6 className="mb-1">{reviewer.name}</h6>
                                                            </div>
                                                            <div>
                                                                {isReviewerAssigned(selectedPaper.id, reviewer.id) ? (
                                                                    <button className="btn btn-sm btn-success" disabled>
                                                                        <i className="fas fa-check"></i> Assigned
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary"
                                                                        onClick={() => assignReviewer(selectedPaper.id, reviewer.id)}
                                                                        disabled={getAssignedReviewers(selectedPaper.id).length >= 4}
                                                                    >
                                                                        <i className="fas fa-plus"></i> Assign
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" onClick={() => setSelectedPaper(null)}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Bulk Assignment Modal */}
                {showAssignmentModal && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                        <div className="modal-dialog modal-xl">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Bulk Assignment</h5>
                                    <button type="button" className="close" onClick={() => setShowAssignmentModal(false)}><span>&times;</span></button>
                                </div>
                                <div className="modal-body">
                                    <table className="table table-bordered">
                                        <thead><tr><th>Paper</th><th>Current Reviewers</th><th>Add Reviewers</th></tr></thead>
                                        <tbody>
                                            {rows.map(paper => (
                                                <tr key={paper.id}>
                                                    <td><strong>{paper.title}</strong><br /><small>{paper.author_name}</small></td>
                                                    <td>{getAssignedReviewers(paper.id).map(r => <span key={r.id} className="badge badge-success mr-1">{r.name}</span>)}</td>
                                                    <td>
                                                        <select className="form-control" multiple value={assignments[paper.id] || []} onChange={(e) => {
                                                            const val = Array.from(e.target.selectedOptions, o => parseInt(o.value));
                                                            if (val.length > 4) { alert("Max 4 reviewers per paper."); return; }
                                                            setAssignments(prev => ({ ...prev, [paper.id]: val }));
                                                        }}>
                                                            {reviews.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setShowAssignmentModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={() => { alert('Bulk assignment applied.'); setShowAssignmentModal(false); }}>Apply Assignments</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {(selectedPaper || showAssignmentModal) && <div className="modal-backdrop fade show"></div>}
            </div>
            <Pagination links={papers?.links || []} />
        </AdminLayout>
    );
}