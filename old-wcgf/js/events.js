let currentSlide = 0;
let slideWidth = 0; // Variable pour la largeur fixe des slides

window.onload = function initializeSlider() {
    const slides = document.querySelectorAll('.event');
    if (slides.length > 0) {
        slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight || 0);
        console.log("Slide width initialized:", slideWidth);
    }
};

window.slide = function slide(direction) {
    const slider = document.querySelector('.event-slider');
    const slides = document.querySelectorAll('.event');
    const visibleSlides = 6; // Nombre d'événements visibles
    const totalSlides = slides.length; // Total des événements dans le DOM

    console.log("Direction:", direction);
    console.log("Current slide before update:", currentSlide);
    console.log("Total slides:", totalSlides);

    // Met à jour currentSlide
    currentSlide += direction;

    // Empêche currentSlide de sortir des limites
    if (currentSlide < 0) {
        console.log("Limite atteinte : début");
        currentSlide = 0; // Reste au premier événement
    } else if (currentSlide > totalSlides - visibleSlides) {
        console.log("Limite atteinte : fin");
        currentSlide = totalSlides - visibleSlides; // Reste au dernier groupe visible
    }

    console.log("Current slide after update:", currentSlide);

    // Applique la transformation
    const transformValue = `translateX(-${currentSlide * slideWidth}px)`;
    slider.style.transform = transformValue;

    console.log("Transform applied:", transformValue);
};