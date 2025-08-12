import { Head, useForm } from "@inertiajs/react";
import AuthorInfo from "./Partial/AuthorInfo";
import PaperInfo from "./Partial/PaperInfo";
import Declare from "./Partial/Declare";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Submit() {
    const { data, setData, errors, post, processing } = useForm({
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
        // Declaration
        submitted_elsewhere: "",
        original_submission: "",
        agree_guidelines: "",
        // Add other fields as needed
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setData(name, type === "checkbox" ? checked : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("submission.store"));
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
                        <form onSubmit={handleSubmit}>
                            <div className="bg-white/80 rounded-xl p-8 shadow-lg border border-blue-100">
                                <AuthorInfo data={data} errors={errors} onChange={handleChange} />
                            </div>
                            <div className="mt-8 bg-white/80 rounded-xl p-8 shadow-lg border border-blue-100">
                                <PaperInfo data={data} errors={errors} onChange={handleChange} />
                            </div>
                            <div className="mt-8 bg-white/80 rounded-xl p-8 shadow-lg border border-blue-100">
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