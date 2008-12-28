Element.addMethods({
  fade: function(element, options) {
    if (!(element = $(element))) return;
    new FX.Element(element)
      .setOptions(options || {})
      .animate({opacity: 0})
      .play();
    return element;
  },
  
  appear: function(element, options) {
    if (!(element = $(element))) return;
    new FX.Element(element)
      .setOptions(options || {})
      .animate({opacity: 1})
      .play();
    return element;
  },
  
  blindUp: function(element, options) {
    if (!(element = $(element))) return;
    if (!element.visible() || element.fx_blindUp) return element;
    
    var wrapper = element.wrap().makeClipping().setStyle({height: element.getHeight()+'px'});
    element.fx_blindUp = new FX.Element(wrapper)
      .setOptions(options || {})
      .onEnded(function() {element.hide(); wrapper.replace(element); delete element.fx_blindUp;})
      .animate({height: 0})
      .play();
    return element;
  },
  
  blindDown: function(element, options) {
    if (!(element = $(element))) return;
    if (element.visible() || element.fx_blindDown) return element;
    var height = element.getHeight();

    element.fx_blindDown = new FX.Element(element)
      .setOptions(options || {})
      .onBeforeStarted(function() {element.show(); element.style.height = '0px';})
      .onEnded(function() {delete element.fx_blindDown})
      .animate({height: height + 'px'})
      .play();
    return element;
  },
  
  highlight: function(element, options) {
    if (!(element = $(element))) return;
    if (!element.visible()) return element;

    if (element.fx_highlight) element.fx_highlight.stop().reverse().rewind();

    options = options || {};
    var highlightColor = options.highlightColor || "#ffff99";
    var originalColor = element.getStyle('background-color');
        
    element.fx_highlight = new FX.Element(element)
      .setOptions(options)
      .animate({backgroundColor: originalColor})
      .onBeforeStarted(function() {element.setStyle({backgroundColor: highlightColor});})
      .onEnded(function() {delete element.fx_highlight})
      .play();
    return element;
  },
  
  shake: function(element, options){
    if (!(element = $(element))) return;
    if (!element.visible()) return element;

    if (element.fx_shake) element.fx_shake.stop().reverse().rewind();

    var options = Object.extend({duration: 50}, options || {})
    var distance = options.distance || 20;
    var half_speed_options = Object.clone(options);
    half_speed_options.duration *= 2;
    
    element.makePositioned();
    element.fx_shake = new FX.Element(element)
      .setOptions(options)
      .animate({left: '+='+distance})
      .onEnded(function() {
        new FX.Element(element)
          .setOptions(half_speed_options)
          .animate({left: '-='+distance*2})
          .onEnded(function() {
            new FX.Element(element)
              .setOptions(options)
              .animate({left: '+='+distance})
              .onEnded(function() {element.undoPositioned(); delete element.fx_shake;}).play();
          })
          .play();
      }).play();
    return element;
  },
  
  pulsate: function(element, options) {
    if (!(element = $(element))) return;
    if (!element.visible()) return element;
    options = Object.extend({duration: 2000}, options || {});

    if (element.fx_pulsate) element.fx_pulsate.isBackward() ? element.fx_pulsate.stop().reverse().rewind() : element.fx_pulsate.stop().rewind();

    var pulses = options.pulses || 5;
    options.duration = options.duration / (pulses * 2);
    
    element.fx_pulsate = new FX.Element(element)
      .setOptions(options)
      .setCycle('backAndForth', pulses, true)
      .onEnded(function() {delete element.fx_pulsate;})
      .animate({opacity: 0})
      .play();
    return element;
  }
});
