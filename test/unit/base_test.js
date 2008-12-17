new Test.Unit.Runner({
  testEvents: function(){
    var width = $('div').setStyle({backgroundColor: 'red', height: '10px', width: '100px'}).getWidth();
    var nb_loop = 2;

    var Tests = {
      beforeStarted: function(test_runner) {
        test_runner.assertEqual(width, $('div').getWidth(), "beforeStarted event shoule be called before any modifiction");
      },
      started: function(test_runner) {
        // test_runner.assertEqual(true, fx.playing(), "started event should be called once started");
      },
      cycleEnded: function(test_runner) {
        // test_runner.assertEqual(width + (100 * fx.getCycle()), $('div').getWidth(), "cycleEnded should be called once every cycle is done");
      },
      ended: function(test_runner) {
        test_runner.assertEqual(width + (100 * nb_loop), $('div').getWidth(), "ended event should be called once all the modifications has been done");
      }
    };

    document.observe('fx:beforeStarted', function(event) {
      Tests.beforeStarted(this);
    }.bind(this));
    
    document.observe('fx:started', function(event) {
      Tests.started(this);
    }.bind(this));
    
    document.observe('fx:cycleEnded', function(event) {
      Tests.cycleEnded(this);
    }.bind(this));
    
    document.observe('fx:ended', function(event) {
      Tests.ended(this);
    }.bind(this));
    
    var fx = new FX.Element('div')
      .setOptions({duration: 500})
      .animate({width: '+=100'})
      .setCycle('loop', nb_loop)
      .onBeforeStarted(Tests.beforeStarted(this))
      .onStarted(Tests.started(this))
      .onCycleEnded(Tests.cycleEnded(this))
      .onEnded(Tests.ended(this))
      .play();
  }
});