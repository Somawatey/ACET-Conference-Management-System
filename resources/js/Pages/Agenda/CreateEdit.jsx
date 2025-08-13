import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

const AgendaForm = () => {
    const [formData, setFormData] = useState({
        date: '',
        place: '',
        startTime: '', // No default selected time
        endTime: '',   // No default selected time
        speaker: '',
        topic: '',
    });

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
    };

    const handleDateChange = (event) => {
        const newDate = event.target.value;
        setFormData(prevData => ({
            ...prevData,
            date: newDate,
        }));
        // Hide the calendar after a date is picked
        setIsCalendarOpen(false);
    };

    const timeSlots = [
        '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM',
        '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
        '03:00 PM', '03:30 PM',
    ];

    return (
        <AdminLayout>
            <form
                onSubmit={handleSubmit}
                className="p-10 bg-white rounded-2xl shadow-lg max-w-5xl mx-auto my-12 border border-gray-200"
            >
                <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
                    Create Agenda
                </h2>
                <p className="text-gray-500 text-center mb-8">
                    Fill in the details to schedule your event.
                </p>

                {/* Event Place */}
                <div className='w-full'>
                    <InputLabel htmlFor="place">
                        Choose Place
                    </InputLabel>
                    <TextInput
                        type="text"
                        id="place"
                        name="place"
                        placeholder="Ex: Cosmo Hall"
                        value={formData.place}
                        onChange={handleChange}
                        className="w-full"
                    />
                </div>

                {/* Speaker Info */}
                <div className="mt-2 border-t pt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <InputLabel htmlFor="speaker">
                            Speaker
                        </InputLabel>
                        <TextInput
                            type="text"
                            id="speaker"
                            name="speaker"
                            placeholder="Ex: John Doe"
                            value={formData.speaker}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="topic" className="block text-sm font-medium text-gray-700">
                            Topic
                        </InputLabel>
                        <TextInput
                            type="text"
                            id="topic"
                            name="topic"
                            placeholder="Ex: Natural Language Processing"
                            value={formData.topic}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>
                </div>
                
                {/* Schedule Section */}
                <div className="mt-2 border-t pt-2">
                    <h3 className="text-lg font-semibold text-gray-800 ">
                        Schedule
                    </h3>
                    <div className='flex flex-col justify-center gap-5 items-start'>
                        {/* Calendar Picker */}
                        <div className="grid grid-cols-2 gap-x-10 w-full">
                            <label className="form-control">
                                <div className="label">
                                    <span className="label-text">Choose Date</span>
                                </div>
                                <button
                                    type="button"
                                    className="btn w-full"
                                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                >
                                    {formData.date}
                                </button>
                            </label>
                            <p className="text-center text-sm text-gray-600 border rounded-sm py-2">
                                Selected Date: <span className='font-bold text-blue-600'>{formData.date || 'Not selected'}</span>
                            </p>
                            {isCalendarOpen && (
                                <div className="relative z-10 w-full">
                                    <div className="absolute rounded-box shadow-lg">
                                        <calendar-date class="cally bg-white p-3" onchange={handleDateChange}>
                                            <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
                                            <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
                                            <calendar-month></calendar-month>
                                        </calendar-date>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Start and End Time Slots */}
                        <div className="w-full grid grid-cols-2 gap-10">
                            {/* Start Time Slots */}
                            <div>
                                <InputLabel>Start Time</InputLabel>
                                <ul className="grid grid-cols-2 gap-3">
                                    {timeSlots.map((time, idx) => (
                                        <div key={`start-${idx}`} className='rounded transition hover:scale-105'>
                                            <input
                                                type="radio"
                                                id={`startTime-${idx}`}
                                                name="startTime"
                                                value={time}
                                                checked={formData.startTime === time}
                                                onChange={(e) => handleChange(e)}
                                                className="hidden peer"
                                            />

                                            <label
                                                htmlFor={`startTime-${idx}`}
                                                className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium bg-white border rounded-sm"
                                            >
                                                {time}
                                            </label>
                                        </div>
                                    ))}
                                </ul>
                                <p className="mt-4 text-center text-sm text-gray-600 border rounded-sm py-2">
                                    Selected Start Time: <span className='font-bold text-blue-600'>{formData.startTime || 'Not selected'}</span>
                                </p>
                            </div>

                            {/* End Time Slots */}
                            <div>
                                <InputLabel>End Time</InputLabel>
                                <ul className="grid grid-cols-2 gap-3">
                                    {timeSlots.map((time, idx) => (
                                        <div key={`end-${idx}`} className='rounded transition hover:scale-105'>
                                            <input
                                                type="radio"
                                                id={`endTime-${idx}`}
                                                name="endTime"
                                                value={time}
                                                checked={formData.endTime === time}
                                                onChange={(e) => handleChange(e)}
                                                className="hidden peer"
                                            />
                                            <label
                                                htmlFor={`endTime-${idx}`}
                                                className="inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium bg-white border rounded-lg cursor-pointer transition peer-checked:bg-blue-600 peer-checked:text-white"
                                            >
                                                {time}
                                            </label>
                                        </div>
                                    ))}
                                </ul>
                                <p className="mt-4 text-center text-sm text-gray-600 border rounded-sm py-2">
                                    Selected End Time: <span className='font-bold text-blue-600'>{formData.endTime || 'Not selected'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="mt-4 flex justify-center">
                    <PrimaryButton type="submit">
                        Submit Agenda
                    </PrimaryButton>
                </div>
            </form>
        </AdminLayout>
    );
};

export default AgendaForm;