new Test.Unit.Runner({
  testFade: function(){
    Object.extend(FX.DefaultOptions, {duration: 500});
    
    $('div').fade();
    this.wait(550, function(){
      this.assertEqual(0, $('div').getOpacity());
    });
    
    $('div').show().fade({duration: 1000});
    this.wait(550, function(){
      this.assertNotEqual(0, $('div').getOpacity());
      this.wait(500, function(){
        this.assertEqual(0, $('div').getOpacity());
      });
    });
  },
  
  testAppear: function(){
    Object.extend(FX.DefaultOptions, {duration: 500});
    $('div').hide();
    this.assertEqual(0, $('div').getOpacity());
    
    $('div').appear();
    this.wait(550, function(){
      this.assertEqual(1, $('div').getOpacity());
    });
    
    $('div').hide().appear({duration: 1000});
    this.wait(550, function(){
      this.assertNotEqual(1, $('div').getOpacity());
      this.wait(500, function(){
        this.assertEqual(1, $('div').getOpacity());
      });
    });
  }
});
