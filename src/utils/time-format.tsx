export function timeFormatBR(date) {
  if (!date || !(date instanceof Date)) {
      return ""; // Return an empty string or some default value
  }

  return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
  });
}
