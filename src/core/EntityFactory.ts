import { BaseEntity } from './BaseEntity.ts';
import { Polyanet } from './Polyanet.ts';
import { Soloon } from './Soloon.ts';
import { Cometh } from './Cometh.ts';
import type { SoloonColor, ComethDirection } from '../types/index.ts';

export class EntityFactory {
    static createFromGoalString(row: number, col: number, cellStr: string): BaseEntity | null {
        if (!cellStr || cellStr === 'SPACE') return null;

    // cellStr Examples: "POLYANET", "RIGHT_COMETH", "BLUE_SOLOON"
    const parts = cellStr.split('_');
    const type = parts[parts.length - 1]; // Always the last part
    const modifier = parts.length > 1 ? parts[0].toLowerCase() : undefined; // First part if exists

    if (type === 'POLYANET') {
      return new Polyanet(row, col);
    }

    if (type === 'SOLOON') {
      // Default to blue if parsing fails, but modifier should be there
      return new Soloon(row, col, (modifier as SoloonColor) || 'blue');
    }

    if (type === 'COMETH') {
      // Default to up if parsing fails
      return new Cometh(row, col, (modifier as ComethDirection) || 'up');
    }

    console.warn(`⚠Unknown entity type in Goal Map: ${cellStr}`);

    return null;
  }
}
