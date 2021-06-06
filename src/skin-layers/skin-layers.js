import React from 'react';

import SkinLayer from '../skin-layer'
import "./skin-layers.css"

const SkinLayers = ({ chosenId, skinLayers, onDeleted, onToggleChosen, onToggleHide }) => {
    const elements = skinLayers.map((item) => {
        const { id, ...itemProps } = item;
        return (
            <li key={id} className="skin-layer">
                <SkinLayer {...itemProps}
                    id={id}
                    chosenId={chosenId}
                    onDeleted={() => onDeleted(id)}
                    onToggleHide={() => onToggleHide(id)}
                    onToggleChosen={() => onToggleChosen(id)} />
            </li>
        )
    })



    return (
        <div className="d-block p-1 ">
            <h5>SkinLayers</h5>
            <ul className="item-list list-group ">
                {elements}
            </ul>
        </div>
    );
};

export default SkinLayers;