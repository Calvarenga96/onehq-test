const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const edges = [];
const parent = new Array(1000000).fill(0);

function findParent(node) {
    if (parent[node] !== node) {
        parent[node] = findParent(parent[node]);
    }
    return parent[node];
}

function unionNodes(nodeA, nodeB) {
    const parentA = findParent(nodeA);
    const parentB = findParent(nodeB);
    if (parentA !== parentB) {
        parent[parentA] = parentB;
    }
}

function main() {
    rl.question("", (firstLine) => {
        [numNodes, numEdges, maxWeight] = firstLine.split(" ").map(Number);

        for (let i = 1; i <= numNodes; i++) {
            parent[i] = i;
        }

        let inputLines = [];
        rl.on("line", (line) => {
            inputLines.push(line);
            if (inputLines.length === numEdges) {
                rl.close();
            }
        });

        rl.on("close", () => {
            for (let i = 0; i < numEdges; i++) {
                const [nodeA, nodeB, weight] = inputLines[i]
                    .split(" ")
                    .map(Number);
                edges.push([weight, [nodeA, nodeB]]);
            }

            edges.sort((a, b) => a[0] - b[0]);

            let totalWeight = 0;
            let remainingComponents = numNodes;
            let minEdgesNeeded = numNodes - 1;
            let edgesUsed = 0;

            for (let i = 0; i < edges.length; i++) {
                const nodeA = edges[i][1][0];
                const nodeB = edges[i][1][1];

                if (findParent(nodeA) === findParent(nodeB)) continue;

                unionNodes(nodeA, nodeB);
                remainingComponents--;
                edgesUsed++;
                totalWeight += edges[i][0];

                if (totalWeight + remainingComponents - 1 <= maxWeight) {
                    minEdgesNeeded = remainingComponents - 1;
                }

                if (edgesUsed === numNodes - 1) break;
            }

            if (numNodes - 1 > maxWeight || edgesUsed < numNodes - 1) {
                console.log(-1);
            } else {
                console.log(minEdgesNeeded);
            }
        });
    });
}

main();
