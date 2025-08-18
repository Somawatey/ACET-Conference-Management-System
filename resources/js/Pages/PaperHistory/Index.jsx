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

    // Fallback sample histories
    const fallbackHistories = [
        { id: 1, paper_id: 101, title: 'AI for Healthcare', author: 'Jane Doe', version: 1, status: 'Submitted', submitted_at: '2025-07-10' },
        { id: 2, paper_id: 101, title: 'AI for Healthcare', author: 'Jane Doe', version: 2, status: 'Revised', submitted_at: '2025-07-25' },
        { id: 3, paper_id: 102, title: 'Quantum Computing Advances', author: 'John Smith', version: 1, status: 'Accepted', submitted_at: '2025-08-02' },
    ];

    const rows = normalizedHistories.length > 0 ? normalizedHistories : fallbackHistories;

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
                                    <th>Version</th>
                                    <th>Status</th>
                                    <th>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((h, idx) => (
                                    <tr key={h.id ?? `history-${idx}`}>
                                        <td>{h.id}</td>
                                        <td>{h.title}</td>
                                        <td>{h.author}</td>
                                        <td>v{h.version}</td>
                                        <td><span className={statusClass(h.status)}>{h.status}</span></td>
                                        <td>{h.submitted_at}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
