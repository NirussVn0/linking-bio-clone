'use client';

import { useEffect } from 'react';

export function reportWebVitals(metric: any) {
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    // gtag('event', metric.name, {
    //   value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    //   event_label: metric.id,
    //   non_interaction: true,
    // });
  }
}

export default function WebVitals() {
  useEffect(() => {
    // Dynamically import web-vitals to avoid affecting bundle size
    import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(reportWebVitals);
      onINP(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
    });
  }, []);

  return null;
}
