import { Link, router } from '@inertiajs/react';

export default function PaperActions({ paper, onManageReviewers }) {
    
    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this paper? This action cannot be undone.')) {
            router.delete(route('papers.destroy', paper.id), {
                onSuccess: () => {
                    // Handle success if needed
                },
                onError: (errors) => {
                    console.error('Error deleting paper:', errors);
                }
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                <Link 
                    href={route('review.history', { paper_id: paper.id })}
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 group-hover:text-blue-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Check Review</span>
                </Link>

                <button
                    onClick={onManageReviewers}
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500 group-hover:text-purple-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Manage Reviewers</span>
                </button>

                <Link 
                    href={route('review.history', { paper_id: paper.id })} 
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 group-hover:text-amber-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">View History</span>
                </Link>

                <Link 
                    href={route('paper-decision.show', paper.id)} 
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500 group-hover:text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Edit Decision</span>
                </Link>

                <button
                    onClick={handleDelete}
                    className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 group hover:bg-red-50"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 group-hover:text-red-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">Delete</span>
                </button>
            </div>
        </div>
    );
}
