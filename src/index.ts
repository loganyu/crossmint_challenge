import { MegaverseAPI } from './services/MegaverseAPI.js';
import { EntityFactory } from './core/EntityFactory.js';
import { BaseEntity } from './core/BaseEntity.js';
import { Polyanet } from './core/Polyanet.js';
import { Soloon } from './core/Soloon.js';
import { Cometh } from './core/Cometh.js';
import type { SoloonColor, ComethDirection } from './types/index.js';

const api = new MegaverseAPI();
const args = process.argv.slice(2);
const command = args[0];

async function main() {
  try {
    switch (command) {
      case 'current':
        await showCurrent();
        break;
      case 'goal':
        await showGoal();
        break;
      case 'create':
        await createManual();
        break;
      case 'delete':
        await deleteManual();
        break;
      case 'reset':
        await resetMap();
        break;
      case 'solve':
      default:
        await solveChallenge();
        break;
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// --- COMMAND HANDLERS ---

async function showCurrent() {
  console.log('Fetching Current Map...');
  const map = await api.getCurrentMap();
  api.printMap(map);
}

async function showGoal() {
  console.log('Fetching Goal Map...');
  const goal = await api.getGoalMap();
  console.log(goal);
}

async function createManual() {
  // Usage: npm run create -- row col type [modifier]
  const [_, rowStr, colStr, type, mod] = args;
  const row = parseInt(rowStr);
  const col = parseInt(colStr);

  if (isNaN(row) || isNaN(col) || !type) {
    console.error('Usage: npm run create -- <row> <col> <type> [modifier]');
    console.error('Ex: npm run create -- 5 5 polyanet');
    console.error('Ex: npm run create -- 5 5 soloon blue');
    return;
  }

  let entity: BaseEntity;

  if (type.includes('polyanet')) {
      entity = new Polyanet(row, col);
  } else if (type.includes('soloon')) {
      entity = new Soloon(row, col, (mod as SoloonColor) || 'blue');
  } else if (type.includes('cometh')) {
      entity = new Cometh(row, col, (mod as ComethDirection) || 'up');
  } else {
      console.error('Unknown type. Use polyanet, soloon, or cometh.');
      return;
  }

  console.log(`Creating ${entity.getSymbol()} at ${row},${col}...`);
  await api.createEntity(entity);
  console.log('Done!');
}

async function deleteManual() {
    // Usage: npm run delete -- row col
    const [_, rowStr, colStr] = args;
    const row = parseInt(rowStr);
    const col = parseInt(colStr);

    if (isNaN(row) || isNaN(col)) {
      console.error('Usage: npm run delete -- <row> <col>');
      return;
    }

    console.log(`Deleting entity at ${row},${col}...`);
    await api.deleteEntity(row, col);
    console.log('Done!');
}

async function resetMap() {
  console.log('⚠️ DELETING EVERYTHING...');
  const map = await api.getCurrentMap();
  
  for (let row = 0; row < map.content.length; row++) {
    for (let col = 0; col < map.content[row].length; col++) {
      if (map.content[row][col] !== null) {
        process.stdout.write(`\rDeleting (${row}, ${col})... `);
        await api.deleteEntity(row, col);
        await new Promise(r => setTimeout(r, 800)); // Safety delay
      }
    }
  }
  console.log('\n✨ Map cleared!');
}

async function solveChallenge() {
  console.log('📡 Fetching maps...');
  const [goalMap, currentMap] = await Promise.all([
    api.getGoalMap(),
    api.getCurrentMap()
  ]);

  api.printMap(currentMap); 

  const toCreate: BaseEntity[] = [];
  const toDelete: { row: number; col: number; type: number }[] = [];

  let alreadyCorrectCount = 0;

  for (let row = 0; row < goalMap.length; row++) {
    for (let col = 0; col < goalMap[row].length; col++) {
      const goalCellString = goalMap[row][col];
      const currentCellData = currentMap.content[row]?.[col] || null;

      const desiredEntity = EntityFactory.createFromGoalString(row, col, goalCellString);

      if (desiredEntity) {
        if (desiredEntity.matches(currentCellData)) {
          alreadyCorrectCount++;
        } else {
          toCreate.push(desiredEntity);
        }
      } else {
        if (currentCellData !== null) {
          toDelete.push({ row, col, type: currentCellData.type });
        } else {
          alreadyCorrectCount++;
        }
      }
    }
  }

  console.log(`Analysis Complete:`);
  console.log(`   - ${alreadyCorrectCount} positions are correct.`);
  console.log(`   - ${toDelete.length} entities to DELETE (Clearing space).`);
  console.log(`   - ${toCreate.length} entities to CREATE (Overwriting/New).`);

  if (toDelete.length === 0 && toCreate.length === 0) {
    console.log('🎉 Map is already perfect!');
    return;
  }

  if (toDelete.length > 0) {
    console.log(`\n🗑️  Clearing ${toDelete.length} spaces...`);
    for (const [i, item] of toDelete.entries()) {
        process.stdout.write(`\r[${i + 1}/${toDelete.length}] Deleting type ${item.type} at (${item.row}, ${item.col})  `);
        await api.deleteEntity(item.row, item.col, item.type);
        await new Promise(r => setTimeout(r, 800)); 
    }
  }

  if (toCreate.length > 0) {
    console.log(`\n🚀 Creating ${toCreate.length} new entities...`);
    for (const [i, entity] of toCreate.entries()) {
        process.stdout.write(`\r[${i + 1}/${toCreate.length}] Creating ${entity.getSymbol()} at (${entity.row}, ${entity.col})  `);
        await api.createEntity(entity);
        await new Promise(r => setTimeout(r, 600)); 
    }
  }

  console.log('\n\n✨ Verifying final result...');
  const finalMap = await api.getCurrentMap();
  api.printMap(finalMap);
}

main();
