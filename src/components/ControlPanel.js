import React from 'react';
import Slider from 'rc-slider';

import '../styles/ControlPanel.css';
import 'rc-slider/assets/index.css';

function ControlPanel(props) {
    return (
        <div className='controls'>
            <button onClick={props.reset}>
                Reset
            </button>
            <button onClick={props.running ? props.stop : props.start}>
                {props.running ? 'Stop' : 'Start'}
            </button>
            <button onClick={props.randomize}>
                Randomize
            </button>
            <div className='gridlines-checkbox'>
                <input
                    type='checkbox'
                    onChange={props.toggleGridlines}
                    checked
                    />
                <label>Gridlines</label>
            </div>
            <div className='slider'>
                Delay: {props.delay} ms
                <Slider
                    min={20}
                    max={500}
                    defaultValue={props.delay}
                    handleStyle={{
                        cursor: 'default',
                        border: 'none',
                    }}
                    onAfterChange={props.updateDelay}
                    />
            </div>
            <div className='slider'>
                Random Density: {10 - (10 * props.density)}
                <Slider
                    min={0}
                    max={10}
                    defaultValue={10 - (10 * props.density)}
                    handleStyle={{
                        cursor: 'default',
                        border: 'none',
                    }}
                    onAfterChange={val => props.updateDensity((10 - val) / 10)}
                    />
            </div>
            Press + to zoom in, - to zoom out while paused.
        </div>
    );
}

export default ControlPanel;
