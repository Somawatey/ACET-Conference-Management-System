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
import React, { useEffect, useState } from "react";


export default function RoleCreateEdit({ role, permissions }) {
  const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
    useForm({
      name: role?.name || '',
      permissions: [],
    });
    
  // Define permission categories
  const categories = {
    "role": ["role-list", "role-create", "role-edit", "role-delete"],
    "user": ["user-list", "user-create", "user-edit", "user-delete"],
    "agenda": ["agenda-list", "agenda-create", "agenda-edit", "agenda-delete"],
    "paper": ["paper-list", "paper-create", "paper-edit", "paper-delete", "paper-assign", "paper-review", "paper-approve", "paper-reject"],
    "conferences": ["conference-list", "conference-create", "conference-edit", "conference-delete"],
    "review": ["review-list", "review-create", "review-edit", "review-delete", "review-history", "your-reviews"],
    "dashboard": ["dashboard"],
    "other": []
  };
  
  // Group permissions by category
  const [categorizedPermissions, setCategorizedPermissions] = useState({});
  const [activeCategory, setActiveCategory] = useState('role');

  useEffect(() => {
    if (role !== undefined) {
      const permIds = role.permissions.map(p => p.id);
      setData('permissions', permIds);
    }
    
    // Group permissions by category
    const grouped = {};
    Object.keys(categories).forEach(category => {
      grouped[category] = permissions.filter(p => 
        categories[category].includes(p.name)
      );
    });
    
    // Add any permissions that don't match predefined categories to "other"
    const allCategorizedPerms = Object.values(categories).flat();
    const uncategorizedPerms = permissions.filter(p => !allCategorizedPerms.includes(p.name));
    if (uncategorizedPerms.length > 0) {
      grouped.other = [...uncategorizedPerms];
    }
    
    setCategorizedPermissions(grouped);
  }, [role, permissions]);

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
  
  const setCategory = (category) => {
    setActiveCategory(category);
  };
  
  const handleSelectAllInCategory = (category, isChecked) => {
    const categoryPermIds = categorizedPermissions[category].map(p => p.id);
    if (isChecked) {
      // Add all permissions from this category
      const newPermissions = [...new Set([...data.permissions, ...categoryPermIds])];
      setData('permissions', newPermissions);
    } else {
      // Remove all permissions from this category
      setData('permissions', data.permissions.filter(id => !categoryPermIds.includes(id)));
    }
  };
  
  const handleSelectAllPermissions = (isChecked) => {
    if (isChecked) {
      // Select all permissions across all categories
      const allPermissionIds = permissions.map(p => p.id);
      setData('permissions', allPermissionIds);
    } else {
      // Deselect all permissions
      setData('permissions', []);
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
      <section className=" h-screen bg-white dark:bg-white">
        <div className="flex w-full justify-center px-6">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-dark text-center">
                {headWeb}
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-grey-900">Role Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-grey-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter role name"
                    required
                  />
                  <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                  <label htmlFor="permissions" className="block mb-2 text-sm font-medium text-gray-900 dark:text-grey-900">
                    <span className='text-danger'>*</span>Permissions
                  </label>
                  
                  {/* Tabs Navigation with Select All Button */}
                  <div className="flex flex-wrap items-center border-b border-gray-200">
                    <ul className="flex flex-wrap -mb-px flex-grow">
                      {Object.keys(categorizedPermissions).map(category => {
                        if (categorizedPermissions[category]?.length === 0) return null;
                        
                        // Check if all permissions in this category are selected
                        const categoryPermIds = categorizedPermissions[category].map(p => p.id);
                        const allSelected = categoryPermIds.every(id => data.permissions.includes(id));
                        const someSelected = categoryPermIds.some(id => data.permissions.includes(id));
                        
                        const isActive = category === activeCategory;
                        
                        return (
                          <li key={category} className="mr-2">
                            <button 
                              type="button"
                              onClick={() => setCategory(category)}
                              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-t-lg 
                                ${isActive 
                                  ? 'border-b-2 border-blue-600 text-blue-600 bg-gray-100' 
                                  : 'border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300'
                                }`}
                            >
                              <span className="mr-2">
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </span>
                              {allSelected && (
                                <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                                  ✓
                                </span>
                              )}
                              {!allSelected && someSelected && (
                                <span className="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                                  ⋯
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                    
                    {/* Select All Permissions Button */}
                    <div className="ml-auto mb-px">
                      <div className="flex items-center py-2 px-4 bg-gray-100 rounded-t-lg border border-gray-300">
                        <input
                          type="checkbox"
                          id="select-all-permissions"
                          onChange={(e) => handleSelectAllPermissions(e.target.checked)}
                          checked={permissions.length > 0 && data.permissions.length === permissions.length}
                          className="mr-2 h-4 w-4 text-blue-600"
                        />
                        <label htmlFor="select-all-permissions" className="text-sm font-bold text-gray-900">
                          Select All Permissions
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tab Content */}
                  <div className="mt-4">
                    {Object.keys(categorizedPermissions).map(category => {
                      if (categorizedPermissions[category]?.length === 0 || category !== activeCategory) return null;
                      
                      // Check if all permissions in this category are selected
                      const categoryPermIds = categorizedPermissions[category].map(p => p.id);
                      const allSelected = categoryPermIds.every(id => data.permissions.includes(id));
                      
                      return (
                        <div key={category} className="mb-3">
                          <div className="flex items-center py-1 px-2 mb-2 border-b">
                            <input
                              type="checkbox"
                              id={`category-${category}`}
                              onChange={(e) => handleSelectAllInCategory(category, e.target.checked)}
                              checked={allSelected}
                              className="mx-2"
                            />
                            <label htmlFor={`category-${category}`} className="text-sm font-bold leading-6 text-gray-900 flex-1 cursor-pointer">
                              Select All {category.charAt(0).toUpperCase() + category.slice(1)} Permissions
                            </label>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                            {categorizedPermissions[category].map(permission => (
                              <div key={permission.id} className="py-1 px-2 border rounded hover:bg-gray-50">
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
                        </div>
                      );
                    })}
                  </div>
                  
                  <InputError className="mt-2" message={errors.permissions} />
                </div>

                <div className="flex space-x-4">
                  <Link
                    href={route('roles.index')}
                    className="w-1/3 text-gray-700 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-gray-300"
                  >
                    Back to Roles
                  </Link>
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-2/3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    {processing ? (role?.id ? 'Updating...' : 'Creating...') : (role?.id ? 'Update Role' : 'Create Role')}
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