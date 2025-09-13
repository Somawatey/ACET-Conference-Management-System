export default function StatusBadge({ status, paper }) {
    const getStatusClass = (status) => {
        const s = (status || '').toString().toLowerCase();
        
        // Check if paper is published
        if (paper?.is_published) {
            return 'bg-blue-100 text-blue-800';
        }
        
        if (s.includes('publish') || s === 'accepted') return 'bg-green-100 text-green-800';
        if (s.includes('pend')) return 'bg-yellow-100 text-yellow-800';
        if (s.includes('reject')) return 'bg-red-100 text-red-800';
        return 'bg-gray-100 text-gray-800';
    };

    const getDisplayStatus = () => {
        if (paper?.is_published) {
            return 'Published';
        }
        return status || 'Pending';
    };

    return (
        <span className={`${getStatusClass(status)} px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
            {getDisplayStatus()}
        </span>
    );
}
