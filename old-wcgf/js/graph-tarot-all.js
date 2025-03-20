function drawCombinedGraph(canvasId, leagueData, xpData, coinData) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');

            canvas.width = canvas.offsetWidth;
            canvas.height = 300;

            const width = canvas.width;
            const height = canvas.height;
            const margin = 50;
            const graphWidth = width - 2 * margin;
            const graphHeight = height - 2 * margin;
            const maxValue = 10000;
            const yInterval = 2500;

            ctx.clearRect(0, 0, width, height);

            // Draw horizontal lines
            for (let i = 0; i <= maxValue; i += yInterval) {
                const y = height - margin - (i / maxValue) * graphHeight;

                ctx.beginPath();
                ctx.moveTo(margin, y);
                ctx.lineTo(width - margin, y);
                ctx.strokeStyle = '#ccc';
                ctx.lineWidth = 1;
                ctx.stroke();

                const label = i === 0 ? '0' : `${i / 1000}k`;
                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(label, margin - 10, y + 3);
            }

            // Labels for X-axis
            const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            labels.forEach((label, index) => {
                const x = margin + (index / (labels.length - 1)) * graphWidth;

                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(label, x, height - margin + 20);
            });

            // Draw curve function
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

                data.forEach((point, index) => {
                    const x = margin + (index / (data.length - 1)) * graphWidth;
                    const y = height - margin - (point / maxValue) * graphHeight;

                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI * 2);
                    ctx.fillStyle = color;
                    ctx.fill();
                });
            }

            // Draw curves
            drawCurve(leagueData, '#45bfe6'); // Blue
            drawCurve(xpData, '#ea5f28'); // Orange
            drawCurve(coinData, '#894416'); // Brown
        }

        // Draw graphs
        drawCombinedGraph('combinedGraph1', [200, 1500, 3000, 5000, 7000, 8500, 10000], [500, 2500, 3500, 4500, 6500, 8000, 10000], [1000, 4000, 2000, 8000, 5000, 9000, 7000]);
        drawCombinedGraph('combinedGraph2', [200, 1800, 2500, 4000, 6500, 7000, 9500], [100, 1500, 2300, 3700, 4800, 7200, 9600], [1000, 2500, 1000, 6000, 3000, 4000, 2000]);
        drawCombinedGraph('combinedGraph3', [300, 1400, 2900, 4800, 6600, 8400, 10000], [400, 2000, 3100, 4700, 6400, 7200, 9000], [1500, 3000, 500, 7500, 2500, 6000, 3000]);