const numberFormat = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
});

export function rupiahFormatter(number) {
    if (isNaN(number)) return '0';
    return numberFormat.format(number);
}