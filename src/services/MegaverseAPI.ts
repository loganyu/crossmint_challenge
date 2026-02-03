import { BaseEntity } from '../core/BaseEntity.js';
import type { MegaverseMap, MapCell } from '../types/index.js';

export class MegaverseAPI {
  private candidateId = '9f4a8cb3-13ce-4552-a62d-bf8ec1a15f83';
  private baseUrl = 'https://challenge.crossmint.io/api';

  async getCurrentMap(): Promise<MegaverseMap> {
    const response = await fetch(`${this.baseUrl}/map/${this.candidateId}`);
    if (!response.ok) throw new Error(`Fetch Map Error: ${response.status}`);
    const data = await response.json() as { map: MegaverseMap };

    return data.map;
  }

  async getGoalMap(): Promise<string[][]> {
    const response = await fetch(`${this.baseUrl}/map/${this.candidateId}/goal`);
    if (!response.ok) throw new Error(`Fetch Goal Error: ${response.status}`);
    const data = await response.json() as { goal: string[][] };
    return data.goal;
  }

  async createEntity(entity: BaseEntity): Promise<void> {
    await this.retryRequest(
      entity.getEndpoint(),
      'POST',
      { candidateId: this.candidateId, ...entity.getApiPayload() }
    );
  }

  async deleteEntity(row: number, col: number, type: number | string = 'polyanet'): Promise<void> {
    let endpoint = '';

    // Handle Numeric Types (from Map Data)
    if (typeof type === 'number') {
      if (type === 0) endpoint = 'polyanets';
      else if (type === 1) endpoint = 'soloons';
      else if (type === 2) endpoint = 'comeths';
    } 
    // Handle String Types (from CLI or default)
    else {
      const t = type.toLowerCase();
      if (t.includes('polyanet')) endpoint = 'polyanets';
      else if (t.includes('soloon')) endpoint = 'soloons';
      else if (t.includes('cometh')) endpoint = 'comeths';
    }

    // Fallback safety
    if (!endpoint) {
      endpoint = 'polyanets';
    }

    await this.retryRequest(
      endpoint, 
      'DELETE', 
      { candidateId: this.candidateId, row, column: col }
    );
  }

  private async retryRequest(endpoint: string, method: string, body: any, retries = 3): Promise<void> {
    const url = `${this.baseUrl}/${endpoint}`;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        
        if (response.ok) return;

        if (response.status === 429) {
          const delay = attempt * 1500; 
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw new Error(`API Error ${response.status}: ${response.statusText}`);
      } catch (e) {
          if (attempt === retries) throw e;
      }
    }
  }

  printMap(map: MegaverseMap): void {
    console.log('\n--- CURRENT MAP STATUS ---');
    map.content.forEach((row) => {
      const rowStr = row.map(cell => this.parseMapCell(cell)).join(' ');
      console.log(rowStr);
    });
    console.log('--------------------------\n');
  }
  
  private parseMapCell(cell: MapCell): string {
    if (!cell) return '🌑'; 
    if (cell.type === 0) return '🪐'; 
    if (cell.type === 1) {
      if (typeof cell.color !== 'string') return '❔';

      const c = cell.color?.toLowerCase();
      if (c === 'blue') return '🔵';
      if (c === 'red') return '🔴';
      if (c === 'purple') return '🟣';
      if (c === 'white') return '⚪';
      return '❔'; 
    }
    if (cell.type === 2) {
      if (typeof cell.direction !== 'string') return '❔';

      const d = cell.direction?.toLowerCase();
      if (d === 'up') return '☝️';
      if (d === 'down') return '👇';
      if (d === 'left') return '👈';
      if (d === 'right') return '👉';
      return '❔'; 
    }
    return '❔'; 
  }
}
