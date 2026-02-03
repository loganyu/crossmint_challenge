# Crossmint Megaverse Challenge
This is an object oriented TypeScript solution to the Crossmint Megaverse Challenge.

## Setup
1. Install Dependencies
```bash
npm install
```

2. Configuration
Create `.env` file and set CANDIDATE_ID
```bash
CANDIDATE_ID=candidate-id-here
```

## Commands
1. Solve Challenge

`npm start`: fetches current and goal maps, verifies rules, and updates current map

2. View Maps

`npm run current`: fetch current map and print in readable format
`npm run goal`: fetch goal map and log goal map string array

3. Manually create entities

`npm run create -- 5 5 polyanet`

`npm run create -- 5 6 soloon blue`

`npm run create -- 5 7 cometh right`

4. Manually delete entities. (endpoint defaults to Polyanet. Note that the endpoint seems to delete the entity at a point despite the type of entity provided)

`npm run delete -- 5 5`

`npm run delete -- 5 6 soloon`

5. Reset map

`npm run reset`

## Assumptions and Design Decisions
* the validation step, `isGoalMapValid`, checks that Soloons are only adjacent to a Polyanet. However, I left out the logic to do this. the backend does not enforce this validation step. 