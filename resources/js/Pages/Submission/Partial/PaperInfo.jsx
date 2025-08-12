import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';
import PaperUpload from './PaperUpload';

export default function PaperInfo({ className = '', data = {}, errors = {}, onChange }) {
    return (
        <section className={className}>
            <header>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Paper Information
                </h1>
            </header>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Left side: Track, Topic, Paper Title */}
                <div className="space-y-6">
                    <div>
                        <InputLabel htmlFor="track" value="Track" />
                        <TextInput
                            id="track"
                            name="track"
                            className="mt-1 block w-full"
                            placeholder="Enter track"
                            required
                            value={data.track || ''}
                            onChange={onChange}
                        />
                        <InputError className="mt-2" message={errors.track} />
                    </div>
                    <div>
                        <InputLabel htmlFor="topic" value="Topic" />
                        <TextInput
                            id="topic"
                            name="topic"
                            className="mt-1 block w-full"
                            placeholder="Enter topic"
                            required
                            value={data.topic || ''}
                            onChange={onChange}
                        />
                        <InputError className="mt-2" message={errors.topic} />
                    </div>
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
                </div>
                {/* Right side: Abstract, Keyword */}
                <div className="space-y-6">
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
                    <div>
                        <InputLabel htmlFor="keyword" value="Keyword(s)" />
                        <TextInput
                            id="keyword"
                            name="keyword"
                            className=" block w-full"
                            placeholder="Enter keywords, separated by commas"
                            required
                            value={data.keyword || ''}
                            onChange={onChange}
                        />
                        <InputError className="mt-2" message={errors.keyword} />
                    </div>
                </div>
                {/* Upload below both columns */}
                <div className="lg:col-span-1">
                    <PaperUpload />
                </div>
            </div>
        </section>
    );
}