import "./App.css";
import { createContext, useReducer, useEffect } from "react";
import reducer from "../reducer";
import Setting from "../Setting/Index";
import cloneDeep from "lodash.clonedeep";

const initialState = {
    numberOfPeople: 500,
    vaxRate: 20,
    infectionChance: 50,
    incubationPeriod: 2,
    speed: 25,
};

const mainContext = createContext(initialState);

function App() {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(
        function () {
            const nodes = document.querySelectorAll(".node");
            const nodeCoordinates = new Map();
            const vaccinatedPopulation = Math.ceil((state.numberOfPeople * state.vaxRate) / 100);
            let viewportWidth = window.innerWidth;
            let viewportHeight = window.innerHeight;
            const viewportArea = viewportWidth * viewportHeight;
            const nodePadding = `${0.8 * (viewportArea / 2073600) * (300 / (state.numberOfPeople + 60)) + 0.5}rem`;
            const nodeBorder = `${parseFloat(nodePadding) < 0.65 ? "0.1rem" : parseFloat(nodePadding) < 1.4 ? "0.2rem" : "0.3rem"}`;
            const nodeDirections = {};
            const restartButton = document.getElementById("button-restart");
            const settingsButton = document.getElementById("button-settings");
            const settingsButtonArrow = document.getElementById("button-settings__arrow");
            const selection = document.getElementById("selection");
            const settingsTransform = -document.querySelector(".settings").getBoundingClientRect().bottom;

            // grid for hashing locations of nodes

            nodes.forEach(function (node) {
                const topPos = Math.random() * 100;
                const leftPos = Math.random() * 100;
                node.style.padding = `${nodePadding}`;
                node.style.border = `${nodeBorder} solid black`;
                node.style.top = `${topPos}%`;
                node.style.left = `${leftPos}%`;
                nodeDirections[node.id] = Math.random() * 360;

                nodeCoordinates.set(node.id, [topPos, leftPos]);
                node.classList.remove("node--vaccinated");
                node.classList.remove("node--incubating");
                node.classList.remove("node--infected");
            });

            const nodeWidth = nodes[0].offsetWidth;
            for (let i = 0; i < vaccinatedPopulation; i++) {
                nodes[i].classList.add("node--vaccinated");
            }

            if (vaccinatedPopulation < state.numberOfPeople) {
                nodes[state.numberOfPeople - 1].classList.add("node--infected");
            }

            const degreesToRadians = Math.PI / 180;

            const moveNodes = function () {
                console.log(state.speed);
                const movement = state.speed / 130;
                nodes.forEach(function (node) {
                    const parseFloatedTop = parseFloat(node.style.top);
                    const parseFloatedLeft = parseFloat(node.style.left);

                    const direction = nodeDirections[node.id];

                    const verticalMove = movement * -Math.sin(direction * degreesToRadians);
                    const horizontalMove = movement * Math.cos(direction * degreesToRadians);

                    const topAdded = parseFloatedTop + verticalMove;
                    const leftAdded = parseFloatedLeft + horizontalMove;

                    const newTop = 0 < topAdded && topAdded < 100 ? topAdded : topAdded < 0 ? 0 : 100;
                    const newLeft = 0 < leftAdded && leftAdded < 100 ? leftAdded : leftAdded < 0 ? 0 : 100;

                    node.style.top = `${newTop}%`;
                    node.style.left = `${newLeft}%`;

                    nodeCoordinates[node.id] = [newTop, newLeft];

                    if (parseFloatedLeft <= 0 && 90 < direction && direction < 270) {
                        if (direction < 180) {
                            nodeDirections[node.id] = 90 - Math.random() * 90;
                        } else {
                            nodeDirections[node.id] = 270 + Math.random() * 90;
                        }
                    } else if (parseFloatedLeft >= 100 && (direction < 90 || 270 < direction)) {
                        if (direction < 90) {
                            nodeDirections[node.id] = 90 + Math.random() * 90;
                        } else {
                            nodeDirections[node.id] = 270 - Math.random() * 90;
                        }
                    } else if (parseFloatedTop <= 0 && 0 < direction && direction < 180) {
                        if (direction < 90) {
                            nodeDirections[node.id] = 360 - Math.random() * 90;
                        } else {
                            nodeDirections[node.id] = 180 + Math.random() * 90;
                        }
                    } else if (parseFloatedTop >= 100 && 180 < direction) {
                        if (direction < 270) {
                            nodeDirections[node.id] = 180 - Math.random() * 90;
                        } else {
                            nodeDirections[node.id] = Math.random() * 90;
                        }
                    } else {
                        nodeDirections[node.id] += Math.random() * 40 - 20;
                        if (nodeDirections[node.id] >= 360) nodeDirections[node.id] -= 360;
                        if (nodeDirections[node.id] <= 0) nodeDirections[node.id] += 360;
                    }
                });
            };

            const handleOverlaps = function () {
                const app = document.querySelector(".app");

                const [viewportHeight, viewportWidth] = [window.innerHeight, window.innerWidth];

                const nodeIdToNode = {};

                let gridCellsX = Math.ceil(viewportWidth / nodeWidth);
                let gridCellsY = Math.ceil(viewportHeight / nodeWidth);
                const grid = {};

                for (let gridY = 0; gridY < gridCellsY; gridY++) {
                    for (let gridX = 0; gridX < gridCellsX; gridX++) {
                        grid[`${gridY},${gridX}`] = [];
                    }
                }

                nodes.forEach(function (node, index) {
                    const [nodeTop, nodeLeft] = nodeCoordinates[node.id];
                    let bucketY = Math.floor((nodeTop / 100) * gridCellsY);
                    let bucketX = Math.floor((nodeLeft / 100) * gridCellsX);
                    if (bucketY >= gridCellsY) bucketY = gridCellsY - 1;
                    if (bucketY < 0) bucketY = 0;
                    if (bucketX >= gridCellsX) bucketX = gridCellsX - 1;
                    if (bucketX < 0) bucketX = 0;

                    nodeIdToNode[node.id] = node;
                    grid[`${bucketY},${bucketX}`].push(node.id);
                });

                nodes.forEach(function (node, index) {
                    const classList = node.classList;
                    if (
                        classList.contains("node--vaccinated") ||
                        classList.contains("node--infected" || classList.contains("node--incubating"))
                    )
                        return;

                    const halfNodeWidth = nodeWidth / 2;

                    const [nodeTop, nodeLeft] = nodeCoordinates[node.id];

                    let bucketY = Math.floor((nodeTop / 100) * gridCellsY);
                    let bucketX = Math.floor((nodeLeft / 100) * gridCellsX);

                    if (bucketY >= gridCellsY) bucketY = gridCellsY - 1;
                    if (bucketY < 0) bucketY = 0;
                    if (bucketX >= gridCellsX) bucketX = gridCellsX - 1;
                    if (bucketX < 0) bucketX = 0;

                    const bucket = `${bucketY},${bucketX}`;

                    const bucketsToSearch = [bucket];

                    const nodeCentreTop = (nodeTop / 100) * viewportHeight;
                    const nodeCentreLeft = (nodeLeft / 100) * viewportWidth;

                    const overlappingTop =
                        nodeCentreTop - halfNodeWidth > 0 &&
                        Math.floor(((nodeCentreTop - halfNodeWidth) / viewportHeight) * gridCellsY) < bucketY;

                    const overlappingBottom =
                        nodeCentreTop + halfNodeWidth < viewportHeight &&
                        Math.floor(((nodeCentreTop + halfNodeWidth) / viewportHeight) * gridCellsY) > bucketY;

                    const overlappingLeft =
                        nodeCentreLeft - halfNodeWidth > 0 &&
                        Math.floor(((nodeCentreLeft - halfNodeWidth) / viewportWidth) * gridCellsX) < bucketX;

                    const overlappingRight =
                        nodeCentreLeft + halfNodeWidth < viewportWidth &&
                        Math.floor(((nodeCentreLeft + halfNodeWidth) / viewportWidth) * gridCellsX) > bucketX;

                    if (overlappingTop) bucketsToSearch.push(`${bucketY - 1},${bucketX}`);
                    if (overlappingBottom) bucketsToSearch.push(`${bucketY + 1},${bucketX}`);
                    if (overlappingLeft) bucketsToSearch.push(`${bucketY},${bucketX - 1}`);
                    if (overlappingRight) bucketsToSearch.push(`${bucketY},${bucketX + 1}`);
                    if (overlappingBottom && overlappingRight) bucketsToSearch.push(`${bucketY + 1},${bucketX + 1}`);
                    if (overlappingTop && overlappingRight) bucketsToSearch.push(`${bucketY - 1},${bucketX + 1}`);
                    if (overlappingBottom && overlappingLeft) bucketsToSearch.push(`${bucketY + 1},${bucketX - 1}`);
                    if (overlappingTop && overlappingLeft) bucketsToSearch.push(`${bucketY - 1},${bucketX - 1}`);

                    for (const bucket of bucketsToSearch) {
                        if (!grid[bucket]) {
                        }
                        for (const otherNodeId of grid[bucket]) {
                            if (otherNodeId === node.id) continue;

                            if (!document.querySelector(`#${otherNodeId}`).classList.contains("node--infected")) continue;

                            const [otherNodeTop, otherNodeLeft] = nodeCoordinates[otherNodeId];

                            const horizonSeparation = (Math.abs(nodeLeft - otherNodeLeft) * viewportWidth) / 100;
                            const verticalSeparation = (Math.abs(nodeTop - otherNodeTop) * viewportHeight) / 100;
                            const separation = Math.sqrt(horizonSeparation ** 2 + verticalSeparation ** 2);

                            if (separation < nodeWidth) {
                                if (state.incubationPeriod === 0) {
                                    node.classList.add("node--infected");
                                } else {
                                    node.classList.add("node--incubating");
                                    setTimeout(function () {
                                        if (node.classList.contains("node--incubating")) {
                                            node.classList.remove("node--incubating");
                                            node.classList.add("node--infected");
                                        }
                                    }, state.incubationPeriod * 1000);
                                }
                            }
                        }
                    }
                });
            };

            const moveNodesInterval = setInterval(moveNodes, 40);
            const handleOverlapsInterval = setInterval(handleOverlaps, 100);

            const restartHandler = function () {
                const newNumberOfPeople = +document.querySelector("#input--nodes").value;
                const newVaccinationRate = +document.querySelector("#input--vaccincation-rate").value;
                const newInfectionChance = +document.querySelector("#input--infectiousness").value;
                const newIncubationPeriod = +document.querySelector("#input--incubation-period").value;
                const newSpeed = +document.querySelector("#input--speed").value;

                dispatch({
                    type: "SET_ALL_INFECTION_VALUES",
                    payload: {
                        numberOfPeople: newNumberOfPeople,
                        vaxRate: newVaccinationRate,
                        infectionChance: newInfectionChance,
                        incubationPeriod: newIncubationPeriod,
                        speed: newSpeed,
                    },
                });
            };

            restartButton.addEventListener("click", restartHandler);

            const settingsHandler = function () {
                if (selection.classList.contains("selection--closed")) {
                    selection.style.transform = "translateY(0)";
                    selection.classList.remove("selection--closed");
                    settingsButtonArrow.classList.remove("button-settings__arrow--down");
                } else {
                    selection.style.transform = `translateY(${settingsTransform}px)`;
                    selection.classList.add("selection--closed");
                    settingsButtonArrow.classList.add("button-settings__arrow--down");
                }
            };

            settingsButton.addEventListener("click", settingsHandler);

            return function () {
                clearInterval(moveNodesInterval);
                clearInterval(handleOverlapsInterval);
                restartButton.removeEventListener("click", restartHandler);
                settingsButton.removeEventListener("click", settingsHandler);
            };
        },
        [state]
    );

    return (
        <mainContext.Provider value={{ state, dispatch }}>
            <div className="app">
                <div className="selection" id="selection">
                    <section className="settings" id="settings">
                        <h2>Settings</h2>
                        <Setting
                            title="Population:"
                            min="1"
                            max="2000"
                            defaultValue="500"
                            sliderId="slider--nodes"
                            inputId="input--nodes"
                            unit="#"
                        ></Setting>
                        <Setting
                            title="Vaccination Rate:"
                            min="0"
                            max="100"
                            defaultValue="20"
                            sliderId="slider--vaccination-rate"
                            inputId="input--vaccincation-rate"
                            unit="%"
                        ></Setting>
                        <Setting
                            title="Infectiousness:"
                            min="1"
                            max="100"
                            defaultValue="70"
                            sliderId="slider--infectiousness"
                            inputId="input--infectiousness"
                            unit="%"
                        ></Setting>
                        <Setting
                            title="Incubation Period:"
                            min="0"
                            max="50"
                            defaultValue="2"
                            sliderId="slider--incubation-period"
                            inputId="input--incubation-period"
                            unit="secs"
                        ></Setting>
                        <Setting
                            title="Speed:"
                            min="10"
                            max="100"
                            defaultValue="40"
                            sliderId="slider--speed"
                            inputId="input--speed"
                            unit="%"
                        ></Setting>
                    </section>
                    <div className="buttons">
                        <button type="button" onClick={function () {}} className="selection__button" id="button-restart">
                            Restart
                        </button>
                        <button type="button" className="selection__button" id="button-settings">
                            Infection settings
                            <p id="button-settings__arrow" className="button-settings__arrow--up">
                                &uarr;
                            </p>
                        </button>
                    </div>
                </div>
                <main className="main">
                    {Array.apply(null, Array(state.numberOfPeople)).map(function (_, i) {
                        return <div id={`node--${i}`} key={i} className="node"></div>;
                    })}
                </main>
            </div>
        </mainContext.Provider>
    );
}

export { mainContext };

export default App;
