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
    options = options || {};

    if (element.fx) element.fx.stop().reverse().rewind();
    
    var distance = options.distance || 20;
    
    var move_right = new FX.Element(element)
      // TODO: Loop should make the back and forth even if only one loop
      .setCycle('backAndForth', 1)
      // TODO: Should support +=XXXpx, suffix is not supported now
      .animate({left: '+='+distance});
    var move_left = new FX.Element(element)
      // TODO: Loop should make the back and forth even if only one loop
      .setCycle('backAndForth', 1)
      // TODO: Should support +=XXXpx, suffix is not supported now
      .animate({left: '-='+distance});
    element.fx = new FX.Score(element)
      // TODO: Makes sure duration acts properly
      .setOptions(options)
      // TODO: Doesn't seem to loop
      .setCycle('loop', 2)
      // TODO: Doesn't seems to be trigerred before it any actions starts
      .onBeforeStarted(function() {element.makePositioned();})
      .onEnded(function() {element.undoPositioned(); delete element.fx;})
      .add(move_right)
      .add(move_left, {position: 'last'})
      .play();
    return element;
  }
});