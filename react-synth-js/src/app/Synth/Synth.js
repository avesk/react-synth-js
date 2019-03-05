/**
 * https://medium.com/@mautayro/creating-a-basic-computer-keyboard-controlled-synthesizer-with-the-web-audio-api-8a3d0ab1d65e
 */
import React, { Component } from 'react';

const keyboardFrequencyMap = {
    '90': 261.6256, // C
    '83': 277.1826, // C#
    '88': 293.6648, // D
    '68': 311.1270, // D#
    '67': 329.6276, // E
    '86': 349.2282, // F
    '71': 369.9944, // F#
    '66': 391.9954, // G
    '72': 415.3047, // G#
    '78': 440.0000, // A
    '74': 466.1638, // A#
    '77': 493.8833, // B
    '81': 523.2511, // C
    '50': 554.3653, // C#
    '87': 587.3295, // D
    '51': 622.2540, // D#
    '69': 659.2551, // E
    '82': 698.4565, // F
    '53': 739.9888, // F#
    '84': 783.9909, // G
    '54': 830.6094, // G#
    '89': 880.0000, // A
    '55': 932.3275, // A#
    '85': 987.7666, // B
}

// SET UP AUDIO CONTEXT
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create audio analyiser (not used)
const analyser = audioCtx.createAnalyser();

// PROCESSING CHAIN
const masterGain = audioCtx.createGain(); // node

const presets = {
    'sine': [
        {'harmonic': 1, 'gain': 1},
    ],
    'square': [
        {'harmonic': 1, 'gain': 1},
        {'harmonic': 3, 'gain': .5},
        {'harmonic': 5, 'gain': .25},
        {'harmonic': 7, 'gain': .125},
        {'harmonic': 8, 'gain': .065},
    ],
    'triangle': [
        {'harmonic': 1, 'gain': 1},
        {'harmonic': 3, 'gain': -1*(1/Math.sqrt(3))},
        {'harmonic': 5, 'gain': (1/Math.sqrt(5))},
        {'harmonic': 7, 'gain': -1*(1/Math.sqrt(7))},
        {'harmonic': 8, 'gain': (1/Math.sqrt(8))},
    ],
    'p_fith': [
        {'harmonic': 3, 'gain': 1},
        {'harmonic': 2, 'gain': 1},
    ],
    'p_fourth': [
        {'harmonic': 4, 'gain': 1},
        {'harmonic': 3, 'gain': 1},
    ],
    'maj_third': [
        {'harmonic': 6, 'gain': 1},
        {'harmonic': 5, 'gain': 1},
    ],
    'min_third': [
        {'harmonic': 5, 'gain': 1},
        {'harmonic': 4, 'gain': 1},
    ],
    'maj_triad': [
        {'harmonic': 6, 'gain': 1},
        {'harmonic': 5, 'gain': 1},
        {'harmonic': 4, 'gain': 1},
    ],
    'a_harmonic_square': [
        {'harmonic': 1, 'gain': 1},
        {'harmonic': .777, 'gain': 1},
        {'harmonic': .23423, 'gain': 1},
        {'harmonic': 3, 'gain': .5},
        {'harmonic': 5, 'gain': .25},
        {'harmonic': 5.7564534, 'gain': .25},
        {'harmonic': 7, 'gain': .125},
        {'harmonic': 8, 'gain': .065},
        {'harmonic': 13.464, 'gain': .065},
    ],
}

class Synth extends Component {

    constructor(props) {
        super(props);

        // unused analyser code
        analyser.fftSize = 256;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);

        const presetTamber = presets.triangle;
        const offPrec = 1; // offset precision
        this.state = {
            activeOscillators: {}, tamberMode: presetTamber, 
            waveform: 'sine', dataArray: dataArray, offPrec 
        };

        // CONNECTIONS
        masterGain.connect(audioCtx.destination);
        masterGain.connect(analyser);

        this.keyDown = this.keyDown.bind(this);
        this.keyUp = this.keyUp.bind(this);
    }

    componentWillMount() {
        window.addEventListener("keydown", this.keyDown, false);
        window.addEventListener("keyup", this.keyUp, false);
    }
   
    componentWillUnmount() {
        window.removeEventListener("keydown", this.keyDown, false);
        window.removeEventListener("keyup", this.keyUp, false);
    }

    renderFrequencyData() {
        const dataArray = this.state.dataArray;
        analyser.getByteFrequencyData(dataArray);
        // console.log(dataArray);
        dataArray.map( harm => {
            console.log(harm);
        });
    }

    keyDown(event) {
        if(!event.repeat) { // prevent key down from repeatedly firing
            const key = (event.detail || event.which).toString();
            console.log(key + " down");
            const fund = keyboardFrequencyMap[key];
            this.playNoteWithTamber(key, fund);
            this.renderFrequencyData();
        } else {
            // this.renderFrequencyData();
        }
    }

    keyUp(event) {
        const key = (event.detail || event.which).toString();
        console.log(key + " up");
        const freq = keyboardFrequencyMap[key];
        this.stopNote(key, freq);
    }

    /**
     * Stop each harmonic associated with the timbre mode
     */
    stopNote(key, freq) {
        var activeOscillators = this.state.activeOscillators;
        var offset;
        var tamberMode = this.state.tamberMode;
        var offPrec = this.state.offPrec;
        tamberMode.map( harm => {
            offset = Math.floor(freq*harm['harmonic']*offPrec); // *1000 adds more precision on the index
            if(keyboardFrequencyMap[key] && this.state.activeOscillators[offset]) {
                activeOscillators[offset].stop();
                delete activeOscillators[offset];
                this.setState({activeOscillators: activeOscillators})
            }
        });
    }

    // @todo account for octaves in offset
    /**
     * Play each harmonic associated with the timbre mode
     */
    playNoteWithTamber(key, fund) {
        var offset, freq;
        var tamberMode = this.state.tamberMode;
        var offPrec = this.state.offPrec;
        tamberMode.map( harm => {
            freq = fund*harm['harmonic'];
            offset = Math.floor(freq*offPrec);
            console.log('playing: ' + offset)
            // offset = this.getOffset();
            if(keyboardFrequencyMap[key] && !this.state.activeOscillators[offset]) {
                this.playNote(freq, offset, harm['gain']);
            }
        });
    }

    /**
     * Create a new oscillator for the harmonic
     * Set the frequency of that oscillator the frequency of the harmonic
     * Set the wave form of that harmonic (sine by default in state)
     * Create a and set a gain connection
     * Connect the harmonic oscillator to the gain
     * connect the gain to the master gain
     * start the oscillator
     */
    playNote(freq, offset, gain) {
        const osc = audioCtx.createOscillator(); 
        var activeOscillators = this.state.activeOscillators;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.type = this.state.waveform;
        activeOscillators[offset] = osc;
        const harmGain = audioCtx.createGain(); // node
        harmGain.gain.setValueAtTime(gain, audioCtx.currentTime);
        activeOscillators[offset].connect(harmGain);
        harmGain.connect(masterGain);
        activeOscillators[offset].start();
        this.setState({activeOscillators: activeOscillators});
    }

    render() {
        return(
            <React.Fragment>
                <p></p>
            </React.Fragment>
        ) 
    }
}

export default Synth;