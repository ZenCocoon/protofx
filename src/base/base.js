/**
 *  == fx ==
 *  The FX section
**/

/** section: fx
 * FX
 **/
 
// Namespace
FX = {};

// t: current time, b: beginning value, c: change in value, d: duration
FX.Transition = {
	swing: function( x, t, b, c, d) {
		return ((-Math.cos(t/d*Math.PI)/2) + 0.5) * c + b;
	}
}


FX.DefaultOptions = {duration: 500, transition: FX.Transition.swing, eventNotifier: document, memoData: null};
/** 
 *  class FX.Base
 *
 * Base class for any kind of FX.  
 *  
 **/
FX.Base = Class.create((function() {
  /** 
   *  new FX.Base([options])
   **/
  function initialize(options) {
    this.options     = Object.extend(Object.clone(FX.DefaultOptions), options);
    this.currentTime = null;
    this.nextTime    = 0;
    this.playing     = false;
    this.backward    = false;
    this.cycle       = false;
    this.callbacks   = {onEnded: Prototype.emptyFunction, onStarted: Prototype.emptyFunction,
                        onBeforeStarted: Prototype.emptyFunction, onCycleEnded: Prototype.emptyFunction,
                        onRewinded: Prototype.emptyFunction, onReversed: Prototype.emptyFunction};
    this.setOptions(options);
  }
  
  /** 
   *  FX.Base#setOptions(options) -> FX.Base
   **/
  function setOptions(options) {
    Object.extend(this.options, options || {});
    return this; 
  }
  
  /** 
   *  FX.Base#getDuration() -> int
   **/
  function getDuration() {
    return this.options.duration;
  }
  
  /** 
   *  FX.Base#isPlaying() -> true/false
   **/
  function isPlaying() {
    return this.playing;
  }
  
  /** 
   *  FX.Base#isBackward() -> true/false
   **/
  function isBackward() {
    return this.backward;
  }
  
  /** 
   *  FX.Base#setCycle(type, count) -> FX.Base
   *  - type (String): 
   *    - 'loop' repeat the effect
   *    - 'backAndForth' starts in reverse mode when effect is done
   *    - 'none' no cycles
   *  - count (Number or "unlimited"): number of cycles to run (default 1)
   *  - back (true/false): should it come back to original states after each loop ? (default true if type is backAndForth else is false)
   **/
  function setCycle(type, count, back) {
    back = type == 'backAndForth' ?
      ((back === false || back == 'false') ? false : true) :
      ((back == undefined || back === true  || back == 'true' ) ? true  : false);
    this.cycle = type == 'none' ? false : {type: type, count: count || 1, back: back, current: 0, direction: 1};
    return this;
  }
  
  /** 
   *  FX.Base#getCycle() -> int
   *  
   *  Returns current cycle position
   **/
  function getCycle() {
    return this.cycle ? this.cycle.current : (this.backward ? 1 : 0)
  }
  
  /** 
   *  FX.Base#play() -> FX.Base
   *  
   *  Starts animation from current position
   *  fires fx:started, fx:beforeStarted
   **/
  function play() {
    if (this.playing) return;
      
    this.fire('beforeStarted');
    this.playing = true;

    // Reset time for a new play
    if (this.currentTime == null) {
      if (this.backward && this.cycle) {
        this.cycle.direction = this.cycle.back ? 1 : -1;
        this.cycle.current = this.cycle.count == 'unlimited' ? 0 : parseInt(this.cycle.count);
        this.currentTime = this.backward && !this.cycle.back ? this.getDuration() : 0;
        this.startAnimation(this.back);
      } else {
        this.currentTime = this.backward ? this.getDuration() : 0;
        this.startAnimation(this.backward);
      }
    }
    // Add it to metronome to receive recurring updateAnimation
    FX.Metronome.register(this);

    this.fire('started');
    return this;
  }
  
  /** 
   *  FX.Base#stop() -> FX.Base
   *  
   *  Stops animation at current running position
   *  fires fx:stopped
   **/
  function stop() {
    this.fire('stopped');
    FX.Metronome.unregister(this);
    this.playing = false;
    return this;
  }
  
  /** 
   *  FX.Base#reverse() -> FX.Base
   *  
   *  Reverses animation. If animation is running, it keeps running backward
   *  fire fx:reversed
   **/
  function reverse() {
    if (this.cycle) this.cycle.direction *= -1;
    this.backward = !this.backward;
    this.fire('reversed');
    return this;
  }
  
  /** 
   *  FX.Base#rewind() -> FX.Base
   *  
   *  Rewind animation. Depending on animation direction it goes to begin or end position
   *  fires fx:rewinded
   **/
  function rewind() {
    // Stop before rewinding
    this.stop();
    if (!this.cycle) {
      this.updateAnimation(this.backward ? 1 : 0);
    } else if (this.cycle.back == true) {
      this.updateAnimation(0);
    } else if (this.cycle.type == 'loop') {
      this.updateAnimation(this.backward ? parseInt(this.cycle.count) - this.cycle.current : -1 * this.cycle.current);
    } else {
      this.updateAnimation(this.backward ? 1 : 0);
    }
    this.currentTime = null;
    if (this.cycle) this.cycle.current = this.backward ? parseInt(this.cycle.count) : 0;
    this.fire('rewinded');
    return this;
  }

  // Function called periodically by Metronome
  function metronomeUpdate(delta) {
    // Update current time
    if (this.cycle) {
      this.currentTime += this.cycle.direction < 0 ? -delta : delta;
    } else {
      this.currentTime += this.backward ? -delta : delta;
    }

    // Unregister from FX.Metronome if time is out of range
    if (this.currentTime > this.getDuration() || this.currentTime < 0) {
      // Force update to last position
      this.currentTime = this.currentTime < 0 ? 0 : this.getDuration();
      this.updateAnimation(this.currentTime / this.getDuration());
      
      // Check cycle
      if (this.cycle) {
        if (this.cycle.type == 'loop') {
          this.cycle.current += this.backward ? -1 : this.cycle.direction;
          this.fire('cycleEnded');
          this.cycle.back ? this.updateAnimation(0) : this.startAnimation(this.backward);
          this.currentTime = this.backward && !this.cycle.back ? this.getDuration() : 0;
        }
        else if (this.cycle.type == 'backAndForth') {
          this.cycle.direction *= -1;
          if ((!this.backward && this.cycle.back && this.cycle.direction > 0) ||
              (!this.backward && !this.cycle.back && this.cycle.direction < 0) ||
              (this.backward && this.cycle.back && this.cycle.direction > 0) ||
              (this.backward && !this.cycle.back && this.cycle.direction < 0)) {
            this.cycle.current += this.backward ? -1 : 1;
            this.fire('cycleEnded');
          }
        }
        // Still cycle to run
        if (this.cycle.count == 'unlimited' ||
            (!this.backward && 0 <= this.cycle.current && this.cycle.current < this.cycle.count) ||
            (this.backward && this.cycle.current > 0 || (this.cycle.type == "backAndForth" && this.cycle.current == 0 && this.cycle.direction < 0))) return;
      }
      this.stopAnimation();
      FX.Metronome.unregister(this);

      this.currentTime = null;
      this.playing = false;
      this.fire('ended');
    }
    else {
      var from_pos = this.cycle && this.backward && this.cycle.type == 'loop' && !this.cycle.back ? this.cycle.count - 1 : 0;
      var pos = this.options.transition(this.currentTime / this.getDuration(), this.currentTime, from_pos, 1, this.getDuration());
      this.updateAnimation(pos);
    }
  }
  
  function onEnded(callback) {
    this.callbacks.onEnded = callback;
    return this;
  }
  
  function onStarted(callback) {
    this.callbacks.onStarted = callback;
    return this;
  }
  
  function onBeforeStarted(callback) {
    this.callbacks.onBeforestarted = callback;
    return this;
  }
  
  function onCycleEnded(callback) {
    this.callbacks.onCycleended = callback;
    return this;
  }
  
  function onRewinded(callback) {
    this.callbacks.onRewinded = callback;
    return this;
  }
  
  function onReversed(callback) {
    this.callbacks.onReversed = callback;
    return this;
  }
  
  function fire(eventName) {
    var callback;
    if (callback = this.callbacks['on'+ eventName.capitalize()]) callback(this);
    this.options.eventNotifier.fire('fx:' + eventName, {fx: this, data: this.memoData});
  }

  // Internal callbacks for subclasses
  // Get (or create) linked group
  function updateAnimation(pos) {
    throw 'FX.Base#updateAnimation(pos) must be implemented'
  }
 
  return {           
    initialize:      initialize,
    setOptions:      setOptions,
    setCycle:        setCycle,
    getCycle:        getCycle,
    getDuration:     getDuration,
    play:            play,
    stop:            stop,
    reverse:         reverse,
    rewind:          rewind,
    isPlaying:       isPlaying,
    isBackward:      isBackward, 
    metronomeUpdate: metronomeUpdate,
    startAnimation:  Prototype.emptyFunction,
    stopAnimation:   Prototype.emptyFunction,
    updateAnimation: updateAnimation,
    fire:            fire,
    onStarted:       onStarted,
    onEnded:         onEnded,
    onBeforeStarted: onBeforeStarted,
    onCycleEnded:    onCycleEnded,
    onRewinded:      onRewinded,
    onReversed:      onReversed 
  }
})());
