import cloneDeep from "lodash.clonedeep";

export default function reducer(state, action) {
    if (action.type === "SET_NUMBER_OF_NODES") {
        console.log(JSON.stringify(action));
        return {
            ...state,
            // numberOfPeople: action.payload,
        };
    }
}
