function removeFromArray(arr, elm) {
    arr.forEach(element => {
        if (element == elm){
            arr.splice(arr.indexOf(element), 1);
        }
    });
}

function heuristic(a, b) {
    let d = abs(a.c - b.c) + abs(a.j - b.j);
    return d;
}

let cols = 30;
let rows = 30;
let grid = new Array(cols);

let openSet = [];
let closedSet = [];
let start;
let end;
let w, h;
let path = [];

function Spot(c, j) {
    this.c = c;
    this.j = j;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.neighbors = [];
    this.previous = undefined;
    this.wall = false;

    if (random(1) < 0.3){
        this.wall = true;   
    }

    this.show = function (col){
        fill(col);
        if (this.wall){
            fill(0);
        }
        noStroke();
        rect(this.c * w, this.j * h, w-1, h-1);
    }

    this.addNeighbors = function (grid) {
        let c = this.c;
        let j = this.j;
        if (c < cols - 1){
            this.neighbors.push(grid[c + 1][j]);
        }
        if (c > 0){
            this.neighbors.push(grid[c - 1][j]);
        }
        if (j < rows - 1){
            this.neighbors.push(grid[c][j + 1]);
        }
        if (j > 0){
            this.neighbors.push(grid[c][j - 1]);
        }
        if (c > 0 && j > 0){
            this.neighbors.push(grid[c - 1][j - 1]);
        }
        if (c < cols - 1 && j > 0){
            this.neighbors.push(grid[c + 1][j - 1]);
        }
        if (c > 0 && j < rows - 1){
            this.neighbors.push(grid[c - 1][j + 1]);
        }
        if (c < cols - 1 && j < rows - 1){
            this.neighbors.push(grid[c + 1][j + 1]);
        }
    }
}

function setup() {
    createCanvas(400, 400);
    console.log('A*');

    w = width / rows;
    h = height / cols;

    for (let i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    for (let c = 0; c < cols; c++) {
        for (let j = 0; j < rows; j++) {
            grid[c][j] = new Spot(c, j);
        }
    }

    for (let c = 0; c < cols; c++) {
        for (let j = 0; j < rows; j++) {
            grid[c][j].addNeighbors(grid);
        }
    }

    start = grid[0][0];
    end = grid[cols - 1][4];

    start.wall = false;
    end.wall = false;

    openSet.push(start);
}

function draw() {

    if (openSet.length > 0){

        let winner = 0;
        for (let i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f){
                winner = i;
            }
            var current = openSet[winner];

            if (current === end){
                noLoop();
                console.log('DONE!');
                frameRate(0);
            }

            removeFromArray(openSet, current)
            closedSet.push(current);

            let neighbors = current.neighbors;

            for (let i=0; i < neighbors.length; i++){
                let neighbor = neighbors[i];

                if (!closedSet.includes(neighbor) && !neighbor.wall){
                    let tempG = current.g + 1;

                    if (openSet.includes(neighbor)){
                        if (tempG < neighbor.g){
                            neighbor.g = tempG;
                        }
                    }else {
                        neighbor.g = tempG;
                        openSet.push(neighbor);
                    }

                    neighbor.h = heuristic(neighbor, end);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous = current;
                }
            }
        }

    }else {
        // No solution
        console.log('No solution');
        noLoop();
        return;
    }

    background(0);

    for (let c = 0; c < cols; c++) {
        for (let j = 0; j < rows; j++) {
            grid[c][j].show(color(255));
        }
    }

    for (let i = 0; i < closedSet.length; i++){
        closedSet[i].show(color(255,0,0));
    }

    for (let i = 0; i < openSet.length; i++){
        openSet[i].show(color(0, 255, 0));
    }

    // Find the path
    path = [];
    let temp = current;
    path.push(temp);
    while(temp.previous){
        path.push(temp.previous);
        temp = temp.previous;
    }

    for (let i = 0; i < path.length; i++){
        path[i].show(color(0, 0, 255));
    }
}