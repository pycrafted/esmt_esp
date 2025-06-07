import { create } from 'zustand';

interface Antenna {
  id: string;
  position: [number, number, number];
  gain: number;
  type: 'tx' | 'rx';
}

interface Terrain {
  points: Array<[number, number, number]>;
  type: string;
}

interface SimulationState {
  antennas: Antenna[];
  terrain: Terrain;
  frequency: number;
  addAntenna: (antenna: Omit<Antenna, 'id'>) => void;
  updateAntenna: (index: number, antenna: Partial<Antenna>) => void;
  removeAntenna: (id: string) => void;
  updateTerrain: (terrain: Partial<Terrain>) => void;
  setFrequency: (frequency: number) => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  antennas: [],
  terrain: {
    points: [],
    type: 'flat'
  },
  frequency: 2400, // MHz par défaut

  addAntenna: (antenna) => set((state) => ({
    antennas: [...state.antennas, { ...antenna, id: Math.random().toString(36).substr(2, 9) }]
  })),

  updateAntenna: (index, antenna) =>
    set((state) => ({
      antennas: state.antennas.map((a, i) =>
        i === index ? { ...a, ...antenna } : a
      )
    })),

  removeAntenna: (id) => set((state) => ({
    antennas: state.antennas.filter((antenna) => antenna.id !== id)
  })),

  updateTerrain: (terrain) =>
    set((state) => ({
      terrain: { ...state.terrain, ...terrain }
    })),

  setFrequency: (frequency) => set({ frequency })
})); 