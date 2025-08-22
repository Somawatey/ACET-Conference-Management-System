import { Head, usePage, Link } from "@inertiajs/react";
import PaperInfo from "./Partial/PaperInfo";
import PaperList from "./Partial/PaperList";
import TextArea from "@/Components/TextArea";
import Suggestion from "./Partial/Suggest";
import PrimaryButton from "@/Components/PrimaryButton";
import ReviewFormat from "./Partial/ReviewFormat";
import { useState, useEffect } from "react";
import { useForm } from '@inertiajs/react';

export default function Review({ papers = [], review }) {
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

    // Paper list: get from props or usePage
    const pageProps = usePage().props;
    const paperRows = papers.length ? papers : (pageProps.papers?.data || pageProps.papers || []);

    // Collect review data from child components (assume you have state or props for these)
    // For demonstration, use dummy state. Replace with actual state from your components.
    const [feedback, setFeedback] = useState(''); // review comment
    const [score, setScore] = useState(''); // rating
    const [recommendation, setRecommendation] = useState(''); // comment

    const { post, processing, errors, reset } = useForm({});

    // Handle review submission
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('reviews.store'), {
            data: {
                paper_id: papers[0]?.id || '',
                feedback,
                score,
                recommendation,
            },
            onSuccess: () => {
                reset();
                alert('Review submitted successfully!');
            },
            onError: () => {
                alert('Failed to submit review.');
            }
        });
    };

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
                            <h1 className="text-3xl font-semibold text-blue-900 mb-2">Your Review</h1>
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="mb-2"><b>Feedback:</b> {review.feedback}</div>
                                <div className="mb-2"><b>Score:</b> {review.score}</div>
                                <div className="mb-2"><b>Recommendation:</b> {review.recommendation}</div>
                                <Link href={route('reviews.edit', review.id)} className="btn btn-primary mt-4">Edit Review</Link>
                            </div>
                        </div>
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
                        <h1 className="text-3xl font-semibold text-blue-900 mb-2">
                            Paper Review Details
                        </h1>
                        <p className="text-medium text-gray-700">
                            Review the submitted paper information and provide your evaluation. All paper details are displayed below for your reference during the review process.
                        </p>
                    </div>
                    {/* Review submission form */}
                    <form onSubmit={handleSubmit}>
                        <PaperList papers={paperRows} />
                        <div className="space-y-8 bg-white shadow rounded-lg p-6 mt-8">
                            <div>
                                <PaperInfo className="" />
                            </div>
                            <div className="mt-8">
                                <ReviewFormat className="mt-8" />
                            </div>
                            <div className="mt-8">
                                <Suggestion className="mt-8" />
                            </div>
                            <div className="flex justify-end">
                                <PrimaryButton className="mt-4" type="submit" disabled={processing}>
                                    Submit Review
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </main>
            </section>
        </div>
    );
}