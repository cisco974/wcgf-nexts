function drawWinLossGraph(canvasId, winData, lossData) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Ajuster la taille du canvas
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    const width = canvas.width;
    const height = canvas.height;
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;
    const maxValue = 100; // Valeur maximale pour l'axe Y
    const yInterval = 25; // Intervalle entre les lignes horizontales

    // Effacer le canvas avant de dessiner
    ctx.clearRect(0, 0, width, height);

    // Dessiner les lignes horizontales
    for (let i = 0; i <= maxValue; i += yInterval) {
        const y = height - margin - (i / maxValue) * graphHeight;

        ctx.beginPath();
        ctx.moveTo(margin, y);
        ctx.lineTo(width - margin, y);
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ajouter les labels de l'axe Y
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(i, margin - 10, y + 3);
    }

    // Ajouter les labels de l'axe X
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    labels.forEach((label, index) => {
        const x = margin + (index / (labels.length - 1)) * graphWidth;

        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, height - margin + 20);
    });

    // Fonction pour dessiner une courbe
    function drawCurve(data, color) {
        ctx.beginPath();
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.stroke();

        // Ajouter les points sur la courbe
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
        });
    }

    // Dessiner les courbes
    drawCurve(lossData, '#d31105'); // Courbe des défaites en rouge
    drawCurve(winData, '#7bb82d'); // Courbe des victoires en vert

    // Ajouter un copyright en bas
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    //ctx.fillText('WCGF.com', width / 2, height - 10);
}

// Données pour les courbes
const winData1 = [10, 20, 30, 45, 55, 65, 75]; // Victoires cumulées
const lossData1 = [5, 10, 15, 20, 25, 30, 35]; // Défaites cumulées

const winData2 = [8, 18, 28, 40, 50, 60, 70]; // Victoires cumulées pour un autre graphique
const lossData2 = [3, 8, 12, 17, 22, 27, 30]; // Défaites cumulées pour un autre graphique

const winData3 = [5, 15, 25, 35, 50, 65, 80]; // Victoires cumulées pour un troisième graphique
const lossData3 = [2, 5, 10, 15, 20, 25, 30]; // Défaites cumulées pour un troisième graphique

// Dessiner les trois graphiques sur la page
drawWinLossGraph('winLossGraph1', winData1, lossData1);
drawWinLossGraph('winLossGraph2', winData2, lossData2);
drawWinLossGraph('winLossGraph3', winData3, lossData3);