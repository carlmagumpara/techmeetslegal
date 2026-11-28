import { useEffect, useRef } from 'react';
import skrollr from 'skrollr';

// Scene gaps range from ~100px to ~3000px. A flat 1000ms transition makes the
// short hops crawl while long jumps flash past their keyframes, so scale the
// duration with distance and clamp it to keep both extremes comfortable.
const SCROLL_MS_PER_PIXEL = 2;
const MIN_SCROLL_DURATION = 350;
const MAX_SCROLL_DURATION = 2500;

function scrollDuration(from, to) {
  const distance = Math.abs(to - from);
  return Math.min(
    MAX_SCROLL_DURATION,
    Math.max(MIN_SCROLL_DURATION, Math.round(distance * SCROLL_MS_PER_PIXEL)),
  );
}

/**
 * Replaces the legacy jQuery skrollr bootstrap and next-*.js files.
 *
 * skrollr still owns the frame-by-frame scroll animation because Tailwind
 * utilities cannot interpolate hundreds of scroll keyframes. React owns the
 * DOM; skrollr is initialised after mount and torn down on unmount.
 */
export function useExperience({ scenes, initial, videoRange }) {
  const skrollrRef = useRef(null);
  const sceneRef = useRef(0);

  useEffect(() => {
    const previousHeight = document.body.style.height;
    const instance = skrollr.init({
      smoothScrolling: false,
      forceHeight: true,
      easing: 'swing',
    });
    skrollrRef.current = instance;

    // The original pages jumped to the first narrative scene on load.
    const startTimer = window.setTimeout(() => {
      instance.refresh();
      window.scrollTo(0, initial);
    }, 60);

    const goTo = (index) => {
      if (index < 0 || index >= scenes.length) return;
      const target = scenes[index];
      sceneRef.current = index;
      instance.animateTo(target, {
        duration: scrollDuration(instance.getScrollTop(), target),
        easing: 'swing',
      });
    };

    const onClick = (event) => {
      const button = event.target.closest('[data-scene]');
      if (!button) return;
      goTo(Number(button.dataset.scene) - 1);
    };

    const onWheel = (event) => {
      if (instance.isAnimatingTo()) {
        event.preventDefault();
        return;
      }
      const current = window.scrollY;
      let nearest = 0;
      let min = Math.abs(current - scenes[0]);
      for (let i = 1; i < scenes.length; i += 1) {
        const distance = Math.abs(current - scenes[i]);
        if (distance < min) {
          min = distance;
          nearest = i;
        }
      }
      sceneRef.current = nearest;
      if (Math.abs(event.deltaY) < 4) return;
      event.preventDefault();
      goTo(sceneRef.current + (event.deltaY > 0 ? 1 : -1));
    };

    document.addEventListener('click', onClick);
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.clearTimeout(startTimer);
      document.removeEventListener('click', onClick);
      window.removeEventListener('wheel', onWheel);
      skrollrRef.current = null;
      instance.destroy();
      document.body.style.height = previousHeight;
      window.scrollTo(0, 0);
    };
  }, [scenes, initial]);

  // Keep the embedded YouTube clip in sync with its scene, as before.
  useEffect(() => {
    let player;
    let disposed = false;

    const createPlayer = () => {
      if (disposed || !window.YT || !document.getElementById('player')) return;
      player = new window.YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: 'dUqOztOx2u0',
        playerVars: { fs: 0, rel: 0 },
        events: {
          onReady: (event) => event.target.stopVideo(),
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
      if (!document.querySelector('script[data-yt-api]')) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.dataset.ytApi = 'true';
        document.head.appendChild(tag);
      }
    }

    const onScroll = () => {
      if (!player || typeof player.playVideo !== 'function') return;
      const [from, to] = videoRange;
      const top = window.scrollY;
      if (top >= from && top <= to) player.playVideo();
      else player.pauseVideo();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      disposed = true;
      window.removeEventListener('scroll', onScroll);
      delete window.onYouTubeIframeAPIReady;
      if (player && typeof player.destroy === 'function') player.destroy();
    };
  }, [videoRange]);
}
