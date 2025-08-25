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
                if (place.formatted_address) {
                    // Update the form's state with the selected address.
                    setData('location', place.formatted_address);
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
            <section className="bg-white dark:bg-white">
              <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                  <div className="p-6 space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-dark text-center">
                        {headWeb}
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                      <div>
                        <label htmlFor="conf_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Conference Name</label>
                        <input
                          type="text"
                          name="conf_name"
                          id="conf_name"
                          value={data.conf_name}
                          onChange={(e) => setData('conf_name', e.target.value)}
                          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="ACET Conference 2025"
                          required
                        />
                        <InputError className="mt-2" message={errors.conf_name} />
                      </div>
                      
                      <div>
                        <label htmlFor="topic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Topic</label>
                        <input
                          type="text"
                          name="topic"
                          id="topic"
                          value={data.topic}
                          onChange={(e) => setData('topic', e.target.value)}
                          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          placeholder="Technology Innovation"
                          required
                        />
                        <InputError className="mt-2" message={errors.topic} />
                      </div>

                      <div>
                        <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Conference Date</label>
                        <input
                          type="date"
                          name="date"
                          id="date"
                          value={data.date}
                          onChange={(e) => setData('date', e.target.value)}
                          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          required
                        />
                        <InputError className="mt-2" message={errors.date} />
                      </div>

                      <div >
                        <label htmlFor="location" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Location</label>
                        <input
                            type="text"
                            name="location"
                            ref={locationInputRef}
                            id="location"
                            value={data.location} // Change 'defaultValue' back to 'value'
                            onChange={(e) => setData('location', e.target.value)}                            
                            className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                        <InputError className="mt-2" message={errors.location} />
                        
                      </div >

                      <button
                        type="submit"
                        disabled={processing}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      >
                        {processing ? (conference?.id ? 'Updating...' : 'Creating...') : (conference?.id ? 'Update Conference' : 'Create Conference')}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
        </AdminLayout>
    );
}