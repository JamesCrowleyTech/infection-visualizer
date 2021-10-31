import React from "react";
import "./Index.css";

export default function Statistic({ id, num, colour }) {
    return (
        <div className="statistic" id={id}>
            <div
                className="statistic__node"
                style={{
                    backgroundColor: colour,
                }}
            ></div>
            <h3 className="statistic__number" id={`${id}__number`}>
                {num}
            </h3>
        </div>
    );
}
