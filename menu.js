document.getElementById("start-btn").addEventListener("click", function() {
  // При кліку на кнопку "Start" відображаємо вікно вибору рівнів
  document.getElementById("level-menu").style.display = "block";
  
  // Приховуємо кнопку "Start"
  document.getElementById("start-btn").style.display = "none";
});

document.getElementById("level1-btn").addEventListener("click", function() {
  // Приховуємо вікно вибору рівнів
  document.getElementById("level-menu").style.display = "none";
  
  // Відображаємо відео
  var video = document.getElementById('level1video');
  video.style.display = "block";
  video.play();

  // Після завершення відео переходимо на сторінку level1.html
  video.addEventListener('ended', function() {
      window.location.href = "level1.html";
  });
});

document.addEventListener("DOMContentLoaded", function() {
  var audio = document.getElementById('myAudio');

  // Налаштовуємо циклічне відтворення
  audio.loop = true;

  // Запускаємо відтворення аудіо при завантаженні сторінки
  audio.play().catch(function(error) {
      console.log("User interaction is required to start the audio playback: ", error);
      
      // Запускаємо аудіо після взаємодії користувача
      document.body.addEventListener('click', function() {
          audio.play();
      }, { once: true });
  });
});
