export function crontime(cron) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const days = [
        'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ];
    const [second, minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ');
    const monthName = month === '*' ? 'Setiap Bulan' : (months[parseInt(month) - 1] || '');

    const dayName = dayOfWeek === '*' ? 'Setiap Hari' : (days[parseInt(dayOfWeek)] || '');
    const dateDisplay = dayOfMonth === '*' ? '' : dayOfMonth;

    const pad = (val) => val === '*' ? '00' : val.padStart(2, '0');
    const timeDisplay = `${pad(hour)}:${pad(minute)}:${pad(second)}`;

    if (dayOfWeek === '*' && dayOfMonth === '*' && month === '*') {
        return `Setiap hari pukul ${timeDisplay}`;
    }

    const datePart = dateDisplay ? `${dateDisplay} ${monthName}` : monthName;
    return `${dayName}, ${datePart} pukul ${timeDisplay}`.replace(/\s+/g, ' ').trim();
}