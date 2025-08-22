import { Link } from '@inertiajs/react';
import React, { useState } from 'react';

export default function PaperList({ papers = [] }) {
    const [openId, setOpenId] = useState(null);
    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

    const getTopicText = (p) => (typeof p?.topic === 'object' ? (p.topic?.name ?? '') : (p?.topic ?? ''));
    const getPaperTitle = (p) => (p?.paper_title ?? p?.title ?? '');
    const statusClass = (status) => {
        const s = (status || '').toString().toLowerCase();
        if (s.includes('publish') || s === 'accepted') return 'badge badge-success';
        if (s.includes('pend')) return 'badge badge-warning';
        if (s.includes('reject')) return 'badge badge-danger';
        return 'badge badge-secondary';
    };

    return (
        <div className="card mt-4">
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
                            <th>PDF</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {papers.map((paper, idx) => (
                            <React.Fragment key={paper.id ?? `row-${idx}`}> 
                                <tr>
                                    <td>{paper.id}</td>
                                    <td className="font-medium">{getPaperTitle(paper)}</td>
                                    <td>{getTopicText(paper)}</td>
                                    <td>{paper.author_name}</td>
                                    <td>
                                        <span className={statusClass(paper.status)}>
                                            {paper.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={statusClass(paper.status)}>
                                            {paper.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td>
                                        {paper.url ? (
                                            <a href={paper.url.startsWith('http') ? paper.url : `/storage/${paper.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                                PDF
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">No PDF</span>
                                        )}
                                    </td>
                                    <td className="space-x-2">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => toggleRow(paper.id)}
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
                                                <Link 
                                                    href={typeof route === 'function' ? route('reviews.create') : '#'}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                                >
                                                    Create New Review
                                                </Link>
                                                <Link href={typeof route === 'function' ? route('paper-assignments.index') : '#'} className="btn btn-sm btn-info text-white">Assign Reviewer</Link>
                                                <Link href="#" className="btn btn-sm btn-outline-secondary">View History</Link>
                                                <Link href={typeof route === 'function' ? route('papers.edit', paper.id) : '#'} className="btn btn-sm btn-primary">Edit Decision</Link>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        {papers.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-500 p-4">No papers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
