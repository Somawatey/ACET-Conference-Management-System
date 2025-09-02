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
                    <StatusBadge status={paper.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusBadge status={paper.status} />
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
                    <td colSpan={7} className="p-6">
                        <PaperActions paper={paper} onManageReviewers={() => onAssignReviewer(paper)} />
                    </td>
                </tr>
            )}
        </Fragment>
    );
}
