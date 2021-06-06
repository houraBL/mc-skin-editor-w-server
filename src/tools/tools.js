import React from 'react';
import { SketchPicker } from 'react-color';
import reactCSS from 'reactcss'


import "./tools.css"

export default class Tools extends React.Component {
    state = {
        displayColorPicker: this.props.displayColorPicker,
        color: this.props.color,
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {
        this.setState({ color: color.rgb })
    };

    

    render() {
        const styles = reactCSS({
            'default': {
              color: {
                width: '24px',
                height: '24px',
                borderRadius: '2px',
                background: `rgba(${ this.props.color.r }, ${ this.props.color.g }, ${ this.props.color.b }, ${ this.state.color.a })`,
              },
              swatch: {
                padding: '5px',
                background: '#fff',
                borderRadius: '1px',
                boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                display: 'inline-block',
              },
              popover: {
                position: 'absolute',
                zIndex: '5',
              },
              cover: {
                position: 'fixed',
                top: '0px',
                right: '0px',
                bottom: '0px',
                left: '0px',
              },
            },
        });
        
        const {color, onColorChange, onSwatchClick, onBodyPartClick, displayColorPicker} = this.props;
        
        return (
            <ul className="d-block p-1 item-list list-group  ">
                <li className="list-group-item skin-parts tool-list">
                    <span className = 'row justify-content-center' >Skin parts</span>
                    <span className = 'row '>
                        <span className = 'col-md-6 justify-content-center'>Body</span>
                        <span className = 'col-md-6 justify-content-center'>Overlay</span>
                    </span>
                    <span className = 'row'>
                        <span className = 'col-md-6'>
                            <span className = 'row d-flex justify-content-center'>
                                <div id="head" className = " body-part" onClick = {onBodyPartClick} style={{width: '16px', height: '16px',}}  >
                                </div>
                            </span>
                            <span className = 'row justify-content-center'>
                                <div id="rightArm" className = " body-part limb" onClick = {onBodyPartClick}  style={{ }}  >
                                </div>
                                <div id="body" className = " body-part"  onClick = {onBodyPartClick}  style={{
                                    width: '16px',
                                    height: '24px',                                            
                                    }}  >
                                </div>
                                <div  id="leftArm" className = " body-part limb"  onClick = {onBodyPartClick}  style={{ }}  >
                                </div>
                            </span>
                            <span className = "row justify-content-center">
                                <div   id="rightLeg" className = " body-part limb" onClick = {onBodyPartClick}  style={{ }}  >
                                </div>
                                <div   id="leftLeg" className = " body-part limb" onClick = {onBodyPartClick}  style={{ }}  >
                                </div>
                            </span>
                        </span>
                        <span className = 'col-md-6'>
                            <span className = 'row d-flex justify-content-center'>
                                <div  id="headO"  className = " body-part" onClick = {onBodyPartClick}  style={{
                                    width: '16px',
                                    height: '16px',                                        
                                    }}  >
                                </div>
                            </span>
                            <span className = 'row justify-content-center'>
                                <div  id="rightArmO"  className = " body-part limb"  onClick = {onBodyPartClick} style={{ }}  >
                                </div>
                                <div id="bodyO"  className = " body-part"  onClick = {onBodyPartClick}  style={{
                                    width: '16px',
                                    height: '24px',                                            
                                    }}  >
                                </div>
                                <div  id="leftArmO" className = " body-part limb"  onClick = {onBodyPartClick}  style={{ }}  >
                                </div>
                            </span>
                            <span className = "row justify-content-center">
                                <div  id="rightLegO"  className = " body-part limb"  onClick = {onBodyPartClick} style={{ }}  >
                                </div>
                                <div  id="leftLegO"  className = " body-part limb" onClick = {onBodyPartClick}  style={{ }}  >
                                </div>
                            </span>
                        </span>
                        
                    </span>
                </li>
                <li className="list-group-item list-group-item-action">Bucket
                    
                </li>
                <li className="list-group-item tool list-group-item-action">Pan</li>
                <li className="list-group-item tool list-group-item-action">
                    <label>Color</label>
                    <div className=" float-right" style={ styles.color }  onClick={ onSwatchClick }/>
                    <div>
                        { displayColorPicker ? <div style={ styles.popover} >
                        <div style={ styles.cover} onClick={ onSwatchClick }/>
                        <SketchPicker color={ color } onChange={ onColorChange }  />
                        </div> : null }

                    </div>
                </li>
                <li className="list-group-item list-group-item-action">Transparent</li>
                <li className="list-group-item list-group-item-action">Easer</li>
                <li className="list-group-item list-group-item-action">Random colors</li>
            </ul>
        );
    }
};
