new Test.Unit.Runner({
  testOnBeforeStarted: function(){
    var width = $('div').getWidth();
    
    document.observe('fx:beforeStarted', function(event) {
      this.assertEqual(width, $('div').getWidth());
    }.bind(this));
    
    new FX.Element('div')
      .setOptions({duration: 500})
      .animate({width: '+=100px'})
      .onBeforeStarted(function() { this.assertEqual(width, $('div').getWidth()); }.bind(this))
      .play();
  }
});