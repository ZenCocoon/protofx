new Test.Unit.Runner({
  setup: function(){
    // Would be good to load fixture instead
    $('sandbox').insert('<div id="div"> </div>');
  },
  
  teardown: function(){
    $('div').remove();
  },
  
  testFade: function(){
    Object.extend(FX.DefaultOptions, {duration: 500});
    var element = $('div');
    
    element.fade();
    this.wait(550, function(){
      this.assertEqual(0, element.getOpacity());
      
      element.setOpacity(1);
      this.assertEqual(1, element.getOpacity());
      element.fade({duration: 1000});
      this.wait(550, function(){
        this.assertNotEqual(0, element.getOpacity());
        this.wait(500, function(){
          this.assertEqual(0, element.getOpacity());
        });
      });
    });
  },
  
  testAppear: function(){
    Object.extend(FX.DefaultOptions, {duration: 500});
    var element = $('div');
    
    element.hide(0);
    this.assertNotVisible(element);
    
    element.appear();
    this.wait(550, function(){
      this.assertEqual(1, element.getOpacity());
      
      element.setOpacity(0)
      this.assertEqual(0, element.getOpacity());
      element.appear({duration: 1000});
      this.wait(550, function(){
        this.assertNotEqual(1, element.getOpacity());
        this.wait(500, function(){
          this.assertEqual(1, element.getOpacity());
        });
      });
    });
  },
  
  testBlindUp: function(){
    Object.extend(FX.DefaultOptions, {duration: 500});
    var element = $('div');
    element.setStyle({height: '200px'});
    
    this.assertEqual(200, element.getHeight());
    element.blindUp();
    this.wait(550, function(){
      this.assertEqual(200, element.getHeight(), 'Should end with initial height');
      this.assertNotVisible(element, 'Should end hidden');
    
      element.show().blindUp({duration: 1000});
      this.wait(550, function(){
        this.assertNotEqual(200, element.getHeight());
        this.assertNotEqual(0, element.getHeight());
        this.wait(500, function(){
          this.assertEqual(200, element.getHeight(), 'Should end with initial height');
          this.assertNotVisible(element, 'Should end hidden');
        });
      });
    });
  },
  
  testBlindDown: function(){
    Object.extend(FX.DefaultOptions, {duration: 500});
    var element = $('div');
    element.setStyle({height: '200px'}).hide();
    
    this.assertEqual(200, element.getHeight());
    this.assertNotVisible(element);
    element.blindDown();
    this.wait(550, function(){
      this.assertEqual(200, element.getHeight());
    
      element.hide();
      this.assertEqual(200, element.getHeight());
      this.assertNotVisible(element);
      element.blindDown({duration: 1000});
      this.wait(550, function(){
        this.assertVisible(element);
        this.assertNotEqual(200, element.getHeight());
        this.assertNotEqual(0, element.getHeight());
        this.wait(500, function(){
          this.assertEqual(200, element.getHeight());
        });
      });
    });
  }
});
