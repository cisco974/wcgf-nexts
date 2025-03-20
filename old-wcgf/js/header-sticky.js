document.addEventListener("DOMContentLoaded", () => {
    const topBar = document.querySelector(".top-bar");
    const header = document.querySelector("header");

    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > topBar.offsetHeight) {
            header.classList.add("sticky");
            header.style.top = "0"; // Fixe le header au haut de la page
        } else {
            header.classList.remove("sticky");
            header.style.top = ""; // Restaure la position naturelle
        }

        // Gère le retour sous la top-bar en scroll inverse
        if (scrollTop < lastScrollTop && scrollTop <= topBar.offsetHeight) {
            header.style.top = `0px`;
        }

        lastScrollTop = scrollTop;
    });
});