export default function ReviewSummary({ reviewData }) {
    // Calculate summary statistics
    const getSummaryStats = () => {
        const stats = { Accept: 0, Revise: 0, Reject: 0 };
        const ratings = [];
        
        reviewData.forEach(review => {
            if (review.status && stats.hasOwnProperty(review.status)) {
                stats[review.status]++;
            }
            if (review.rating && !isNaN(review.rating)) {
                ratings.push(parseFloat(review.rating));
            }
        });
        
        return { 
            ...stats, 
            ratings,
            averageRating: ratings.length > 0 ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1) : 0
        };
    };

    const summaryStats = getSummaryStats();
    const totalReviews = reviewData.length;

    // Generate overall status message
    const getOverallStatusMessage = () => {
        const acceptedCount = summaryStats.Accept;
        const reviseCount = summaryStats.Revise;
        const rejectedCount = summaryStats.Reject;

        if (rejectedCount > 0) {
            return "This paper has received some negative reviews. Please address all reviewer concerns before resubmission.";
        } else if (reviseCount > 0) {
            const reviseReviewers = reviewData
                .filter(review => review.status === 'Revise')
                .map(review => (review.reviewBy || 'Unknown').split(' ').pop()) // Get last name
                .join(' and ');
            return `This paper has received mostly positive reviews. Please address the revision comments${reviseReviewers ? ` from ${reviseReviewers}` : ''} and resubmit for final approval.`;
        } else if (acceptedCount === totalReviews && totalReviews > 0) {
            return "Congratulations! This paper has received unanimous acceptance from all reviewers.";
        } else {
            return "Review process is ongoing. Please check back for updates.";
        }
    };

    const getStatusColor = (count, status) => {
        if (count === 0) return 'text-gray-400';
        
        switch(status) {
            case 'Accept': return 'text-green-600';
            case 'Revise': return 'text-yellow-600';
            case 'Reject': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getRatingBar = (ratings) => {
        if (ratings.length === 0) return null;
        
        const ratingCounts = {};
        for (let i = 1; i <= 10; i++) {
            ratingCounts[i] = 0;
        }
        
        ratings.forEach(rating => {
            const roundedRating = Math.round(rating);
            if (ratingCounts[roundedRating] !== undefined) {
                ratingCounts[roundedRating]++;
            }
        });
        
        return (
            <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Rating Distribution</h4>
                <div className="space-y-1">
                    {Object.entries(ratingCounts).reverse().map(([rating, count]) => (
                        <div key={rating} className="flex items-center">
                            <span className="w-6 text-xs text-gray-600">{rating}</span>
                            <div className="flex-1 mx-2 bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${ratings.length > 0 ? (count / ratings.length) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="w-6 text-xs text-gray-600">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-8 bg-white shadow rounded-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Summary</h3>
            
            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${getStatusColor(summaryStats.Accept, 'Accept')}`}>
                        {summaryStats.Accept}
                    </div>
                    <div className="text-sm text-green-700">Accepted</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${getStatusColor(summaryStats.Revise, 'Revise')}`}>
                        {summaryStats.Revise}
                    </div>
                    <div className="text-sm text-yellow-700">Needs Revision</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className={`text-2xl font-bold ${getStatusColor(summaryStats.Reject, 'Reject')}`}>
                        {summaryStats.Reject}
                    </div>
                    <div className="text-sm text-red-700">Rejected</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                        {summaryStats.averageRating > 0 ? summaryStats.averageRating : 'N/A'}
                    </div>
                    <div className="text-sm text-blue-700">Average Rating</div>
                </div>
            </div>

            {/* Rating Distribution */}
            {summaryStats.ratings.length > 0 && getRatingBar(summaryStats.ratings)}
            
            {/* Overall Status Message */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">Overall Status:</span> {getOverallStatusMessage()}
                </p>
            </div>
            
            {/* Total Reviews Footer */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Total Reviews: {totalReviews}</span>
                    <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}