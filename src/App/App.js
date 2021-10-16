import "./App.css";
import { createContext, useReducer, useEffect } from "react";
import reducer from "../reducer";

const initialState = {
    numberOfPeople: 200,
    vaxRate: 20,
    infectionChance: 50,
};

const mainContext = createContext(initialState);

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(function () {
        const nodes = document.querySelectorAll(".node");
        const vaxxedPopulation = Math.ceil(
            (state.numberOfPeople * state.vaxRate) / 100
        );
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportArea = viewportWidth * viewportHeight;
        // prettier-ignore
        const nodeRadius = 0.8 * (viewportArea / 2073600) * (300 / (state.numberOfPeople + 60)) + 0.5;
        const nodeBorder = `${
            nodeRadius < 0.65 ? "1px" : nodeRadius < 1.4 ? "2px" : "3px"
        }`;
        const nodeDirections = {};
        nodes.forEach(function (node) {
            node.style.padding = `${nodeRadius}rem`;
            node.style.border = `${nodeBorder} solid black`;
            node.style.top = `${Math.random() * 100}%`;
            node.style.left = `${Math.random() * 100}%`;
            nodeDirections[node.id] = Math.random() * 360;
        });

        for (let i = 0; i < vaxxedPopulation; i++) {
            nodes[i].classList.add("node--vaxxed");
        }
        if (vaxxedPopulation < state.numberOfPeople)
            nodes[vaxxedPopulation].classList.add("node--infected");
        console.log(nodeDirections);
        console.log();

        const degreesToRadians = Math.PI / 180;
        const intervalFunc = async function () {
            const movement = 1;
            nodes.forEach(function (node) {
                const parseFloatedTop = parseFloat(node.style.top);
                const parseFloatedLeft = parseFloat(node.style.left);
                const direction = nodeDirections[node.id];

                const verticalMove =
                    movement * -Math.sin(direction * degreesToRadians);
                const horizontalMove =
                    movement * Math.cos(direction * degreesToRadians);

                node.style.top = `${parseFloatedTop + verticalMove}%`;
                node.style.left = `${parseFloatedLeft + horizontalMove}%`;

                // nodeDirections[node.id] += Math.random() * 60 - 30;
                // if (nodeDirections[node.id] >= 360)
                //     nodeDirections[node.id] -= 360;
                // if (nodeDirections[node.id] <= 0)
                //     nodeDirections[node.id] += 360;

                // prettier-ignore
                if (parseFloatedLeft < 0 && 90 < direction && direction < 270) {
                    if (direction < 180) {
                        nodeDirections[node.id] = 90 - Math.random() * 20;
                    } else {
                        nodeDirections[node.id] = 270 + Math.random() * 20;
                    }
                } else if (parseFloatedLeft > 100 && (direction < 90 || 270 < direction)) {
                    if (direction < 90) {
                        nodeDirections[node.id] = 90 + Math.random() * 20;
                    } else {
                        nodeDirections[node.id] = 270 - Math.random() * 20;
                    }
                } else if (parseFloatedTop < 0 &&0 < direction && direction < 180) {
                    if (direction < 90) {
                        nodeDirections[node.id] = 360 - Math.random() * 20;
                    } else {
                        nodeDirections[node.id] = 180 + Math.random() * 20;
                    }
                } else if (parseFloatedTop > 95 && 180 < direction) {
                    if (direction < 270) {
                        nodeDirections[node.id] = 180 - Math.random() * 20;
                    } else {
                        nodeDirections[node.id] = Math.random() * 20;
                    }
                } else {
                    nodeDirections[node.id] += Math.random() * 50 - 25;
                    if (nodeDirections[node.id] >= 360)
                        nodeDirections[node.id] -= 360;
                    if (nodeDirections[node.id] <= 0)
                        nodeDirections[node.id] += 360;
                }
            });
        };

        setInterval(intervalFunc, 100);

        // while (true) {
        //     for (let i = 0, people = state.numberOfPeople; i < people; i++) {}
        // }
    });

    return (
        <mainContext.Provider value={{ state, dispatch }}>
            <div className="app">
                <div className="selection"></div>
                {Array.apply(null, Array(state.numberOfPeople)).map(function (
                    _,
                    i
                ) {
                    return (
                        <div id={`node--${i}`} key={i} className="node"></div>
                    );
                })}
            </div>
        </mainContext.Provider>
    );
}

export { mainContext };

export default App;
