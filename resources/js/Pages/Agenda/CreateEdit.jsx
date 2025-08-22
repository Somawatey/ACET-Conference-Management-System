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
        paper_id: datas?.paper_id ? String(datas.paper_id) : "", // Convert to string
        conference_id: datas?.conference_id ? String(datas.conference_id) : "", // Convert to string
        session: datas?.session || "",
        type: datas?.type || "",
        is_active: datas?.is_active ?? true,
        order_index: datas?.order_index ?? 0
    });

    // When datas changes (like when form loads in edit mode), update the form
    useEffect(() => {
        if (datas) {
            // Log what we received to debug
            console.log("Received agenda data:", datas);
            
            // Set selected date
            if (datas.date) {
                setSelectedDate(new Date(datas.date));
            }
        }
    }, [datas]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ensure date is set from selectedDate
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
                    <form onSubmit={handleSubmit}>
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

                                    {/* type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Type</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData("type", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Choose type --</option>
                                            {type && type.length > 0 && type.map((typeItem) => (
                                                <option key={typeItem} value={typeItem}>
                                                    {typeItem}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                                    </div>
                                </div>

                                {/* Title, Speaker, Location, Description */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData("title", e.target.value)}
                                            placeholder="Enter event title"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData("location", e.target.value)}
                                        placeholder="Enter location"
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
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-50 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors mt-4"
                                >
                                    {processing ? "Submitting..." : datas?.id ? "Update Event" : "Submit Event"}
                                </button>
                            </div>
                        )}

                        {/* DateTime Tab */}
                        {activeTab === "dateTime" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col space-y-6">
                                    <div className="grid grid-cols-2">
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                                            <DatePicker
                                                selected={selectedDate}
                                                onChange={(date) => {
                                                    setSelectedDate(date);
                                                    setData("date", date ? date.toISOString().split('T')[0] : '');
                                                }}
                                                dateFormat="PPP"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            type="time"
                                            value={data.start_time}
                                            onChange={(e) => setData("start_time", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            type="time"
                                            value={data.end_time}
                                            onChange={(e) => setData("end_time", e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Date & Time Preview</h3>
                                    <p><strong>Date:</strong> {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}</p>
                                    <p><strong>Start Time:</strong> {data.start_time || "Not selected"}</p>
                                    <p><strong>End Time:</strong> {data.end_time || "Not selected"}</p>
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-50 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors mt-4"
                                >
                                    {processing ? "Submitting..." : datas?.id ? "Update Event" : "Submit Event"}
                                </button>
                            </div>
                        )}

                        {/* Review Tab */}
                        {activeTab === "review" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800">Review Your Event Details</h2>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Paper:</strong> {papers.find(p => p.id == data.paper_id)?.paper_title || "Not selected"}</p>
                                    <p><strong>Conference:</strong> {conferences.find(c => c.id == data.conference_id)?.conf_name || "Not selected"}</p>
                                    <p><strong>Type:</strong> {data.type || "Not selected"}</p>
                                    <p><strong>Session:</strong> {data.session || "Not selected"}</p>
                                    <p><strong>Title:</strong> {data.title || "Not provided"}</p>
                                    <p><strong>Speaker:</strong> {data.speaker || "Not provided"}</p>
                                    <p><strong>Location:</strong> {data.location || "Not provided"}</p>
                                    <p><strong>Description:</strong> {data.description || "Not provided"}</p>
                                    <p><strong>Date:</strong> {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}</p>
                                    <p><strong>Start Time:</strong> {data.start_time || "Not selected"}</p>
                                    <p><strong>End Time:</strong> {data.end_time || "Not selected"}</p>
                                </div>
                                <div className="flex space-x-4 mt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 transition-colors"
                                    >
                                        {processing ? "Processing..." : datas?.id ? "Update Event" : "Submit Event"}
                                    </button>
                                    <Link
                                        href={route('agenda.index')}
                                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md shadow-sm hover:bg-gray-400 transition-colors"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
