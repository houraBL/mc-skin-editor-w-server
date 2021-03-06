import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import './redactor.css';
//import SkinLayers from '../skin-layers';

let camera, scene, renderer, controls, skinTexture;
let canvas, drawingCanvas, drawingContext;
let container;
let visibleLayers;
let visibleBodyParts;
let color;
let layers = [];
let i = 0;
let chosenId = "";

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const onClickPosition = new THREE.Vector2();
//var skinToLoad = 'https://texture.namemc.com/ae/fc/aefc9682a40ebaf0.png';
//var skinToLoad2 = 'https://texture.namemc.com/c8/68/c86868b8b045944d.png';

function init() {
    camera = new THREE.PerspectiveCamera(80, 1, 0.1, 1000);
    camera.position.set(0, 0, 40);

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas"), antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf0f8ff);
    //renderer.setSize( window.innerWidth / 2, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.ROTATE,
        MOUSEWHEEL: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
    }
    controls.minDistance = 20;
    controls.maxDistance = 50;
    controls.update();

    container = document.getElementById("container");
    container.appendChild(renderer.domElement);
    container.addEventListener('pointermove', onMouseMove);
    container.addEventListener('pointerdown', onMouseDown);
    container.addEventListener('pointerup', onMouseUp);
    // window.addEventListener( 'resize', onWindowResize );    
}

function onMouseDown(evt) {
    evt.preventDefault();
    if (evt.button === 0) {
        const array = getMousePosition(container, evt.clientX, evt.clientY);
        onClickPosition.fromArray(array);
        const intersects = getIntersects(onClickPosition, scene.children);
        if (intersects.length > 0 && intersects[0].uv) {
            controls.enabled = false;
        } else { controls.enabled = true; }
    }

}

function onMouseUp(evt) {
    evt.preventDefault();
    controls.enabled = true;
}

function onMouseMove(evt) {
    if (controls.enabled === false) {
        const array = getMousePosition(container, evt.clientX, evt.clientY);
        onClickPosition.fromArray(array);

        var objectsToRaycast = scene.children.filter((el) => el.visible);

        const intersects = getIntersects(onClickPosition, objectsToRaycast);
        if (intersects.length > 0 && intersects[0].uv) {
            const intersect = intersects[0];
            const uv = intersect.uv;
            const index = intersect.face.materialIndex;
            intersect.object.material[index].map.transformUv(uv);
            drawOnChosenLayer(uv.x, uv.y);
        }
    }
}

function getMousePosition(dom, x, y) {
    const rect = dom.getBoundingClientRect();
    let rendererXY = new THREE.Vector2();
    renderer.getSize(rendererXY);
    return [(x - rect.left) / rendererXY.width, (y - rect.top) / rendererXY.height];
}

function getIntersects(point, objects) {
    mouse.set((point.x * 2) - 1, - (point.y * 2) + 1);
    raycaster.setFromCamera(mouse, camera);
    return raycaster.intersectObjects(objects);
}

function CanvasTexture(parentTexture) {
    this._canvas = drawingCanvas || null;
    this._context2D = drawingContext || null;
    this._image = drawingContext.createImageData(drawingCanvas.width, drawingCanvas.height);
    this._data = this._image.data;
    if (parentTexture) {
        this._parentTexture.push(parentTexture);
        parentTexture.image = this._canvas;
    }
}

CanvasTexture.prototype = {
    constructor: CanvasTexture,
    _parentTexture: [],

    addParent: function (parentTexture) {
        if (this._parentTexture.indexOf(parentTexture) === - 1) {
            this._parentTexture.push(parentTexture);
            parentTexture.image = this._canvas;
        }
    },


    updateTextures: function () {
        for (let i = 0; i < this._parentTexture.length; i++) {
            this._parentTexture[i].needsUpdate = true;
        }
    },

};

function drawOnChosenLayer(x, y) {
    const _x = Math.floor(x * 64);
    const _y = Math.floor(y * 64);

    let layerId = -1;
    for (i = 0; i < layers.length; i++) {
        if (layers[i].id === chosenId) {
            layerId = i;
            break;
        }
    }
    if (layerId > -1) {
        if ( layers[layerId].visible === false) return;
        layers[layerId].layerContext.drawImage(layers[layerId].layerCanvas, 0, 0);
        layers[layerId].layerContext.fillStyle = color || "#000000";
        layers[layerId].layerContext.beginPath();
        layers[layerId].layerContext.rect(_x, _y, 1, 1);
        layers[layerId].layerContext.fill();
        sumUpLayers();

    }

}

