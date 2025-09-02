import Breadcrumb from '@/Components/Breadcrumb';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import NavLink from '@/Components/NavLink';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transition } from '@headlessui/react';
import { useEffect, useRef, useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function ConferencesCreateEdit({ conference = {} }) {
    const locationInputRef = useRef(null);
    const { google_maps_api_key } = usePage().props; // <-- Get the key

// In your CreateEdit.jsx component

useEffect(() => {
    const scriptId = 'google-maps-script';

    // Guard clause: if the API key is missing, do nothing.
    if (!google_maps_api_key) {
        console.error("Google Maps API key is missing. Please check your backend configuration.");
        return;
    }

    // This function initializes the autocomplete feature.
    const initializeAutocomplete = () => {
        if (window.google && locationInputRef.current) {
            const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
                 // Restricts suggestions to geographical locations
                componentRestrictions: { country: 'kh'},
            });

            // Add the event listener for when a user selects a place.
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.name) {
                    // Update the form's state with the selected address.
                    setData('location', place.name);
                }
            });
        }
    };

    // Check if the script is already on the page.
    if (document.getElementById(scriptId)) {
        initializeAutocomplete(); // If so, just run the initialization.
    } else {
        // If not, create and append the script.
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${google_maps_api_key}&libraries=places`;
        script.async = true;
        script.defer = true;
        // Set the onload callback to our initialization function.
        script.onload = initializeAutocomplete;
        document.body.appendChild(script);
    }

}, [google_maps_api_key]); // Dependency array is correct.

    // Manage form state and submission via Inertia's useForm
    const { data, setData, post, patch, errors, reset, processing, recentlySuccessful } =
        useForm({
            // Initial values (use existing conference data when editing)
            conf_name: conference?.conf_name || '',
            topic: conference?.topic || '',
            date: conference?.date || '',
            location: conference?.location || '',
        });

    // Submit handler: create when no conference ID, otherwise update
    const submit = (e) => {
        e.preventDefault();
        if (!conference?.id) {
            post(route('conferences.store'), { 
                preserveState: true,
                onSuccess: () => {
                    reset(); // Clear the form on successful create
                },
            });
        } else {
            patch(route('conferences.update', conference.id), {
                preserveState: true,
            });
        }
    };

    // Page title and breadcrumb trail
    const headWeb = conference?.id ? 'Conference Edit' : 'Conference Create';
    const linksBreadcrumb = [
        { title: 'Home', url: '/' }, 
        { title: 'Conferences', url: route('conferences.index') },
        { title: headWeb, url: '' }
    ];

    return (
        // Layout wrapper with breadcrumb navigation
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />}>
            {/* Set the browser page title */}
            <Head title={headWeb} />
            <section className="h-screen bg-white dark:bg-white py-4">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg border border-gray-100">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center mb-6">
                      <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h1 className="text-2xl font-bold text-gray-900">
                        {headWeb}
                      </h1>
                    </div>
                    <form className="space-y-6" onSubmit={submit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-1">
                          <div className="mb-6">
                            <label htmlFor="conf_name" className="block mb-2 text-sm font-medium text-gray-900">Conference Name</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                name="conf_name"
                                id="conf_name"
                                value={data.conf_name}
                                onChange={(e) => setData('conf_name', e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="ACET Conference 2025"
                                required
                              />
                            </div>
                            <InputError className="mt-2" message={errors.conf_name} />
                          </div>
                          
                          <div className="mb-6">
                            <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-900">Conference Topic</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                name="topic"
                                id="topic"
                                value={data.topic}
                                onChange={(e) => setData('topic', e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Technology Innovation"
                                required
                              />
                            </div>
                            <InputError className="mt-2" message={errors.topic} />
                          </div>
                        </div>
                        
                        <div className="col-span-1">
                          <div className="mb-6">
                            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900">Conference Date</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <input
                                type="date"
                                name="date"
                                id="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                required
                              />
                            </div>
                            <InputError className="mt-2" message={errors.date} />
                          </div>

                          <div className="mb-6">
                            <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900">Location</label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                              </div>
                              <input
                                type="text"
                                name="location"
                                ref={locationInputRef}
                                id="location"
                                value={data.location}
                                onChange={(e) => setData('location', e.target.value)}
                                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                                placeholder="Enter a location"
                                required
                              />
                            </div>
                            <InputError className="mt-2" message={errors.location} />
                            <p className="mt-1 text-xs text-gray-500">Type to search for a location or enter manually</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-4 border-t pt-6">
                        <Link
                          href={route('conferences.index')}
                          className="text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg text-sm px-5 py-2.5 text-center font-medium"
                        >
                          Cancel
                        </Link>
                        <button
                          type="submit"
                          disabled={processing}
                          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                        >
                          {processing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              {conference?.id ? 'Updating...' : 'Creating...'}
                            </>
                          ) : (
                            <>
                              {conference?.id ? 'Update Conference' : 'Create Conference'}
                              <svg className="w-4 h-4 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                              </svg>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                    <div className="mt-6 bg-gray-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg border-t">
                      <div className="text-xs text-gray-500">
                        <p className="mb-2">
                          <span className="font-medium">Note:</span> Created conferences will be visible to all users with appropriate permissions.
                        </p>
                        <p>
                          <span className="font-medium">Need help?</span> Contact the system administrator if you encounter any issues.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
        </AdminLayout>
    );
}