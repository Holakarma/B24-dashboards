export function formatNumber(number: string) {
    return number.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}
