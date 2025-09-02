import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "@inertiajs/react";

export default function AgendaForm({ datas = null, papers = [], conferences = [], session = [], type = [] }) {
    const [activeTab, setActiveTab] = useState("info");
    const [selectedDate, setSelectedDate] = useState(datas?.date ? new Date(datas.date) : null);

    // Initialize form with existing data
    const { data, setData, post, put, processing, errors } = useForm({
        title: datas?.title || "",
        description: datas?.description || "",
        date: datas?.date || "",
        start_time: datas?.start_time ? datas.start_time.substring(0, 5) : "",
        end_time: datas?.end_time ? datas.end_time.substring(0, 5) : "",
        location: datas?.location || "",
        speaker: datas?.speaker || "",
        paper_id: datas?.paper_id ? String(datas.paper_id) : "",
        conference_id: datas?.conference_id ? String(datas.conference_id) : "",
        session: datas?.session || "",
        type: datas?.type || "",
        is_active: datas?.is_active ?? true,
        order_index: datas?.order_index ?? 0
    });

    // Add this function after your other handler functions (around line 85)
    const handleStartTimeChange = (e) => {
        const startTime = e.target.value;
        setData("start_time", startTime);
        
        // Automatically set end time to 1 hour later
        if (startTime) {
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes, 0, 0);
            
            // Add 1 hour
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
            
            // Format end time as HH:MM
            const endTime = endDate.toTimeString().slice(0, 5);
            setData("end_time", endTime);
        }
    };

    useEffect(() => {
        if (datas) {
            console.log("Received agenda data:", datas);
            
            if (datas.date) {
                setSelectedDate(new Date(datas.date));
            }
        }
    }, [datas]);

    // Handle form submission (only called from review tab)
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedDate && !data.date) {
            setData("date", selectedDate.toISOString().split('T')[0]);
        }
        
        console.log("Submitting data:", data);
        
        if (datas?.id) {
            console.log(`Updating agenda ${datas.id} with put request`);
            put(route("agenda.update", datas.id), {
                onSuccess: () => {
                    console.log("Successfully updated agenda");
                },
                onError: (errors) => {
                    console.error("Update failed with errors:", errors);
                }
            });
        } else {
            console.log("Creating new agenda with post request");
            post(route("agenda.store"), {
                onSuccess: () => {
                    console.log("Successfully created agenda");
                },
                onError: (errors) => {
                    console.error("Creation failed with errors:", errors);
                }
            });
        }
    };

    // Handle next button clicks
    const handleNext = (e) => {
        e.preventDefault();
        
        if (activeTab === "info") {
            // Validate required fields for info tab before proceeding
            if (!data.title.trim()) {
                alert("Please enter an event title before proceeding.");
                return;
            }
            setActiveTab("dateTime");
        } else if (activeTab === "dateTime") {
            // Validate required fields for dateTime tab before proceeding
            if (!selectedDate) {
                alert("Please select a date before proceeding.");
                return;
            }
            if (!data.start_time) {
                alert("Please select a start time before proceeding.");
                return;
            }
            if (!data.end_time) {
                alert("Please select an end time before proceeding.");
                return;
            }
            // Update date in form data before moving to review
            setData("date", selectedDate.toISOString().split('T')[0]);
            setActiveTab("review");
        }
    };

    // Handle previous button clicks
    const handlePrevious = () => {
        if (activeTab === "dateTime") {
            setActiveTab("info");
        } else if (activeTab === "review") {
            setActiveTab("dateTime");
        }
    };

    return (
        <AdminLayout>
            <div className="min-h-screen px-5 py-10 mt-10">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {datas?.id ? "Edit Event" : "Create New Event"}
                        </h1>
                        <p className="text-gray-600">Fill out the details to schedule an event on the agenda.</p>
                    </div>
                    <Link
                        href={route('agenda.index')}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                        Back to List
                    </Link>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6">
                        {["info", "dateTime", "review"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`-mb-px mr-1 px-4 py-2 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out ${
                                    activeTab === tab
                                        ? "border-blue-500 text-blue-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                {tab === "info"
                                    ? "1. Information"
                                    : tab === "dateTime"
                                    ? "2. Date & Time"
                                    : "3. Review"}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div>
                        {/* Info Tab */}
                        {activeTab === "info" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {/* Paper */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Paper</label>
                                        <select
                                            value={data.paper_id}
                                            onChange={(e) => setData("paper_id", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Choose Paper --</option>
                                            {papers.map((paper) => (
                                                <option key={paper.id} value={paper.id}>
                                                    {paper.paper_title}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.paper_id && <p className="text-red-500 text-sm mt-1">{errors.paper_id}</p>}
                                    </div>

                                    {/* Conference */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Conference</label>
                                        <select
                                            value={data.conference_id}
                                            onChange={(e) => setData("conference_id", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Choose Conference --</option>
                                            {conferences.map((conf) => (
                                                <option key={conf.id} value={conf.id}>
                                                    {conf.conf_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.conference_id && <p className="text-red-500 text-sm mt-1">{errors.conference_id}</p>}
                                    </div>
                                </div>

                                {/* Title, Speaker, Location, Description */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            placeholder="Enter event title"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                                        <input
                                            type="text"
                                            value={data.speaker}
                                            onChange={(e) => setData("speaker", e.target.value)}
                                            placeholder="Enter speaker name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        {errors.speaker && <p className="text-red-500 text-sm mt-1">{errors.speaker}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData("location", e.target.value)}
                                        placeholder="Enter room"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        placeholder="Enter event description"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md h-32 resize-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-start   space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        Next: Date & Time
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* DateTime Tab */}
                        {activeTab === "dateTime" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date *</label>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => {
                                                    setSelectedDate(date);
                                                    setData("date", date ? date.toISOString().split('T')[0] : '');
                                                }}
                                                dateFormat="PPP"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                                        </div>
                                        {/* Session */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Session</label>
                                            <select
                                                value={data.session}
                                                onChange={(e) => setData("session", e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">-- Choose Session --</option>
                                                {session && session.length > 0 && session.map((sessionItem) => (
                                                    <option key={sessionItem} value={sessionItem}>
                                                        {sessionItem}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.session && <p className="text-red-500 text-sm mt-1">{errors.session}</p>}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Time *
                                            <span className="text-xs text-gray-500 ml-2">(End time will be automatically set to 1 hour later)</span>
                                        </label>
                                        <input
                                            type="time"
                                            value={data.start_time}
                                            onChange={handleStartTimeChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Time *
                                            <span className="text-xs text-gray-500 ml-2">(Automatically calculated)</span>
                                        </label>
                                        <input
                                            type="time"
                                            value={data.end_time}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                                            required
                                            readOnly
                                        />
                                        <p className="text-xs text-blue-600 mt-1">
                                            Duration: 1 hour (Conference sessions are limited to 1 hour maximum)
                                        </p>
                                        {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Date & Time Preview</h3>
                                    <div className="space-y-3">
                                        <p><strong>Date:</strong> {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}</p>
                                        <p><strong>Start Time:</strong> {data.start_time || "Not selected"}</p>
                                        <p><strong>End Time:</strong> {data.end_time || "Not selected"}</p>
                                        <p><strong>Session:</strong> {data.session || "Not selected"}</p>
                                        
                                        {data.start_time && data.end_time && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Duration:</strong> 1 hour
                                                </p>
                                                <p className="text-xs text-blue-600 mt-1">
                                                    Conference sessions are automatically set to 1 hour duration for optimal scheduling.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Navigation Buttons */}
                                <div className="flex justify-between space-x-4 mt-6 col-span-2">
                                    <button
                                        type="button"
                                        onClick={handlePrevious}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Previous: Information
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        Next: Review
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Review Tab */}
                        {activeTab === "review" && (
                            <form onSubmit={handleSubmit}>
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-gray-800">Review Your Event Details</h2>
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                                            <div>
                                                <p className="mb-2"><strong>Paper:</strong> {papers.find(p => p.id == data.paper_id)?.paper_title || "Not selected"}</p>
                                                <p className="mb-2"><strong>Conference:</strong> {conferences.find(c => c.id == data.conference_id)?.conf_name || "Not selected"}</p>
                                                <p className="mb-2"><strong>Session:</strong> {data.session || "Not selected"}</p>
                                                <p className="mb-2"><strong>Title:</strong> {data.title || "Not provided"}</p>
                                                <p className="mb-2"><strong>Speaker:</strong> {data.speaker || "Not provided"}</p>
                                                <p className="mb-2"><strong>Location:</strong> {data.location || "Not provided"}</p>
                                            </div>
                                            <div>
                                                <p className="mb-2"><strong>Date:</strong> {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}</p>
                                                <p className="mb-2"><strong>Start Time:</strong> {data.start_time || "Not selected"}</p>
                                                <p className="mb-2"><strong>End Time:</strong> {data.end_time || "Not selected"}</p>
                                                <p className="mb-2"><strong>Description:</strong></p>
                                                <p className="text-gray-600 text-sm">{data.description || "Not provided"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Navigation and Submit Buttons */}
                                    <div className="flex justify-between space-x-4 mt-6">
                                        <button
                                            type="button"
                                            onClick={handlePrevious}
                                            className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Previous: Date & Time
                                        </button>
                                        <div className="flex space-x-4">
                                            <Link
                                                href={route('agenda.index')}
                                                className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 transition-colors"
                                            >
                                                Cancel
                                            </Link>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {datas?.id ? "Update Event" : "Create Event"}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
