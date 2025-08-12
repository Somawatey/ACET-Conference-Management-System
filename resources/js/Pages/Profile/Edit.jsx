import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdateProfilePhotoForm from './Partials/UpdateProfilePhotoForm';
import ProfileInfo from './Partials/ProfileInfo';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-white">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Main Grid Layout */}
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-12 auto-rows-auto">
                        {/* Profile Photo - Left sidebar style */}
                        <div className="lg:col-span-6 bg-white p-6 shadow sm:rounded-lg">
                            <UpdateProfilePhotoForm className="ml-3" />
                        </div>
                        <div className="lg:col-span-6 bg-white p-6 shadow sm:rounded-lg">
                            <ProfileInfo className="ml-3"/>
                        </div>

                        {/* Profile Information - Main content area */}
                        <div className="lg:col-span-12 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="ml-2 mr-2"
                            />
                        </div>

                        {/* Password Update - Spans 2 columns */}
                        <div className="lg:col-span-12 bg-white p-4 shadow sm:rounded-lg sm:p-8">
                            <UpdatePasswordForm className="ml-2 mr-2"/>
                        </div>

                        {/* Delete Account - Spans 2 columns */}
                        <div className="lg:col-span-12 bg-white p-4 shadow sm:rounded-lg sm:p-8 border-l-4 border-red-500">
                            <DeleteUserForm className="ml-2 mr-2"/>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}