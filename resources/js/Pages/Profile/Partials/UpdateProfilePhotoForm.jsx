import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Transition } from '@headlessui/react';
import { useForm, usePage } from '@inertiajs/react';
import { useRef, useState, useEffect } from 'react';
import Croppie from 'croppie';
import 'croppie/croppie.css';

export default function UpdateProfilePhotoForm({ className = '' }) {
    const fileInput = useRef();
    const croppieContainer = useRef();
    const [photoPreview, setPhotoPreview] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [croppedImage, setCroppedImage] = useState(null);
    const [croppieInstance, setCroppieInstance] = useState(null);
    
    const { auth } = usePage().props;
    const currentPhoto = auth.user.profile_photo_url;
    const userName = auth.user.name;

    const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
        photo: null,
    });

    // Generate user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2) // Take first 2 initials
            .join('');
    };

    // Check if user has a profile photo
    const hasProfilePhoto = () => {
        return croppedImage || (currentPhoto && !currentPhoto.includes('default-avatar'));
    };

    // Initialize Croppie when showing cropper
    useEffect(() => {
        if (showCropper && photoPreview && croppieContainer.current) {
            const croppie = new Croppie(croppieContainer.current, {
                viewport: { width: 300, height: 300, type: 'circle' },
                boundary: { width: 400, height: 400 },
                showZoomer: true,
                enableOrientation: true,
                enableResize: false,
                mouseWheelZoom: 'ctrl'
            });

            croppie.bind({
                url: photoPreview
            });

            setCroppieInstance(croppie);

            return () => {
                if (croppie) {
                    croppie.destroy();
                }
            };
        }
    }, [showCropper, photoPreview]);

    const selectNewPhoto = () => {
        fileInput.current.click();
    };

    const updatePhoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrop = async () => {
        if (croppieInstance) {
            try {
                const croppedImageUrl = await croppieInstance.result({
                    type: 'base64',
                    size: 'viewport',
                    format: 'jpeg',
                    quality: 0.9
                });
                
                setCroppedImage(croppedImageUrl);
                
                // Convert base64 to blob for upload
                const response = await fetch(croppedImageUrl);
                const blob = await response.blob();
                const file = new File([blob], 'profile-photo.jpg', { type: 'image/jpeg' });
                
                setData('photo', file);
                setShowCropper(false);
            } catch (error) {
                console.error('Error cropping image:', error);
            }
        }
    };

    const cancelCrop = () => {
        setShowCropper(false);
        setPhotoPreview(null);
        setCroppedImage(null);
        setData('photo', null);
        if (croppieInstance) {
            croppieInstance.destroy();
            setCroppieInstance(null);
        }
        fileInput.current.value = '';
    };

    const deletePhoto = () => {
        setData('photo', null);
        setPhotoPreview(null);
        setCroppedImage(null);
        setShowCropper(false);
        if (croppieInstance) {
            croppieInstance.destroy();
            setCroppieInstance(null);
        }
        fileInput.current.value = '';
    };

    const submit = (e) => {
        e.preventDefault();
        
        post(route('profile.photo.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setCroppedImage(null);
                setPhotoPreview(null);
                setShowCropper(false);
                if (croppieInstance) {
                    croppieInstance.destroy();
                    setCroppieInstance(null);
                }
                fileInput.current.value = '';
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Profile Photo
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Update your account's profile photo. Drag to reposition and use the slider to zoom.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Current Photo Display */}
                <div className="flex items-center space-x-6">
                    <div className="shrink-0 relative">
                        {hasProfilePhoto() ? (
                            <img
                                className="h-20 w-20 object-cover rounded-full border-4 border-gray-300 shadow-lg"
                                src={croppedImage || currentPhoto}
                                alt="Current profile photo"
                            />
                        ) : (
                            <div className="h-20 w-20 rounded-full border-4 border-gray-300 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white text-lg font-bold">
                                    {getUserInitials(userName)}
                                </span>
                            </div>
                        )}
                        
                        {/* Photo indicator badge */}
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                            {hasProfilePhoto() ? (
                                <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            )}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex space-x-3">
                            <SecondaryButton 
                                type="button" 
                                onClick={selectNewPhoto}
                                disabled={showCropper}
                            >
                                {hasProfilePhoto() ? 'Change Photo' : 'Add Photo'}
                            </SecondaryButton>
                            
                            {(data.photo || croppedImage || hasProfilePhoto()) && (
                                <SecondaryButton 
                                    type="button" 
                                    onClick={deletePhoto}
                                    className="text-red-600 hover:text-red-500"
                                >
                                    Remove Photo
                                </SecondaryButton>
                            )}
                        </div>
                        
                        <div className="space-y-1">
                            <p className="text-xs text-gray-500">
                                JPG, JPEG, PNG up to 2MB. Image will be cropped to circle.
                            </p>
                            {!hasProfilePhoto() && (
                                <p className="text-xs text-blue-600">
                                    Currently showing your initials: <strong>{getUserInitials(userName)}</strong>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    ref={fileInput}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={updatePhoto}
                    className="hidden"
                />

                {/* Croppie Modal */}
                {showCropper && photoPreview && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                Crop Your Photo
                            </h3>
                            
                            <div className="mb-6 flex justify-center">
                                <div 
                                    ref={croppieContainer}
                                    className="w-full h-96 mx-auto"
                                    style={{
                                        '--croppie-boundary-margin': '0 auto',
                                        '--croppie-slider-margin-top': '20px'
                                    }}
                                />
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <SecondaryButton 
                                    type="button" 
                                    onClick={cancelCrop}
                                >
                                    Cancel
                                </SecondaryButton>
                                <PrimaryButton 
                                    type="button" 
                                    onClick={handleCrop}
                                >
                                    Crop Photo
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                )}

                <InputError message={errors.photo} className="mt-2" />

                {/* Save Button */}
                {data.photo && croppedImage && (
                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Uploading...' : 'Save Photo'}
                        </PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-green-600">
                                Photo updated successfully!
                            </p>
                        </Transition>
                    </div>
                )}
            </form>

            {/* Custom Croppie Styles using CSS-in-JS */}
            <style jsx>{`
                .croppie-container .cr-boundary {
                    margin: 0 auto;
                }
                
                .croppie-container .cr-slider-wrap {
                    margin-top: 1.25rem;
                }
                
                .croppie-container .cr-viewport {
                    border: 2px solid #e5e7eb;
                    box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.3);
                }
                
                .croppie-container .cr-slider {
                    background: #f3f4f6;
                    border: 1px solid #d1d5db;
                    border-radius: 0.375rem;
                }
                
                .croppie-container .cr-slider::-webkit-slider-thumb {
                    background: #3b82f6;
                    border: 2px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </section>
    );
}