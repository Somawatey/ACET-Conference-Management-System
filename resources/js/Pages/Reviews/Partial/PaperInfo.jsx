

export default function PaperInfo({ className = '', data = {}, errors = {}, onChange }) {
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
                        Machine Learning Approaches for Sustainable Agriculture in Southeast Asia
                    </div>
                </div>
                <div className="">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Track
                        </label>
                        <div className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                            Main Track
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}