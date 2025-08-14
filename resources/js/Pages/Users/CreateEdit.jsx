import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function UsersCreateEdit({ user = {}, roles = [] }) {
    // Manage form state and submission via Inertia's useForm
    const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
        useForm({
            // Initial values (use existing user data when editing)
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            password_confirmation: '',
            // Store selected role IDs (single role enforced below)
            roles: user?.roles?.map(role => role.id) || [],
        });
    // UI: toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    
    // Handle single role selection by keeping only the latest selected ID
    const handleSelectRole = (e) => {
        const value = parseInt(e.target.value);
        setData('roles', [value]); // Single role selection
    };

    // Submit handler: create when no user ID, otherwise update
    const submit = (e) => {
        e.preventDefault();
        if (!user?.id) {
            post(route('users.store'), { 
                preserveState: true,
                onSuccess: () => {
                    reset(); // Clear the form on successful create
                },
            });
        } else {
            patch(route('users.update', user.id), {
                preserveState: true,
                onSuccess: () => {
                    // Keep general data, clear only password fields on successful update
                    reset('password', 'password_confirmation');
                },
            });
        }
    };

    // Page title and breadcrumb trail
    const headWeb = user?.id ? 'User Edit' : 'User Create';
    const linksBreadcrumb = [
        { title: 'Home', url: '/' }, 
        { title: 'Users', url: route('users.index') },
        { title: headWeb, url: '' }
    ];

    return (
        // Layout wrapper with breadcrumb navigation
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            {/* Set the browser page title */}
            <Head title={headWeb} />
            <section className="bg-white dark:bg-white">
              <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-6 sm:p-8">
                                         <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-dark text-center">
                        {headWeb}
                      </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                      <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Reviewer"
                          required
                        />
                        <InputError className="mt-2" message={errors.name} />
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="name@company.com"
                          required
                        />
                        <InputError className="mt-2" message={errors.email} />
                      </div>
                      <div>
    <label htmlFor="roles" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role</label>
    <select
      name="roles"
      id="roles"
      value={data.roles[0] || ''}
      onChange={handleSelectRole}
      className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      required
    >
      <option value="" disabled className="text-gray-400 dark:text-gray-500">Select a role</option>
      {roles.map((role) => (
        <option key={role.id} value={role.id}>{role.name}</option>
      ))}
    </select>
    <InputError className="mt-2" message={errors.roles} />
</div>
                      <div>
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 pr-10 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required={!user?.id}
                          />
                          <button
                            type="button"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-white"
                            onClick={() => setShowPassword((v) => !v)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                              <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
                            </svg>
                          </button>
                        </div>
                        <InputError className="mt-2" message={errors.password} />
                      </div>
                      <div>
                        <label htmlFor="password_confirmation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                        <input
                          type="password"
                          name="password_confirmation"
                          id="password_confirmation"
                          value={data.password_confirmation}
                          onChange={(e) => setData('password_confirmation', e.target.value)}
                          placeholder="••••••••"
                          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required={!user?.id}
                        />
                        <InputError className="mt-2" message={errors.password_confirmation} />
                      </div>
                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {processing ? (user?.id ? 'Updating...' : 'Creating...') : (user?.id ? 'Update User' : 'Create User')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
        </AdminLayout>
    );
}