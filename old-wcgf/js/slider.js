document.addEventListener("DOMContentLoaded", function () {
    const gamesContainer = document.querySelector('.games-container');
    const games = Array.from(gamesContainer.children);
    const leftButton = document.querySelector('.nav-button.left');
    const rightButton = document.querySelector('.nav-button.right');

    console.log("Initialisation des colonnes :", games);

    // Fonction pour mettre à jour les classes et opacités
    function updateGames() {
        games.forEach((game, index) => {
            game.classList.remove('active'); // Supprime la classe active
            game.style.opacity = index === 1 ? '1' : '0.5'; // Réduit l'opacité des colonnes non centrales
        });
        games[1].classList.add('active'); // Ajoute la classe active à la colonne centrale
    }

    // Fonction pour déplacer à gauche
    function slideLeft() {
        const firstGame = games.shift(); // Retire la première colonne
        games.push(firstGame); // L'ajoute à la fin
        updateDOM();
        updateGames();
    }

    // Fonction pour déplacer à droite
    function slideRight() {
        const lastGame = games.pop(); // Retire la dernière colonne
        games.unshift(lastGame); // L'ajoute au début
        updateDOM();
        updateGames();
    }

    // Fonction pour réorganiser le DOM
    function updateDOM() {
        gamesContainer.style.transition = 'transform 0.5s ease'; // Animation fluide
        gamesContainer.innerHTML = ''; // Vide le conteneur
        games.forEach((game) => {
            gamesContainer.appendChild(game); // Réinsère les colonnes dans le nouvel ordre
        });
    }

    // Initialisation
    updateGames();

    // Ajout des événements
    leftButton.addEventListener('click', slideLeft);
    rightButton.addEventListener('click', slideRight);
});