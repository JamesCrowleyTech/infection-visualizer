import cloneDeep from "lodash.clonedeep";

export default function reducer(state, action) {
    if (action.type === "SET_ALL_INFECTION_VALUES") {
        const { numberOfPeople, infectionChance, vaxRate, incubationPeriod, speed, mortalityRate, periodUntilMortalityOrRecovery } =
            action.payload;
        return {
            ...state,
            numberOfPeople,
            infectionChance,
            vaxRate,
            incubationPeriod,
            speed,
            mortalityRate,
            periodUntilMortalityOrRecovery,
        };
    }
}
