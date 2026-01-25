export const dateformatter = (dateString) => {
    if (!dateString || dateString === '') return '';
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
    }).format(date).replace(/\//g, '-');
    return formattedDate;
}