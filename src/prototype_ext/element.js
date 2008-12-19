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
    if (!element.visible() || element.fx) return element;
    
    element.fx = new FX.Element(element)
      .setOptions(options || {})
      .onBeforeStarted(function() {element.originalHeight = element.style.height})
      .onEnded(function() {element.hide(); element.style.height = element.originalHeight; delete element.fx;})
      .animate({height: 0})
      .play();
    return element;
  },
  
  blindDown: function(element, options) {
    if (!(element = $(element))) return;
    if (element.visible() || element.fx) return element;
    var height = element.getHeight();

    element.fx = new FX.Element(element)
      .setOptions(options || {})
      .onBeforeStarted(function() {element.show(); element.style.height = '0px';})
      .onEnded(function() {delete element.fx})
      .animate({height: height + 'px'})
      .play();
    return element;
  },
  
  highlight: function(element, options) {
    if (!(element = $(element))) return;
    if (!element.visible()) return element;
    options = options || {};

    if (element.fx) element.fx.stop().reverse().rewind();

    var highlightColor = options.highlightColor || "#ffff99";
    var originalColor = element.getStyle('background-color');
        
    element.fx = new FX.Element(element)
      .setOptions(options)
      .animate({backgroundColor: originalColor})
      .onBeforeStarted(function() {element.setStyle({backgroundColor: highlightColor});})
      .onEnded(function() {delete element.fx})
      .play();
    return element;
  },
  
  shake: function(element, options){
    if (!(element = $(element))) return;
    if (!element.visible()) return element;
    options = Object.extend({duration: 50}, options || {});

    if (element.fx) element.fx.stop().reverse().rewind();

    var distance = options.distance || 20;
    
    var move_right = new FX.Element(element)
      .setOptions(options)
      // TODO: Loop should make the back and forth even if only one loop
      .setCycle('backAndForth', 1)
      // TODO: Should support +=XXXpx, suffix doesn't seem to be supported yet
      .animate({left: '+='+distance});
    var move_left = new FX.Element(element)
      .setOptions(options)
      // TODO: Loop should make the back and forth even if only one loop
      .setCycle('backAndForth', 1)
      // TODO: Should support +=XXXpx, suffix doesn't seem to be supported yet
      .animate({left: '-='+distance});
    element.makePositioned();
    element.fx = new FX.Score(element)
      // TODO: Would be nice to set duration as the global time spent in the queue
      // TODO: Doesn't seem to loop
      .setCycle('loop', 2)
      .onEnded(function() {element.undoPositioned(); delete element.fx;})
      .add(move_right)
      .add(move_left, {position: 'last'})
      .play();
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
      // TODO: Loop should make the back after the loops
      .setCycle('backAndForth', pulses)
      .onEnded(function() {delete element.fx_pulsate;})
      .animate({opacity: 0})
      .play();
    return element;
  }
});
