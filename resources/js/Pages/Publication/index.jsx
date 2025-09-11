import { Head, Link } from '@inertiajs/react';

export default function PublicationIndex({ papers = [] }) {
    const handleBackClick = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            // Fallback to dashboard or home if no history
            window.location.href = route('dashboard');
        }
    };

    return (
        <>
            <Head title="Publications" />
            <div className="bg-gray-100 min-h-screen py-10">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Back Button */}
                    <div className="mb-6">
                        <button
                            onClick={handleBackClick}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
                        >
                            <svg 
                                className="w-4 h-4 mr-2" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                                />
                            </svg>
                            Back
                        </button>
                    </div>

                    <h1 className="text-4xl font-bold text-blue-700 mb-2">Published Papers</h1>
                    <p className="text-gray-600 mb-8">Browse all papers published by our organizers.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {papers.map(paper => (
                            <div key={paper.id} className="bg-white rounded-xl shadow border border-blue-100 p-6 flex flex-col justify-between hover:shadow-lg transition duration-200">
                                <div>
                                    <h2 className="text-xl font-semibold text-blue-900">{paper.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">By <span className="font-medium text-blue-600">{paper.author}</span> | <span>{paper.conference}</span></p>
                                    <p className="mt-3 text-gray-700">{paper.abstract}</p>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    <span className="text-xs text-gray-400">Published: {paper.publishedAt}</span>
                                    {paper.pdfUrl ? (
                                        <a
                                            href={paper.pdfUrl.startsWith('http') 
                                                ? paper.pdfUrl 
                                                : `${window.location.origin}/storage/${paper.pdfUrl.replace(/^\/+/, '')}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 hover:scale-105 transition duration-200 inline-flex items-center"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Download PDF
                                        </a>
                                    ) : (
                                        <span className="bg-gray-300 text-gray-500 px-4 py-2 rounded-full cursor-not-allowed inline-flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            PDF Not Available
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {papers.length === 0 && (
                        <div className="text-center text-gray-500 py-16">
                            No publications found.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}