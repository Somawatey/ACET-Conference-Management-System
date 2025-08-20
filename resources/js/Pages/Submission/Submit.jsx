import { Head, useForm, usePage, Link } from "@inertiajs/react";
import AuthorInfo from "./Partial/AuthorInfo";
import PaperInfo from "./Partial/PaperInfo";
import Declare from "./Partial/Declare";
import PrimaryButton from "@/Components/PrimaryButton";
import { useState, useEffect } from "react";

export default function Submit() {
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
                // Clear all inputs after successful upload
                reset();
                // Optional: scroll to top after reset
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
        });
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen">
            <header>
                <Head title="Submit" />
                <section>
                    <header className="bg-[#12284B] shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                            <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow">
                                ACET Conference Paper Submission
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
                                Welcome to the ACET 2025 Paper Submission Form.
                            </h1>
                            <p className="text-medium text-gray-700">
                                Please complete all required fields in this form to submit your research paper for review and consideration at the ASEAN Conference on Emerging Technologies 2025. This form collects essential information about the authors, affiliations, paper title, abstract, and relevant topics. Your submission will be evaluated by our program committee, and accepted papers will be included in the official conference proceedings.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white/80 rounded-xl p-8 shadow-lg border border-blue-100">
                                <AuthorInfo data={data} errors={errors} onChange={handleChange} />
                            </div>
                            <div className="mt-8 bg-white/80 rounded-xl p-8 shadow-lg border border-blue-100">
                                <PaperInfo data={data} errors={errors} onChange={handleChange} />
                            </div>
                            <div className="mt-8 bg-[#fff5f5]/80 rounded-xl p-8 shadow-lg border border-blue-100">
                                <Declare data={data} errors={errors} onChange={handleChange} />
                            </div>
                            <div className="mt-8 flex justify-end">
                                <PrimaryButton
                                    type="submit"
                                    className="px-8 py-3 bg-[#12284B] text-white font-semibold rounded-lg shadow hover:bg-blue-900 transition"
                                    disabled={processing}
                                >
                                    {processing ? "Submitting..." : "Submit"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </main>
                </section>
            </header>
        </div>
    );
}