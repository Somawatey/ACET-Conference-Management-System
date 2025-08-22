import AdminLayout from '@/Layouts/AdminLayout';
import Breadcrumb from '@/Components/Breadcrumb';
import { Head } from '@inertiajs/react';

export default function PaperHistoryPage({ histories = [] }) {
    const headWeb = 'Paper Submission History';
    const linksBreadcrumb = [
        { title: 'Home', url: '/' },
        { title: 'Papers', url: '/papers' },
        { title: headWeb, url: '' }
    ];

    // Normalize data
    const normalizedHistories = Array.isArray(histories?.data)
        ? histories.data
        : Array.isArray(histories)
            ? histories
            : [];
    console.log(normalizedHistories);
    const rows = normalizedHistories;

    const statusClass = (status) => {
        const s = (status || '').toLowerCase();
        if (s.includes('accept')) return 'badge badge-success';
        if (s.includes('revise') || s.includes('resubmit')) return 'badge badge-warning';
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
                                    <th>Author</th>
                                    <th>Corresponding Email</th>
                                    <th>Submitted By</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((h, idx) => (
                                    <tr key={h.id ?? `history-${idx}`}>
                                        <td>{h.id}</td>
                                        <td>{h.paper_title}</td>
                                        <td>{h.author_name}</td>
                                        <td>{h.corresponding_email || '—'}</td>
                                        <td>{h.submitted_by || '—'}</td>
                                        <td><span className={statusClass(h.status)}>{h.status}</span></td>
                                        <td>{h.created_at}</td>
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center text-muted py-3">No submission history found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
