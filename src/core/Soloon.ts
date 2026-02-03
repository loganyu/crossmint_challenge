import { BaseEntity } from './BaseEntity.ts';
import type { EntityType, SoloonColor, MapCellData } from '../types/index.ts';

export class Soloon extends BaseEntity {
    constructor(row: number, col: number, public color: SoloonColor = 'blue') {
        super(row, col);
    }

    getType(): EntityType {
        return 'SOLOON';
    }

    getEndpoint(): string {
        return 'soloons';
    }

    getApiPayload(): object {
        return {
            row: this.row,
            column: this.col,
            color: this.color
        };
    }

    getSymbol(): string {
        const map: Record<string, string> = {
            blue: '🔵', red: '🔴', purple: '🟣', white: '⚪'
        };
        return map[this.color] || '?';
    }

    matches(cell: MapCellData | null): boolean {
        // Soloon is Type 1. Check type AND color.
        return (
            cell !== null && 
            cell.type === 1 && 
            typeof cell.color === 'string' &&
            cell.color?.toLowerCase() === this.color
        );
    }
}
