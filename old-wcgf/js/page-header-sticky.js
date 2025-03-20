document.addEventListener("DOMContentLoaded", () => {
    const pageHeader = document.querySelector(".page-header");

    // Fonction pour gérer le sticky
    const handleStickyPageHeader = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Rendre la page-header sticky après avoir scrollé de 200px (ajuste si nécessaire)
        if (scrollTop > 150) {
            pageHeader.classList.add("sticky");
        } else {
            pageHeader.classList.remove("sticky");
        }
    };

    // Écouteur de scroll
    window.addEventListener("scroll", handleStickyPageHeader);
});// JavaScript Document