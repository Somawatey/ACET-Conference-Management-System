import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import TextArea from '@/Components/TextArea';

export default function AuthorInfo({ className = '', data = {}, errors = {}, onChange }) {
    return (
        <section className={className}>
            <header>
                <h1 className="text-2xl font-semibold text-gray-900">
                    Author Information
                </h1>
            </header>
            <div className="mt-6 space-y-10">
                {/* First Author */}
                <div className="space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        First Author Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Please provide the details of the first author for the submission.
                    </p>
                    {/* Grid: Name & Email above Institute */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="author-name" value="Author Name" />
                            <TextInput
                                id="author-name"
                                name="author_name"
                                className="mt-1 block w-full"
                                placeholder="Enter author name"
                                required
                                autoComplete="author-name"
                                value={data.author_name || ''}
                                onChange={onChange}
                            />
                            <InputError className="mt-2" message={errors.author_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="author-email" value="Author Email" />
                            <TextInput
                                id="author-email"
                                name="author_email"
                                className="mt-1 block w-full"
                                placeholder="Enter author email"
                                required
                                autoComplete="author-email"
                                value={data.author_email || ''}
                                onChange={onChange}
                            />
                            <InputError className="mt-2" message={errors.author_email} />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="author-institute" value="Affiliation / Institution" />
                            <TextInput
                                id="author-institute"
                                name="author_institute"
                                className="mt-1 block w-full"
                                placeholder="Enter affiliation / institution"
                                required
                                autoComplete="author-institute"
                                value={data.author_institute || ''}
                                onChange={onChange}
                            />
                            <InputError className="mt-2" message={errors.author_institute} />
                        </div>
                    </div>
                </div>
                {/* Co-Authors as textarea under first author */}
                <div className="space-y-6">
                    <h2 className="text-lg font-medium text-blue-900">
                        Co-Author Information
                    </h2>
                    <p className="mt-1 text-sm text-blue-700">
                        Please list all co-authors. For each co-author, write their name and affiliation/institution on one line.  
                        Make sure there is a line break between each co-author.<br />
                        <span className="italic">Example:<br />John Dave, CADT<br />Jane Smith, RUPP</span>
                    </p>
                    <div>
                        <InputLabel htmlFor="coauthors" value="Co-Authors" />
                        <TextArea
                            id="coauthors"
                            name="coauthors"
                            className="mt-1 block w-full"
                            placeholder="John Dave, CADT&#10;Jane Smith, RUPP"
                            rows={6}
                            value={data.coauthors || ''}
                            onChange={onChange}
                        />
                        <InputError className="mt-2" message={errors.coauthors} />
                    </div>
                </div>
                {/* Corresponding Author under Co-Authors */}
                <div className="mt-10 space-y-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        Corresponding Author Information
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Please provide the details of the Corresponding author for the submission.
                    </p>
                    {/* Grid: Corresponding Name & Email above Institute & Role (if any) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="correspond-name" value="Corresponding Author Name" />
                            <TextInput
                                id="correspond-name"
                                name="correspond_name"
                                className="mt-1 block w-full"
                                placeholder="Enter corresponding author name"
                                required
                                autoComplete="correspond-name"
                                value={data.correspond_name || ''}
                                onChange={onChange}
                            />
                            <InputError className="mt-2" message={errors.correspond_name} />
                        </div>
                        <div>
                            <InputLabel htmlFor="correspond-email" value="Corresponding Author Email" />
                            <TextInput
                                id="correspond-email"
                                name="correspond_email"
                                className="mt-1 block w-full"
                                placeholder="Enter corresponding author email"
                                required
                                autoComplete="correspond-email"
                                value={data.correspond_email || ''}
                                onChange={onChange}
                            />
                            <InputError className="mt-2" message={errors.correspond_email} />
                        </div>
                        {/* If you want to add more fields (like institute/role) for corresponding author, add here */}
                    </div>
                </div>
            </div>
        </section>
    );
}