import React from 'react';

import "./skin-layer.css"



export default class SkinLayers extends React.Component {
    state = {
        id: this.props.id,
        src: this.props.src,
        isMain: this.props.isMain,
        label: this.props.label,
    }

    componentDidMount() {

    }
    

    render() {
        const { onDeleted, onToggleHide, onToggleChosen, chosenId } = this.props;
        //let className = 'skin-layer';
        
        let divClassname = "list-group-item skin-layer";

        if (this.props.hidden) {
            //className += ' hidden';
        }

        if (chosenId === this.props.id) {
            divClassname += ' chosen';
        }
        return (
            <div className={divClassname} id={this.props.id} onClick = {onToggleChosen}>
                {this.state.isMain ? (
                    <div>
                        <label>{this.state.label}</label>
                        {/*<button type="button"
                            className="btn btn-sm btn-outline-info float-right"
                            disabled>
                            hide
                         </button>*/}
                    </div>
                ) : (
                    <div>

                        <label>{this.state.label}</label>
                        <button type="button"
                            className="btn btn-sm btn-del float-right"
                            onClick={onDeleted}>
                            del
                        </button>
                        <button type="button"
                            className="btn btn-sm btn-hide float-right"
                            onClick={onToggleHide}>
                            hide
                        </button>
                    </div>
                )}
            </div>
        );
    }
};
