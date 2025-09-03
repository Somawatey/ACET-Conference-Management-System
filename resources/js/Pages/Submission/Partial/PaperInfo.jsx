import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PaperUpload from './PaperUpload';

export default function PaperInfo({ className = '', data = {}, errors = {}, onChange }) {
    // Adapter to pass file back to parent as a synthetic change event
    const handleFileSelect = (file) => {
        if (typeof onChange === 'function') {
            onChange({
                target: {
                    name: 'paper_file',
                    value: file,
                    type: 'file',
                },
            });
        }
    };

    return (
        <section className={className}>
            <header>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Paper Information
                </h1>
            </header>
            <div className="mt-6 space-y-6">
                {/* Track and Topic side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel htmlFor="track" value="Track" />
                        <select
                            id="track"
                            name="track"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            value={data.track || ''}
                            onChange={onChange}
                        >
                            <option value="">Select track</option>
                            <option value="main">Main Track</option>
                            <option value="student">Student Track</option>
                        </select>
                        <InputError className="mt-2" message={errors.track} />
                    </div>
                    <div>
                        <InputLabel htmlFor="topic" value="Topic" />
                        <select
                            id="topic"
                            name="topic"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                            value={data.topic || ''}
                            onChange={onChange}
                        >
                            <option value="">Select topic</option>
                            <option value="NLP">NLP</option>
                            <option value="AI">AI</option>
                            <option value="Machine Learning">Machine Learning</option>
                            <option value="Data Sciences">Data Sciences</option>
                            <option value="IoT Networking">IoT Networking</option>
                            <option value="Software Engineering">Software Engineering</option>
                            <option value="Computer Networks">Computer Networks</option>
                            <option value="Cybersecurity">Cybersecurity</option>
                            <option value="Other">Other</option>



                        </select>
                        <InputError className="mt-2" message={errors.topic} />
                    </div>
                </div>
                {/* Paper Title */}
                <div>
                    <InputLabel htmlFor="paper_title" value="Paper Title" />
                    <TextInput
                        id="paper_title"
                        name="paper_title"
                        className="mt-2 block w-full"
                        placeholder="Enter paper title"
                        required
                        value={data.paper_title || ''}
                        onChange={onChange}
                    />
                    <InputError className="mt-2" message={errors.paper_title} />
                </div>
                {/* Abstract */}
                <div>
                    <InputLabel htmlFor="abstract" value="Abstract" />
                    <TextArea
                        id="abstract"
                        name="abstract"
                        className="mt-1 block w-full"
                        placeholder="Enter abstract"
                        required
                        rows={5}
                        value={data.abstract || ''}
                        onChange={onChange}
                    />
                    <InputError className="mt-2" message={errors.abstract} />
                </div>
                {/* Keywords */}
                <div>
                    <InputLabel htmlFor="keyword" value="Keyword(s)" />
                    <TextInput
                        id="keyword"
                        name="keyword"
                        className="mt-1 block w-full"
                        placeholder="Enter keywords, separated by commas"
                        required
                        value={data.keyword || ''}
                        onChange={onChange}
                    />
                    <InputError className="mt-2" message={errors.keyword} />
                </div>
                {/* Upload */}
                <div>
                    <PaperUpload
                        onChange={handleFileSelect}
                        file={data.paper_file || null}
                        error={errors.paper_file}
                    />
                </div>
            </div>
        </section>
    );
}