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

// const tamberMode = [ // square wave
//     {'harmonic': 1, 'gain': 1},
//     {'harmonic': 3, 'gain': .5},
//     {'harmonic': 5, 'gain': .25},
//     {'harmonic': 7, 'gain': .125},
//     {'harmonic': 8, 'gain': .065},
//     // {'harmonic': 1, 'gain': 1},
//     // {'harmonic': 2, 'gain': .5},
//     // {'harmonic': 3, 'gain': .7},
//     // {'harmonic': 4, 'gain': .125},
//     // {'harmonic': 5, 'gain': .065},
// ];

// SET UP AUDIO CONTEXT
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// PROCESSING CHAIN
const masterGain = audioCtx.createGain(); // node

class Synth extends Component {

    constructor(props) {
        super(props);

        const presetTamber = [
            {'harmonic': 1, 'gain': 1},
            {'harmonic': 3, 'gain': .5},
            {'harmonic': 5, 'gain': .25},
            {'harmonic': 7, 'gain': .125},
            {'harmonic': 8, 'gain': .065},
        ];

        this.state = {activeOscillators: {}, tamberMode: presetTamber, waveform: 'triangle' };

        // CONNECTIONS
        masterGain.connect(audioCtx.destination);

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

    keyDown(event) {
        const key = (event.detail || event.which).toString();
        console.log(key + " down");
        const fund = keyboardFrequencyMap[key];
        this.playNoteWithTamber(key, fund);
    }

    keyUp(event) {
        const key = (event.detail || event.which).toString();
        console.log(key + " up");
        const freq = keyboardFrequencyMap[key];
        this.stopNote(key, freq);
    }

    stopNote(key, freq) {
        var activeOscillators = this.state.activeOscillators;
        var offset;
        var tamberMode = this.state.tamberMode;
        tamberMode.map( harm => {
            offset = Math.floor(freq*harm['harmonic']*1000);
            if(keyboardFrequencyMap[key] && this.state.activeOscillators[offset]) {
                activeOscillators[offset].stop();
                delete activeOscillators[offset];
                this.setState({activeOscillators: activeOscillators})
            }
        });
    }

    playNoteWithTamber(key, fund) {
        var offset, freq;
        var tamberMode = this.state.tamberMode;
        tamberMode.map( harm => {
            freq = fund*harm['harmonic'];
            offset = Math.floor(freq*1000);
            if(keyboardFrequencyMap[key] && !this.state.activeOscillators[offset]) {
                this.playNote(freq, offset, harm['gain']);
            }
        });
    }

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
        return <p>SYNTH</p>;
    }
}

export default Synth;