function setupCanvasDrawing() {
    // get canvas and context
    drawingCanvas = document.getElementById('drawing-canvas');
    drawingContext = drawingCanvas.getContext('2d');

    skinTexture = new THREE.CanvasTexture(drawingCanvas);
    skinTexture.magFilter = THREE.NearestFilter;

    canvas = new CanvasTexture(skinTexture);
    sumUpLayers();

    // set the variable to keep track of when to draw
    let paint = false;
    drawingCanvas.addEventListener('pointerdown', function (e) {
        if (e.button === 0) { paint = true; };
        if (paint) drawOnChosenLayer(e.offsetX / drawingCanvas.clientWidth, e.offsetY / drawingCanvas.clientHeight);
    });
    drawingCanvas.addEventListener('pointermove', function (e) {
        if (paint) drawOnChosenLayer(e.offsetX / drawingCanvas.clientWidth, e.offsetY / drawingCanvas.clientHeight);
    });
    window.addEventListener('pointerup', function () {
        paint = false;
    });
};

//#region skin init
function skinInit() {
    var rightLeg = createLeg(0, 0, false);
    rightLeg.position.set(-2, -10, 0);
    rightLeg.name = 'rightLeg';
    var leftLeg = createLeg(0.25, -0.5, false);
    leftLeg.position.set(2, -10, 0);
    leftLeg.name = 'leftLeg';
    var rightLegO = createLeg(0, -0.25, true);
    rightLegO.position.set(-2.1184, -10, 0);
    rightLegO.name = 'rightLegO';
    var leftLegO = createLeg(0, -0.5, true);
    leftLegO.position.set(2.1184, -10, 0);
    leftLegO.name = 'leftLegO';
    scene.add(rightLeg, leftLeg, rightLegO, leftLegO);

    var rightArm = createArm(0.625, 0, false);
    rightArm.position.set(-6, 2, 0);
    rightArm.name = 'rightArm';
    var leftArm = createArm(0.5, -0.5, false);
    leftArm.position.set(6, 2, 0);
    leftArm.name = 'leftArm';
    var rightArmO = createArm(0.625, -0.25, true);
    rightArmO.position.set(-6.246, 2, 0);
    rightArmO.name = 'rightArmO';
    var leftArmO = createArm(0.75, -0.5, true);
    leftArmO.position.set(6.246, 2, 0);
    leftArmO.name = 'leftArmO';
    scene.add(rightArm, leftArm, rightArmO, leftArmO);
    var head = createHead(0, 0, false);
    head.position.set(0, 12, 0);
    head.name = 'head';
    var headO = createHead(0.5, 0, true);
    headO.position.set(0, 12, 0);
    headO.name = 'headO';
    scene.add(head, headO);

    var body = createBody(0, 0, false);
    body.position.set(0, 2, 0);
    body.name = 'body';
    var bodyO = createBody(0, -0.25, true);
    bodyO.position.set(0, 2, 0);
    bodyO.name = 'bodyO';
    scene.add(body, bodyO);
};

