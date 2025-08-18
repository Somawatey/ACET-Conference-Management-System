import AdminLayout from "@/Layouts/AdminLayout";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AgendaForm = () => {
    const [activeTab, setActiveTab] = useState("info");
    const [selectedDate, setSelectedDate] = useState(null);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [title, setTitle] = useState("");
    const [speaker, setSpeaker] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    return (
        <AdminLayout>
            <div className="h-screen px-5 py-10 mt-10">
                {/* Header */}
                <div className="">
                    <h1 className="text-2xl font-bold text-gray-800">Create New Event</h1>
                    <p className="text-gray-600">Fill out the details to schedule an event on the agenda.</p>
                </div>
                
                {/* Card Container */}
                <div className="bg-white p-8 rounded-lg shadow-md">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        {["info", "dateTime", "review"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`-mb-px mr-1 px-4 py-2 border-b-2 text-sm font-medium transition-colors duration-200 ease-in-out
                                    ${activeTab === tab 
                                        ? "border-blue-500 text-blue-600" 
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                    }`
                                }
                            >
                                {tab === "info" ? "1. Information" : tab === "dateTime" ? "2. Date & Time" : "3. Review"}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="pt-6">
                        {/* Info Tab */}
                        {activeTab === "info" && (
                            <div className="space-y-6">
                                <div className="w-full flex gap-5">
                                    <div className="flex-1">
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                        <input
                                            id="title"
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="Enter event title"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="speaker" className="block text-sm font-medium text-gray-700 mb-1">Speaker</label>
                                        <input
                                            id="speaker"
                                            type="text"
                                            value={speaker}
                                            onChange={(e) => setSpeaker(e.target.value)}
                                            placeholder="Enter speaker name"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        id="location"
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="Enter location"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        id="description"
                                        type="text"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Enter event description"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md h-32 resize-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* DateTime Tab */}
                        {activeTab === "dateTime" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Pickers */}
                                <div className="flex flex-col space-y-6">
                                    {/* Date Picker */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                                        <DatePicker
                                            selected={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            dateFormat="PPP"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    {/* Start Time */}
                                    <div>
                                        <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <input
                                            id="start-time"
                                            type="time"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    {/* End Time */}
                                    <div>
                                        <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <input
                                            id="end-time"
                                            type="time"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Right: Preview */}
                                <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Date & Time Preview</h3>
                                    <div className="space-y-2 text-gray-700">
                                        <p>
                                            <span className="font-semibold">Date:</span>{" "}
                                            {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Start Time:</span> {startTime || "Not selected"}
                                        </p>
                                        <p>
                                            <span className="font-semibold">End Time:</span> {endTime || "Not selected"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Review Tab */}
                        {activeTab === "review" && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-gray-800">Review Your Event Details</h2>
                                <div className="space-y-4 text-gray-700">
                                    <p>
                                        <span className="font-semibold">Event Title:</span> {title || "Not provided"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Event Speaker:</span> {speaker || "Not provided"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Location:</span> {location || "Not provided"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Description:</span> {description || "Not provided"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Date:</span>{" "}
                                        {selectedDate ? selectedDate.toLocaleDateString() : "Not selected"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Start Time:</span> {startTime || "Not selected"}
                                    </p>
                                    <p>
                                        <span className="font-semibold">End Time:</span> {endTime || "Not selected"}
                                    </p>
                                </div>
                                <div className="pt-4">
                                    <button className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                                        Submit Event
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AgendaForm;