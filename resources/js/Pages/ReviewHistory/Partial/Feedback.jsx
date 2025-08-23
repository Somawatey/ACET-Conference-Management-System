export default function ReviewerBlock({ review, isSelected = false, onToggle }) {
    const getStatusBadge = (status) => {
        const statusStyles = {
            Accept: "bg-green-100 text-green-800 border-green-200",
            Revise: "bg-yellow-100 text-yellow-800 border-yellow-200",
            Reject: "bg-red-100 text-red-800 border-red-200"
        };

        const statusText = {
            Accept: "Accepted",
            Revise: "Needs Revision",
            Reject: "Rejected"
        };

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                {statusText[status] || status || 'No Status'}
            </span>
        );
    };

    const getRatingDisplay = (rating) => {
        if (!rating) return 'Not rated';
        
        const stars = [];
        const fullStars = Math.floor(rating);
        
        for (let i = 1; i <= 10; i++) {
            if (i <= fullStars) {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                );
            } else {
                stars.push(
                    <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                );
            }
        }
        
        return (
            <div className="flex items-center space-x-1">
                <div className="flex">{stars.slice(0, Math.min(rating, 5))}</div>
                <span className="text-sm font-semibold text-gray-700">({rating}/10)</span>
            </div>
        );
    };

    return (
        <div 
            id={`review-${review.id}`}
            className={`bg-white shadow rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
        >
            {/* Clickable Header Section */}
            <div 
                className="p-6 cursor-pointer"
                onClick={() => onToggle && onToggle(review.id)}
            >
                <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Review #{review.id}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    {getStatusBadge(review.status)}
                                    <svg 
                                        className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isSelected ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Reviewed By:</span>
                                    <div className="mt-1">
                                        <span className="text-sm text-gray-900 font-medium">
                                            {review.reviewBy || 'Unknown Reviewer'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Review Date:</span>
                                    <div className="mt-1">
                                        <span className="text-sm text-gray-900">
                                            {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'No date'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Rating:</span>
                                    <div className="mt-1">
                                        {getRatingDisplay(review.rating)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview of comments when collapsed */}
                {!isSelected && (
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">Quick Preview: </span>
                        {review.comments ? 
                            (review.comments.length > 100 ? 
                                review.comments.substring(0, 100) + '...' : 
                                review.comments
                            ) : 
                            'No comments provided'
                        }
                        <span className="text-blue-600 ml-2 font-medium">Click to view full details</span>
                    </div>
                )}
            </div>

            {/* Expanded Detail Section */}
            {isSelected && (
                <div className="px-6 pb-6 border-t border-gray-100 bg-gray-50">
                    <div className="pt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">Full Review Details</h4>
                        
                        {/* Detailed Review Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Review ID:</span>
                                    <div className="mt-1 text-sm text-gray-900">#{review.id}</div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Reviewer:</span>
                                    <div className="mt-1 text-sm text-gray-900 font-medium">
                                        {review.reviewBy || 'Unknown Reviewer'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Paper ID:</span>
                                    <div className="mt-1 text-sm text-gray-900">#{review.paper_id || 'N/A'}</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Review Date:</span>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : 'No date provided'}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Status:</span>
                                    <div className="mt-1">
                                        {getStatusBadge(review.status)}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Rating:</span>
                                    <div className="mt-1">
                                        {getRatingDisplay(review.rating)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Full Comments Section */}
                        <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Complete Review Comments & Feedback</h5>
                            <div className="bg-white border border-gray-300 rounded-md p-4">
                                <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                                    {review.comments || 'No comments provided for this review.'}
                                </p>
                            </div>
                        </div>

                        {/* Additional Review Criteria (if available) */}
                        {(review.methodology_rating || review.novelty_rating || review.clarity_rating) && (
                            <div className="mt-6">
                                <h5 className="text-sm font-medium text-gray-700 mb-3">Detailed Ratings</h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {review.methodology_rating && (
                                        <div className="bg-white border border-gray-200 rounded-md p-3">
                                            <span className="text-xs font-medium text-gray-600">Methodology</span>
                                            <div className="mt-1">{getRatingDisplay(review.methodology_rating)}</div>
                                        </div>
                                    )}
                                    {review.novelty_rating && (
                                        <div className="bg-white border border-gray-200 rounded-md p-3">
                                            <span className="text-xs font-medium text-gray-600">Novelty</span>
                                            <div className="mt-1">{getRatingDisplay(review.novelty_rating)}</div>
                                        </div>
                                    )}
                                    {review.clarity_rating && (
                                        <div className="bg-white border border-gray-200 rounded-md p-3">
                                            <span className="text-xs font-medium text-gray-600">Clarity</span>
                                            <div className="mt-1">{getRatingDisplay(review.clarity_rating)}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggle && onToggle(review.id);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Collapse Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}