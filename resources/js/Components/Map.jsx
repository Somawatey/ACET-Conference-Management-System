import { useState, useEffect } from "react";

function Map({ location = null, open = false, onClose = () => {} }) {
    // If external control is not being used, use internal state
    const [internalOpen, setInternalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [mapSrc, setMapSrc] = useState(
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509198!2d144.9537353153165!3d-37.81627997975157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11f5b5%3A0x5045675218ceed30!2sMelbourne%20Convention%20and%20Exhibition%20Centre!5e0!3m2!1sen!2sau!4v1616161616161!5m2!1sen!2sau"
    );

    // Effect to update map when location prop changes
    useEffect(() => {
        if (location) {
            const query = encodeURIComponent(location);
            setMapSrc(`https://www.google.com/maps?q=${query}&output=embed`);
            setSearch(location);
        }
    }, [location]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim() !== "") {
            const query = encodeURIComponent(search);
            setMapSrc(`https://www.google.com/maps?q=${query}&output=embed`);
        }
    };

    // Determine if modal should be open (either from props or internal state)
    const isOpen = open || internalOpen;
    const handleClose = () => {
        onClose();
        setInternalOpen(false);
    };

    return (
        <>


            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl relative p-6 pt-8">
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h1 className="text-xl font-bold mb-4">Map</h1>
                        {/* Search form */}
                        <form onSubmit={handleSearch} className="flex gap-2 pb-2">
                            <input
                                type="text"
                                placeholder="Search location"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 border rounded px-2 py-1"
                            />
                            <button
                                type="submit"
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Search
                            </button>
                        </form>
                        <div className="map-container w-full pb-4">
                            <iframe
                                src={mapSrc}
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Map;