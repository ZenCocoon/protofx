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
    if (!(element = $(element)) || !element.visible()) return;
    new FX.Element(element)
      .setOptions(options || {})
      .onBeforeStarted(function() {element.originalHeight = element.style.height})
      .onEnded(function() {element.hide(); element.style.height = element.originalHeight; (element.originalHeight)})
      .animate({height: 0})
      .play();
    return element;
  },
  
  blindDown: function(element, options) {
    if (!(element = $(element)) || element.visible()) return;
    var height = element.getHeight();
    new FX.Element(element)
      .setOptions(options || {})
      .onBeforeStarted(function() {element.show(); element.style.height = '0px'})
      .animate({height: height + 'px'})
      .play();
    return element;
  },
  
  highlight: function(element, options) {
    if (!(element = $(element)) || !element.visible()) return;
    var options = options || {};
    var highlightColor = options.highlightColor || "#ffff99";
    var originalColor = element.getStyle('background-color');
    // TODO: Should prevent from highlighting an under highling element
    new FX.Element(element.setStyle({backgroundColor: highlightColor}))
      .setOptions(options)
      .animate({backgroundColor: originalColor})
      .play();
    return element;
  }
});