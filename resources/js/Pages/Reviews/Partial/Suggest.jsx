import React, { useState } from 'react';
import TextArea from '@/Components/TextArea';

export default function Suggestion({ className = '', data = {}, errors = {}, onChange }) {
    const [status, setStatus] = useState(data.status || '');
    const [comment, setComment] = useState(data.comment || '');

    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        setStatus(newStatus);
        if (onChange) {
            onChange('status', newStatus);
        }
    };

    const handleCommentChange = (event) => {
        const newComment = event.target.value;
        setComment(newComment);
        if (onChange) {
            onChange('comment', newComment);
        }
    };

    return (
        <section className={className}>
            <header>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Suggestion
                </h1>
            </header>
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <select 
                        value={status} 
                        onChange={handleStatusChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md text-gray-900 ${
                            errors.status 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    >
                        <option value="">Select a status</option>
                        <option value="accept">Accept</option>
                        <option value="revise">Revise</option>
                        <option value="reject">Reject</option>
                    </select>
                    {errors.status && (
                        <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment
                    </label>
                    <TextArea
                        value={comment}
                        onChange={handleCommentChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md text-gray-900 ${
                            errors.comment 
                                ? 'border-red-300 bg-red-50' 
                                : 'border-gray-300 bg-white'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        rows={4}
                        placeholder="Enter your suggestion or comments here..." 
                    />
                    {errors.comment && (
                        <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
                    )}
                </div>
            </div>
        </section>
    );
}