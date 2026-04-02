export const trackSchedule = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Schedule');
  }
};
