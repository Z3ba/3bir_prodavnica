const Rating = ({ value, text }) => {
    const fullStars = Math.round(value);

    return (
        <div className="rating" aria-label={`Ocena ${value} od 5`}>
            <span>{'★'.repeat(fullStars)}{'☆'.repeat(5 - fullStars)}</span>
            <small>{text}</small>
        </div>
    );
};

export default Rating;
