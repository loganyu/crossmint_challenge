export type EntityType = 'POLYANET' | 'SOLOON' | 'COMETH' | 'SPACE';
export type SoloonColor = 'blue' | 'red' | 'purple' | 'white';
export type ComethDirection = 'up' | 'down' | 'left' | 'right';

export interface MapCellData {
    type: number;       // 0 = Polyanet, 1 = Soloon, 2 = Cometh
    color?: string | number;     // should be string but API might return numbers for Soloons color
    direction?: string | number; // should be string but API might return numbers for Cometh direction
}
export type MapCell = MapCellData | null;

export interface MegaverseMap {
  _id: string;
  content: MapCell[][];
  candidateId: string;
  phase: number;
  __v: number;
}

export interface CurrentMapResponse {
  map: MegaverseMap;
}

export interface GoalMapResponse {
  goal: string[][];
}


interface BaseConfig {
    row: number;
    col: number;
}

interface SoloonConfig extends BaseConfig {
    color: SoloonColor;
    direction?: never;
}

interface ComethConfig extends BaseConfig {
    direction: ComethDirection;
    color?: never;
}

interface PolyanetConfig extends BaseConfig {
    color?: never;
    direction?: never;
}

export type EntityConfig = SoloonConfig | ComethConfig | PolyanetConfig;
