import { useEffect, useRef, useState } from 'react';

export function LazyMount({ children, rootMargin = '200px', fallback = null }) {
  const [visible, setVisible] = useState(false);
  const markerRef = useRef(null);

  useEffect(() => {
    const target = markerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={markerRef}>{visible ? children : fallback}</div>;
}
