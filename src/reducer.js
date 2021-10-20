import cloneDeep from "lodash.clonedeep";

export default function reducer(state, action) {
    if (action.type === "SET_ALL_INFECTION_VALUES") {
        return {
            ...state,
        };
    }
}
