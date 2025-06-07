import { evaluate } from 'mathjs';

interface Obstacle {
  position: [number, number, number];
  height: number;
  width: number;
}

interface DiffractionParams {
  frequency: number;
  distance: number;
  txPosition: [number, number, number];
  rxPosition: [number, number, number];
  obstacles: Obstacle[];
}

interface DiffractionResult {
  totalLoss: number;
  obstacleLosses: Array<{
    obstacle: Obstacle;
    loss: number;
  }>;
}

export class DiffractionService {
  private static readonly C = 299792458; // Vitesse de la lumière en m/s

  /**
   * Calcule le paramètre de diffraction v
   */
  private static calculateDiffractionParameter(
    h: number,
    wavelength: number,
    d1: number,
    d2: number
  ): number {
    return h * Math.sqrt(2 * (d1 + d2) / (wavelength * d1 * d2));
  }

  /**
   * Calcule la perte par diffraction en dB
   */
  private static calculateDiffractionLoss(v: number): number {
    if (v < -0.7) {
      return 0;
    } else if (v < 0) {
      return 20 * Math.log10(0.5 * Math.exp(-0.95 * v));
    } else if (v < 1) {
      return 20 * Math.log10(0.5 * (1 - 0.62 * Math.exp(-0.95 * v)));
    } else {
      return 20 * Math.log10(0.225 / v);
    }
  }

  /**
   * Calcule la perte par diffraction pour un obstacle
   */
  private static calculateObstacleLoss(
    obstacle: Obstacle,
    params: DiffractionParams
  ): number {
    const wavelength = this.C / (params.frequency * 1e6); // Conversion MHz en Hz
    const d1 = Math.sqrt(
      Math.pow(obstacle.position[0] - params.txPosition[0], 2) +
      Math.pow(obstacle.position[2] - params.txPosition[2], 2)
    );
    const d2 = Math.sqrt(
      Math.pow(params.rxPosition[0] - obstacle.position[0], 2) +
      Math.pow(params.rxPosition[2] - obstacle.position[2], 2)
    );

    const v = this.calculateDiffractionParameter(
      obstacle.height,
      wavelength,
      d1,
      d2
    );

    return this.calculateDiffractionLoss(v);
  }

  /**
   * Calcule la perte totale par diffraction pour tous les obstacles
   */
  public static calculateTotalDiffractionLoss(
    params: DiffractionParams
  ): DiffractionResult {
    const obstacleLosses = params.obstacles.map(obstacle => ({
      obstacle,
      loss: this.calculateObstacleLoss(obstacle, params)
    }));

    const totalLoss = obstacleLosses.reduce(
      (sum, { loss }) => sum + loss,
      0
    );

    return {
      totalLoss,
      obstacleLosses
    };
  }

  /**
   * Vérifie si un obstacle est dans la première zone de Fresnel
   */
  public static isInFirstFresnelZone(
    obstacle: Obstacle,
    params: DiffractionParams
  ): boolean {
    const wavelength = this.C / (params.frequency * 1e6);
    const d1 = Math.sqrt(
      Math.pow(obstacle.position[0] - params.txPosition[0], 2) +
      Math.pow(obstacle.position[2] - params.txPosition[2], 2)
    );
    const d2 = Math.sqrt(
      Math.pow(params.rxPosition[0] - obstacle.position[0], 2) +
      Math.pow(params.rxPosition[2] - obstacle.position[2], 2)
    );

    const fresnelRadius = Math.sqrt(wavelength * d1 * d2 / (d1 + d2));
    return obstacle.height <= fresnelRadius;
  }
} 