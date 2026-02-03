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
* the validation step, `isGoalMapValid`, checks that Soloons are only adjacent to a Polyanet and does not run if the goal map is invalid. However, the backend does not enforce this validation step. If I had access to the backend, I would add validations for this logic. Note that the functions for manual creation and deletion of entities do not validate this since I created them for debugging. If the individual creation steps were to be used, I would validate this rule because making an API request.
* The API allows setting direction and color to any string or number. When reading the map, they are treated as "unknown" values
