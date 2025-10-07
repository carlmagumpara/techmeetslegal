$(document).ready(function () {
  const scenes = [
    2001, 2901, 5201, 6101, 7801, 8901, 10101, 10801, 11101,
    11701, 12201, 12701, 13201, 13701, 14201, 15103, 15601,
    16401, 17201, 17801, 18401, 19001, 19401, 20401, 20900,
    21701, 22602, 23101, 26200
  ];

  let currentScene = 0;
  let isAnimating = false;

  // Handle click-based jumps
  scenes.forEach((pos, i) => {
    $(`.scene-${i + 1}`).click(function () {
      goToScene(i);
    });
  });

  // Function to go to a specific scene
  function goToScene(index) {
    if (index < 0 || index >= scenes.length) return;
    isAnimating = true;
    currentScene = index;

    $('html,body')
      .stop()
      .animate({ scrollTop: scenes[index] }, 1000, 'swing', function () {
        isAnimating = false;
      });
  }

  // Detect scroll direction (wheel / touchpad)
  window.addEventListener(
    'wheel',
    function (e) {
      if (isAnimating) {
        e.preventDefault();
        return;
      }

      if (e.deltaY > 0) {
        // Scroll down
        if (currentScene < scenes.length - 1) {
          currentScene++;
          goToScene(currentScene);
        }
      } else if (e.deltaY < 0) {
        // Scroll up
        if (currentScene > 0) {
          currentScene--;
          goToScene(currentScene);
        }
      }

      e.preventDefault(); // block default scroll
    },
    { passive: false }
  );

  // Optional: fix scroll position if user jumps manually
  $(window).on('scroll', function () {
    if (!isAnimating) {
      const scrollTop = $(window).scrollTop();
      let nearest = 0;
      let minDist = Math.abs(scrollTop - scenes[0]);
      for (let i = 1; i < scenes.length; i++) {
        const dist = Math.abs(scrollTop - scenes[i]);
        if (dist < minDist) {
          minDist = dist;
          nearest = i;
        }
      }
      currentScene = nearest;
    }
  });
});
