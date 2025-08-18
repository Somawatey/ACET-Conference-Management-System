import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function PaperPage({ papers = [] }) {
    const headWeb = 'Paper List';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    const normalizedPapers = Array.isArray(papers?.data)
        ? papers.data
        : Array.isArray(papers)
            ? papers
            : [];

    const fallbackPapers = [
        { id: 1, title: 'AI for Healthcare', topic: 'Artificial Intelligence', author_name: 'Jane Doe', status: 'Published' },
        { id: 2, title: 'Quantum Computing Advances', topic: 'Quantum Computing', author_name: 'John Smith', status: 'Pending' },
    ];

    const rows = normalizedPapers.length > 0 ? normalizedPapers : fallbackPapers;

    const [openId, setOpenId] = useState(null);
    const [selectedPaper, setSelectedPaper] = useState(null);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignments, setAssignments] = useState({});
    const [assignedReviewers, setAssignedReviewers] = useState({});

    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));
    const getTopicText = (p) => typeof p?.topic === 'object' ? (p.topic?.name ?? '') : (p?.topic ?? '');

    const statusClass = (status) => {
        const s = (status || '').toString().toLowerCase();
        if (s.includes('publish') || s === 'accepted') return 'badge badge-success';
        if (s.includes('pend')) return 'badge badge-warning';
        if (s.includes('reject')) return 'badge badge-danger';
        return 'badge badge-secondary';
    };

    const reviewers = [
        { id: 1, name: "Dr. Alice Thompson", institution: "MIT", expertise: ["AI", "Machine Learning"], rating: 4.8, papers_reviewed: 45 },
        { id: 2, name: "Prof. Robert Wilson", institution: "Stanford University", expertise: ["Quantum Computing", "Cryptography"], rating: 4.9, papers_reviewed: 67 },
        { id: 3, name: "Dr. Maria Garcia", institution: "UC Berkeley", expertise: ["Renewable Energy", "Materials Science"], rating: 4.7, papers_reviewed: 38 },
        { id: 4, name: "Prof. James Lee", institution: "Harvard University", expertise: ["Blockchain", "Distributed Systems"], rating: 4.6, papers_reviewed: 52 },
        { id: 5, name: "Dr. Lisa Anderson", institution: "Johns Hopkins", expertise: ["AI", "Healthcare"], rating: 4.8, papers_reviewed: 41 },
        { id: 6, name: "Prof. Thomas Brown", institution: "Caltech", expertise: ["Quantum Computing", "Physics"], rating: 4.9, papers_reviewed: 58 },
    ];

    const getAssignedReviewers = (paperId) => assignedReviewers[paperId] || [];

    const isReviewerAssigned = (paperId, reviewerId) =>
        getAssignedReviewers(paperId).some(r => r.id === reviewerId);

    const assignReviewer = (paperId, reviewerId) => {
        if (getAssignedReviewers(paperId).length >= 4) {
            alert("You can only assign up to 4 reviewers.");
            return;
        }
        const reviewer = reviewers.find(r => r.id === reviewerId);
        setAssignedReviewers(prev => ({
            ...prev,
            [paperId]: [...(prev[paperId] || []), reviewer]
        }));
    };

    const getExpertiseTags = (tags) =>
        tags?.map((tag, i) => (
            <span key={i} className="badge badge-info mr-1">{tag}</span>
        ));

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
                                    <th>Review Status</th>
                                    <th>Decision</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((paper, idx) => (
                                    <>
                                        <tr key={paper.id ?? `row-${idx}`}>
                                            <td>{paper.id}</td>
                                            <td>{paper.title}</td>
                                            <td>{getTopicText(paper)}</td>
                                            <td>{paper.author_name}</td>
                                            <td><span className={statusClass(paper.status)}>{paper.status || 'Pending'}</span></td>
                                            <td><span className={statusClass(paper.status)}>{paper.status || 'Pending'}</span></td>
                                            <td>
                                                <button className="btn btn-sm btn-outline-primary" onClick={() => toggleRow(paper.id)}>View</button>
                                            </td>
                                        </tr>

                                        {openId === (paper.id ?? idx) && (
                                            <tr className="bg-light">
                                                <td colSpan={7}>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <Link href="#" className="btn btn-sm btn-secondary">Check Review</Link>
                                                        <button className="btn btn-sm btn-info text-white" onClick={() => setSelectedPaper(paper)}>Assign Reviewer</button>
                                                        <button className="btn btn-sm btn-warning" onClick={() => setShowAssignmentModal(true)}>Bulk Assignment</button>
                                                        <Link
                                                            href={route('reviews.create')}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                                        >
                                                            Create New Review
                                                        </Link>
                                                        <Link href="#" className="btn btn-sm btn-outline-secondary">View History</Link>
                                                        <Link href={typeof route === 'function' ? route('papers.edit', paper.id) : '#'} className="btn btn-sm btn-primary">Edit Decision</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                            </tbody>
                        </table>
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
                                    {reviewers.map(reviewer => (
                                        <div key={reviewer.id} className="col-md-6 mb-2">
                                            <div className={`card ${isReviewerAssigned(selectedPaper.id, reviewer.id) ? 'border-success' : ''}`}>
                                                <div className="card-body p-3">
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h6 className="mb-1">{reviewer.name}</h6>
                                                            <p className="text-muted mb-1">{reviewer.institution}</p>
                                                            {getExpertiseTags(reviewer.expertise)}
                                                            <div className="mt-1">
                                                                <small>Rating: ★ {reviewer.rating}</small><br />
                                                                <small>Reviewed: {reviewer.papers_reviewed}</small>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {isReviewerAssigned(selectedPaper.id, reviewer.id) ? (
                                                                <button className="btn btn-sm btn-success" disabled><i className="fas fa-check"></i> Assigned</button>
                                                            ) : (
                                                                <button className="btn btn-sm btn-outline-primary" onClick={() => assignReviewer(selectedPaper.id, reviewer.id)} disabled={getAssignedReviewers(selectedPaper.id).length >= 4}><i className="fas fa-plus"></i> Assign</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedPaper(null)}>Close</button>
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
                                                        {reviewers.map(r => <option key={r.id} value={r.id}>{r.name} ({r.institution})</option>)}
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
        </AdminLayout>
    );
}
