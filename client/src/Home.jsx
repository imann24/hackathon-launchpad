import React, { useState, useRef, useEffect } from "react";
import * as PIXI from 'pixi.js'
const particles = require('pixi-particles');

export default function Home() {
  const [state, setState] = useState();
  const canvasRef = useRef(null);

  useEffect(() => {
    const app = new PIXI.Application({view: canvasRef.current});

    var emitter = new particles.Emitter(
    	app.stage,
    	[PIXI.Texture.from('https://pixijs.io/pixi-particles-editor/assets/images/particle.png')],
    	{
    		alpha: {
    			list: [
    				{
    					value: 0.8,
    					time: 0
    				},
    				{
    					value: 0.1,
    					time: 1
    				}
    			],
    			isStepped: false
    		},
    		scale: {
    			list: [
    				{
    					value: 1,
    					time: 0
    				},
    				{
    					value: 0.3,
    					time: 1
    				}
    			],
    			isStepped: false
    		},
    		color: {
    			list: [
    				{
    					value: "fb1010",
    					time: 0
    				},
    				{
    					value: "f5b830",
    					time: 1
    				}
    			],
    			isStepped: false
    		},
    		speed: {
    			list: [
    				{
    					value: 200,
    					time: 0
    				},
    				{
    					value: 100,
    					time: 1
    				}
    			],
    			isStepped: false
    		},
    		startRotation: {
    			min: 0,
    			max: 360
    		},
    		rotationSpeed: {
    			min: 0,
    			max: 0
    		},
    		lifetime: {
    			min: 0.5,
    			max: 0.5
    		},
    		frequency: 0.008,
    		spawnChance: 1,
    		particlesPerWave: 1,
    		emitterLifetime: 0.31,
    		maxParticles: 1000,
    		pos: {
    			x: 100,
    			y: 100,
    		},
    		addAtBack: false,
    		spawnType: "circle",
    		spawnCircle: {
    			x: 0,
    			y: 0,
    			r: 10
    		}
    	}
    );

    // Calculate the current time
    var elapsed = Date.now();

    // Update function every frame
    var update = function(){

    	// Update the next frame
    	requestAnimationFrame(update);

    	var now = Date.now();

    	// The emitter requires the elapsed
    	// number of seconds since the last update
    	emitter.update((now - elapsed) * 0.001);
    	elapsed = now;

    	// Should re-render the PIXI Stage
    	// renderer.render(stage);
    };

    // Start emitting
    emitter.emit = true;

    // Start the update
    update();
  }, [])

  return <div>
    <canvas ref={canvasRef}></canvas>
  </div>
}