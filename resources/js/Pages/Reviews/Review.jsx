import { Head, usePage, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";
import PaperInfoSection from "./Partial/PaperInfoSection";
import ReviewDetailsSection from "./Partial/ReviewDetailsSection";
import ReviewFormSection from './Partial/ReviewFormSection';
import { useState, useEffect } from "react";
import { useForm } from '@inertiajs/react';

export default function Review({ paper, review }) {
    const { auth } = usePage().props;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

    // Paper list: get from props
    const paperRows = paper ? [paper] : [];

    // Initialize form with paper data
    const { data, setData, post, processing, errors, reset } = useForm({
        paper_id: paper?.id || '',
        reviewer_id: auth?.user?.id || '',
        feedback: '',
        score: '',
        recommendation: '',
    });

    // Handle form field changes
    const handleFeedbackChange = (value) => {
        setData('feedback', value);
    };

    const handleScoreChange = (value) => {
        setData('score', value);
    };

    const handleRecommendationChange = (value) => {
        setData('recommendation', value);
    };

    // Handle review submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!data.paper_id) {
            alert('Paper ID is required');
            return;
        }
        if (!data.score || data.score < 1 || data.score > 10) {
            alert('Score must be between 1 and 10');
            return;
        }

        post(route('reviews.store'), {
            onSuccess: () => {
                reset();
                alert('Review submitted successfully!');
                // Redirect back to reviews list
                window.location.href = route('reviews.reviewList');
            },
            onError: (errors) => {
                console.error('Review submission errors:', errors);
                alert('Failed to submit review. Please check your input.');
            }
        });
    };

    // If no paper is provided, show error message
    if (!paper) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
                <Head title="Review Paper" />
                <section>
                    <header className="bg-[#12284B] shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow">
                                Review Paper
                            </h2>
                        </div>
                    </header>
                    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p>No paper found for review. Please select a paper from the assignments list.</p>
                            <Link href={route('reviews.reviewList')} className="text-red-800 underline">
                                Back to Assignments
                            </Link>
                        </div>
                    </main>
                </section>
            </div>
        );
    }

    // Assume 'review' prop is passed if user has already submitted a review for this paper
    // If not, show submit form. If yes, show review info and edit button.
    if (review) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
                <Head title="Review Paper" />
                <section>
                    <header className="bg-[#12284B] shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                            <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow">
                                Review Paper
                            </h2>
                        </div>
                    </header>
                    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-3xl font-semibold text-blue-900 mb-2">Your Review</h1>
                                    <p className="text-gray-700">
                                        Review details for this paper
                                    </p>
                                </div>
                                <Link 
                                    href={route('reviews.reviewList')} 
                                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                                >
                                    ← Back to Assignments
                                </Link>
                            </div>
                        </div>

                        {/* Paper Information Section */}
                        <PaperInfoSection paper={paper} className="mb-6" />

                        {/* Review Details Section */}
                        <ReviewDetailsSection review={review} />
                    </main>
                </section>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <Head title="Review Paper" />
            <section>
                <header className="bg-[#12284B] shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                        <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow">
                            Review Paper
                        </h2>
                        
                        {/* Profile dropdown section */}
                        <div className="flex items-center">
                            <div className="flex flex-row relative mx-3">
                                <span className="mr-3 mt-1 text-white">{`${auth?.user?.name}`}</span>
                                <button
                                    id="user-menu-button"
                                    type="button"
                                    className="flex text-sm rounded-full focus:outline-none focus:ring-1 
                                               focus:ring-offset-2 focus:ring-gray-200"
                                    aria-expanded={isDropdownOpen}
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                >
                                    <div className="image">
                                        {hasProfilePhoto() ? (
                                            <img
                                                src={auth.user.profile_photo_url}
                                                className="img-circle elevation-2"
                                                alt="User Image"
                                                style={{ width: '34px', height: '34px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div
                                                className="img-circle elevation-2 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '34px',
                                                    height: '34px',
                                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                {getUserInitials(auth?.user?.name)}
                                            </div>
                                        )}
                                    </div>
                                </button>

                                {/* Dropdown menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 z-50 mt-10 w-52 origin-top-right rounded-md 
                                                    shadow-lg ring-1 ring-black ring-opacity-5 
                                                    focus:outline-none bg-white"
                                    >
                                        <div className='px-4 py-2 mt-2'>
                                            <div className="py-1 border-b border-gray-200">
                                                <p className="text-sm text-gray-900 ">
                                                    <b>Username:</b> {auth?.user?.name}
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    <b>Email:</b> {auth?.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <ul className="py-1">
                                            <li>
                                                <Link href={route('dashboard')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition duration-200">
                                                    Dashboard
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition duration-200">
                                                    Profile Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition duration-200"
                                                >
                                                    Logout
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    {/* Custom Header and Description */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-semibold text-blue-900 mb-2">
                                    Paper Review Details
                                </h1>
                                <p className="text-medium text-gray-700">
                                    Review the submitted paper information and provide your evaluation.
                                </p>
                            </div>
                            <Link 
                                href={route('reviews.reviewList')} 
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-200"
                            >
                                ← Back to Assignments
                            </Link>
                        </div>
                    </div>
                    {/* Review submission form */}
                    <form onSubmit={handleSubmit}>
                        {/* Paper Information Section */}
                        <PaperInfoSection paper={paper} className="mb-6" />
                        
                        <div className="space-y-8">
                            <ReviewFormSection
                                data={data}
                                setData={setData}
                                errors={errors}
                                processing={processing}
                                onCancel={() => window.history.back()}
                                className=""
                            />
                        </div>
                    </form>
                </main>
            </section>
        </div>
    );
}