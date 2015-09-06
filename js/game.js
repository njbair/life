var Life = {
    /**
     * Initial game options.
     */
    config: {
        grid: {
            width: 100,
            height: 50
        },
        boardElementId: 'gameContainer',
        cycleInterval: 5,
    },
    grid: [],
    board: false,
    run: false,
    /**
     * Initialize the game
     */
    init: function() {
        var x,y;
        
        Life.board = document.getElementById(Life.config.boardElementId);
        
        Life.grid = {
            rows: new Array(Life.config.grid.height),
            element: (function() {
                var table = document.createElement("table");
                table.setAttribute("id", "boardTable");
                table.classList.add("board");
                
                table.addEventListener("contextmenu", function(e){
                    e.preventDefault();
                });
                
                return table;
            }()),
            map: function(callback) {
                var x,y;
                
                for (y in this.rows) {
                    for (x in this.rows[y].columns) {
                        this.rows[y].columns[x] = callback(this.rows[y].columns[x]);
                    }
                }
                
                return this;
            }
        };
        
        Life.board.appendChild(Life.grid.element);
        
        for (y=0; y<Life.grid.rows.length; y++) {
            
            Life.grid.rows[y] = {
                columns: new Array(Life.config.grid.width),
                element: (function() {
                    var row = document.createElement("tr");
                    row.setAttribute("id", "row." + y);
                    row.classList.add("row");
                    
                    return row;
                }())
            }
            
            Life.grid.element.appendChild(Life.grid.rows[y].element);
            
            for (x=0; x<Life.grid.rows[y].columns.length; x++) {
                Life.grid.rows[y].columns[x] = {
                    x: x,
                    y: y,
                    state: false,
                    neighbors: [false, false, false, false, false, false, false, false],
                    element: (function() {
                        var cell = document.createElement("td");
                        cell.setAttribute("id", "cell." + y + "." + x);
                        cell.classList.add("cell");
                        (function(x,y){
                            cell.addEventListener("mousedown", function(e){
                                if (e.buttons === 1) {
                                    Life.setCellState(x,y,true);
                                } else if (e.buttons === 2) {
                                    Life.setCellState(x,y,false);
                                }
                            });
                            cell.addEventListener("mouseover", function(e){
                                if (e.buttons === 1) {
                                    Life.setCellState(x,y,true);
                                } else if (e.buttons === 2) {
                                    Life.setCellState(x,y,false);
                                }
                            });
                        }(x,y));
                        
                        return cell;
                    }())
                };
                
                Life.grid.rows[y].element.appendChild(Life.grid.rows[y].columns[x].element);
            }
        }
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
    setCellState: function(x, y, state) {
        Life.grid.rows[y].columns[x].state = state;
        
        if (state) {
            Life.grid.rows[y].columns[x].element.classList.add("alive");
        } else {
            Life.grid.rows[y].columns[x].element.classList.remove("alive");
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
        
        for (i in cell.neighbors) {
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
    }
};

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false);
    Life.init();
    
    document.getElementById('startButton').addEventListener("click", function(e){
        e.preventDefault();
        
        if (Life.run) {
            this.innerHTML = "Start";
            window.clearInterval(Life.run);
            Life.run = false;
        } else {
            this.innerHTML = "Stop";
            Life.run = setInterval(Life.cycle, Life.config.cycleInterval);
        }
    });
}, false);