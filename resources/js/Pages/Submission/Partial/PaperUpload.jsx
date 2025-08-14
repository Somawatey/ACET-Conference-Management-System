import React, { useRef } from 'react';

export default function PaperUpload({ className = '', onChange, file, error }) {
    const fileInput = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onChange(e.dataTransfer.files[0]);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className={className}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Paper (PDF)
            </label>
            <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
                onClick={() => fileInput.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16v-4m0 0V8a4 4 0 018 0v4m-8 0h8m-8 4h8" />
                </svg>
                <p className="text-gray-600 text-sm mb-1">
                    Drag & drop your PDF here, or <span className="text-indigo-600 underline">browse</span>
                </p>
                {file && (
                    <p className="text-green-600 text-xs mt-2">
                        Selected: {file.name}
                    </p>
                )}
                <input
                    ref={fileInput}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
        </div>
    );
}