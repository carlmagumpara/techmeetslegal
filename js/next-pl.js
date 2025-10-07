$(document).ready(function () {
  const scenes = [
    3201, 3701, 3801, 4100, 4600, 5100, 5600, 6100, 6600, 7100,
    7901, 8201, 9500, 11200, 12100, 13000, 14601, 15401,
    15901, 16501, 17101, 17701, 18301, 18901, 19501, 20101,
    20902, 21601, 22201, 22801, 23301, 23901, 24501, 25201,
    25601, 26501, 27401, 28801, 29502, 30101, 31400
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


      console.log(scrollTop)

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
