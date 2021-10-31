import cloneDeep from "lodash.clonedeep";

export default function reducer(state, action) {
    const {
        numberOfPeople,
        infectionChance,
        vaxRate,
        incubationPeriod,
        speed,
        mortalityRate,
        periodUntilMortalityOrRecovery,
        infected,
        healthy,
        incubating,
        recovered,
        deceased,
    } = state;
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
