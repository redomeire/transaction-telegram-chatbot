export function crontime(cron) {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const days = [
        'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ];

    const parts = cron.trim().split(/\s+/);
    if (parts.length < 5 || parts.length > 6) return 'Format cron tidak valid';

    let second, minute, hour, dayOfMonth, month, dayOfWeek;

    if (parts.length === 6) {
        [second, minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    } else {
        second = '0';
        [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
    }

    const pad = (val) => (val === '*' || val === '0' || val === '00') ? '00' : val.padStart(2, '0');

    let timeDisplay = `${pad(hour)}:${pad(minute)}`;
    if (parts.length === 6 && second !== '0' && second !== '*') {
        timeDisplay += `:${pad(second)}`;
    }

    const monthName = month === '*' ? '' : months[parseInt(month) - 1];
    const dayName = dayOfWeek === '*' ? '' : days[parseInt(dayOfWeek)];

    if (dayOfWeek === '*' && dayOfMonth === '*') {
        if (month === '*') return `Setiap hari pukul ${timeDisplay}`;
        return `Setiap hari di bulan ${monthName} pukul ${timeDisplay}`;
    }

    if (dayOfWeek !== '*' && dayOfMonth === '*') {
        return `Setiap hari ${dayName} pukul ${timeDisplay}`;
    }

    const dateDisplay = dayOfMonth !== '*' ? `tanggal ${dayOfMonth}` : '';
    const monthPart = monthName ? monthName : 'setiap bulan';

    let result = '';
    if (dayName) result += `${dayName}, `;
    if (dateDisplay) result += `${dateDisplay} `;
    result += `${monthPart} pukul ${timeDisplay}`;

    return result.replace(/\s+/g, ' ').trim();
}