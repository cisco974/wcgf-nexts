const coinCanvas = document.getElementById('coinProgressGraph');
const coinCtx = coinCanvas.getContext('2d');

coinCanvas.width = coinCanvas.offsetWidth;
coinCanvas.height = 300;

// Données des courbes
const coinData = [1000, 4000, 2000, 8000, 5000, 9000, 9500]; // Dernier point ajusté
const coinData2 = [500, 3000, 3000, 6000, 4000, 7000, 6000]; // Moindre performance
const coinData3 = [200, 2000, 1000, 7000, 3000, 5000, 5500]; // Encore moindre performance

function drawCoinGraph() {
    const width = coinCanvas.width;
    const height = coinCanvas.height;
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;
    const maxValue = 10000;
    const yInterval = 2500;

    coinCtx.clearRect(0, 0, width, height);

    // Lignes horizontales
    for (let i = 0; i <= maxValue; i += yInterval) {
        const y = height - margin - (i / maxValue) * graphHeight;

        coinCtx.beginPath();
        coinCtx.moveTo(margin, y);
        coinCtx.lineTo(width - margin, y);
        coinCtx.strokeStyle = '#ccc';
        coinCtx.lineWidth = 1;
        coinCtx.stroke();

        const label = i === 0 ? '0' : `${i / 1000}k`;
        coinCtx.fillStyle = '#333';
        coinCtx.font = '12px Arial';
        coinCtx.textAlign = 'right';
        coinCtx.fillText(label, margin - 10, y + 3);
    }

    // Labels de l'axe X
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    labels.forEach((label, index) => {
        const x = margin + (index / (labels.length - 1)) * graphWidth;

        coinCtx.fillStyle = '#333';
        coinCtx.font = '12px Arial';
        coinCtx.textAlign = 'center';
        coinCtx.fillText(label, x, height - margin + 20);
    });

    // Fonction pour dessiner une courbe
    function drawCurve(data, color) {
        coinCtx.beginPath();
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            if (index === 0) {
                coinCtx.moveTo(x, y);
            } else {
                coinCtx.lineTo(x, y);
            }
        });

        coinCtx.strokeStyle = color;
        coinCtx.lineWidth = 4;
        coinCtx.stroke();

        // Points sur la courbe
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            coinCtx.beginPath();
            coinCtx.arc(x, y, 5, 0, Math.PI * 2);
            coinCtx.fillStyle = color;
            coinCtx.fill();
        });
    }

    // Dessiner les trois courbes
    drawCurve(coinData3, '#c4a283'); // Marron clair
    drawCurve(coinData2, '#a57047'); // Marron moyen
    drawCurve(coinData, '#894416'); // Marron principal

    // Ajouter le watermark
    coinCtx.fillStyle = '#eee';
    coinCtx.font = '12px Arial';
    coinCtx.textAlign = 'center';
    //coinCtx.fillText('WCGF.com', width / 2, height - 10);
}

drawCoinGraph();