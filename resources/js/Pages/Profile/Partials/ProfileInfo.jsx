import { usePage } from '@inertiajs/react';

export default function ProfileInfo({ className }) {
    const user = usePage().props.auth.user;

    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    return (
        <div className={className}>
            {/* Header */}
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Information
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    View your profile information below.
                </p>
            </header>

            {/* Information Items */}
            <div className="mt-4 space-y-4">
                {/* Name */}
                <div className="flex items-center">
                    <div className="w-6 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <span className="w-16 text-sm font-medium text-gray-700">Name</span>
                    <span className="w-4 text-sm font-medium text-gray-700">:</span>
                    <span className="text-base font-semibold text-gray-900 ml-2">{user.name}</span>
                </div>

                {/* Email */}
                <div className="flex items-center">
                    <div className="w-6 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="w-16 text-sm font-medium text-gray-700">Email</span>
                    <span className="w-4 text-sm font-medium text-gray-700">:</span>
                    <span className="text-base text-gray-900 ml-2">{user.email}</span>
                </div>

                {/* Role */}
                <div className="flex items-center">
                    <div className="w-6 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span className="w-16 text-sm font-medium text-gray-700">Role</span>
                    <span className="w-4 text-sm font-medium text-gray-700">:</span>
                    <span className="text-base text-gray-900 ml-2">{user.roleName}</span>
                </div>

                {/* Joined Date */}
                <div className="flex items-center">
                    <div className="w-6 flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <span className="w-16 text-sm font-medium text-gray-700">Joined</span>
                    <span className="w-4 text-sm font-medium text-gray-700">:</span>
                    <span className="text-base text-gray-900 ml-2">{formatDate(user.created_at)}</span>
                </div>
            </div>
        </div>
    );
}