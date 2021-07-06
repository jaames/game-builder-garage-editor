/**
 * Nodon Graph Renderer, with zoom, pan (hold shift), and node dragging
 */

import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';

import { GameFile } from '../formats';
import { Nodon, Connection, ActorType, NodonCategory } from '../objects';
import { lerp } from '../utils';

const COLOR_GRAPH_BG = 0xFFD42D;
const COLOR_GRAPH_GRID_LINE = 0xFFDC94;

const COLOR_NODON = 0xFF9946;
const COLOR_CONNECTION = 0xFD73A6;

const NODON_COLOR_MAP: Record<NodonCategory, number> = {
  [NodonCategory.Unknown]:      0xFF9946,
  [NodonCategory.Input]:        0xFE0D4C,
  [NodonCategory.Middle]:       0x00D59A,
  [NodonCategory.MiddleLayout]: 0x7A94B0,
  [NodonCategory.Output]:       0x27B8FF,
  [NodonCategory.Object]:       0xFF9946,
};

const SIZE_GRAPH_GRID_UNIT = 12;

export class GraphRenderer {

  rootEl: HTMLElement;
  app: PIXI.Application;
  view: Viewport;
  zoomLevel: number;

  game: GameFile = new GameFile(); // dummy game

  private selectedNodon: Nodon = null

  private gfxList: PIXI.Graphics[] = [];
  private nodonGfxMap = new Map<Nodon, PIXI.Graphics>();
  private nodonPositionMap = new Map<number, [number, number]>();
  private connectionGfxMap = new Map<Connection, PIXI.Graphics>();

  constructor(rootEl: HTMLElement) {
    const bounds = rootEl.getBoundingClientRect();
    const app = new PIXI.Application({
      antialias: true,
      resizeTo: rootEl,
      backgroundColor: COLOR_GRAPH_BG,
      forceCanvas: true,
    });
    const view = new Viewport({
      divWheel: rootEl,
      screenWidth: bounds.width,
      screenHeight: bounds.height,
      interaction: app.renderer.plugins.InteractionEvent
    });
    // enable pan + zoom
    // view.drag();
    view.drag({ keyToPress: ['ShiftLeft', 'ShiftRight'] })
    view.pinch();
    view.wheel();
    view.decelerate();
    // center view at graph origin point
    view.moveCenter(0, 0);
    // clamp zoom
    view.clampZoom({
      minScale: .125 / 2,
      maxScale: 4,
    });
    this.zoomLevel = view.scale.x;
    this.app = app;
    this.view = view;
    rootEl.appendChild(app.view);
    app.stage.addChild(view);
    // handle view events
    this.view.on('wheel', this.handleZoom);
    this.view.on('mousedown', this.handleMouseDown);
  }

  loadGame(game: GameFile) {
    this.game = game;
    this.nodonGfxMap.clear();
    this.nodonPositionMap.clear();
    this.gfxList.forEach(gfx => gfx.destroy());
    this.gfxList = [];
    this.makeGridGfx();
    game.nodons.forEach(nodon => this.makeNodonGfx(nodon));
    game.connections.forEach(connection => this.makeConnectionGfx(connection));
  }

  centerViewToNodon = (nodon: Nodon) => {
    const [x, y] = this.nodonPositionMap.get(nodon.id);
    this.view.moveCenter(x, y)
  }

  makeGridGfx() {
    // TODO
    // const bg = new PIXI.Graphics();
    // // rings
    // bg.lineStyle(1, COLOR_GRAPH_GRID_LINE, 1);
    // for (let i = 0; i < 10; i++)
    //   bg.drawCircle(0, 0, i * (5 * SIZE_GRAPH_GRID_UNIT));
    // this.view.addChild(bg);
  }

  makeNodonGfx(nodon: Nodon) {
    const gfx = new PIXI.Graphics();
    gfx.name = nodon.id.toString();
    gfx.interactive = true;
    const text = new PIXI.Text('');
    text.anchor.set(.5, 1);
    text.style.fill = 0xffffff;
    text.name = 'text';
    text.rotation = Math.PI;
    gfx.addChild(text);
    this.nodonGfxMap.set(nodon, gfx);
    this.view.addChild(gfx);
    this.gfxList.push(gfx)
    this.updateNodonGfx(nodon);
  }

