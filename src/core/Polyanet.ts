import { BaseEntity } from './BaseEntity.ts';
import type { EntityType, MapCellData } from '../types/index.ts';

export class Polyanet extends BaseEntity {
    getType(): EntityType {
        return 'POLYANET';
    }

    getEndpoint(): string {
        return 'polyanets';
    }

    getApiPayload(): object {
        return { row: this.row, column: this.col };
    }

    getSymbol(): string {
        return '🪐'; 
    }

    matches(cell: MapCellData | null): boolean {
        // Polyanet is Type 0
        return cell !== null && cell.type === 0;
    }
}
