import Breadcrumb from '@/Components/Breadcrumb';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import NavLink from '@/Components/NavLink';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SecondaryButtonLink from '@/Components/SecondaryButtonLink';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import moment from 'moment';
import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function AgendaPage({ agendas, filters }) {
    const dataList = agendas.data ?? [];
    const { auth } = usePage().props;
    const can = auth?.can ?? {}; 
    
    // Add search and filter state variables
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [filterId, setFilterId] = useState(filters?.filter_id || '');
    const [sortBy, setSortBy] = useState(filters?.sort_by || 'date');
    const [sortOrder, setSortOrder] = useState(filters?.sort_order || 'asc');
    
    // Your existing state...
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({});
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({
            id: '',
            title: ''
        });
    const [viewingSchedule, setViewingSchedule] = useState(false);
    const [selectedAgenda, setSelectedAgenda] = useState(null);

    // Add this function to handle opening the view modal
    const viewScheduleDetails = (agendaDetail) => {
        setSelectedAgenda(agendaDetail);
        setViewingSchedule(true);
    };

    // Add this function to close the view modal
    const closeViewModal = () => {
        setViewingSchedule(false);
        setSelectedAgenda(null);
    };

    // Function to handle search and filter
    const handleSearch = () => {
        router.get(route('agenda.index'), {
            search: searchTerm,
            filter_id: filterId,
            sort_by: sortBy,
            sort_order: sortOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Function to handle sorting
    const handleSort = (column) => {
        const newSortOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        
        router.get(route('agenda.index'), {
            search: searchTerm,
            filter_id: filterId,
            sort_by: column,
            sort_order: newSortOrder,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Function to clear filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilterId('');
        setSortBy('date');
        setSortOrder('asc');
        
        router.get(route('agenda.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    const formatDate = (datetime) => {
        return moment(datetime).format("DD/MM/YYYY");
    };
    
    const formatTime = (time) => {
        return moment(time, "HH:mm:ss").format("hh:mm A");
    };
    const headWeb = 'Agenda List'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <div className="h-full font-sans">
                <div className="max-w-screen-xl mx-auto">
                    <div className="px-5">
                        {/*-- Search and Filter Section --*/}
                        <div className="flex gap-4 w-full mb-4 bg-white p-4 rounded-lg shadow-sm border">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {/* Search Input */}
                                <div className='col-span-2'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Search title, speaker, location..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                {/* Filter by ID */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Filter by ID
                                    </label>
                                    <input
                                        type="number"
                                        value={filterId}
                                        onChange={(e) => setFilterId(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Enter agenda ID..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                
                                {/* Sort By */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort By
                                    </label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="date">Date</option>
                                        <option value="id">ID</option>
                                        <option value="title">Title</option>
                                        <option value="speaker">Speaker</option>
                                    </select>
                                </div>

                                {/* Sort Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Order
                                    </label>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="asc">Ascending</option>
                                        <option value="desc">Descending</option>
                                    </select>
                                </div>

                            </div>
                            {/* Action Buttons */}
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={handleSearch}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-300 text-sm"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        {/*-- Create Agenda Section --*/}
                        <div className="w-full flex gap-5 mb-4">
                            {/* This can be a Link to a create page or trigger a modal */}
                            {can['agenda-create'] && (
                                <Link
                                    href={route('agenda.create')}
                                    className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                                >
                                    Create Agenda
                                </Link>
                            )}
                            <button 
                                className="bg-green-500 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300 inline-flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Download All
                            </button>
                        </div>

                        {/*-- Agenda Table --*/}
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full">
                                {/*-- Table Header --*/}
                                <thead className="bg-[#E5E7EB] text-black uppercase text-sm">
                                    <tr>
                                        <th className='text-left p-4'>ID</th>
                                        <th className='text-left p-4'>Title</th>
                                        <th className='text-left p-4'>Conference</th>
                                        <th className='text-left p-4'>Date</th>
                                        <th className='text-left p-4'>Time</th>
                                        <th className='text-left p-4'>Location</th>
                                        <th className='text-left p-4'>Speaker</th>
                                        <th className='text-left p-4'>Actions</th>
                                    </tr>
                                </thead>
                                {/*-- Table Body --*/}
                                <tbody className="bg-white text-gray-700">
                                    {dataList.length > 0 ? (
                                        dataList.map((agenda) => (
                                            <tr key={agenda.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-4">{agenda.id}</td>
                                                <td className="p-4 font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900">{agenda.title}</span>
                                                        {agenda.description && (
                                                            <span className="text-sm text-gray-500 truncate max-w-xs">
                                                                {agenda.description.length > 50 
                                                                    ? `${agenda.description.substring(0, 50)}...` 
                                                                    : agenda.description
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {agenda.conference ? (
                                                        <Link href={route('conferences.show', agenda.conference.id)} className="text-blue-600 hover:underline">
                                                            {agenda.conference.conf_name || agenda.conference.title}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No conference</span>
                                                    )}
                                                </td>
                                                <td className="p-4">{formatDate(agenda.date)}</td>
                                                <td className="p-4">
                                                    <div className="flex flex-col text-sm">
                                                        <span className="text-green-600">{formatTime(agenda.start_time)}</span>
                                                        <span className="text-red-600">{formatTime(agenda.end_time)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {agenda.location ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {agenda.location}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No location</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {agenda.speaker ? (
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold mr-2">
                                                                {agenda.speaker.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm">{agenda.speaker}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No speaker</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        {/* View Button */}
                                                        <button 
                                                            onClick={() => viewScheduleDetails(agenda)} 
                                                            className="text-gray-600 hover:text-blue-600"
                                                            title="View Details"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                        </button>
                                                        
                                                        {/* Edit Button */}
                                                        {can['agenda-edit'] && (
                                                            <Link href={route('agenda.edit', agenda.id)} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                        
                                                        {/* Delete Button */}
                                                        {can['agenda-delete'] && (
                                                            <button onClick={() => confirmDataDeletion(agenda)} className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className="text-center p-8">
                                                <div className="flex flex-col items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-gray-500 text-lg">No agenda items found</p>
                                                    <p className="text-gray-400 text-sm">Create your first agenda item to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/*-- Pagination --*/}
                        <div className='flex justify-between items-center pb-5'>
                            <div className='mt-4 flex flex-col items-start'>
                                <div>
                                    <Pagination links={agendas.links} />
                                </div>
                                <div className="mt-2 w-full text-sm text-gray-600">
                                    Showing {agendas.from || 0} to {agendas.to || 0} of {agendas.total || 0} results
                                    {filters?.search && (
                                        <span className="ml-2">
                                            | Searching for: <strong>"{filters.search}"</strong>
                                        </span>
                                    )}
                                    {filters?.filter_id && (
                                        <span className="ml-2">
                                            | ID: <strong>{filters.filter_id}</strong>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*-- Delete Confirmation Modal --*/}
                {confirmingDataDeletion && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
                        <div className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.867-.833-2.464 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                            </div>
                            <p className="mb-4">Are you sure you want to delete the agenda item "<strong>{deleteData.title}</strong>"? This action cannot be undone.</p>
                            {errors.id && <p className="text-red-500 text-sm mt-2">{errors.id}</p>}
                            <div className="mt-6 flex justify-end space-x-4">
                                <button 
                                    onClick={closeModal} 
                                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={deleteDataRow} 
                                    disabled={processing} 
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:bg-red-400 transition duration-200"
                                >
                                    {processing ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* View Schedule Modal */}
                {viewingSchedule && selectedAgenda && (
                    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center overflow-y-auto py-10">
                        <div className="bg-white text-black rounded-lg shadow-xl w-full max-w-4xl m-4">
                            {/* Modal Header */}
                            <div className="bg-gray-100 px-6 py-4 rounded-t-lg flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedAgenda.title}</h2>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {formatDate(selectedAgenda.date)} | {formatTime(selectedAgenda.start_time)} - {formatTime(selectedAgenda.end_time)}
                                    </p>
                                </div>
                                <button 
                                    onClick={closeViewModal} 
                                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Modal Body */}
                            <div className="p-6 max-h-[70vh] overflow-y-auto">
                                {/* Event Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Event Details</h3>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Type</td>
                                                    <td>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            selectedAgenda.type === 'session' ? 'bg-blue-100 text-blue-800' : 
                                                            selectedAgenda.type === 'keynote' ? 'bg-purple-100 text-purple-800' : 
                                                            selectedAgenda.type === 'workshop' ? 'bg-green-100 text-green-800' : 
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {selectedAgenda.type?.charAt(0).toUpperCase() + selectedAgenda.type?.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Session</td>
                                                    <td>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            selectedAgenda.session === 'morning' ? 'bg-yellow-100 text-yellow-800' : 
                                                            selectedAgenda.session === 'afternoon' ? 'bg-orange-100 text-orange-800' : 
                                                            'bg-indigo-100 text-indigo-800'
                                                        }`}>
                                                            {selectedAgenda.session?.charAt(0).toUpperCase() + selectedAgenda.session?.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Speaker</td>
                                                    <td>{selectedAgenda.speaker || 'Not specified'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Location</td>
                                                    <td>
                                                        {selectedAgenda.location ? (
                                                            <div className="flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                {selectedAgenda.location}
                                                            </div>
                                                        ) : 'Not specified'}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-3">Conference Information</h3>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Conference</td>
                                                    <td>{selectedAgenda.conference?.conf_name || 'Unknown'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Paper</td>
                                                    <td>{selectedAgenda.paper?.paper_title || 'Not associated'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Created</td>
                                                    <td>{selectedAgenda.created_at ? formatDate(selectedAgenda.created_at) : 'Unknown'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-2 pr-4 font-medium text-gray-500 align-top">Last Updated</td>
                                                    <td>{selectedAgenda.updated_at ? formatDate(selectedAgenda.updated_at) : 'Unknown'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Description</h3>
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        {selectedAgenda.description ? (
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedAgenda.description}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">No description provided</p>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Schedule Table */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Schedule Details</h3>
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {formatTime(selectedAgenda.start_time)} - {formatTime(selectedAgenda.end_time)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="font-medium text-gray-900">{selectedAgenda.title}</div>
                                                    {selectedAgenda.speaker && (
                                                        <div className="text-gray-500 text-xs mt-1">Presenter: {selectedAgenda.speaker}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        selectedAgenda.session === 'morning' ? 'bg-yellow-100 text-yellow-800' : 
                                                        selectedAgenda.session === 'afternoon' ? 'bg-orange-100 text-orange-800' : 
                                                        'bg-indigo-100 text-indigo-800'
                                                    }`}>
                                                        {selectedAgenda.session?.charAt(0).toUpperCase() + selectedAgenda.session?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {selectedAgenda.location || 'TBA'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            {/* Modal Footer */}
                            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-between">
                                <div className='flex space-x-3'>
                                    <button 
                                        className="bg-green-500 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300 inline-flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        Download All
                                    </button>
                                    <div className="flex items-center text-gray-500 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        ID: {selectedAgenda.id}
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    {can['agenda-edit'] && (
                                        <Link 
                                            href={route('agenda.edit', selectedAgenda.id)} 
                                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring ring-blue-300 disabled:opacity-25 transition"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </Link>
                                    )}
                                    <button
                                        onClick={closeViewModal}
                                        className="inline-flex items-center px-4 py-2 bg-gray-300 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-400 active:bg-gray-500 focus:outline-none focus:border-gray-500 focus:ring ring-gray-300 disabled:opacity-25 transition"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}