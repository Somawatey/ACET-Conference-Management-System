export default function Circle({ size = 100, imgSrc, border = true }) {
    return (
        <div
            className={`rounded-full overflow-hidden ${
                border ? 'border border-black' : ''
            }`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
            }}
        >
            {imgSrc ? (
                <img
                    src={imgSrc}
                    alt="Profile"
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="bg-gray-300 w-full h-full" />
            )}
        </div>
    );
}
