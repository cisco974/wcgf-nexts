const leagueCanvas = document.getElementById('leagueProgressGraph');
const leagueCtx = leagueCanvas.getContext('2d');

// Ajuster la taille du canvas
leagueCanvas.width = leagueCanvas.offsetWidth;
leagueCanvas.height = 300;

// Données des courbes
const leagueData = [200, 1500, 3000, 5000, 7000, 8500, 10000]; // Courbe principale
const lowerPerformance1 = [150, 1200, 2500, 4000, 5500, 6500, 8000]; // Moins bonne performance
const lowerPerformance2 = [100, 800, 1500, 2500, 3500, 4500, 6000]; // Performance encore moindre

function drawLeagueGraph() {
    const width = leagueCanvas.width;
    const height = leagueCanvas.height;
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;
    const maxValue = 10000;
    const yInterval = 2500;

    // Effacer le canvas avant de dessiner
    leagueCtx.clearRect(0, 0, width, height);

    // Dessiner les lignes horizontales
    for (let i = 0; i <= maxValue; i += yInterval) {
        const y = height - margin - (i / maxValue) * graphHeight;

        leagueCtx.beginPath();
        leagueCtx.moveTo(margin, y);
        leagueCtx.lineTo(width - margin, y);
        leagueCtx.strokeStyle = '#ccc';
        leagueCtx.lineWidth = 1;
        leagueCtx.stroke();

        // Ajouter les labels de l'axe Y
        const label = i === 0 ? '0' : `${i / 1000}k`;
        leagueCtx.fillStyle = '#333';
        leagueCtx.font = '12px Arial';
        leagueCtx.textAlign = 'right';
        leagueCtx.fillText(label, margin - 10, y + 3);
    }

    // Ajouter les labels de l'axe X
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    labels.forEach((label, index) => {
        const x = margin + (index / (labels.length - 1)) * graphWidth;

        leagueCtx.fillStyle = '#333';
        leagueCtx.font = '12px Arial';
        leagueCtx.textAlign = 'center';
        leagueCtx.fillText(label, x, height - margin + 20);
    });

    // Fonction pour dessiner une courbe
    function drawCurve(data, color) {
        leagueCtx.beginPath();
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            if (index === 0) {
                leagueCtx.moveTo(x, y);
            } else {
                leagueCtx.lineTo(x, y);
            }
        });

        leagueCtx.strokeStyle = color;
        leagueCtx.lineWidth = 4;
        leagueCtx.stroke();

        // Ajouter les points sur la courbe
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            leagueCtx.beginPath();
            leagueCtx.arc(x, y, 5, 0, Math.PI * 2);
            leagueCtx.fillStyle = color;
            leagueCtx.fill();
        });
    }

    // Dessiner les courbes
    drawCurve(lowerPerformance2, '#a0d8f1'); // Courbe la plus claire
    drawCurve(lowerPerformance1, '#67c1eb'); // Courbe intermédiaire
    drawCurve(leagueData, '#45bfe6'); // Courbe principale

    // Ajouter un copyright en bas
    leagueCtx.fillStyle = '#eee';
    leagueCtx.font = '12px Arial';
    leagueCtx.textAlign = 'center';
    //leagueCtx.fillText('WCGF.com', width / 2, height - 10);
}

drawLeagueGraph();