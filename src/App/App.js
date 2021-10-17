import "./App.css";
import { createContext, useReducer, useEffect } from "react";
import reducer from "../reducer";

const initialState = {
    numberOfPeople: 600,
    vaxRate: 20,
    infectionChance: 50,
};

const mainContext = createContext(initialState);

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(function () {
        const nodes = document.querySelectorAll(".node");
        const nodeCoordinates = new Map();
        const vaxxedPopulation = Math.ceil((state.numberOfPeople * state.vaxRate) / 100);
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const viewportArea = viewportWidth * viewportHeight;
        // prettier-ignore
        const nodePadding = `${0.8 * (viewportArea / 2073600) * (300 / (state.numberOfPeople + 60)) + 0.5}rem`;
        const nodeBorder = `${parseFloat(nodePadding) < 0.65 ? "0.1rem" : parseFloat(nodePadding) < 1.4 ? "0.2rem" : "0.3rem"}`;
        const nodeDirections = {};
        nodes.forEach(function (node) {
            const topPos = Math.random() * 100;
            const leftPos = Math.random() * 100;

            node.style.padding = `${nodePadding}`;
            node.style.border = `${nodeBorder} solid black`;
            node.style.top = `${topPos}%`;
            node.style.left = `${leftPos}%`;
            nodeDirections[node.id] = Math.random() * 360;

            nodeCoordinates.set(node.id, [topPos, leftPos]);
        });

        console.log(nodeCoordinates);

        const nodeWidth = nodes[0].offsetWidth;

        for (let i = 0; i < vaxxedPopulation; i++) {
            nodes[i].classList.add("node--vaxxed");
        }
        if (vaxxedPopulation < state.numberOfPeople) nodes[state.numberOfPeople - 1].classList.add("node--infected");

        const degreesToRadians = Math.PI / 180;

        const nodeMovementInterval = async function () {
            const movement = 0.1;
            nodes.forEach(function (node) {
                const parseFloatedTop = parseFloat(node.style.top);
                const parseFloatedLeft = parseFloat(node.style.left);

                const direction = nodeDirections[node.id];

                const verticalMove = movement * -Math.sin(direction * degreesToRadians);
                const horizontalMove = movement * Math.cos(direction * degreesToRadians);

                const newTop = parseFloatedTop + verticalMove;
                const newLeft = parseFloatedLeft + horizontalMove;

                node.style.top = `${newTop}%`;
                node.style.left = `${newLeft}%`;

                nodeCoordinates[node.id] = [newTop, newLeft];

                if (parseFloatedLeft < 0 && 90 < direction && direction < 270) {
                    if (direction < 180) {
                        nodeDirections[node.id] = 90 - Math.random() * 30;
                    } else {
                        nodeDirections[node.id] = 270 + Math.random() * 30;
                    }
                } else if (parseFloatedLeft > 98 && (direction < 90 || 270 < direction)) {
                    if (direction < 90) {
                        nodeDirections[node.id] = 90 + Math.random() * 30;
                    } else {
                        nodeDirections[node.id] = 270 - Math.random() * 30;
                    }
                } else if (parseFloatedTop < 0 && 0 < direction && direction < 180) {
                    if (direction < 90) {
                        nodeDirections[node.id] = 360 - Math.random() * 30;
                    } else {
                        nodeDirections[node.id] = 180 + Math.random() * 30;
                    }
                } else if (parseFloatedTop > 98 && 180 < direction) {
                    if (direction < 270) {
                        nodeDirections[node.id] = 180 - Math.random() * 30;
                    } else {
                        nodeDirections[node.id] = Math.random() * 30;
                    }
                } else {
                    nodeDirections[node.id] += Math.random() * 40 - 20;
                    if (nodeDirections[node.id] >= 360) nodeDirections[node.id] -= 360;
                    if (nodeDirections[node.id] <= 0) nodeDirections[node.id] += 360;
                }
            });
        };

        const handleOverlapsInterval = function () {
            const app = document.querySelector(".app");

            const [viewportHeight, viewportWidth] = [app.offsetHeight, app.offsetWidth];

            nodes.forEach(function (node, index) {
                if (node.classList.contains("node--vaxxed") || node.classList.contains("node--infected")) return;

                const nodeCoords = nodeCoordinates[node.id];
                const [nodeTop, nodeLeft] = nodeCoords;

                nodes.forEach(function (otherNode, otherIndex) {
                    if (index === otherIndex) return;

                    if (!otherNode.classList.contains("node--infected")) return;

                    const otherNodeCoords = nodeCoordinates[otherNode.id];
                    const [otherNodeTop, otherNodeLeft] = otherNodeCoords;

                    const horizonSeparation = (Math.abs(nodeLeft - otherNodeLeft) * viewportWidth) / 100;
                    const verticalSeparation = (Math.abs(nodeTop - otherNodeTop) * viewportHeight) / 100;

                    const separation = Math.sqrt(horizonSeparation ** 2 + verticalSeparation ** 2);

                    if (separation < nodeWidth) node.classList.add("node--infected");
                });
            });
        };

        setInterval(nodeMovementInterval, 34);
        setInterval(handleOverlapsInterval, 200);
    });

    return (
        <mainContext.Provider value={{ state, dispatch }}>
            <div className="app">
                <div className="selection"></div>
                {Array.apply(null, Array(state.numberOfPeople)).map(function (_, i) {
                    return <div id={`node--${i}`} key={i} className="node"></div>;
                })}
            </div>
        </mainContext.Provider>
    );
}

export { mainContext };

export default App;
