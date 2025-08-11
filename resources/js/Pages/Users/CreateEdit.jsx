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

export default function UsersCreateEdit({ user = {}, roles = [] }) {
    const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
        useForm({
            name: user?.name || '',
            email: user?.email || '',
            password: '',
            password_confirmation: '',
            roles: user?.roles?.map(role => role.id) || [],
        });
    
    const handleSelectRole = (e) => {
        const value = parseInt(e.target.value);
        setData('roles', [value]); // Single role selection
    };

    const submit = (e) => {
        e.preventDefault();
        if (!user?.id) {
            post(route('users.store'), { 
                preserveState: true,
                onSuccess: () => {
                    reset();
                },
            });
        } else {
            patch(route('users.update', user.id), {
                preserveState: true,
                onSuccess: () => {
                    reset('password', 'password_confirmation');
                },
            });
        }
    };

    const headWeb = user?.id ? 'User Edit' : 'User Create';
    const linksBreadcrumb = [
        { title: 'Home', url: '/' }, 
        { title: 'Users', url: route('users.index') },
        { title: headWeb, url: '' }
    ];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">User Data Management</h3>
                            </div>
                            <form onSubmit={submit}>
                                <div className="card-body">
                                    {/* Name Field */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="name">
                                            <span className="text-danger">*</span> Name
                                        </label>
                                        <input
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            type="text"
                                            name="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="name"
                                            placeholder="Enter full name"
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    {/* Email Field */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="email">
                                            <span className="text-danger">*</span> Email
                                        </label>
                                        <input
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            type="email"
                                            name="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            placeholder="Enter email address"
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    {/* Password Field */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="password">
                                            <span className="text-danger">*</span> Password
                                            {user?.id && <small className="text-muted"> (leave blank to keep current password)</small>}
                                        </label>
                                        <input
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            type="password"
                                            name="password"
                                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                            id="password"
                                            placeholder="Enter password"
                                            {...(!user?.id && { required: true })}
                                        />
                                        <InputError className="mt-2" message={errors.password} />
                                    </div>

                                    {/* Password Confirmation Field */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="password_confirmation">
                                            <span className="text-danger">*</span> Confirm Password
                                        </label>
                                        <input
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            type="password"
                                            name="password_confirmation"
                                            className={`form-control ${errors.password_confirmation ? 'is-invalid' : ''}`}
                                            id="password_confirmation"
                                            placeholder="Confirm password"
                                            {...(!user?.id && { required: true })}
                                        />
                                        <InputError className="mt-2" message={errors.password_confirmation} />
                                    </div>

                                    {/* Role Selection */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="roles">
                                            <span className="text-danger">*</span> Role
                                        </label>
                                        <select
                                            name="roles"
                                            value={data.roles[0] || ''}
                                            onChange={handleSelectRole}
                                            className={`form-control ${errors.roles ? 'is-invalid' : ''}`}
                                            id="roles"
                                            required
                                        >
                                            <option value="">Select a role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.roles} />
                                    </div>
                                </div>

                                <div className="card-footer clearfix">
                                    <div className="d-flex justify-content-between">
                                        <Link 
                                            href={route('users.index')} 
                                            className="btn btn-secondary"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            disabled={processing}
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            {processing
                                                ? user?.id
                                                    ? 'Updating...'
                                                    : 'Creating...'
                                                : user?.id
                                                    ? 'Update User'
                                                    : 'Create User'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Success Message */}
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <div className="alert alert-success mt-3">
                                    User {user?.id ? 'updated' : 'created'} successfully!
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </section>
        </AdminLayout>
    );
}