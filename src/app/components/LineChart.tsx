"use client";
import React, { useEffect, useRef } from "react";

// Définition des types
interface ChartPoint {
  name: string;
  value: number;
}

interface ChartSeries {
  name: string;
  data: ChartPoint[];
}

interface RankingChartProps {
  id: string;
  series: ChartSeries[];
  colors?: string[];
  baseColor?: string; // Nouvelle prop pour la couleur principale
  height?: number;
  animate?: boolean;
  useGradient?: boolean; // Option pour activer/désactiver le dégradé
}

const LineChart: React.FC<RankingChartProps> = ({
  id,
  series,
  colors = ["#0088FE", "#67c1eb", "#FF5252", "#45bfe6"],
  baseColor, // Nouvelle prop
  height = 300,
  animate = true,
  useGradient = true, // Par défaut, on utilise le dégradé
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, {
      id,
      series,
      colors,
      baseColor,
      height,
      animate,
      useGradient,
    });
    return () => chart.destroy();
  }, [id, series, colors, baseColor, height, animate, useGradient]);

  return <canvas id={id} ref={canvasRef} width="100%" height={height} />;
};

class Chart {
  private id: string;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private series: ChartSeries[];
  private colors: string[];
  private baseColor: string | undefined;
  private useGradient: boolean;
  private height: number;
  private animate: boolean;
  private margin: number = 50;
  private bottomMargin: number = 70;
  private pointRadius: number = 6;
  private lineWidth: number = 3;
  private gridColor: string = "#ccc";
  private textColor: string = "#333";
  private fontSize: number = 12;
  private fontFamily: string = "Arial, sans-serif";
  private animationDuration: number = 1000;
  private labels: string[] = [];
  private maxValue: number = 0;

