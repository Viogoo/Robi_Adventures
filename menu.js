document.getElementById("start-btn").addEventListener("click", function() {
    // При кліку на кнопку "Start" відображаємо вікно вибору рівнів
    document.getElementById("level-menu").style.display = "block";
    
    // Приховуємо кнопку "Start"
    document.getElementById("start-btn").style.display = "none";
  });
  
  document.getElementById("level1-btn").addEventListener("click", function() {
    // При кліку на кнопку "Рівень 1" переходимо на сторінку level1.html
    window.location.href = "level1.html";
  });
  