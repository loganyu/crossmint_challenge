import type { EntityType, MapCellData } from '../types/index.ts';

export abstract class BaseEntity {
  constructor(public row: number, public col: number) {}

  abstract getType(): EntityType;
  abstract getApiPayload(): object;
  abstract getEndpoint(): string;
  abstract getSymbol(): string;
  abstract matches(cell: MapCellData | null): boolean;
}
