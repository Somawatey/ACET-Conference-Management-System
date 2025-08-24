import React, { useMemo, useEffect, useState, useRef } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

// A simple component for status badges
const StatusBadge = ({ status }) => {
    const baseClasses = 'px-3 py-1 text-sm font-semibold rounded-full inline-block';
    const statusClasses = {
        Accept: 'bg-green-100 text-green-800',
        Reject: 'bg-red-100 text-red-800',
        Revise: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`${baseClasses} ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>;
};

export default function ReviewedPaper({ auth, paper, papers = [], reviews = [], flash, decision = null, editing = false }) {
    // If no single paper is provided, render the index listing view
    if (!paper) {
        const rows = Array.isArray(papers) ? papers : [];
        const statusClass = (status) => {
            const s = (status || '').toString().toLowerCase();
            if (s.includes('accept') || s === 'accepted') return 'badge badge-success';
            if (s.includes('pend')) return 'badge badge-warning';
            if (s.includes('reject')) return 'badge badge-danger';
            return 'badge badge-secondary';
        };

        return (
            <AdminLayout>
                <Head title="Paper Decisions" />
                <div className="container-fluid" style={{ marginTop: '75px' }}>
                    <div className="card">
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <h5 className="mb-0">Paper Decisions</h5>
                        </div>
                        <div className="card-body table-responsive p-0">
                            <table className="table table-hover text-nowrap">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Status</th>
                                        <th>Decision</th>
                                        <th>Comment</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((p) => (
                                        <tr key={p.id}>
                                            <td>{p.id}</td>
                                            <td className="font-medium">{p.title}</td>
                                            <td><span className={statusClass(p.status)}>{p.status || 'Pending'}</span></td>
                                            <td>{p.decision?.decision ? <StatusBadge status={p.decision.decision} /> : <span className="text-muted">—</span>}</td>
                                            <td className="text-truncate" style={{ maxWidth: 320 }}>{p.decision?.comment || ''}</td>
                                            <td>
                                                <Link href={route('paper-decision.show', { paper: p.id })} className="btn btn-sm btn-primary mr-2">
                                                    {p.decision ? 'View / Edit' : 'Make Decision'}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {rows.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="text-center text-muted p-3">No papers found.</td>
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

    const initial = useMemo(() => ({
        decision: decision?.decision || '',
        comment: decision?.comment || '',
    }), [decision]);

    const { data, setData, post, processing, errors, patch } = useForm(initial);

    // Local editing state to avoid route changes when editing inline
    const [isEditing, setIsEditing] = useState(!!editing);

    // Keep form data in sync when server decision changes and we're not editing
    useEffect(() => {
        if (!isEditing) {
            setData('decision', decision?.decision || '');
            setData('comment', decision?.comment || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decision, isEditing]);

    // Safely resolve a named route to URL, with a string fallback
    const resolveRoute = (name, params, fallback) => {
        try {
            if (typeof route === 'function') {
                if (route().has && route().has(name)) return route(name, params);
                return route(name, params);
            }
        } catch (_) {}
        return fallback;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            onFinish: () => {
                // If no validation errors, mimic Cancel and force a hard refresh to show updated info
                const hasErrors = errors && Object.keys(errors).length > 0;
                if (!hasErrors) {
                    setIsEditing(false);
                    const url = resolveRoute('paper-decision.show', { paper: paper.id }, `/paper-decision/${paper.id}`);
                    router.visit(url, { replace: true });
                }
            },
        };
        if (decision?.id) {
            // Update existing decision
            const updateUrl = resolveRoute('paper-decision.update', { paper: paper.id }, `/paper-decision/${paper.id}`);
            patch(updateUrl, options);
        } else {
            const storeUrl = resolveRoute('paper-decision.store', { paper: paper.id }, `/paper-decision/${paper.id}`);
            console.log('Submitting to URL:', storeUrl);
            console.log('Form data:', data);
            post(storeUrl, options);
        }
    };

    // Fallback: if onSuccess/options don't fire, detect when processing ends with no errors
    const wasProcessing = useRef(false);
    useEffect(() => {
        if (wasProcessing.current && !processing) {
            const hasErrors = errors && Object.keys(errors).length > 0;
            if (!hasErrors) {
                // Integrate cancel behavior after successful save
                setIsEditing(false);
                try {
                    const url = route('paper-decision.show', { paper: paper.id });
                    router.visit(url, { replace: true });
                } catch (_) {
                    router.visit(`/paper-decision/${paper.id}`, { replace: true });
                }
            }
        }
        wasProcessing.current = processing;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [processing, errors]);
    const headWeb = 'Paper decision';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout>
            <Head title="Paper Decision" />

            <div className="py-15" style={{ marginTop: '75px' }}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Paper Information Section */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Paper Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                <p><strong>Paper Title:</strong> {paper.title}</p>
                                <p><strong>Author:</strong> {paper.author}</p>
                                <p><strong>Track:</strong> {paper.track}</p>
                                <p><strong>Total Reviews:</strong> {reviews.length}</p>
                            </div>
                        </section>
                    </div>

                    {/* Reviewers Dashboard Section */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Reviewers Dashboard</h3>
                            <p className="text-sm text-gray-600 mb-4">List of reviews from reviewers</p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reviewer</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resource</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {reviews.map((review) => (
                                            <tr key={review.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{review.reviewer}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={review.status} />
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <Link
                                                        href={route('reviews.show', { id: review.id })}
                                                        className="text-indigo-600 hover:text-indigo-900">
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>

                    {/* Final Decision Section */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Final Decision</h3>
                                {decision && !isEditing && (
                                    (() => {
                                        try {
                                            return (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(true)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500"
                                                >
                                                    Edit Decision
                                                </button>
                                            );
                                        } catch (e) {
                                            // As a last resort, fall back to show route
                                            return (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(true)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded hover:bg-indigo-500"
                                                >
                                                    Edit Decision
                                                </button>
                                            );
                                        }
                                    })()
                                )}
                            </div>

                            {/* Show current decision summary if exists and not in editing mode */}
                            {decision && !isEditing && (
                                <div className="mb-6 p-4 bg-gray-50 border rounded">
                                    <div className="mb-2">
                                        <span className="text-sm text-gray-600 mr-2">Status:</span>
                                        <StatusBadge status={decision.decision} />
                                    </div>
                                    {decision.comment && (
                                        <div>
                                            <div className="text-sm text-gray-600 mb-1">Comment</div>
                                            <p className="text-gray-800 whitespace-pre-line">{decision.comment}</p>
                                        </div>
                                    )}
                                    <div className="mt-3 text-xs text-gray-500">
                                        {decision.organizer && <span>By {decision.organizer} • </span>}
                                        <span>Updated {decision.updated_at || decision.created_at}</span>
                                    </div>
                                </div>
                            )}

                            {(!decision || isEditing) && (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="decision" className="block text-sm font-medium text-gray-700">Decision <span className="text-red-500">*</span></label>
                                        <select
                                            id="decision"
                                            name="decision"
                                            value={data.decision}
                                            onChange={(e) => setData('decision', e.target.value)}
                                            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${errors.decision ? 'border-red-500' : ''}`}
                                            required
                                        >
                                            <option value="" disabled>Select a decision</option>
                                            <option value="Accept">Accept</option>
                                            <option value="Reject">Reject</option>
                                            <option value="Revise">Revise</option>
                                        </select>
                                        {errors.decision && <p className="mt-1 text-sm text-red-600">{errors.decision}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            rows="4"
                                            value={data.comment}
                                            onChange={(e) => setData('comment', e.target.value)}
                                            className={`mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.comment ? 'border-red-500' : ''}`}
                                            placeholder="Add any additional comments about your decision..."
                                        ></textarea>
                                        {errors.comment && <p className="mt-1 text-sm text-red-600">{errors.comment}</p>}
                                        <p className="mt-1 text-sm text-gray-500">Maximum 5000 characters</p>
                                    </div>
                                    <div className="flex justify-end space-x-3">
                                        {decision ? (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setData('decision', decision?.decision || '');
                                                    setData('comment', decision?.comment || '');
                                                }}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                Cancel
                                            </button>
                                        ) : (
                                            <Link
                                                href={route('paper-decision.show', { paper: paper.id })}
                                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"
                                            >
                                                Cancel
                                            </Link>
                                        )}
                                        <button
                                            type="submit"
                                            disabled={processing || !data.decision}
                                            className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                        >
                                            {processing ? (decision ? 'Updating...' : 'Submitting...') : (decision ? 'Update Decision' : 'Submit Decision')}
                    
                                        </button>
                                    </div>
                                </form>
                            )}
                        </section>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}