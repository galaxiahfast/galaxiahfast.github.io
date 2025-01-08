document.addEventListener("DOMContentLoaded", function() {
  const homeButton = document.querySelector('.home-button');
  const heartButton = document.querySelector('.heart-button');
  const userButton = document.querySelector('.user-button');
  const homeOriginal = 'static/images/mobile-phone-icons/home.png';
  const heartOriginal = 'static/images/mobile-phone-icons/heart.png';
  const userOriginal = 'static/images/mobile-phone-icons/user.png';
  const homeHover = 'static/images/mobile-phone-icons/home_.png';
  const heartHover = 'static/images/mobile-phone-icons/heart_.png';
  const userHover = 'static/images/mobile-phone-icons/user_.png';
  const contenedorPantalla = document.querySelector('.contenedor-pantalla-celular');
  const contenedor1 = document.querySelector('.segundo-contenedor');
  const contenedor2 = document.querySelector('.segundo-contenedor-2');
  const contenedor3 = document.querySelector('.segundo-contenedor-3');

  function changeImageOnHover(button, hoverSrc) {
      const img = button.querySelector('img');
      img.src = hoverSrc;
  }

  function restoreImage(button, originalSrc) {
      const img = button.querySelector('img');
      img.src = originalSrc;
  }

  function setActiveButton(button, originalSrc, hoverSrc) {
      homeButton.classList.remove('active');
      heartButton.classList.remove('active');
      userButton.classList.remove('active');
      restoreImage(homeButton, homeOriginal);
      restoreImage(heartButton, heartOriginal);
      restoreImage(userButton, userOriginal);
      button.classList.add('active');
      changeImageOnHover(button, hoverSrc);
  }

  function showContent(contenedor) {
      contenedor1.style.display = 'none';
      contenedor2.style.display = 'none';
      contenedor3.style.display = 'none';
      contenedor.style.display = 'block';
  }

  setActiveButton(homeButton, homeOriginal, homeHover);
  showContent(contenedor1);

  homeButton.addEventListener('mouseover', function() {
      setActiveButton(homeButton, homeOriginal, homeHover);
      showContent(contenedor1);
  });

  heartButton.addEventListener('mouseover', function() {
      setActiveButton(heartButton, heartOriginal, heartHover);
      showContent(contenedor2);
  });

  userButton.addEventListener('mouseover', function() {
      setActiveButton(userButton, userOriginal, userHover);
      showContent(contenedor3);
  });

  homeButton.addEventListener('mouseout', function() {
      if (!homeButton.classList.contains('active')) {
          restoreImage(homeButton, homeOriginal);
      }
  });

  heartButton.addEventListener('mouseout', function() {
      if (!heartButton.classList.contains('active')) {
          restoreImage(heartButton, heartOriginal);
      }
  });

  userButton.addEventListener('mouseout', function() {
      if (!userButton.classList.contains('active')) {
          restoreImage(userButton, userOriginal);
      }
  });
});
