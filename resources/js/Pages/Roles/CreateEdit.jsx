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

    const headWeb = role?.id ? 'Edit Role' : 'Create Role';
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    
    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            <Head title={headWeb} />
            <section className="bg-white dark:bg-white">
              <div className=" flex items-center w-full justify-center px-6 m-0 md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 h-[600px]">
                  <div className="p-6 space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-dark text-center">
                      {headWeb}
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                      <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Role Name</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Enter role name"
                          required
                        />
                        <InputError className="mt-2" message={errors.name} />
                      </div>
                      
                      <div>
                        <label htmlFor="permissions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          <span className='text-danger'>*</span>Permissions
                        </label>
                        <div className="border border-gray-300 rounded-lg p-3 max-h-[300px] overflow-y-auto bg-gray-50">
                          {permissions.map(permission => (
                            <div key={permission.id} className="py-1">
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
                        </div>
                        <InputError className="mt-2" message={errors.permissions} />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {processing ? (role?.id ? 'Updating...' : 'Creating...') : (role?.id ? 'Update Role' : 'Create Role')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
        </AdminLayout>
    );
}