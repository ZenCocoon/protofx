new Test.Unit.Runner({
  setup: function() {
    // TODO: Would be good to load fixture instead
    $('sandbox').insert('<div id="div"> </div>');
    // Might be usefull for debug
    // $('div').setStyle({backgroundColor: 'red', width: '500px'});
    this.duration = 250;
    // In case of failures first try to increase this extra waiting time
    this.extra_wait = 100;
  },
  
  teardown: function() {
    $('div').remove();
  },
  
  testEvents: function() {
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
      rewinded: function(fx, test_runner) {
        test_runner = test_runner || this;
        test_runner.assertEqual(width, $('div').getWidth(), "rewinded should be called once the rewind action is triggered");
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
    
    document.observe('fx:rewinded', function(event) {
      Tests.rewinded(event.memo.fx, this);
    }.bind(this));
    
    document.observe('fx:ended', function(event) {
      Tests.ended(event.memo.fx, this);
    }.bind(this));
    
    var fx = new FX.Element('div')
      .setOptions({duration: this.duration})
      .animate({width: '+=100'})
      .setCycle('loop', nb_loop, false)
      .onBeforeStarted(Tests.beforeStarted.bind(this))
      .onStarted(Tests.started.bind(this))
      .onCycleEnded(Tests.cycleEnded.bind(this))
      .onRewinded(Tests.rewinded.bind(this))
      .onEnded(Tests.ended.bind(this))
      .play();

    // Keep waiting the end of the animation + tiny extra to don't stop testing before animation has been done
    this.wait(this.duration * nb_loop + this.extra_wait, function() {
      fx.rewind();
    });
  },
  
  testBackAndForthCycles: function() {
    var height = $('div').setStyle({height: '100px'}).getHeight();
    var fx = new FX.Element('div')
      .setOptions({duration: this.duration})
      .animate({height: '+=100'})
      .setCycle('backAndForth', 2)
      .onEnded(function(fx) {
        this.assertEqual(2, fx.getCycle(), 'Makes sure it made the right amount of cycle');
        this.assertEqual(height, $('div').getHeight(), "Style should be back to original at the end");
      }.bind(this))
      .play();

    // Keep waiting the end of the animation + tiny extra to don't stop testing before animation has been done
    this.wait(this.duration * 4 + this.extra_duration, function() {
      this.teardown();
      this.setup();

      var height = $('div').setStyle({height: '100px'}).getHeight();
      var fx = new FX.Element('div')
        .setOptions({duration: this.duration})
        .animate({height: '+=100'})
        .setCycle('backAndForth', 2, false)
        .onEnded(function(fx) {
          this.assertEqual(2, fx.getCycle(), 'Makes sure it made the right amount of cycle');
          this.assertEqual(height + 100, $('div').getHeight(), "Style should ends with one update done.");
        }.bind(this))
        .play();

      // Keep waiting the end of the animation + tiny extra to don't stop testing before animation has been done
      this.wait(this.duration * 4 + this.extra_wait, Prototype.emptyFunction);
    });
  },
  
  testLoopCycles: function() {
    var height = $('div').setStyle({height: '100px'}).getHeight();
    var fx = new FX.Element('div')
      .setOptions({duration: this.duration})
      .animate({height: '+=100'})
      .setCycle('loop', 2)
      .onEnded(function(fx) {
        this.assertEqual(2, fx.getCycle(), 'Makes sure it made the right amount of cycle');
        this.assertEqual(height, $('div').getHeight(), "Style should be back to original at the end");
      }.bind(this))
      .play();

    // Keep waiting the end of the animation + tiny extra to don't stop testing before animation has been done
    this.wait(this.duration * 2 + this.extra_duration, function() {
      this.teardown();
      this.setup();
          
      var height = $('div').setStyle({height: '100px'}).getHeight();
      var fx = new FX.Element('div')
        .setOptions({duration: this.duration})
        .animate({height: '+=100'})
        .setCycle('loop', 2, false)
        .onEnded(function(fx) {
          this.assertEqual(2, fx.getCycle(), 'Makes sure it made the right amount of cycle');
          this.assertEqual(height + 200, $('div').getHeight(), "Style should ends with X loops update done.");
        }.bind(this))
        .play();

      // Keep waiting the end of the animation + tiny extra to don't stop testing before animation has been done
      this.wait(this.duration * 2 + this.extra_wait, Prototype.emptyFunction);
    });
  },
  
  testRewind: function() {
    var height = $('div').setStyle({height: '100px'}).getHeight();
    var fx = new FX.Element('div')
      .setOptions({duration: this.duration})
      .animate({height: '+=100'})
      .play();

    document.observe('fx:rewinded', function(event) {
      var fx = event.memo.fx;
      this.assertEqual(100, $('div').getHeight(), 'Should be back to initial height');
      this.assertEqual(0, fx.getCycle(), 'Cycle count should be back to 0');
      this.assertEqual(0, fx.isBackward(), "Shouldn't go backward");
    }.bind(this));

    // Wait half of the animation to test rewind
    this.wait(this.duration / 2, function() {
      fx.rewind();

      // Test with backAndForth cycle
      fx.setCycle('backAndForth', 1).play();
      // Wait a quarter of the animation to test rewind
      this.wait(this.duration / 2, function() {
        fx.rewind();

        // Test to rewind while backAndForth cycle moves backward
        fx.setCycle('backAndForth', 1).play();
        // Wait 3 quarters of the animation to test rewind
        this.wait(this.duration * 1.5, function() {
          fx.rewind();

          // Make sure it get back to origin even from finished state
          fx.setCycle('backAndForth', 1, false).play();
          // Wait that the animation has finished before testing rewind
          this.wait(this.duration * 2 + this.extra_wait, function() {
            fx.rewind();
            
            // Make sure it get back to origin even from finished state
            fx.setCycle('loop', 2, true).play();
            // Wait that the animation has finished before testing rewind
            this.wait(this.duration * 2 + this.extra_wait, function() {
              fx.rewind();

              // Make sure it get back to origin even from finished state
              fx.setCycle('loop', 2).play();
              // Wait that the animation has finished before testing rewind
              this.wait(this.duration * 2 + this.extra_wait, function() {
                fx.rewind();
              });
            });
          });
        });
      });
    });
  },
  
  testRewindWhileBackward: function() {
    var height = $('div').setStyle({height: '100px'}).getHeight();
    var fx = new FX.Element('div')
      .setOptions({duration: this.duration})
      .animate({height: '+=100'})
      .play();

    document.observe('fx:rewinded', function(event) {
      var fx = event.memo.fx;
      if (fx.isBackward() == 1) {
        this.assertEqual(200, $('div').getHeight(), 'Should go to final height');
        this.assertEqual(1, fx.getCycle(), 'Cycle count should be to the maximum');
      }
    }.bind(this));

    // Wait half of the animation to test rewind
    this.wait(this.duration / 2, function() {
      fx.reverse().rewind();

      // Test with backAndForth cycle
      fx.setCycle('backAndForth', 1).reverse().rewind().play();
      // Wait a quarter of the animation to test rewind
      this.wait(this.duration / 2, function() {
        fx.reverse().rewind();

        // Test to rewind while backAndForth cycle moves backward
        fx.setCycle('backAndForth', 1).reverse().rewind().play();
        // Wait 3 quarters of the animation to test rewind
        this.wait(this.duration * 1.5, function() {
          fx.reverse().rewind();

          // Make sure it get back to origin even from finished state
          fx.setCycle('backAndForth', 1, false).reverse().rewind().play();
          // Wait that the animation has finished before testing rewind
          this.wait(this.duration * 2 + this.extra_wait, function() {
            fx.reverse().rewind();

            // Make sure it get back to origin even from finished state
            fx.setCycle('loop', 1, true).reverse().rewind().play();
            // Wait that the animation has finished before testing rewind
            this.wait(this.duration * 2 + this.extra_wait, function() {
              fx.reverse().rewind();

              // Make sure it get back to origin even from finished state
              fx.setCycle('loop', 1).reverse().rewind().play();
              // Wait that the animation has finished before testing rewind
              this.wait(this.duration * 2 + this.extra_wait, function() {
                fx.reverse().rewind();
              });
            });
          });
        });
      });
    });
  }
});
