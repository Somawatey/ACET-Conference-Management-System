import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import Pagination from '@/Components/Pagination';
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
        { id: 1, title: 'AI for Healthcare', topic: 'Artificial Intelligence', author_name: 'Jane Doe', link: '#', status: 'Published' },
        { id: 2, title: 'Quantum Computing Advances', topic: 'Quantum Computing', author_name: 'John Smith', link: '#', status: 'Pending' },
    ];

    const rows = normalizedPapers.length > 0 ? normalizedPapers : fallbackPapers;

    const [openId, setOpenId] = useState(null);
    const toggleRow = (id) => setOpenId((prev) => (prev === id ? null : id));

    const getTopicText = (p) => (typeof p?.topic === 'object' ? (p.topic?.name ?? '') : (p?.topic ?? ''));

    const statusClass = (status) => {
        const s = (status || '').toString().toLowerCase();
        if (s.includes('publish') || s === 'accepted') return 'badge badge-success';
        if (s.includes('pend')) return 'badge badge-warning';
        if (s.includes('reject')) return 'badge badge-danger';
        return 'badge badge-secondary';
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
                                            <td className="font-medium">{paper.title}</td>
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
                                            <tr key={`${paper.id ?? idx}-details`} className="bg-light">
                                                <td colSpan={6} className="p-3">
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        <Link href="#" className="btn btn-sm btn-secondary">Check Review</Link>
                                                        <Link 
                                                            href={route('reviews.create')}
                                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                                                        >
                                                            Create New Review
                                                        </Link>
            
                                                        <Link href={route('paper-assignments.index')} className="btn btn-sm btn-info text-white">Assign Reviewer</Link>
                                                        <Link href="#" className="btn btn-sm btn-outline-secondary">View History</Link>
                                                        <Link href={typeof route === 'function' ? route('papers.edit', paper.id) : '#'} className="btn btn-sm btn-primary">Edit Decision</Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center text-gray-500 p-4">No papers found.</td>
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
            </div>
        </AdminLayout>
    );
}