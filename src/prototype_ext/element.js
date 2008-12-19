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
    
    element.fx_blindUp = new FX.Element(element)
      .setOptions(options || {})
      .onBeforeStarted(function() {element.originalHeight = element.style.height})
      .onEnded(function() {element.hide(); element.style.height = element.originalHeight; delete element.fx_blindUp;})
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
    options = options || {};

    if (element.fx_highlight) element.fx_highlight.stop().reverse().rewind();

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
    options = Object.extend({duration: 50}, options || {});

    if (element.fx) element.fx_shake.stop().reverse().rewind();

    var distance = options.distance || 20;
    
    var move_right = new FX.Element(element)
      .setOptions(options)
      .setCycle('backAndForth', 1)
      // TODO: Should support +=XXXpx, suffix doesn't seem to be supported yet
      .animate({left: '+='+distance});
      
    var move_left = new FX.Element(element)
      .setOptions(options)
      .setCycle('backAndForth', 1)
      // TODO: Should support +=XXXpx, suffix doesn't seem to be supported yet
      .animate({left: '-='+distance});
    element.makePositioned();
    element.fx_shake = new FX.Score(element)
      // TODO: Doesn't loop
      .setCycle('loop', 2)
      .onEnded(function() {element.undoPositioned(); delete element.fx_shake;})
      // TODO: Does makes backAndForth cycle as expected
      .add(move_right)
      // TODO: Does makes backAndForth cycle as expected
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
      .setCycle('backAndForth', pulses, true)
      .onEnded(function() {delete element.fx_pulsate;})
      .animate({opacity: 0})
      .play();
    return element;
  }
});
