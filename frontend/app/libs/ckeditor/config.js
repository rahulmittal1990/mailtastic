/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	config.toolbarGroups = [
		{ name: 'clipboard', groups: [ 'undo', 'clipboard' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'editing' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'tools', groups: [ 'Maximize', 'tools' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others', groups: [ 'others' ] },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph', 'sourcearea' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

	config.removeButtons = 'Subscript,Superscript,lineheight, spellchecker,Cut,Copy,Paste,PasteText,PasteFromWord,Unlink,Anchor,SpecialChar,Source,Strike,RemoveFormat,NumberedList,BulletedList,Outdent,Indent,Blockquote,Styles,Format,About';


	

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
        
        //default font size and font family
        
//        config.font_defaultLabel = 'Arial';
//        config.fontSize_defaultLabel = '12px';
//        config.lineHeight_defaultLabel = '1.5';
        
        config.line_height="1;1.1;1.2;1.3;1.4;1.5;1.6;1.7;1.8;1.9;2.0" ;
         config.fontSize_sizes=" 8px;9px;10px;11px;12px;13px;14px;16px;18px;20px;22px;24px;26px;28px;36px;48px;72px;" ;
        
        config.letterspacing="1px;201px;" ;
        
        config.enterMode = CKEDITOR.ENTER_BR;
        //config.enterMode = CKEDITOR.ENTER_DIV;
        
        //enable additional plugins
        config.extraPlugins = 'justify';
        config.extraPlugins += ',maximize';
        config.extraPlugins += ',colordialog';
        config.extraPlugins += ',tabletools';
        config.extraPlugins += ',autogrow';           //editor gets bigger when more content is inserted
        config.extraPlugins += ',dialogadvtab';
        config.extraPlugins += ',tableresize';
        config.extraPlugins += ',divarea';

        config.extraPlugins += ',sourcedialog';
        //config.extraPlugins += ',letterspacing';
         
       
         
         // Remove one plugin.
        config.removePlugins = 'magicline';
        
        //eigene farben
        config.colorButton_enableMore = true;
        
        
          //enbale other skin
         config.skin = 'bootstrapck';
        //setting default font family
//        CKEDITOR.on('instanceReady', function( ev ) {
            //ev.editor.setData('<div style="font-family:Arial, Verdana, sans-serif;font-size : 12px;line-height : 1;">Text hier eingeben</div>');
//        });




//        
        
        //set default values when table configuration dialogue is opened
        CKEDITOR.on( 'dialogDefinition', function( ev ) {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;

            if ( dialogName == 'table' ) {
                var info = dialogDefinition.getContents( 'info' );

                info.get( 'txtWidth' )[ 'default' ] = '500';       // Set default width to 100%
                info.get( 'txtBorder' )[ 'default' ] = '0';         // Set default border to 0
                info.get( 'txtCellSpace' )[ 'default' ] = '0';         // Set default border to 0
                info.get( 'txtCellPad' )[ 'default' ] = '0';         // Set default border to 0
                
                
                
            }
        });

        
       };



