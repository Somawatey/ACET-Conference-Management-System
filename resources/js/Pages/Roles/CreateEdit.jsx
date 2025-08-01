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
import React, {useEffect} from "react";


export default function RoleCreateEdit({ role, permissions }) {
    const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
        useForm({
            name: role?.name || '',
            permissions: [],
        });

    useEffect(() => {
        if (role !== undefined) {
            const permIds = role.permissions.map(p => p.id);
            setData('permissions', permIds);
        }
    }, [role]);

    const handleSelectPermission = (e) => {
        const id = parseInt(e.target.value);
        if (e.target.checked) {
            if (!data.permissions.includes(id)) {
                setData('permissions', [...data.permissions, id]);
            }
        } else {
            setData('permissions', data.permissions.filter(p => p !== id));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        if (role == undefined) {
            post(route('roles.store'), {
                preserveState: true,
                onFinish: () => reset(),
            });
        } else {
            patch(route('roles.update', role.id), {
                preserveState: true,
                onFinish: () => reset(),
            });
        }
    };

    const headWeb = 'Roles Create';
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
                                    {/* Title Field */}
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="title">
                                            <span className='text-danger'>*</span>Title
                                        </label>
                                        <input
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            type="text"
                                            name="name"
                                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                            id="title"
                                        />
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    {/* Permissions */}
                                    <div className="form-group">
                                        <label className='text-uppercase' htmlFor="permissions">
                                            <span className='text-danger'>*</span>Permissions
                                        </label>
                                        {permissions.map(permission => (
                                            <div key={permission.id}>
                                                <input
                                                    type="checkbox"
                                                    name="permissions"
                                                    value={permission.id}
                                                    id={`perm-${permission.id}`}
                                                    onChange={handleSelectPermission}
                                                    checked={data.permissions.includes(permission.id)}
                                                    className="mx-2"
                                                />
                                                <label htmlFor={`perm-${permission.id}`} className="text-sm font-medium leading-6 text-gray-900">
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))}
                                        <InputError className="mt-2" message={errors.permissions} />
                                    </div>
                                </div>

                                <div className="card-footer clearfix">
                                    <button disabled={processing} type="submit" className="btn btn-primary">
                                        {processing
                                            ? role?.id ? "Updating..." : "Saving..."
                                            : role?.id ? "Update" : "Save"}
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