import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function SubmissionModal({ paper, onClose, conference }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        paper_id: paper.id,
        title: paper.title || '',
        abstract: paper.abstract || '',
        keywords: paper.keywords || '',
        topic_id: paper.topic_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        post(route('papers.submit'), {
            onSuccess: () => {
                setIsSubmitting(false);
                onClose();
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                
                <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full">
                    <form onSubmit={handleSubmit}>
                        {/* Header */}
                        <div className="flex items-start justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Submit Paper to Conference
                            </h3>
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <span className="text-2xl">×</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Conference Info */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h4 className="font-medium text-blue-900">
                                    {conference.name}
                                </h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    Submission Deadline: {new Date(conference.submission_deadline).toLocaleDateString()}
                                </p>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Abstract
                                    </label>
                                    <textarea
                                        value={data.abstract}
                                        onChange={(e) => setData('abstract', e.target.value)}
                                        rows={4}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.abstract && (
                                        <p className="mt-1 text-sm text-red-600">{errors.abstract}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Keywords
                                    </label>
                                    <input
                                        type="text"
                                        value={data.keywords}
                                        onChange={(e) => setData('keywords', e.target.value)}
                                        placeholder="Separate keywords with commas"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    {errors.keywords && (
                                        <p className="mt-1 text-sm text-red-600">{errors.keywords}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Topic
                                    </label>
                                    <select
                                        value={data.topic_id}
                                        onChange={(e) => setData('topic_id', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    >
                                        <option value="">Select a topic</option>
                                        {conference.topics.map((topic) => (
                                            <option key={topic.id} value={topic.id}>
                                                {topic.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.topic_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.topic_id}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                disabled={processing || isSubmitting}
                            >
                                {processing || isSubmitting ? 'Submitting...' : 'Submit Paper'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