  constructor(canvas: HTMLCanvasElement, config: RankingChartProps) {
    this.canvas = canvas;
    const ctx = this.canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Failed to get 2D context");
    }
    this.ctx = ctx;
    this.id = config.id;
    this.series = config.series;
    this.colors = config.colors || [];
    this.baseColor = config.baseColor;
    this.height = config.height || 300;
    this.animate = config.animate !== undefined ? config.animate : true;
    this.useGradient =
      config.useGradient !== undefined ? config.useGradient : true;
    this.init();
  }

  public destroy() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private init() {
    this.canvas.width = this.canvas.parentElement?.clientWidth || 800;
    this.canvas.height = this.height;
    this.extractLabels();
    this.calculateMaxValue();
    this.draw();
  }

  private extractLabels() {
    if (this.series.length > 0 && this.series[0].data) {
      this.labels = this.series[0].data.map((point) => point.name);
    } else {
      this.labels = [];
    }
  }

  private calculateMaxValue() {
    let max = 0;
    this.series.forEach((serie) => {
      serie.data.forEach((point) => {
        if (point.value > max) {
          max = point.value;
        }
      });
    });

    // Adapter l'échelle en fonction de la valeur maximale
    if (max <= 30) {
      // Pour les petites valeurs, créer une échelle plus appropriée
      this.maxValue = max < 5 ? 5 : Math.ceil(max / 5) * 5;
    } else if (max <= 100) {
      // Pour les valeurs moyennes
      this.maxValue = Math.ceil(max / 10) * 10;
    } else {
      // Pour les grandes valeurs
      this.maxValue = Math.ceil(max / 100) * 100;
    }

    // Ajouter un peu d'espace au-dessus du point le plus haut (10% supplémentaire)
    this.maxValue = Math.ceil(this.maxValue * 1.1);

    if (this.maxValue === 0) this.maxValue = 5; // Valeur par défaut si pas de données
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawGrid();
    this.drawXAxisLabels();

    // Génération des couleurs dégradées si nécessaire
    const colorsToUse =
      this.useGradient && this.baseColor
        ? this.generateGradientColors(this.baseColor, this.series.length)
        : this.colors;

    this.series.forEach((serie, index) => {
      const color = colorsToUse[index % colorsToUse.length] || "#0088FE";
      this.drawSeries(serie, color);
    });
  }

  // Méthode pour générer des couleurs en dégradé
  private generateGradientColors(baseColor: string, count: number): string[] {
    // Convertir la couleur hexadécimale en RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    const colors: string[] = [];

    // Ajouter la couleur de base comme première couleur
    colors.push(baseColor);

    // Générer des versions plus claires pour les couleurs suivantes
    for (let i = 1; i < count; i++) {
      // Calculer le facteur de luminosité (plus l'index est grand, plus la couleur est claire)
      // Réduit l'intensité du dégradé pour que la dernière ligne reste visible
      const factor = 0.3 + (i * 0.2) / count;

      // Éclaircir la couleur
      const newR = Math.min(255, Math.round(r + (255 - r) * factor));
      const newG = Math.min(255, Math.round(g + (255 - g) * factor));
      const newB = Math.min(255, Math.round(b + (255 - b) * factor));

      // Convertir en hexadécimal et ajouter à la liste
      const newColor = `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
      colors.push(newColor);
    }

    return colors;
  }

  private drawGrid() {
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    this.ctx.fillStyle = this.textColor;
    this.ctx.textAlign = "right";
    this.ctx.textBaseline = "middle";

    // Déterminer un nombre approprié de lignes de grille et un pas adapté à l'échelle
    let gridLines = 5;
    let step;

    if (this.maxValue <= 5) {
      gridLines = 5;
      step = 1;
    } else if (this.maxValue <= 50) {
      gridLines = Math.ceil(this.maxValue / 10);
      step = 10;
    } else {
      gridLines = 5;
      step = this.maxValue / gridLines;

      // Arrondir le pas pour qu'il soit un nombre "propre"
      const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
      step = Math.ceil(step / magnitude) * magnitude;
    }

    for (let i = 0; i <= gridLines; i++) {
      const value = i * step;
      const y =
        this.height -
        this.bottomMargin -
        (value / this.maxValue) *
          (this.height - this.margin - this.bottomMargin);

      this.ctx.beginPath();
      this.ctx.moveTo(this.margin, y);
      this.ctx.lineTo(this.canvas.width - this.margin, y);
      this.ctx.stroke();

      // Format large numbers with K, M, etc.
      let displayValue = value.toString();
      if (value >= 1000000) {
        displayValue = (value / 1000000).toFixed(1) + "M";
      } else if (value >= 1000) {
        displayValue = (value / 1000).toFixed(1) + "K";
      }

      this.ctx.fillText(displayValue, this.margin - 10, y);
    }
  }

  private drawXAxisLabels() {
    if (this.labels.length === 0) return;

    this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    this.ctx.fillStyle = this.textColor;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";

    const y = this.height - this.bottomMargin + 20;

    this.labels.forEach((label, index) => {
      const x =
        this.margin +
        (index / (this.labels.length - 1)) *
          (this.canvas.width - 2 * this.margin);
      this.ctx.fillText(label, x, y);

      // Draw small tick marks
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.height - this.bottomMargin);
      this.ctx.lineTo(x, this.height - this.bottomMargin + 5);
      this.ctx.strokeStyle = this.gridColor;
      this.ctx.stroke();
    });
  }

  private drawSeries(serie: ChartSeries, color: string) {
    if (serie.data.length === 0) return;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();

    serie.data.forEach((point, index) => {
      const x =
        this.margin +
        (index / (serie.data.length - 1)) *
          (this.canvas.width - 2 * this.margin);
      const y =
        this.height -
        this.bottomMargin -
        (point.value / this.maxValue) *
          (this.height - this.margin - this.bottomMargin);

      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.stroke();

    // Draw points
    serie.data.forEach((point, index) => {
      const x =
        this.margin +
        (index / (serie.data.length - 1)) *
          (this.canvas.width - 2 * this.margin);
      const y =
        this.height -
        this.bottomMargin -
        (point.value / this.maxValue) *
          (this.height - this.margin - this.bottomMargin);

      this.ctx.beginPath();
      this.ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    });
  }
}

export default LineChart;
