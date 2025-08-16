import { Head } from "@inertiajs/react";
import PaperInfo from "./Partial/PaperInfo";
import TextArea from "@/Components/TextArea";
import Suggestion from "./Partial/Suggest";
import PrimaryButton from "@/Components/PrimaryButton";
import ReviewFormat from "./Partial/ReviewFormat";

export default function Review() {
    // Fake data for display

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
                    {/* Custom Header and Description */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-blue-900 mb-2">
                            Paper Review Details
                        </h1>
                        <p className="text-medium text-gray-700">
                            Review the submitted paper information and provide your evaluation. All paper details are displayed below for your reference during the review process.
                        </p>
                    </div>
                    <div className="space-y-8 bg-white shadow rounded-lg p-6">
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
                            <PrimaryButton className="mt-4">
                                Submit Review
                            </PrimaryButton>
                        </div>
                    </div>

                </main>
            </section>
        </div>
    );
}