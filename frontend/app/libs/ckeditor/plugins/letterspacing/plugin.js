CKEDITOR.plugins.add( 'letterspacing', {
  requires: ['richcombo'],
  init: function( editor ) {
    var config = editor.config,
      lang = editor.lang.format;
    var trackings = [];

    config.allowedContent = 'span'; //There may be a better way to do this.
//
//    for (var i = -10; i < 11; i++) {
//      trackings.push(String(i) + 'px');
//    }
//    
    
     
   
    trackings.push("-7px");
trackings.push("-6px");
trackings.push("-5px");
trackings.push("-4px");
trackings.push("-3px");
trackings.push("-2px");
trackings.push("-1.5px");
trackings.push("-1px");
trackings.push("-0.5px");
    
    
     trackings.push("0px");
     trackings.push("0.2px");
    trackings.push("0.5px");
trackings.push("1px");
trackings.push("1.5px");
trackings.push("2px");
trackings.push("3px");
trackings.push("4px");
trackings.push("5px");
trackings.push("6px");
trackings.push("7px");




    editor.ui.addRichCombo('letterspacing', {
      label: 'Zeichenabstand',
      title: 'Zeichenabstand ändern',
      voiceLabel: 'Zeichenabstand ändern' ,
      className: 'cke_format',
      multiSelect: false,

      panel: {
      css : [ config.contentsCss, CKEDITOR.getUrl( CKEDITOR.skin.getPath('editor') + 'editor.css' ) ]
      },

      init: function() {
      this.startGroup('Zeichenabstand');
      for (var this_letting in trackings) {
        this.add(trackings[this_letting], trackings[this_letting], trackings[this_letting]);
      }
      },

      onClick: function(value) {
      editor.focus();
      editor.fire('saveSnapshot');
      var ep = editor.elementPath();
      var style = new CKEDITOR.style({styles: {'letter-spacing': value}});
      editor[style.checkActive(ep) ? 'removeStyle' : 'applyStyle' ](style);

      editor.fire('saveSnapshot');
      }
    });
  }
});
