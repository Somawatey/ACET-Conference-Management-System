import React, { useState, useEffect, Fragment } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';

export default function YourSubmissionPage({ papers }) {
    const [openId, setOpenId] = useState(null);

    const headWeb = 'Your Submissions';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    const normalizedPapers = Array.isArray(papers) ? papers : [];
    const rows = normalizedPapers;

    console.log("Your Submissions:", normalizedPapers);

    // Helper functions
    const getPaperTitle = (paper) => paper.title || '';
    const getTopicText = (paper) => paper.topic || '';
    const getAuthorName = (paper) => paper.author_name || '';
    const getDecision = (paper) => paper.decision || 'Pending';

    const decisionClass = (decision) => {
        const d = (decision || '').toString().toLowerCase();
        if (d.includes('accept') || d === 'accepted') return 'badge badge-success';
        if (d.includes('pend')) return 'badge badge-warning';
        if (d.includes('reject')) return 'badge badge-danger';
        if (d.includes('revise')) return 'badge badge-info';
        return 'badge badge-secondary';
    };

    const reviewStatusClass = (status) => {
        const s = (status || '').toString().toLowerCase();
        if (s.includes('accept') || s === 'accepted') return 'text-success';
        if (s.includes('pend')) return 'text-warning';
        if (s.includes('reject')) return 'text-danger';
        if (s.includes('revise')) return 'text-info';
        return 'text-secondary';
    };

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
                                    <th>Submitted</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((paper, idx) => (
                                    <Fragment key={paper.id ?? `row-${idx}`}>
                                        <tr>
                                            <td>{paper.id}</td>
                                            <td className="font-medium">{getPaperTitle(paper)}</td>
                                            <td>
                                                <span className="badge badge-outline-primary">
                                                    {getTopicText(paper)}
                                                </span>
                                            </td>
                                            <td>{getAuthorName(paper)}</td>
                                            <td>
                                                <span className={decisionClass(getDecision(paper))}>
                                                    {getDecision(paper)}
                                                </span>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {paper.submitted_at ? new Date(paper.submitted_at).toLocaleDateString() : 'N/A'}
                                                </small>
                                            </td>
                                            <td className="space-x-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => setOpenId(openId === paper.id ? null : paper.id)}
                                                >
                                                    {openId === paper.id ? 'Hide' : 'View'}
                                                </button>
                                            </td>
                                        </tr>
                                        {openId === (paper.id ?? idx) && (
                                            <tr className="bg-light">
                                                <td colSpan={8} className="p-3">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h6 className="font-weight-bold mb-3">Paper Details</h6>
                                                            <div className="mb-2">
                                                                <strong>Track:</strong>
                                                                <span className="ml-2 badge badge-secondary">{paper.track || 'N/A'}</span>
                                                            </div>
                                                            <div className="mb-2">
                                                                <strong>Institute:</strong>
                                                                <span className="ml-2">{paper.institute || 'N/A'}</span>
                                                            </div>
                                                            <div className="mb-2">
                                                                <strong>Corresponding Email:</strong>
                                                                <span className="ml-2">{paper.correspond_email || 'N/A'}</span>
                                                            </div>
                                                            <div className="mb-2">
                                                                <strong>Current Status:</strong>
                                                                <span className={`ml-2 ${decisionClass(paper.status)}`}>
                                                                    {paper.status || 'Pending'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <h6 className="font-weight-bold mb-3">Available Actions</h6>
                                                            <div className="d-flex gap-2 flex-wrap">
                                                                <Link
                                                                    href={route('review.history', { paper_id: paper.id })}
                                                                    className="btn btn-sm btn-info"
                                                                >
                                                                    <i className="fas fa-history mr-1"></i>
                                                                    Review History
                                                                </Link>
                                                                <Link
                                                                    href={route('submissions.show', { id: paper.submission_id })}
                                                                    className="btn btn-sm btn-secondary"
                                                                >
                                                                    <i className="fas fa-eye mr-1"></i>
                                                                    View Submission
                                                                </Link>
                                                                {(paper.decision === 'Pending' || !paper.decision) && (
                                                                    <Link
                                                                        href={route('submissions.edit', { id: paper.submission_id })}
                                                                        className="btn btn-sm btn-warning"
                                                                    >
                                                                        <i className="fas fa-edit mr-1"></i>
                                                                        Edit Submission
                                                                    </Link>
                                                                )}
                                                                <button
                                                                    className="btn btn-sm btn-outline-success"
                                                                    disabled
                                                                >
                                                                    <i className="fas fa-download mr-1"></i>
                                                                    Download PDF
                                                                </button>
                                                                {paper.decision && paper.decision !== 'Pending' && (
                                                                    <Link
                                                                        href={`#decision-${paper.id}`}
                                                                        className="btn btn-sm btn-primary"
                                                                    >
                                                                        <i className="fas fa-gavel mr-1"></i>
                                                                        View Decision
                                                                    </Link>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center text-gray-500 p-4">
                                            <div className="py-4">
                                                <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
                                                <h5 className="text-muted">No submissions found</h5>
                                                <p className="text-muted">You haven't submitted any papers yet.</p>
                                                <Link
                                                    href={route('submissions.create')}
                                                    className="btn btn-primary mt-2"
                                                >
                                                    Submit Your First Paper
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {rows.length > 0 && (
                        <div className="card-footer">
                            <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                    Showing {rows.length} submission{rows.length !== 1 ? 's' : ''}
                                </small>
                                <div className="d-flex gap-2">
                                    <Link
                                        href={route('submissions.create')}
                                        className="btn btn-sm btn-outline-primary"
                                    >
                                        Submit Another Paper
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