  updateNodonGfx(nodon: Nodon) {
    let [x, y] = nodon.canvasPos;
    let [width, height] = nodon.canvasSize;
    let [scaleX, scaleY] = nodon.canvasScale;
    x /= 100;
    y /= -100; // y is inverted
    x *= SIZE_GRAPH_GRID_UNIT;
    y *= SIZE_GRAPH_GRID_UNIT;
    width *= scaleX * SIZE_GRAPH_GRID_UNIT;
    height *= scaleY * SIZE_GRAPH_GRID_UNIT;
    const gfx = this.nodonGfxMap.get(nodon);
    const lineWidth = lerp(16, 4, this.zoomLevel / 4);
    const color = NODON_COLOR_MAP[nodon.category];
    const text = gfx.getChildByName('text') as PIXI.Text;
    text.text = nodon.label;
    gfx.clear();
    gfx.position.x = x;
    gfx.position.y = y;
    gfx.rotation = Math.PI - nodon.canvasRotate; // inverted
    gfx.zIndex = nodon.canvasSortIndex;
    gfx.lineStyle(lineWidth, color, 1);
    gfx.beginFill(color, .01);
    if (this.zoomLevel < .25)
      gfx.drawRect(-width / 2, -height / 2, width, height);
    else 
      gfx.drawRoundedRect(-width / 2, -height / 2, width, height, 4);
    gfx.endFill();
    this.nodonPositionMap.set(nodon.id, [x, y]);
  }

  makeConnectionGfx(connection: Connection) {
    const gfx = new PIXI.Graphics();
    gfx.name = connection.id.toString();
    this.connectionGfxMap.set(connection, gfx);
    this.updateConnectionGfx(connection);
    this.view.addChild(gfx);
    this.gfxList.push(gfx)
  }

  updateConnectionGfx(connection: Connection) {
    const {idA, idB} = connection;
    const [xA, yA] = this.nodonPositionMap.get(idA);
    const [xB, yB] = this.nodonPositionMap.get(idB);
    const gfx = this.connectionGfxMap.get(connection);
    const lineWidth = lerp(16, 4, this.zoomLevel / 4);
    gfx.clear();
    gfx.beginFill(COLOR_CONNECTION);
    if (this.zoomLevel > .25) {
      gfx.drawCircle(xA, yA, lineWidth);
      gfx.drawCircle(xB, yB, lineWidth);
    }
    gfx.endFill();
    gfx.lineStyle(lineWidth, COLOR_CONNECTION, 1);
    gfx.moveTo(xA, yA);
    gfx.lineTo(xB, yB);
    gfx.closePath();
  }

  handleMouseDown = (e: PIXI.InteractionEvent) => {
    if (e.data.originalEvent.shiftKey) // ignore viewport pan
      return;
    const target = e.target;
    if (target instanceof PIXI.Graphics) {
      const id = parseInt(target.name);
      const object = this.game.getObjectWithId(id);
      if (object instanceof Nodon) {
        this.selectedNodon = object;
        console.log('Hit:', object);
        console.log('Props:', object.props);
        console.log('Settings:', object.getSettingValues());
        console.log('Connections:', object.getConnections());
        console.log('Parent:', object.getParentNodons());
        console.log('Children:', object.getChildNodons());
        this.view.on('mousemove', this.handleMouseMove);
        this.view.on('mouseup', this.handleMouseUp);
      }
    }
  }

  handleMouseMove = (e: PIXI.InteractionEvent) => {
    const {x: mouseX, y: mouseY} = e.data.getLocalPosition(this.view);
    const nodon = this.selectedNodon;
    if (nodon !== null) {
      const [x, y, z] = nodon.canvasPos;
      const newCanvasX = (mouseX / SIZE_GRAPH_GRID_UNIT) * 100;
      const newCanvasY = (mouseY / SIZE_GRAPH_GRID_UNIT) * -100;
      nodon.canvasPos = [newCanvasX, newCanvasY, z];
      this.updateNodonGfx(nodon);
      const connections = nodon.getConnections();
      connections.forEach(connection => this.updateConnectionGfx(connection));
    }
  }

  handleMouseUp = (e: PIXI.InteractionEvent) => {
    this.selectedNodon = null;
    this.view.off('mousemove', this.handleMouseMove);
    this.view.off('mouseup', this.handleMouseUp);
  }

  handleZoom = () => {
    this.zoomLevel = this.view.scale.x;
    this.game.nodons.forEach(nodon => this.updateNodonGfx(nodon));
    this.game.connections.forEach(connection => this.updateConnectionGfx(connection));
  }

}
