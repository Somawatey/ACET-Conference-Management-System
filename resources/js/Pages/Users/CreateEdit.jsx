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

export default function UsersCreateEdit({ user, roles }) {
    const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            roles: user.roles?.map(role => role.id) || [],
        });
    
    const handleSelectRole = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => parseInt(option.value));
        setData(prev => ({ ...prev, roles: selectedOptions }));
    };
    const submit = (e) => {
        e.preventDefault();
        if (!user.id) {
            post(route('users.store'), { preserveState: true }, {
                onFinish: () => {
                    reset();
                },
            });
        } else {
            patch(route('users.update', user.id), {
                onFinish: () => {
                    reset();
                },
            });
        }
    };

    const headWeb = 'User Create'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <section className="content">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card card-outline card-info">
                            <div className="card-header">
                                <h3 className="card-title">Register Data Management</h3>
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
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    {/* Role Selection */}
                                    <div className="form-group">
                                        <label className="text-uppercase" htmlFor="roles">
                                            <span className="text-danger">*</span> Roles
                                        </label>
                                        <select
                                            name="roles"
                                            value={data.roles[0] || ''} // ✅ set the first (or only) role ID
                                            onChange={(e) => setData('roles', [parseInt(e.target.value)])}
                                            className="w-full p-2 border border-gray-300 rounded"
                                        >
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
                                    <button
                                        disabled={processing}
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        {processing
                                            ? user?.id
                                                ? 'Updating...'
                                                : 'Saving...'
                                            : user?.id
                                                ? 'Update'
                                                : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </AdminLayout>
    );
}