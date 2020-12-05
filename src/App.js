import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
import './App.scss';

let numRows = 50;
let numCols = 50;

const operations = [ [0, 1], [0, -1], [1, -1], [-1, 1], [1, 1], [-1, -1], [1, 0], [-1, 0] ];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 100);
    setGeneration(prevGeneration => prevGeneration + 1)
  }, []);


  return (
    <div className='app'>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      
      <button
        onClick={() => {
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        forward
      </button>

      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random
      </button>

      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
      <br></br>
      <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < (numRows=10); i++) {
              rows.push(
                Array.from(Array(numCols=10), () => 0)
              );
            }

            setGrid(rows);
          }}
        >
          size 10x10
        </button>

        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < (numRows=30); i++) {
              rows.push(
                Array.from(Array(numCols=30), () => 0)
              );
            }

            setGrid(rows);
          }}
        >
          size 30x30
        </button>

        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < (numRows=50); i++) {
              rows.push(
                Array.from(Array(numCols=50), () => 0)
              );
            }

            setGrid(rows);
          }}
        >
          size 50x50
      </button>

      <h3>Generations: {generation}</h3>
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 19,
                height: 20,
                backgroundColor: grid[i][k] ? "gray" : undefined,
                border: "solid 1px black"
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default App;