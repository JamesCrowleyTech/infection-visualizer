import React, { useEffect } from "react";
import "./Index.css";

export default function Setting({ title, min, max, defaultValue, sliderId, inputId, unit = "#" }) {
    useEffect(function () {
        const slider = document.querySelector("#" + sliderId);
        const input = document.querySelector("#" + inputId);
        input.value = slider.value;
    });

    return (
        <div className="settings__setting">
            <h3 className="setting__title">{title}</h3>
            <input
                type="range"
                min={min}
                max={max}
                className="setting__slider"
                id={sliderId}
                defaultValue={defaultValue}
                onChange={function () {
                    const slider = document.querySelector("#" + sliderId);
                    const input = document.querySelector("#" + inputId);
                    input.value = slider.value;
                }}
            ></input>
            <input
                type="number"
                className="setting__input"
                id={inputId}
                min={min}
                max={max}
                onChange={function () {
                    const slider = document.querySelector("#" + sliderId);
                    const input = document.querySelector("#" + inputId);
                    if (+input.value > +input.max) input.value = input.max;
                    if (+input.value < +input.min) input.value = input.min;
                    slider.value = parseInt(input.value);
                }}
            ></input>
            <h4 className="setting__input-unit">{unit}</h4>
            <div>ㅤ</div>
        </div>
    );
}
