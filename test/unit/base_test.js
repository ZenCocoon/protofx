new Test.Unit.Runner({
  setup: function(){
    // TODO: Would be good to load fixture instead
    $('sandbox').insert('<div id="div"> </div>');
  },
  
  teardown: function(){
    $('div').remove();
  },
  
  testEvents: function(){
    var width = $('div').setStyle({width: '100px'}).getWidth();
    var nb_loop = 2;

    var Tests = {
      beforeStarted: function(fx, test_runner) {
        test_runner = test_runner || this;
        test_runner.assertEqual(width, $('div').getWidth(), "beforeStarted event should be called before any modifiction");
      },
      started: function(fx, test_runner) {
        test_runner = test_runner || this;
        test_runner.assertEqual(true, fx.isPlaying(), "started event should be called once started");
      },
      cycleEnded: function(fx, test_runner) {
        test_runner = test_runner || this;
        test_runner.assertEqual(width + (100 * fx.getCycle()), $('div').getWidth(), "cycleEnded should be called once every cycle is done");
      },
      ended: function(fx, test_runner) {
        test_runner = test_runner || this;
        test_runner.assertEqual(width + (100 * nb_loop), $('div').getWidth(), "ended event should be called once all the modifications has been done");
      }
    };

    document.observe('fx:beforeStarted', function(event) {
      Tests.beforeStarted(event.memo.fx, this);
    }.bind(this));
    
    document.observe('fx:started', function(event) {
      Tests.started(event.memo.fx, this);
    }.bind(this));
    
    document.observe('fx:cycleEnded', function(event) {
      Tests.cycleEnded(event.memo.fx, this);
    }.bind(this));
    
    document.observe('fx:ended', function(event) {
      Tests.ended(event.memo.fx, this);
    }.bind(this));
    
    new FX.Element('div')
      .setOptions({duration: 500})
      .animate({width: '+=100'})
      .setCycle('loop', nb_loop)
      .onBeforeStarted(Tests.beforeStarted.bind(this))
      .onStarted(Tests.started.bind(this))
      .onCycleEnded(Tests.cycleEnded.bind(this))
      .onEnded(Tests.ended.bind(this))
      .play();

    // Keep waiting the end of the animation + tiny extra to don't stop testing before animation has been done
    this.wait(1050, Prototype.emptyFunction);
  }
});
