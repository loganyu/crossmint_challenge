import { BaseEntity } from './BaseEntity.ts';
import { Polyanet } from './Polyanet.ts';
import { Soloon } from './Soloon.ts';
import { Cometh } from './Cometh.ts';
import type { SoloonColor, ComethDirection } from '../types/index.ts';

export class EntityFactory {
    static createFromGoalString(row: number, col: number, cellStr: string): BaseEntity | null {
        if (!cellStr || cellStr === 'SPACE') return null;

        const upperStr = cellStr.toUpperCase();

        // 2. Direct matching for Phase 1 (and fallback for Phase 2)
        if (upperStr.includes('POLYANET')) {
            return new Polyanet(row, col);
        }

        if (upperStr.includes('SOLOON')) {
            return new Soloon(row, col); 
        }

        if (upperStr.includes('COMETH')) {
            return new Cometh(row, col);
        }

        console.warn(`⚠️ Unknown entity type in Goal Map: ${cellStr}`);
        return null;
    }
}
