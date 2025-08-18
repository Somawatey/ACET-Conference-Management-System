export default function ReviewerBlock({ review }) {
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
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
                {statusText[status]}
            </span>
        );
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Review #{review.id}
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Reviewed By:</span>
                                    <span className="ml-2 text-sm text-gray-900">{review.reviewBy}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Date:</span>
                                    <span className="ml-2 text-sm text-gray-900">{review.reviewDate}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-gray-700">Rating:</span>
                                    <span className="ml-2 text-sm text-gray-900 font-semibold">{review.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        {getStatusBadge(review.status)}
                    </div>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Review Comments</h4>
                <div className="bg-gray-50 border border-gray-300 rounded-md p-4">
                    <p className="text-gray-900 text-sm leading-relaxed">
                        {review.comments}
                    </p>
                </div>
            </div>
        </div>
    );
}