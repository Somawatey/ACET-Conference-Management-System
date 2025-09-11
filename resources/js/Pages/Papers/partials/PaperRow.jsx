import { Fragment } from 'react';
import StatusBadge from './StatusBadge';
import PaperActions from './PaperActions';

export default function PaperRow({ paper, isOpen, onToggle, onAssignReviewer }) {
    const getPaperTitle = (p) => (p?.paper_title ?? p?.title ?? '');
    const getTopicText = (p) => (typeof p?.topic === 'object' ? (p.topic?.name ?? '') : (p?.topic ?? ''));
    const getAuthorName = (p) => {
        if (p?.submission?.author_info?.author_name) {
            return p.submission.author_info.author_name;
        }
        return 'No Author';
    };
    const getPdfUrl = (p) => {
        if (p?.url) return p.url;
        if (p?.submission?.paper?.url) return p.submission.paper.url;
        return null;
    };

    return (
        <Fragment>
            <tr className="hover:bg-gray-50">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900">{paper.id}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="font-medium text-gray-900">{getPaperTitle(paper)}</div>
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getTopicText(paper)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{getAuthorName(paper)}</td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    {getPdfUrl(paper) ? (
                        <a
                            href={`/storage/${getPdfUrl(paper)}`}
                            download
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                        </a>
                    ) : (
                        <span className="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 rounded">
                            No PDF
                        </span>
                    )}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusBadge status={paper.status} paper={paper} />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusBadge status={paper.decision?.decision} paper={paper} />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                    <button
                        type="button"
                        className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => onToggle(paper.id)}
                    >
                        <svg className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View
                    </button>
                </td>
            </tr>
            {isOpen && (
                <tr className="bg-gray-50">
                    <td colSpan={8} className="p-6">
                        <PaperActions paper={paper} onManageReviewers={() => onAssignReviewer(paper)} />
                    </td>
                </tr>
            )}
        </Fragment>
    );
}
