export default function PaperInfo({ className = '', data = {}, errors = {}, onChange, paper = {} }) {
    return (
        <section className={className}>
            <header>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Paper Information
                </h1>
            </header>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Paper Title
                    </label>
                    <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                        {paper.title || 'No title available'}
                    </div>
                </div>
                <div className="">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Track
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                            {paper.track || 'No track specified'}
                        </div>
                    </div>
                </div>
                
                {/* Add more paper fields as needed */}
                {paper.abstract && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Abstract
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                            {paper.abstract}
                        </div>
                    </div>
                )}
                
                {paper.authors && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Authors
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                            {Array.isArray(paper.authors) 
                                ? paper.authors.join(', ') 
                                : paper.authors
                            }
                        </div>
                    </div>
                )}
                
                {paper.submissionDate && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Submission Date
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                            {new Date(paper.submissionDate).toLocaleDateString()}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}