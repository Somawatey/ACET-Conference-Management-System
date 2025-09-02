import { Head, useForm, usePage, Link, router } from "@inertiajs/react";
import AuthorInfo from "./Partial/AuthorInfo";
import PaperInfo from "./Partial/PaperInfo";
import Declare from "./Partial/Declare";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";

export default function Submit() {
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
        // Author Info
        author_name: "",
        author_institute: "",
        author_email: "",
        correspond_name: "",
        correspond_email: "",
        coauthors: "",
        // Paper Info
        track: "",
        topic: "",
        paper_title: "",
        abstract: "",
        keyword: "",
        paper_file: null,
        // Declaration
        submitted_elsewhere: "",
        original_submission: "",
        agree_guidelines: "",
        // Add other fields as needed
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // File comes in as a File object via synthetic event from PaperInfo
        setData(name, type === "checkbox" ? checked : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Ensure multipart/form-data is used when sending a File
        post(route("submissions.store"), {
            forceFormData: true,
            preserveScroll: false,
            onSuccess: () => {
                // Show success modal instead of immediate reset
                setShowSuccessModal(true);
            },
        });
    };

    const handleBackToYourSubmissions = () => {
        router.visit(route('your-submissions.index'));
    };

    const handleSubmitAnother = () => {
        // Clear all inputs and close modal
        reset();
        setShowSuccessModal(false);
        // Optional: scroll to top after reset
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleGoBack = () => {
        // Go back to previous page or dashboard
        window.history.back();
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <header>
                <Head title="Submit" />
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
                                    Back
                                </button>
                                <h1 className="text-blue-900 text-2xl font-bold">
                                    ACET 2025 Paper Submission
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
                                Submit Your Research Paper
                            </h2>
                            <p className="text-blue-700 leading-relaxed">
                                Please complete all required fields in this form to submit your research paper for review and consideration at the ASEAN Conference on Emerging Technologies 2025. This form collects essential information about the authors, affiliations, paper title, abstract, and relevant topics. Your submission will be evaluated by our program committee, and accepted papers will be included in the official conference proceedings.
                            </p>
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
                                <PaperInfo data={data} errors={errors} onChange={handleChange} />
                            </div>

                            {/* Declaration */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                                        3
                                    </span>
                                    Declaration
                                </h3>
                                <Declare data={data} errors={errors} onChange={handleChange} />
                            </div>

                            {/* Submit Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-around">
                                    {/* Submit Button */}
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
                                                Submitting...
                                            </span>
                                        ) : (
                                            "Submit Paper"
                                        )}
                                    </PrimaryButton>
                                </div>
                                <p className="text-sm text-gray-600 mt-3 text-center">
                                    You'll receive a confirmation email after submission
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
                                Submission Successful!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your paper has been successfully submitted to ACET 2025. 
                                You will receive a confirmation email shortly with your submission details.
                            </p>
                        </div>

                        {/* Modal Actions */}
                        <div className="bg-gray-50 px-6 py-4 flex flex-col gap-4 sm:flex-row sm:gap-0 sm:justify-between rounded-b-lg">
                            {/* View Your Submissions Button */}
                            <button
                                onClick={handleBackToYourSubmissions}
                                className="w-full sm:w-auto px-4 py-2 text-blue-700 bg-white border border-blue-200 
                                         hover:bg-blue-50 font-medium rounded-lg shadow-sm transition-colors duration-200 
                                         focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            >
                                View Submissions
                            </button>

                            {/* Submit Another Paper Button */}
                            <button
                                onClick={handleSubmitAnother}
                                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white 
                                         font-medium rounded-lg shadow transition-colors duration-200 
                                         focus:ring-2 focus:ring-blue-300 focus:outline-none"
                            >
                                Submit Another Paper
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}