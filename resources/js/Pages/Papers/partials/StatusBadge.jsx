export default function StatusBadge({ status }) {
    const getStatusClass = (status) => {
        const s = (status || '').toString().toLowerCase();
        if (s.includes('publish') || s === 'accepted') return 'bg-green-100 text-green-800';
        if (s.includes('pend')) return 'bg-yellow-100 text-yellow-800';
        if (s.includes('reject')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <span className={`${getStatusClass(status)} px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
            {status || 'Pending'}
        </span>
    );
}