function createLeg(dx, dy, owerlay) {
    var legSides = [];
    for (i = 0; i < 6; i++) {
        legSides.push(skinTexture.clone());
        canvas.addParent(legSides[i]);
    }
    var size, transparent;
    owerlay ? size = 0.25 : size = 0;
    owerlay ? transparent = true : transparent = false;
    legSides[0].repeat.set(0.0625, 0.1875);
    legSides[0].offset.set(0.125 + dx, 0.5 + dy);
    legSides[1].repeat.set(0.0625, 0.1875);
    legSides[1].offset.set(0.0 + dx, 0.5 + dy);
    legSides[2].repeat.set(0.0625, 0.0625);
    legSides[2].offset.set(0.0625 + dx, 0.6875 + dy);
    legSides[3].repeat.set(0.0625, 0.0625);
    legSides[3].offset.set(0.125 + dx, 0.6875 + dy);
    legSides[4].repeat.set(0.0625, 0.1875);
    legSides[4].offset.set(0.0625 + dx, 0.5 + dy);
    legSides[5].repeat.set(0.0625, 0.1875);
    legSides[5].offset.set(0.1875 + dx, 0.5 + dy);
    var legMaterials = [];
    for (i = 0; i < 6; i++) {
        legMaterials.push(new THREE.MeshBasicMaterial(
            { map: legSides[i], transparent: transparent, side: THREE.DoubleSide }));
    }
    return new THREE.Mesh(new THREE.BoxGeometry(4 + size, 12 + size, 4 + size), legMaterials);
};
function createArm(dx, dy, owerlay) {
    /// TODO: SLIM SKIN
    var armSides = [];
    for (i = 0; i < 6; i++) {
        armSides.push(skinTexture.clone());
        canvas.addParent(armSides[i]);
    }
    var size, transparent;
    owerlay ? size = 0.25 : size = 0;
    owerlay ? transparent = true : transparent = false;
    armSides[0].repeat.set(0.0625, 0.1875);
    armSides[0].offset.set(0.125 + dx, 0.5 + dy);
    armSides[1].repeat.set(0.0625, 0.1875);
    armSides[1].offset.set(0.0 + dx, 0.5 + dy);
    armSides[2].repeat.set(0.0625, 0.0625);
    armSides[2].offset.set(0.0625 + dx, 0.6875 + dy);
    armSides[3].repeat.set(0.0625, 0.0625);
    armSides[3].offset.set(0.125 + dx, 0.6875 + dy);
    armSides[4].repeat.set(0.0625, 0.1875);
    armSides[4].offset.set(0.0625 + dx, 0.5 + dy);
    armSides[5].repeat.set(0.0625, 0.1875);
    armSides[5].offset.set(0.1875 + dx, 0.5 + dy);
    var armMaterials = [];
    for (i = 0; i < 6; i++) {
        armMaterials.push(new THREE.MeshBasicMaterial(
            { map: armSides[i], transparent: transparent, side: THREE.DoubleSide }));
    }
    return new THREE.Mesh(new THREE.BoxGeometry(4 + size, 12 + size, 4 + size), armMaterials)
};
function createHead(dx, dy, owerlay) {
    var headSides = [];

    for (i = 0; i < 6; i++) {
        headSides.push(skinTexture.clone());
        canvas.addParent(headSides[i]);
    }
    var size, transparent;
    owerlay ? size = 1 : size = 0;
    owerlay ? transparent = true : transparent = false;
    headSides[0].offset.set(0.25 + dx, 0.75);
    headSides[1].offset.set(0 + dx, 0.75);
    headSides[2].offset.set(0.125 + dx, 0.875);
    headSides[3].offset.set(0.375 + dx, 1);
    headSides[3].rotation = Math.PI;
    headSides[4].offset.set(0.125 + dx, 0.75);
    headSides[5].offset.set(0.375 + dx, 0.75);
    var headMaterials = [];
    for (i = 0; i < 6; i++) {
        headSides[i].repeat.set(0.125, 0.125);
        headMaterials.push(new THREE.MeshBasicMaterial(
            { map: headSides[i], transparent: transparent, side: THREE.DoubleSide }));
    }
    return new THREE.Mesh(new THREE.BoxGeometry(8 + size, 8 + size, 8 + size), headMaterials);
};
function createBody(dx, dy, owerlay) {
    var bodySides = [];

    for (i = 0; i < 6; i++) {
        bodySides.push(skinTexture.clone());
        canvas.addParent(bodySides[i]);
    }
    var size, transparent;
    owerlay ? size = 0.25 : size = 0;
    owerlay ? transparent = true : transparent = false;
    bodySides[0].repeat.set(0.0625, 0.1875);
    bodySides[0].offset.set(0.4375, 0.5 + dy);
    bodySides[1].repeat.set(0.0625, 0.1875);
    bodySides[1].offset.set(0.25, 0.5 + dy);
    bodySides[2].repeat.set(0.125, 0.0625);
    bodySides[2].offset.set(0.3125, 0.6875 + dy);
    bodySides[3].repeat.set(0.125, 0.0625);
    bodySides[3].offset.set(0.4375, 0.6875 + dy);
    bodySides[4].repeat.set(0.125, 0.1875);
    bodySides[4].offset.set(0.3125, 0.5 + dy);
    bodySides[5].repeat.set(0.125, 0.1875);
    bodySides[5].offset.set(0.5, 0.5 + dy);
    var bodyMaterials = [];
    for (i = 0; i < 6; i++) {
        bodyMaterials.push(new THREE.MeshBasicMaterial(
            { map: bodySides[i], transparent: transparent, side: THREE.DoubleSide }));
    }
    return new THREE.Mesh(new THREE.BoxGeometry(8 + size, 12 + size, 4 + size), bodyMaterials);
};
//#endregion


