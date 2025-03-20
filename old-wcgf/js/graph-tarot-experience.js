const xpCanvas = document.getElementById('xpProgressGraph');
const xpCtx = xpCanvas.getContext('2d');

xpCanvas.width = xpCanvas.offsetWidth;
xpCanvas.height = 300;

const xpData = [500, 2500, 3500, 4500, 6500, 8000, 10000];
const xpData2 = [300, 2000, 3000, 4000, 5500, 7000, 8500]; // Moindre performance
const xpData3 = [100, 1500, 2500, 3000, 4000, 5000, 6000]; // Encore moindre performance

function drawXpGraph() {
    const width = xpCanvas.width;
    const height = xpCanvas.height;
    const margin = 50;
    const graphWidth = width - 2 * margin;
    const graphHeight = height - 2 * margin;
    const maxValue = 10000;
    const yInterval = 2500;

    xpCtx.clearRect(0, 0, width, height);

    // Lignes horizontales
    for (let i = 0; i <= maxValue; i += yInterval) {
        const y = height - margin - (i / maxValue) * graphHeight;

        xpCtx.beginPath();
        xpCtx.moveTo(margin, y);
        xpCtx.lineTo(width - margin, y);
        xpCtx.strokeStyle = '#ccc';
        xpCtx.lineWidth = 1;
        xpCtx.stroke();

        const label = i === 0 ? '0' : `${i / 1000}k`;
        xpCtx.fillStyle = '#333';
        xpCtx.font = '12px Arial';
        xpCtx.textAlign = 'right';
        xpCtx.fillText(label, margin - 10, y + 3);
    }

    // Labels de l'axe X
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    labels.forEach((label, index) => {
        const x = margin + (index / (labels.length - 1)) * graphWidth;

        xpCtx.fillStyle = '#333';
        xpCtx.font = '12px Arial';
        xpCtx.textAlign = 'center';
        xpCtx.fillText(label, x, height - margin + 20);
    });

    // Fonction pour dessiner une courbe
    function drawCurve(data, color) {
        xpCtx.beginPath();
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            if (index === 0) {
                xpCtx.moveTo(x, y);
            } else {
                xpCtx.lineTo(x, y);
            }
        });

        xpCtx.strokeStyle = color;
        xpCtx.lineWidth = 4;
        xpCtx.stroke();

        // Points sur la courbe
        data.forEach((point, index) => {
            const x = margin + (index / (data.length - 1)) * graphWidth;
            const y = height - margin - (point / maxValue) * graphHeight;

            xpCtx.beginPath();
            xpCtx.arc(x, y, 5, 0, Math.PI * 2);
            xpCtx.fillStyle = color;
            xpCtx.fill();
        });
    }

    // Dessiner les trois courbes
    drawCurve(xpData3, '#f5c5a0'); // Teinte orange clair
    drawCurve(xpData2, '#f18d5e'); // Teinte orange moyen
    drawCurve(xpData, '#ea5f28');  // Orange principal

    // Ajouter le watermark
    xpCtx.fillStyle = '#eee';
    xpCtx.font = '12px Arial';
    xpCtx.textAlign = 'center';
    //xpCtx.fillText('WCGF.com', width / 2, height - 10);
}

drawXpGraph();