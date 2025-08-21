import { Head, useForm } from "@inertiajs/react";
import AuthorInfo from "./Partial/AuthorInfo";
import PaperInfo from "./Partial/PaperInfo";
import Declare from "./Partial/Declare";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Submit() {
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
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            <h2 className="text-white text-2xl font-bold tracking-wide drop-shadow">
                                ACET Conference Paper Submission
                            </h2>
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