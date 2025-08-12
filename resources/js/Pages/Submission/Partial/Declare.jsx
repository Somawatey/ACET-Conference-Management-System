import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function Declare({ className = '', data = {}, errors = {}, onChange }) {
    return (
        <section className={className}>
            <header>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Declaration
                </h1>
            </header>
            <div className="mt-6 space-y-8">
                {/* Q1 */}
                <div>
                    <InputLabel value="Q1: Has this paper been submitted or published elsewhere?" />
                    <div className="mt-2 flex gap-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="submitted_elsewhere"
                                value="yes"
                                checked={data.submitted_elsewhere === 'yes'}
                                onChange={onChange}
                                className="form-radio"
                                required
                            />
                            <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="submitted_elsewhere"
                                value="no"
                                checked={data.submitted_elsewhere === 'no'}
                                onChange={onChange}
                                className="form-radio"
                                required
                            />
                            <span className="ml-2">No</span>
                        </label>
                    </div>
                    <InputError className="mt-2" message={errors.submitted_elsewhere} />
                </div>
                {/* Q2 */}
                <div>
                    <InputLabel value="Q2: I confirm that this submission is original and does not contain plagiarized material." />
                    <div className="mt-2 flex gap-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="original_submission"
                                value="yes"
                                checked={data.original_submission === 'yes'}
                                onChange={onChange}
                                className="form-radio"
                                required
                            />
                            <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="original_submission"
                                value="no"
                                checked={data.original_submission === 'no'}
                                onChange={onChange}
                                className="form-radio"
                                required
                            />
                            <span className="ml-2">No</span>
                        </label>
                    </div>
                    <InputError className="mt-2" message={errors.original_submission} />
                </div>
                {/* Q3 */}
                <div>
                    <InputLabel value="Q3: I confirm that I have read and agree to comply with the conference’s submission guidelines, review procedures, and ethical standards." />
                    <div className="mt-2 flex gap-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="agree_guidelines"
                                value="yes"
                                checked={data.agree_guidelines === 'yes'}
                                onChange={onChange}
                                className="form-radio"
                                required
                            />
                            <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="agree_guidelines"
                                value="no"
                                checked={data.agree_guidelines === 'no'}
                                onChange={onChange}
                                className="form-radio"
                                required
                            />
                            <span className="ml-2">No</span>
                        </label>
                    </div>
                    <InputError className="mt-2" message={errors.agree_guidelines} />
                </div>
            </div>
        </section>
    );
}