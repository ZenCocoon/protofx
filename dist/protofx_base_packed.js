FX={};FX.Transition={swing:function(B,C,A,E,D){return((-Math.cos(C/D*Math.PI)/2)+0.5)*E+A}};FX.DefaultOptions={duration:500,transition:FX.Transition.swing,eventNotifier:document,memoData:null};FX.Base=Class.create((function(){function A(S){this.options=Object.extend(Object.clone(FX.DefaultOptions),S);this.currentTime=null;this.nextTime=0;this.playing=false;this.backward=false;this.cycle=false;this.callbacks={onEnded:Prototype.emptyFunction,onStarted:Prototype.emptyFunction,onBeforeStarted:Prototype.emptyFunction,onCycleEnded:Prototype.emptyFunction};this.setOptions(S)}function J(S){Object.extend(this.options,S||{});return this}function Q(){return this.options.duration}function D(){return this.playing}function C(){return this.backward}function M(T,U,S){this.cycle=T=="none"?false:{type:T,count:U||1,back:T=="backAndForth"?S||(U==1?true:false):false,current:0,direction:1};return this}function O(){return this.cycle?this.cycle.current:1}function L(){if(this.playing){return }this.fire("beforeStarted");this.playing=true;if(this.currentTime==null){this.currentTime=this.backward?this.getDuration():0;this.startAnimation(this.backward)}FX.Metronome.register(this);this.fire("started");return this}function H(){this.fire("stopped");FX.Metronome.unregister(this);this.playing=false;return this}function E(){this.fire("reversed");if(this.cycle){this.cycle.direction*=-1}this.backward=!this.backward;return this}function F(){this.stop();this.fire("rewinded");this.updateAnimation(this.backward?1:0);this.currentTime=null;if(this.cycle){this.cycle.current=1}return this}function B(T){this.currentTime+=this.backward?-T:T;if(this.currentTime>this.getDuration()||this.currentTime<0){this.currentTime=this.currentTime<0?0:this.getDuration();this.updateAnimation(this.currentTime/this.getDuration());if(this.cycle){if(this.cycle.type=="loop"){this.cycle.current+=this.cycle.direction;this.fire("cycleEnded");this.updateAnimation(this.backward?1:0);this.currentTime=this.backward?this.getDuration():0}else{if(this.cycle.type=="backAndForth"){this.backward=!this.backward;if((this.backward!==this.cycle.back&&this.cycle.direction>0)||(this.backward===this.cycle.back&&this.cycle.direction<0)){this.cycle.current+=this.cycle.direction}else{this.fire("cycleEnded")}}}if(this.cycle.count=="unlimited"||(0<=this.cycle.current&&this.cycle.current<this.cycle.count)){return }}this.stopAnimation();FX.Metronome.unregister(this);this.currentTime=null;this.playing=false;this.fire("ended")}else{var S=this.options.transition(this.currentTime/this.getDuration(),this.currentTime,0,1,this.getDuration());this.updateAnimation(S)}}function K(S){this.callbacks.onEnded=S;return this}function R(S){this.callbacks.onStarted=S;return this}function I(S){this.callbacks.onBeforestarted=S;return this}function G(S){this.callbacks.onCycleended=S;return this}function P(S){var T;if(T=this.callbacks["on"+S.capitalize()]){T(this)}this.options.eventNotifier.fire("fx:"+S,{fx:this,data:this.memoData})}function N(S){throw"FX.Base#updateAnimation(pos) must be implemented"}return{initialize:A,setOptions:J,setCycle:M,getCycle:O,getDuration:Q,play:L,stop:H,reverse:E,rewind:F,isPlaying:D,isBackward:C,metronomeUpdate:B,startAnimation:Prototype.emptyFunction,stopAnimation:Prototype.emptyFunction,updateAnimation:N,fire:P,onStarted:R,onEnded:K,onBeforeStarted:I,onCycleEnded:G}})());FX.Attribute=Class.create((function(){function F(M,O,N){this.key=M;this.from=O;this.to=N;this.type=B(this.from);this.unit=D(this.from);this.fromFX=E(this.from,this.isColor());this.toFX=A(this)}function H(P){if(this.isNumber()){return I(this.fromFX,this.toFX,P)+this.unit}else{var O=parseInt(I(this.fromFX[0],this.toFX[0],P));var N=parseInt(I(this.fromFX[1],this.toFX[1],P));var M=parseInt(I(this.fromFX[2],this.toFX[2],P));return"rgb("+O+", "+N+", "+M+")"}}function G(O,N){if(O&&this.relative){this.from=O}this.fromFX=E(this.from,this.isColor());this.relative=false;this.toFX=A(this,N);if(N&&this.relative){var M=this.fromFX;this.fromFX=this.toFX,this.toFX=M}}function C(){return this.type=="Color"}function L(){return this.type=="Number"}function B(M){if(Object.isString(M)&&M.isColor()){return"Color"}else{return"Number"}}function D(N){var M;if(Object.isString(N)&&(M=N.match(/(\d+)([\w\%]*)/))){return M[2]}else{return""}}function E(N,M){if(M){return N.getRGB()}else{if(Object.isString(N)){return parseFloat(N)}else{return N}}}function A(M,N){if(M.isColor()){return M.to.getRGB()}else{if(Object.isString(M.to)){if(K(M.to)){return J(M,N)}else{return parseFloat(M.to)}}else{return M.to}}}function I(O,N,M){return O+(N-O)*M}function K(M){return M.match(/^([\+\-\*\/]=)(\d*)$/)}function J(N,O){N.relative=true;var M=K(N.to);if((O&&M[1]=="-=")||(!O&&M[1]=="+=")){return N.fromFX+parseFloat(M[2])}else{if((O&&M[1]=="+=")||(!O&&M[1]=="-=")){return N.fromFX-parseFloat(M[2])}else{if((O&&M[1]=="*=")||(!O&&M[1]=="/=")){return N.fromFX/parseFloat(M[2])}else{if((O&&M[1]=="/=")||(!O&&M[1]=="*=")){return N.fromFX*parseFloat(M[2])}else{throw"Operator "+M[1]+" not allowed"}}}}}return{initialize:F,convert:H,reset:G,isNumber:L,isColor:C}})());FX.Metronome=(function(){var A=null,F=1000/60,C=null,I=new Array();function H(K){if(!J(K)){I.push(K);B()}}function E(K){I=I.reject(function(L){return L==K});if(I.length==0){G()}}function J(K){return I.find(function(L){return L==K})}function B(){if(A==null){C=new Date().getTime();A=setInterval(D,F);D()}}function G(){if(A){clearInterval(A);A=null;C=0}}function D(){var K=new Date().getTime();var L=K-C;C=K;I.invoke("metronomeUpdate",L)}return{register:H,unregister:E,isRegistered:J}})();Object.extend(String.prototype,{isColor:function(){return this.match(/^\#/)||this.match(/^rgb\(/)},getRGB:function(){function B(C){if(C.length==1){C+=C}return parseInt(C,16)}if(this.isColor()){var A;if(A=this.match(/(^rgb\()(\d+), (\d+), (\d+)(\))/i)){return[parseInt(A[2]),parseInt(A[3]),parseInt(A[4])]}if(A=this.match(/^\#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i)){return A.slice(1).collect(B)}if(A=this.match(/^\#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)){return A.slice(1).collect(B)}}return null}});FX.Element=Class.create(FX.Base,(function(){function A($super,H,G){$super(G);this.element=$(H)}function D(G){this.originalAttributes=G;return this}function C(G){var H=new FX.Element(G,this.options).animate(this.originalAttributes);H.callbacks=this.callbacks;return H}function B(G){this.attributes=this.attributes||E(this.originalAttributes,this.element);this.attributes.each(function(H){H.reset(this.element.getStyle(H.key),G)},this)}function F(H){var G={};this.attributes.each(function(I){G[I.key]=I.convert(H)},this);this.element.setStyle(G)}function E(G,H){var I=[];$H(G).each(function(J){I.push(new FX.Attribute(J.key,H.getStyle(J.key),J.value))});return I}return{initialize:A,animate:D,cloneFor:C,startAnimation:B,updateAnimation:F}})());Element.addMethods({fade:function(B,A){if(!(B=$(B))){return }new FX.Element(B).setOptions(A||{}).animate({opacity:0}).play();return B},appear:function(B,A){if(!(B=$(B))){return }new FX.Element(B).setOptions(A||{}).animate({opacity:1}).play();return B},blindUp:function(B,A){if(!(B=$(B))){return }if(!B.visible()||B.fx_blindUp){return B}B.fx_blindUp=new FX.Element(B).setOptions(A||{}).onBeforeStarted(function(){B.originalHeight=B.style.height}).onEnded(function(){B.hide();B.style.height=B.originalHeight;delete B.fx_blindUp}).animate({height:0}).play();return B},blindDown:function(C,B){if(!(C=$(C))){return }if(C.visible()||C.fx_blindDown){return C}var A=C.getHeight();C.fx_blindDown=new FX.Element(C).setOptions(B||{}).onBeforeStarted(function(){C.show();C.style.height="0px"}).onEnded(function(){delete C.fx_blindDown}).animate({height:A+"px"}).play();return C},highlight:function(B,A){if(!(B=$(B))){return }if(!B.visible()){return B}A=A||{};if(B.fx_highlight){B.fx_highlight.stop().reverse().rewind()}var D=A.highlightColor||"#ffff99";var C=B.getStyle("background-color");B.fx_highlight=new FX.Element(B).setOptions(A).animate({backgroundColor:C}).onBeforeStarted(function(){B.setStyle({backgroundColor:D})}).onEnded(function(){delete B.fx_highlight}).play();return B},shake:function(D,C){if(!(D=$(D))){return }if(!D.visible()){return D}C=Object.extend({duration:50},C||{});if(D.fx){D.fx_shake.stop().reverse().rewind()}var E=C.distance||20;var A=new FX.Element(D).setOptions(C).setCycle("backAndForth",1).animate({left:"+="+E});var B=new FX.Element(D).setOptions(C).setCycle("backAndForth",1).animate({left:"-="+E});D.makePositioned();D.fx_shake=new FX.Score(D).setCycle("loop",2).onEnded(function(){D.undoPositioned();delete D.fx_shake}).add(A).add(B,{position:"last"}).play();return D},pulsate:function(C,A){if(!(C=$(C))){return }if(!C.visible()){return C}A=Object.extend({duration:2000},A||{});if(C.fx_pulsate){C.fx_pulsate.isBackward()?C.fx_pulsate.stop().reverse().rewind():C.fx_pulsate.stop().rewind()}var B=A.pulses||5;A.duration=A.duration/(B*2);C.fx_pulsate=new FX.Element(C).setOptions(A).setCycle("backAndForth",B,true).onEnded(function(){delete C.fx_pulsate}).animate({opacity:0}).play();return C}});