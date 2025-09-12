import React, { useRef } from 'react';

export default function PaperUpload({ className = '', onChange, file, error, isEdit = false, currentFileName = null }) {
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
                {isEdit ? 'Update Paper (PDF) - Optional' : 'Upload Paper (PDF)'}
            </label>
            
            {/* Show current file in edit mode */}
            {isEdit && currentFileName && !file && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-blue-900">Current file:</p>
                            <p className="text-sm text-blue-700">{currentFileName}</p>
                        </div>
                    </div>
                </div>
            )}
            
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
                    {isEdit 
                        ? "Drag & drop a new PDF here to replace current file, or "
                        : "Drag & drop your PDF here, or "
                    }<span className="text-indigo-600 underline">browse</span>
                </p>
                {file && (
                    <p className="text-green-600 text-xs mt-2">
                        {isEdit ? "New file selected: " : "Selected: "}{file.name}
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
            {isEdit && (
                <p className="text-gray-500 text-xs mt-2">
                    Leave empty to keep the current file unchanged.
                </p>
            )}
        </div>
    );
}