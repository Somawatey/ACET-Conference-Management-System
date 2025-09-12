import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { router } from '@inertiajs/react';

export default function PublishModal({ isOpen, onClose, paper, isPublished }) {
    const handleConfirm = () => {
        if (isPublished) {
            // Unpublish
            router.post(route('papers.unpublish', paper.id), {}, {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.error('Error unpublishing paper:', errors);
                    // Keep modal open on error
                }
            });
        } else {
            // Publish
            router.post(route('papers.publish', paper.id), {}, {
                onSuccess: () => {
                    onClose();
                },
                onError: (errors) => {
                    console.error('Error publishing paper:', errors);
                    // Keep modal open on error
                }
            });
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                                >
                                    {isPublished ? 'Unpublish Paper' : 'Publish Paper'}
                                </Dialog.Title>

                                <div className="mb-6">
                                    {/* Paper Info */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold text-gray-800 mb-2">Paper Details:</h4>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Title:</span> {paper.paper_title || paper.title || 'Untitled'}
                                        </p>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">ID:</span> #{paper.id}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Current Status:</span> 
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                                isPublished 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {isPublished ? 'Published' : 'Not Published'}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Confirmation Message */}
                                    <div className="mb-4">
                                        {isPublished ? (
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Are you sure you want to <strong>unpublish</strong> this paper? 
                                                        This will remove it from the public published papers list.
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-start space-x-3">
                                                <div className="flex-shrink-0">
                                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-700">
                                                        Are you sure you want to <strong>publish</strong> this paper? 
                                                        This will make it available in the public published papers list.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                                            isPublished
                                                ? 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500'
                                                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        }`}
                                        onClick={handleConfirm}
                                    >
                                        {isPublished ? (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                                </svg>
                                                Unpublish
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                Publish
                                            </>
                                        )}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
