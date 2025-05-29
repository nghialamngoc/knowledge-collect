'use client';
import { useEffect } from 'react';
import { onCLS, onFCP, onLCP, onINP, onTTFB, Metric } from 'web-vitals';

interface WebVitalMetric extends Metric {
  name: 'CLS' | 'FCP' | 'LCP' | 'INP' | 'TTFB';
  value: number;
  id: string;
}

type TrackFunction = (metric: WebVitalMetric) => void;

const defaultTrack: TrackFunction = metric => {
  console.log({
    name: metric.name,
    value: metric.name === 'CLS' ? metric.value.toFixed(4) : Math.round(metric.value),
    id: metric.id,
    rating: metric.rating
  });
};

const useReportWebVitals = ({ track = defaultTrack }: { track?: TrackFunction }) => {
  useEffect(() => {
    onLCP(track);
    onCLS(track);
    onINP(track);
    onFCP(track);
    onTTFB(track);
  }, [track]);
};

export default useReportWebVitals;
