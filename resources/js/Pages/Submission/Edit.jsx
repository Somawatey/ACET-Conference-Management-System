import { Head, useForm, usePage, Link, router } from "@inertiajs/react";
import AuthorInfo from "./Partial/AuthorInfo";
import PaperInfo from "./Partial/PaperInfo";
import Declare from "./Partial/Declare";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";

export default function Edit({ submission }) {
    const { auth } = usePage().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#user-menu-button')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Generate user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    // Check if user has a profile photo
    const hasProfilePhoto = () => {
        return auth?.user?.profile_photo_url;
    };
    
    const { data, setData, errors, post, processing, reset } = useForm({
        // Author Info - populate with existing data
        author_name: submission?.author_info?.author_name || "",
        author_institute: submission?.author_info?.institute || "",
        author_email: submission?.author_info?.author_email || "",
        correspond_name: submission?.author_info?.correspond_name || "",
        correspond_email: submission?.author_info?.correspond_email || "",
        coauthors: submission?.author_info?.coauthors || "",
        
        // Paper Info - populate with existing data
        track: submission?.track || "",
        topic: submission?.paper?.topic || "",
        paper_title: submission?.paper?.paper_title || "",
        abstract: submission?.paper?.abstract || "",
        keyword: submission?.paper?.keyword || "",
        paper_file: null, // File will be handled separately
        
        // Declaration - populate with existing data
        submitted_elsewhere: submission?.submitted_elsewhere || false,
        original_submission: submission?.original_submission || false,
        agree_guidelines: true, // Always true for editing
        
        // Use PATCH method for updates
        _method: 'PATCH'
    });

    console.log('Submission data:', submission);
    console.log('Author info:', submission?.author_info);
    console.log('Form data:', data);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === "checkbox" ? checked : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Use POST with _method: PATCH for Laravel
        post(route("submissions.update", { id: submission.id }), {
            forceFormData: true,
            preserveScroll: false,
            onSuccess: () => {
                setShowSuccessModal(true);
            },
        });
    };

    const handleBackToYourSubmissions = () => {
        router.visit(route('submissions.index'));
    };

    const handleGoBack = () => {
        router.visit(route('submissions.index'));
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <header>
                <Head title="Edit Submission" />
                <section>
                    {/* Clean Header */}
                    <header className="bg-white shadow-sm">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Back Button */}
                                <button
                                    onClick={handleGoBack}
                                    className="flex items-center px-3 py-2 text-blue-700 hover:text-blue-900 
                                             hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back to Submissions
                                </button>
                                <h1 className="text-blue-900 text-2xl font-bold">
                                    Edit Paper Submission
                                </h1>
                            </div>
                            
                            {/* User Profile Section */}
                            <div className="flex items-center space-x-3">
                                <span className="text-blue-800 font-medium">{auth?.user?.name}</span>
                                <div className="relative">
                                    <button
                                        id="user-menu-button"
                                        type="button"
                                        className="flex items-center justify-center w-9 h-9 rounded-full 
                                                   hover:ring-2 hover:ring-blue-300 focus:outline-none 
                                                   focus:ring-2 focus:ring-blue-400 transition-all duration-200"
                                        aria-expanded={isDropdownOpen}
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        {hasProfilePhoto() ? (
                                            <img
                                                src={auth.user.profile_photo_url}
                                                className="w-full h-full rounded-full object-cover"
                                                alt="Profile"
                                            />
                                        ) : (
                                            <div className="w-full h-full rounded-full bg-blue-600 
                                                          flex items-center justify-center text-white text-sm font-medium">
                                                {getUserInitials(auth?.user?.name)}
                                            </div>
                                        )}
                                    </button>

                                    {/* Simple Dropdown */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 z-50 mt-2 w-48 origin-top-right 
                                                        bg-white rounded-md shadow-lg border border-gray-200">
                                            <div className="p-3 border-b border-gray-100">
                                                <p className="text-sm font-medium text-blue-900">
                                                    {auth?.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {auth?.user?.email}
                                                </p>
                                            </div>
                                            <div className="py-1">
                                                <Link 
                                                    href={route('dashboard')} 
                                                    className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                                >
                                                    Dashboard
                                                </Link>
                                                <Link 
                                                    href={route('profile.edit')} 
                                                    className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
                                                >
                                                    Profile Settings
                                                </Link>
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                                >
                                                    Logout
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content */}
                    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                        {/* Welcome Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-blue-900 mb-3">
                                Edit Your Research Paper Submission
                            </h2>
                            <p className="text-blue-700 leading-relaxed">
                                Update your paper submission details below. You can modify the author information, paper details, and declaration status. 
                                Make sure all information is accurate before saving your changes.
                            </p>
                            
                            {/* Current Status Info */}
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">
                                            Current Status: <span className="font-semibold">{submission?.paper?.status || 'Pending'}</span>
                                        </p>
                                        <p className="text-xs text-blue-700">
                                            Submitted on: {submission?.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Author Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                        1
                                    </span>
                                    Author Information
                                </h3>
                                <AuthorInfo data={data} errors={errors} onChange={handleChange} />
                            </div>

                            {/* Paper Information */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                        2
                                    </span>
                                    Paper Details
                                </h3>
                                <PaperInfo 
                                    data={data} 
                                    errors={errors} 
                                    onChange={handleChange} 
                                    isEdit={true}
                                    currentFileName={submission?.paper?.url ? submission.paper.url.split('/').pop() : null}
                                />
                            </div>

                            {/* Declaration */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                        3
                                    </span>
                                    Declaration
                                </h3>
                                <Declare data={data} errors={errors} onChange={handleChange} isEdit={true} />
                            </div>

                            {/* Submit Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-center gap-4">
                                    {/* Cancel Button */}
                                    <button
                                        type="button"
                                        onClick={handleGoBack}
                                        className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium 
                                                 rounded-lg shadow transition-colors duration-200 
                                                 focus:ring-4 focus:ring-gray-300 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                    
                                    {/* Update Button */}
                                    <PrimaryButton
                                        type="submit"
                                        className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white font-medium 
                                                 rounded-lg shadow transition-colors duration-200 
                                                 focus:ring-4 focus:ring-blue-300 focus:outline-none 
                                                 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Updating...
                                            </span>
                                        ) : (
                                            "Update Submission"
                                        )}
                                    </PrimaryButton>
                                </div>
                                <p className="text-sm text-gray-600 mt-3 text-center">
                                    Changes will be saved and your submission status may be updated
                                </p>
                            </div>
                        </form>
                    </main>
                </section>
            </header>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
                        {/* Modal Header */}
                        <div className="p-6 text-center">
                            {/* Success Icon */}
                            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            
                            {/* Success Message */}
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Update Successful!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your submission has been successfully updated. 
                                The changes have been saved and will be reflected in your submission status.
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="bg-gray-50 px-6 py-4 flex justify-center rounded-b-lg">
                            {/* Back to Submissions Button */}
                            <button
                                onClick={handleBackToYourSubmissions}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                                         font-medium rounded-lg shadow transition-colors duration-200 
                                         focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            >
                                Back to Your Submissions
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
