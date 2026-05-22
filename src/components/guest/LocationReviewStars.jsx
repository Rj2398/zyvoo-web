const LocationReviewStars = ({ rating }) => {
    const maxStars = 5;
    const safeRating = Math.min(Math.max(Math.round(parseFloat(rating)), 0), maxStars); 
    const filledStars = safeRating; 
    const emptyStars = maxStars - filledStars;

    return (
        <div className="location-reviews-list-right-star">
            {[...Array(filledStars)].map((_, index) => (
                <img
                    key={`filled-${index}`}
                    src="/images/locations-grid/star-icon.svg"
                    loading="lazy" alt="Filled Star"
                />
            ))}

            {/* Render empty stars */}
            {[...Array(emptyStars)].map((_, index) => (
                <img
                    key={`empty-${index}`}
                    src="/images/locations-grid/star-icon-blank.svg"
                    loading="lazy" alt="Empty Star"
                />
            ))}
        </div>
    );
};

export default LocationReviewStars;