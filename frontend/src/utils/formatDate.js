import { format } from 'date-fns';

/**
 * Formats a date string to "Fri Apr 03 • 12:04 PM"
 */
export const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'EEE MMM dd • hh:mm a');
  } catch (_) {
    return '';
  }
};
