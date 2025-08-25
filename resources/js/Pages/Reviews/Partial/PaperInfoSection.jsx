import React from 'react';

export default function PaperInfoSection({ paper, className = "" }) {
    if (!paper) {
        return (
            <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paper Information</h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No paper information available</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Paper Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <strong>Title:</strong> {paper.paper_title}
                </div>
                <div>
                    <strong>Topic:</strong> {paper.topic}
                </div>
                <div>
                    <strong>Author:</strong> {paper.author_name || 'Unknown'}
                </div>
                <div>
                    <strong>Keywords:</strong> {paper.keyword}
                </div>
                {paper.url && (
                    <div className="col-span-full">
                        <strong>PDF:</strong> 
                        <a 
                            href={paper.url.startsWith('http') ? paper.url : `/storage/${paper.url}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-600 hover:text-blue-800 underline ml-2"
                        >
                            View Paper
                        </a>
                    </div>
                )}
                {paper.abstract && (
                    <div className="col-span-full">
                        <strong>Abstract:</strong>
                        <p className="mt-2 text-gray-700">{paper.abstract}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
