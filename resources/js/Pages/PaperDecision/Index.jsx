import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Assuming you have a main layout
import { Head, useForm } from '@inertiajs/react';
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

export default function ReviewedPaper({ auth, paper, reviews }) {
    // Using Inertia's form helper for the final decision
         if (!paper) {
        console.error("The 'paper' prop is missing. Received props:", { auth, paper, reviews });
        return (
            <AdminLayout>
                <Head title="Error" />
                <div className="py-15" style={{ marginTop: '75px' }}>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                            <h3 className="text-lg font-medium text-red-700">Error: Paper data not found.</h3>
                            <p className="mt-2 text-gray-600">
                                The page failed to load the required paper information. Please check the browser's developer console for more details.
                            </p>
                        </div>
                    </div>
                </div>
            </AdminLayout>
        ); 
    }
    const { data, setData, post, processing, errors } = useForm({
        decision: '',
        comment: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // The 'post' helper will submit the form to this URL.
        // Replace {paper.id} with the actual paper's ID.
        post(route('paper-decisions.accept', { id: paper.id }));
    };
    const headWeb = 'Paper decision';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout>
            <Head title="Paper Decision" />

            <div className="py-15" style={{marginTop: '75px'}}>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
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
                                                    <a href="#" className="text-indigo-600 hover:text-indigo-900">View Details</a>
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
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Final Decision</h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label htmlFor="decision" className="block text-sm font-medium text-gray-700">Decision</label>
                                    <select
                                        id="decision"
                                        name="decision"
                                        value={data.decision}
                                        onChange={(e) => setData('decision', e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        <option value="" disabled>Select a decision</option>
                                        <option value="Accept">Accept</option>
                                        <option value="Reject">Reject</option>
                                        <option value="Revise">Revise</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                                    <textarea
                                        id="comment"
                                        name="comment"
                                        rows="4"
                                        value={data.comment}
                                        onChange={(e) => setData('comment', e.target.value)}
                                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>

        </AdminLayout>
    );
}