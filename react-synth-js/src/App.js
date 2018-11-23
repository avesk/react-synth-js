import React from 'react';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MUITheme } from './sjui/style';

import Synth from './app/Synth';

const App = () => (
  <MuiThemeProvider theme={MUITheme}>
  <div id="app-wrapper">
    <section>
      <h1>React Synth</h1>
    </section>
    <section>
      <h2>
        React Synth is a beta experiment in developing a programmable 
        web based synthesizer.
      </h2>
      <h2>
        For the purposes of MUS 207, I have developed the additive synthesis feature, programmable
        via javascript code (UI coming soon :P).
      </h2>
    </section>
    <section>
      <h2>Recap: Additive synthesis</h2>
      <p>
        Additive synthesis is a sound synthesis technique that creates timbre by adding sine waves together.
      </p>
      <p>From Wikipedia <a href="https://en.wikipedia.org/wiki/Additive_synthesis">additive synthesis</a></p>
    </section>
    <section>
      <h2>Approximating Waveforms</h2>
      <p>
        In essence, React Synth is capable of approximating the synthesis of various wave forms through patching
        harmonic pure tone oscillators through to the computer's speakers.
      </p>
      <p>Each oscillator is triggered by a keydown press on the keyboard, and stopped by a key release</p>
      <p>Z-M mark the first 12 semi tones, and Q-U are the second octave</p>
    </section>
    <section>
      <h2>Technology</h2>
      <h3>React Synth leverages the Web Audio API.</h3>
      <p>
        MDN Web docs: The Web Audio API provides a powerful and versatile system for controlling 
        audio on the Web, allowing developers to choose audio sources, add effects to audio, create audio 
        visualizations, apply spatial effects (such as panning) and much more.
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API">Web Audio API</a>
      </p>
      <h3>React Synth uses.. Surprise, React!</h3>
      <p>
        React is a cpmonent based JS framework... All that really means, is that its a method of developing
        more organized, modular javascript based applications.
      </p>
    </section>
    <section>
      <h2>Technical Challenges: </h2>
      <ul>
        <li>Originally, I started this project using bare minimum technologies, i.e JS and HTML</li>
        <li>Deciding to port the project to React sets the app up to be more reusable and scalable</li>
      </ul>
      <ul>
        <li>Managing oscillators when keys are mapped to complex timbres</li>
        <li>Keydown plays x number of oscillators, and keyup removes them.</li>
        <li>What if one note is activating multiple oscillators?.</li>
        <li>That will prevent other oscilators in higher or lower notes that contain the same harmonics from playing.</li>
        <li>Full discloser, problem isn't full solved will require some hash mapping, or tweaked logic</li>
        <li>Short term solution, map each oscillator to a large index to avoid collisions.</li>
      </ul>
    </section>
  </div>
    <Synth />
  </MuiThemeProvider>
);

export default App;
