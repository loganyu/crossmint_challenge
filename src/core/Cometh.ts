import { BaseEntity } from './BaseEntity.ts';
import type { EntityType, ComethDirection, MapCellData } from '../types/index.ts';

export class Cometh extends BaseEntity {
    constructor(row: number, col: number, public direction: ComethDirection = 'up') {
        super(row, col);
    }

    getType(): EntityType {
        return 'COMETH';
    }

    getEndpoint(): string {
        return 'comeths';
    }

    getApiPayload(): object {
        return {
            row: this.row,
            column: this.col,
            direction: this.direction
        };
    }

    getSymbol(): string {
        const map: Record<string, string> = {
            up: '☝️', down: '👇', left: '👈', right: '👉'
        };
        return map[this.direction] || '?';
    }

    matches(cell: MapCellData | null): boolean {
        // Cometh is Type 2. Check type AND direction.
        return (
            cell !== null && 
            cell.type === 2 && 
            typeof cell.direction === 'string' &&
            cell.direction?.toLowerCase() === this.direction
        );
    }
}
