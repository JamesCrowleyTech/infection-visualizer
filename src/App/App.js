import "./App.css";
import { createContext, useReducer, useEffect } from "react";
import reducer from "../reducer";

const initialState = {
    numberOfPeople: 300,
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
        for (let i = 0; i < vaxxedPopulation; i++) {
            nodes[i].classList.add("node--vaxxed");
        }
        if (vaxxedPopulation < state.numberOfPeople)
            nodes[vaxxedPopulation].classList.add("node--infected");
    });

    return (
        <mainContext.Provider value={{ state, dispatch }}>
            <div className="app">
                <div className="selection"></div>
                {Array.apply(null, Array(state.numberOfPeople)).map(function (
                    _,
                    i
                ) {
                    return <div key={i} className="node"></div>;
                })}
            </div>
        </mainContext.Provider>
    );
}

export { mainContext };

export default App;
