export default function PaperInfo({ className = '', data = {}, errors = {}, onChange, paper = {} }) {
    return (
        <section className={className}>
            <header>
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    Paper Information
                </h1>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paper Title
                    </label>
                    <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 font-medium">
                        {paper.title || 'No title available'}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic
                    </label>
                    <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {paper.topic || 'No topic specified'}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Track
                    </label>
                    <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {paper.track || 'No track specified'}
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Authors
                    </label>
                    <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {Array.isArray(paper.authors) 
                            ? paper.authors.join(', ') 
                            : (paper.authors || 'No authors specified')
                        }
                    </div>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Submission Date
                    </label>
                    <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {paper.submissionDate 
                            ? new Date(paper.submissionDate).toLocaleDateString()
                            : 'No submission date'
                        }
                    </div>
                </div>
                
                {paper.keywords && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Keywords
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                            {paper.keywords}
                        </div>
                    </div>
                )}
                
                {paper.pdf_path && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            PDF Document
                        </label>
                        <div className="mt-1">
                            <a 
                                href={`/storage/${paper.pdf_path}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View PDF
                            </a>
                        </div>
                    </div>
                )}
                
                {paper.abstract && (
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Abstract
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900 text-sm leading-relaxed">
                            {paper.abstract}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}