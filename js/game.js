var Life = {
    /**
     * Initial game options.
     */
    config: {
        grid: {
            width: 100,
            height: 55 
        },
        boardElementId: 'gameContainer',
        cycleInterval: 5,
    },
    grid: [],
    board: false,
    controls: {},
    run: false,
    /**
     * Initialize the game
     */
    init: function() {
        var x,y;
        
        Life.board = document.getElementById(Life.config.boardElementId);
        Life.board.innerHTML = '';
        Life.grid = Life.createGrid();
        Life.board.appendChild(Life.grid.element);
        
        for (y=0; y<Life.grid.rows.length; y++) {
            Life.grid.rows[y] = Life.createRow(y);
            Life.grid.element.appendChild(Life.grid.rows[y].element);
            
            for (x=0; x<Life.grid.rows[y].columns.length; x++) {
                Life.grid.rows[y].columns[x] = Life.createCell(x,y);
                Life.grid.rows[y].element.appendChild(Life.grid.rows[y].columns[x].element);
            }
        }
    },
    createGrid: function() {
        var grid = {
            rows: new Array(Life.config.grid.height),
            element: Life.createGridElement(),
            map: function(callback) {
                var x,y;
                
                for (y=0; y<this.rows.length; y++) {
                    for (x=0; x<this.rows[y].columns.length; x++) {
                        this.rows[y].columns[x] = callback(this.rows[y].columns[x]);
                    }
                }
                
                return this;
            }
        };
        
        return grid;
    },
    createRow: function(y) {
        var row = {
            columns: new Array(Life.config.grid.width),
            element: Life.createRowElement(y),
        };
        
        return row;
    },
    createCell: function(x,y) {
        var cell = {
            x: x,
            y: y,
            state: false,
            neighbors: [false, false, false, false, false, false, false, false],
            element: Life.createCellElement(x,y)
        };
        
        return cell;
    },
    createGridElement: function() {
        var table = document.createElement("table");
        table.setAttribute("id", "boardTable");
        table.classList.add("board");
        
        table.addEventListener("contextmenu", function(e){
            e.preventDefault();
        });
        
        return table;
    },
    createRowElement: function(y) {
        var row = document.createElement("tr");
        row.setAttribute("id", "row." + y);
        row.classList.add("row");
        
        return row;
    },
    createCellElement: function(x,y) {
        var cell = document.createElement("td");
        cell.setAttribute("id", "cell." + y + "." + x);
        cell.classList.add("cell");
        (function(x,y){
            cell.addEventListener("mousedown", function(e){
                if (e.buttons === 1) {
                    Life.setCellState(x,y,true,true);
                } else if (e.buttons === 2) {
                    Life.setCellState(x,y,false,true);
                }
            });
            cell.addEventListener("mouseover", function(e){
                if (e.buttons === 1) {
                    Life.setCellState(x,y,true,true);
                } else if (e.buttons === 2) {
                    Life.setCellState(x,y,false,true);
                }
            });
        }(x,y));
        
        return cell;
    },
    createControls: function() {
        Life.controls.startButton = document.getElementById("startButton");
        Life.controls.startButton.addEventListener("click", function(){
            Life.start();
        });
        
        Life.controls.stopButton = document.getElementById("stopButton");
        Life.controls.stopButton.addEventListener("click", function(){
            Life.stop();
        });
        Life.controls.stopButton.classList.add("hide");
        
        Life.controls.stepButton = document.getElementById("stepButton");
        Life.controls.stepButton.addEventListener("click", function(){
            Life.stop();
            Life.cycle();
        });
        
        Life.controls.widthField = document.getElementById("widthField");
        Life.controls.heightField = document.getElementById("heightField");
        
        Life.controls.initButton = document.getElementById("initButton");
        Life.controls.initButton.addEventListener("click", function(){
            Life.stop();
            
            Life.config.grid.width = parseInt(Life.controls.widthField.value, 0);
            Life.config.grid.height = parseInt(Life.controls.heightField.value, 0);
            Life.init();
        });
    },
    getCellState: function(x, y) {
        /**
         * If a cell doesn't exist (i.e., is out of bounds), we can just set it
         * to false, as that will have the same effect as an empty neighbor.
         */
        if ((x < 0) || (y < 0)) {
            return false;
        }
        if ((x >= Life.config.grid.width) || (y >= Life.config.grid.height)) {
            return false;
        }
        
        return Life.grid.rows[y].columns[x].state;
    },
    setCellState: function(x, y, state, manual) {
        Life.grid.rows[y].columns[x].state = state;
        
        if (state) {
            Life.grid.rows[y].columns[x].element.classList.add("alive");
            Life.grid.rows[y].columns[x].element.classList.add("marked");
        } else {
            Life.grid.rows[y].columns[x].element.classList.remove("alive");
            if (manual) {
                Life.grid.rows[y].columns[x].element.classList.remove("marked");
            }
        }
        
        return true;
    },
    getNeighbors: function(cell) {
        var neighbors = [
            Life.getCellState((cell.x - 1), (cell.y - 1)),
            Life.getCellState((cell.x - 1), (cell.y + 0)),
            Life.getCellState((cell.x - 1), (cell.y + 1)),
            Life.getCellState((cell.x + 0), (cell.y - 1)),
            Life.getCellState((cell.x + 0), (cell.y + 1)),
            Life.getCellState((cell.x + 1), (cell.y - 1)),
            Life.getCellState((cell.x + 1), (cell.y + 0)),
            Life.getCellState((cell.x + 1), (cell.y + 1))
        ];
        
        return neighbors;
    },
    applyRules: function(cell) {
        var liveNeighborsCount = 0;
        var i;
        
        for (i=0; i<cell.neighbors.length; i++) {
            if (cell.neighbors[i]) {
                liveNeighborsCount++;
            }
        }
        
        if (cell.state) {
            if ((liveNeighborsCount === 2) || (liveNeighborsCount === 3)) {
                Life.setCellState(cell.x, cell.y, true);
            } else {
                Life.setCellState(cell.x, cell.y, false);
            }
        } else {
            if (liveNeighborsCount === 3) {
                Life.setCellState(cell.x, cell.y, true);
            }
        }
        
        return cell;
    },
    cycle: function() {
        Life.grid.map(function(cell){
            cell.neighbors = Life.getNeighbors(cell);
            
            return cell;
        });
        Life.grid.map(function(cell) {
            cell = Life.applyRules(cell);
            
            return cell;
        });
    },
    start: function() {
        Life.controls.startButton.classList.add("hide");
        Life.controls.stopButton.classList.remove("hide");
        Life.run = setInterval(Life.cycle, Life.config.cycleInterval);
    },
    stop: function() {
        Life.controls.stopButton.classList.add("hide");
        Life.controls.startButton.classList.remove("hide");
        window.clearInterval(Life.run);
        Life.run = false;
    }
};

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false);
    
    Life.createControls();
    Life.init();
}, false);