function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
        // you must pass false here or three.js sadly fights the browser
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // set render target sizes here
    }
}

function animate() {
    resizeCanvasToDisplaySize();
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
};

function sumUpLayers() {
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    for (i = 0; i < layers.length; i++) {
        if (layers[i].visible) {
            drawingContext.drawImage(layers[i].layerCanvas, 0, 0);
        }
    }
    canvas.updateTextures();
}

function addNewLayer(newLayer) {
    // Create the layer as a new canvas
    var layer = document.createElement("canvas");
    var layerContext = layer.getContext("2d");
    layerContext.imageSmoothingEnabled = false;
    if (newLayer.src === '') {
        layerContext.clearRect(0, 0, 64, 64);
        layerContext.fillStyle = "#cccccc";
        layerContext.beginPath();
        layerContext.rect(8, 0, 16, 8); //top head
        layerContext.rect(0, 8, 32, 8); // front and back
        layerContext.rect(4, 16, 8, 4);
        layerContext.rect(20, 16, 16, 4);
        layerContext.rect(44, 16, 8, 4);
        layerContext.rect(0, 20, 56, 12);
        layerContext.rect(20, 48, 8, 4);
        layerContext.rect(36, 48, 8, 4);
        layerContext.rect(16, 52, 32, 12);
        layerContext.fill();
    } else {
        //var imageObj  = new Image();
        //imageObj.addEventListener('load', function() {
        //    layerContext.drawImage(imageObj , 0, 0);
        //    sumUpLayers();
        //  }, false);
        //imageObj.onload = function() {
        //    layerContext.drawImage(imageObj , 0, 0);
        //    sumUpLayers();
        //};

        //imageObj.src = newLayer.src;


        var image = new THREE.ImageLoader().load(newLayer.src, function () {
            layerContext.drawImage(image, 0, 0);
            sumUpLayers();
        })


    }
    var newElement = {
        id: newLayer.id,
        layerCanvas: layer,
        layerContext: layerContext,
        visible: true
    }

    /* Add it to our layers array */
    layers.push(newElement);

}

function layersUpdate(skinLayers) {

    for (i = 0; i < skinLayers.length; i++) {
        addNewLayer(skinLayers[i]);
    }
    sumUpLayers();

}
//visibility 
function checkSkinLayers(skinLayers) {

    layers.forEach(element => {
        if (visibleLayers.includes(element.id)) {
            element.visible = true;
        } else {
            element.visible = false;
        }
    });

    if (layers.length > 0) {

        sumUpLayers();
    }
    if (layers.length !== skinLayers.length && layers.length > 0) {
        layersUpdate(skinLayers);
    }
}

function setColor(hexColor) {
    color = hexColor;
}

function setVisibleBodyParts(visibleParts) {
    visibleBodyParts = visibleParts;
    if (scene !== undefined) {
        scene.children.forEach(mesh => {
            mesh.visible = visibleBodyParts[mesh.name];

        });
    }
}

function setDrawingType(is3D) {
    if (is3D) {
        drawingCanvas.style.display = "none";
        container.style.display = "block";
    } else {
        drawingCanvas.style.display = "block";
        container.style.display = "none";
    }
}




class Redactor extends React.Component {

    componentDidMount() {
        init();
        setupCanvasDrawing();
        layersUpdate(this.props.skinLayersData);
        skinInit();
        setDrawingType(this.props.is3D);
        animate();
    }

    render() {


        if (visibleLayers !== this.props.skinLayersData.filter((el) => el.visible).map(a => a.id)) {
            visibleLayers = this.props.skinLayersData.filter((el) => el.visible).map(a => a.id);
            checkSkinLayers(this.props.skinLayersData);
        }

        chosenId = this.props.chosenId;

        setColor(this.props.hexColor);
        setVisibleBodyParts(this.props.visibleParts);

        if (container !== undefined && drawingCanvas !== undefined) {
            setDrawingType(this.props.is3D);
        }



        return (
            <div className="redactor-element">
                <div id="container" className="renderer-container" >
                    <canvas id="renderer-canvas" className="renderer-canvas " ></canvas>
                </div>
                <canvas id="drawing-canvas" className="drawing-canvas " height="64" width="64"></canvas>
            </div>

        )
    }
}

export default Redactor;