// how pixi loads and draws game items for a basic map setup

import * as PIXI from 'pixi.js'
import tileset from './tileset.json'

const GRID_SIZE = 40
const STAGE_WIDTH = window.innerWidth;
const STAGE_HEIGHT = window.innerHeight;

const initPixiApp = ({canvasRef, onLoad}) => {
  // init pixi app and textures
  const textures = {};
  const app = new PIXI.Application({ view: canvasRef.current, width: STAGE_WIDTH, height: STAGE_HEIGHT })

  app.loader.add('static/img/tileset.png').load(() => {
    tileset.forEach((tile) => {
      var baseTexture = new PIXI.BaseTexture('static/img/tileset.png');
      var texture = new PIXI.Texture(baseTexture, new PIXI.Rectangle(tile.x, tile.y, tile.width, tile.height));
      textures[tile.name] = texture
    })
    onLoad({app, textures})
  })
}

const initGameItem = ({gameItem, textures, stage}) => {
  if (gameItem.sprite) {
    let sprite = new PIXI.Sprite(textures[gameItem.sprite])
    sprite.transform.position.x = (gameItem.x * GRID_SIZE)
    sprite.transform.position.y = (gameItem.y * GRID_SIZE)
    sprite.transform.scale.x = 5
    sprite.transform.scale.y = 5
    sprite.name = gameItem.name
    stage.addChild(sprite)
  } else if (gameItem.character) {
    let text = new PIXI.Text(gameItem.character, {fontFamily : 'Courier New', fontSize: GRID_SIZE, fill : '#ff1010', align : 'center'})
    text.transform.position.x = (gameItem.x * GRID_SIZE)
    text.transform.position.y = (gameItem.y * GRID_SIZE)
    stage.addChild(text)
  }
}

const updateGameItem = ({gameItem, texture, stage}) => {
  const pixiChild = stage.getChildByName(gameItem.name)
  pixiChild.style.fill = gameItem.color
  pixiChild.location.x = (gameItem.x * GRID_SIZE)
  pixiChild.location.y = (gameItem.y * GRID_SIZE)

  //TODO: remove pixi item if it has like a DONTRENDER property
  //TODO: remove and add pixi item if character has changed
}

export default {
  initPixiApp,
  initGameItem,
  updateGameItem,
}