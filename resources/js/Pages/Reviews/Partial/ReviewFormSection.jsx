import React from 'react';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function ReviewFormSection({ data, setData, errors, processing, onCancel, className = "" }) {
    return (
        <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Form</h3>
                
                {/* Score Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Score (1-10) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        min="1"
                        max="10"
                        value={data.score}
                        onChange={(e) => setData('score', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter score between 1-10"
                        required
                    />
                    {errors.score && <p className="text-red-600 text-sm mt-1">{errors.score}</p>}
                </div>

                {/* Recommendation */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recommendation
                    </label>
                    <select
                        value={data.recommendation}
                        onChange={(e) => setData('recommendation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select recommendation...</option>
                        <option value="Accept">Accept</option>
                        <option value="Reject">Reject</option>
                        <option value="Revise">Revise</option>
                    </select>
                    {errors.recommendation && <p className="text-red-600 text-sm mt-1">{errors.recommendation}</p>}
                </div>

                {/* Feedback */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Feedback and Comments
                    </label>
                    <textarea
                        rows="6"
                        value={data.feedback}
                        onChange={(e) => setData('feedback', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Provide detailed feedback about the paper..."
                    />
                    {errors.feedback && <p className="text-red-600 text-sm mt-1">{errors.feedback}</p>}
                </div>
            </div>
            
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
                >
                    Cancel
                </button>
                <PrimaryButton type="submit" disabled={processing}>
                    {processing ? 'Submitting...' : 'Submit Review'}
                </PrimaryButton>
            </div>
        </div>
    );
}
