interface LinkBudgetParams {
  frequency: number; // MHz
  distance: number; // mètres
  txPower: number; // dBm
  txGain: number; // dBi
  rxGain: number; // dBi
  txHeight: number; // mètres
  rxHeight: number; // mètres
  climate: 'temperate' | 'tropical' | 'arid';
  reliability: number; // %
}

interface LinkBudgetResult {
  freeSpaceLoss: number;
  totalLoss: number;
  totalGain: number;
  receivedPower: number;
  systemMargin: number;
  availability: number;
}

interface Point2D {
  x: number;
  y: number;
}

export class LinkBudgetService {
  private static readonly C = 299792458; // Vitesse de la lumière en m/s

  /**
   * Calcule la perte en espace libre (formule de Friis)
   */
  private static calculateFreeSpaceLoss(frequency: number, distance: number): number {
    const wavelength = this.C / (frequency * 1e6); // Conversion MHz en Hz
    return 20 * Math.log10(4 * Math.PI * distance / wavelength);
  }

  /**
   * Calcule le rayon de la première zone de Fresnel
   */
  private static calculateFirstFresnelRadius(frequency: number, d1: number, d2: number): number {
    const wavelength = this.C / (frequency * 1e6);
    return Math.sqrt(wavelength * d1 * d2 / (d1 + d2));
  }

  /**
   * Calcule les points de l'ellipsoïde de Fresnel
   */
  public static calculateFresnelPoints(frequency: number, distance: number): Point2D[] {
    const points: Point2D[] = [];
    const numPoints = 100;

    for (let i = 0; i <= numPoints; i++) {
      const x = (distance * i) / numPoints;
      const d1 = x;
      const d2 = distance - x;
      const radius = this.calculateFirstFresnelRadius(frequency, d1, d2);
      
      points.push({ x, y: radius });
    }

    return points;
  }

  /**
   * Calcule le bilan de liaison complet
   */
  public static calculateLinkBudget(params: LinkBudgetParams): LinkBudgetResult {
    const {
      frequency,
      distance,
      txPower,
      txGain,
      rxGain,
      climate,
      reliability
    } = params;

    // Perte en espace libre
    const freeSpaceLoss = this.calculateFreeSpaceLoss(frequency, distance);

    // Pertes atmosphériques (simplifiées)
    const atmosphericLoss = this.calculateAtmosphericLoss(distance, climate);

    // Pertes dues à la polarisation et aux désalignements
    const polarizationLoss = 0.5; // dB
    const misalignmentLoss = 0.5; // dB

    // Pertes totales
    const totalLoss = freeSpaceLoss + atmosphericLoss + polarizationLoss + misalignmentLoss;

    // Gains totaux
    const totalGain = txGain + rxGain;

    // Puissance reçue
    const receivedPower = txPower + totalGain - totalLoss;

    // Marge système (sensibilité du récepteur à -70 dBm)
    const systemMargin = receivedPower - (-70);

    // Disponibilité (basée sur la marge système et la fiabilité requise)
    const availability = this.calculateAvailability(systemMargin, reliability);

    return {
      freeSpaceLoss,
      totalLoss,
      totalGain,
      receivedPower,
      systemMargin,
      availability
    };
  }

  /**
   * Calcule les pertes atmosphériques
   */
  private static calculateAtmosphericLoss(distance: number, climate: string): number {
    const baseLoss = 0.1; // dB/km
    switch (climate) {
      case 'tropical':
        return baseLoss * 1.5 * (distance / 1000);
      case 'arid':
        return baseLoss * 0.8 * (distance / 1000);
      default:
        return baseLoss * (distance / 1000);
    }
  }

  /**
   * Calcule la disponibilité du lien
   */
  private static calculateAvailability(systemMargin: number, reliability: number): number {
    // Formule simplifiée basée sur la marge système
    const baseAvailability = 99.9;
    const marginFactor = Math.min(systemMargin / 20, 1);
    return baseAvailability + (marginFactor * (reliability - baseAvailability));
  }

  // Calcul de la marge de fade (méthode de Barnett-Vignant)
  static calculateFadeMargin(params: {
    frequency: number;
    distance: number;
    climate: string;
    reliability: number;
  }): number {
    const { frequency, distance, climate, reliability } = params;
    
    // Facteurs climatiques
    const climateFactors = {
      'dry': 1,
      'normal': 2,
      'humid': 3
    };

    const factor = climateFactors[climate as keyof typeof climateFactors] || 2;
    const freqGHz = frequency / 1000;

    // Formule de Barnett-Vignant
    return factor * Math.pow(freqGHz, 0.5) * Math.pow(distance, 1.5) * (1 - reliability / 100);
  }
} 