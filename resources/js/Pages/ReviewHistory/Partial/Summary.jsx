export default function ReviewSummary({ reviewData }) {
    // Calculate summary statistics
    const getSummaryStats = () => {
        const stats = { Accept: 0, Revise: 0, Reject: 0 };
        reviewData.forEach(review => {
            stats[review.status]++;
        });
        return stats;
    };

    const summaryStats = getSummaryStats();
    const totalReviews = reviewData.length;

    // Generate overall status message
    const getOverallStatusMessage = () => {
        const acceptedCount = summaryStats.accept;
        const reviseCount = summaryStats.revise;
        const rejectedCount = summaryStats.reject;

        if (rejectedCount > 0) {
            return "This paper has received some negative reviews. Please address all reviewer concerns before resubmission.";
        } else if (reviseCount > 0) {
            const reviseReviewers = reviewData
                .filter(review => review.status === 'revise')
                .map(review => review.reviewBy.split(' ').pop()) // Get last name
                .join(' and ');
            return `This paper has received mostly positive reviews. Please address the revision comments from ${reviseReviewers} and resubmit for final approval.`;
        } else if (acceptedCount === totalReviews) {
            return "Congratulations! This paper has received unanimous acceptance from all reviewers.";
        } else {
            return "Review process is ongoing. Please check back for updates.";
        }
    };

    return (
        <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">{summaryStats.Accept}</div>
                    <div className="text-sm text-green-700">Accepted</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">{summaryStats.Revise}</div>
                    <div className="text-sm text-yellow-700">Needs Revision</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">{summaryStats.Reject}</div>
                    <div className="text-sm text-red-700">Rejected</div>
                </div>
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">Overall Status:</span> {getOverallStatusMessage()}
                </p>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
                Total Reviews: {totalReviews}
            </div>
        </div>
    );
}