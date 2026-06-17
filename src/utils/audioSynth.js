// Web Audio API Synthetic Chime Engine
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playChime(type, volume = 0.5) {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Master volume node
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.4, now); // Scale down slightly to prevent clipping
    masterGain.connect(ctx.destination);

    switch (type) {
      case "chime": {
        // Glass Chime (Harmony: C Major 7th chord C4, E4, G4, B4)
        const frequencies = [261.63, 329.63, 392.00, 493.88, 523.25]; // C4, E4, G4, B4, C5
        frequencies.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now);
          
          // Micro delay for arpeggio effect
          const startTime = now + idx * 0.05;
          const duration = 2.0;
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.3, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(startTime);
          osc.stop(startTime + duration + 0.1);
        });
        break;
      }
      
      case "bowl": {
        // Zen Singing Bowl (Deep resonant bell with metallic overtones & slow LFO)
        const baseFreq = 160; // Deep tone
        const overtones = [1.0, 1.5, 2.24, 2.76, 3.4, 4.1]; // Resonant ratios
        const duration = 4.5;
        
        // Filter for warmth
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now);
        filter.Q.setValueAtTime(1, now);
        filter.connect(masterGain);

        // LFO for the metallic "beating" effect
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(3.5, now); // 3.5 Hz
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(10, now); // Amplitude of pitch variation
        lfo.connect(lfoGain);

        overtones.forEach((ratio, idx) => {
          const osc = ctx.createOscillator();
          const oscGain = ctx.createGain();
          
          osc.type = idx === 0 ? "sine" : "triangle";
          const freq = baseFreq * ratio;
          osc.frequency.setValueAtTime(freq, now);
          
          // Connect LFO to non-fundamental oscillators for pitch movement
          if (idx > 0) {
            lfoGain.connect(osc.frequency);
          }
          
          // Long decay envelope
          oscGain.gain.setValueAtTime(0, now);
          oscGain.gain.linearRampToValueAtTime(idx === 0 ? 0.6 : 0.15 / idx, now + 0.1);
          oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration - 0.2);
          
          osc.connect(oscGain);
          oscGain.connect(filter);
          
          osc.start(now);
          osc.stop(now + duration + 0.2);
        });
        
        lfo.start(now);
        lfo.stop(now + duration + 0.2);
        break;
      }

      case "synth": {
        // FM electronic pluck (Fast decay, bright tone)
        const carrier = ctx.createOscillator();
        const modulator = ctx.createOscillator();
        const modGain = ctx.createGain();
        const ampGain = ctx.createGain();
        
        carrier.type = "sine";
        carrier.frequency.setValueAtTime(440, now); // A4
        
        modulator.type = "sine";
        modulator.frequency.setValueAtTime(220, now); // Octave below
        
        modGain.gain.setValueAtTime(300, now);
        modGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        ampGain.gain.setValueAtTime(0.8, now);
        ampGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(ampGain);
        ampGain.connect(masterGain);
        
        modulator.start(now);
        carrier.start(now);
        
        modulator.stop(now + 0.7);
        carrier.stop(now + 0.7);
        break;
      }
      
      case "pulse": {
        // Pulsing Warning Alarm (3 short rapid pulses)
        const duration = 0.8;
        const pulseTimes = [0, 0.25, 0.5];
        
        pulseTimes.forEach((delay) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = "square";
          osc.frequency.setValueAtTime(880, now + delay); // Bright high beep
          
          gain.gain.setValueAtTime(0, now);
          gain.gain.setValueAtTime(0.4, now + delay);
          gain.gain.linearRampToValueAtTime(0.3, now + delay + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.18);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.start(now + delay);
          osc.stop(now + delay + 0.2);
        });
        break;
      }

      default:
        // Default beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
    }
  } catch (e) {
    console.error("Failed to play synthetic chime:", e);
  }
}
