import { useEffect } from 'react';

export default function useScrollVar(
  cssVarName = '--t',
  targetId = 'helixIntro'
) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        let t = (vh - r.top) / el.offsetHeight; // 0..1 within the section
        if (Number.isNaN(t)) t = 0;
        t = Math.max(0, Math.min(1, t));
        document.documentElement.style.setProperty(cssVarName, String(t));
        raf = 0;
      });
    };

    onScroll(); // initialize
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [cssVarName, targetId]);
}