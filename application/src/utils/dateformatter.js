export const dateformatter = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
    }).format(date).replace(/\//g, '-');
    return formattedDate;
}