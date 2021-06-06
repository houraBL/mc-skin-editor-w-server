import React from 'react';
import ReactDOM from 'react-dom';


//import AppHeader from '../app-header';
import TopPanel from '../top-panel';
import SkinLayers from '../skin-layers';
import Library from '../library';
import Redactor from '../redactor';
import Tools from '../tools';

import './app.css';


export default class App extends React.Component {
    maxId = 100;
    state = {
        skinLayersData: [
            this.createSkinLayer('Base', '', true),
            this.createSkinLayer('maid HBomb94', 'https://texture.namemc.com/ae/fc/aefc9682a40ebaf0.png'),
            this.createSkinLayer('Ramboob', 'https://texture.namemc.com/c8/68/c86868b8b045944d.png'),
        ],
        displayColorPicker: false,
        color: {
            r: '0',
            g: '0',
            b: '0',
            a: '1',
        },
        hexColor: "#000000",
        visibleParts: {
            rightLeg: true, leftLeg: true, rightLegO: true, leftLegO: true,
            rightArm: true, leftArm: true, rightArmO: true, leftArmO: true,
            head: true, headO: true,
            body: true, bodyO: true,
        },
        chosenId: "l-main",
        is3D: true,
    }

    createSkinLayer(label, src, isMain) {
        if (isMain === undefined) {
            return {
                label,
                id: 'l' + this.maxId++,
                src,
                visible: true,
                chosen: false,
                isMain: false,
            }
        } else {
            return {
                label,
                id: 'l-main',
                src,
                visible: true,
                chosen: true,
                isMain: true
            }
        }
    }


    onToggleHide = (id) => {
        this.setState(({ skinLayersData }) => {
            return {
                skinLayersData: this.toggleProperty(skinLayersData, id, 'visible')
            };
        });
    };

    onToggleChosen = (currentTarget) => {
        this.setState(({ skinLayersData }) => {
            return {
                skinLayersData: this.toggleProperty(skinLayersData, this.state.chosenId, 'chosen')
            };
        });
        this.setState(({ skinLayersData }) => {
            return {
                skinLayersData: this.toggleProperty(skinLayersData, currentTarget, 'chosen')
            };
        });
        this.setState({ chosenId: currentTarget });
    };

    onToggleIs3D = ({ currentTarget }) => {
        switch (currentTarget.id) {
            case '2d':
                this.setState(() => {
                    return {
                        is3D: false
                    };
                });
                break;
            case '3d':
                this.setState(() => {
                    return {
                        is3D: true
                    };
                });
                break;
            default:
                this.setState(() => {
                    return {
                        is3D: true
                    };
                });
                break;
        }
    }


    toggleProperty(arr, id, propName) {
        const idx = arr.findIndex((el) => el.id === id);
        const oldItem = arr[idx];
        const newItem = {
            ...oldItem,
            [propName]: !oldItem[propName]
        };

        return [
            ...arr.slice(0, idx),
            newItem,
            ...arr.slice(idx + 1)
        ];
    };

    onColorChange = (color) => {
        this.setState({ color: color.rgb });
        this.setState({ hexColor: color.hex });
    };

    onSwatchClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    onBodyPartClick = ({ currentTarget }) => {

        var c = window.getComputedStyle(currentTarget).backgroundColor;
        if (c === "rgb(95, 158, 160)") {
            currentTarget.style.background = "rgb(168, 212, 212)";

        } else {
            currentTarget.style.background = "rgb(95, 158, 160)";
        }
        this.setState({ visibleParts: this.toggleBodyPastVisibility(this.state.visibleParts, currentTarget.id) });
    }


    toggleBodyPastVisibility = (object, id) => {
        object[id] = !object[id];
        return object;
    }



    deleteItem = (id) => {
        this.setState(({ skinLayersData }) => {
            const index = skinLayersData.findIndex((el) => el.id === id);
            const newSkinLayersData = [
                ...skinLayersData.slice(0, index),
                ...skinLayersData.slice(index + 1)
            ];
            return {
                skinLayersData: newSkinLayersData
            };
        });
    };

    render() {
        const { skinLayersData, chosenId } = this.state;
        //const visibleLayers = skinLayersData.filter((el) => el.visible);
        //<Library className = ""/>
        return (
            <div className="app">
                <TopPanel
                    toggleIs3D={this.onToggleIs3D} />


                <div className="row mb2 d-flex align-items-top no-gutters align-items-center ">
                    <div className="col-md-3">

                        <SkinLayers
                            chosenId={chosenId}
                            skinLayers={skinLayersData}
                            onDeleted={this.deleteItem}
                            onToggleHide={this.onToggleHide}
                            onToggleChosen={this.onToggleChosen} />


                    </div>
                    <div className="col-md-6">
                        <Redactor skinLayersData={skinLayersData}
                            hexColor={this.state.hexColor}
                            visibleParts={this.state.visibleParts}
                            is3D={this.state.is3D} 
                            chosenId = {this.state.chosenId}/>
                    </div>
                    <div className="col-md-3 ">

                        <Tools
                            onBodyPartClick={this.onBodyPartClick}
                            color={this.state.color}
                            displayColorPicker={this.state.displayColorPicker}
                            onColorChange={this.onColorChange}
                            onSwatchClick={this.onSwatchClick}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

