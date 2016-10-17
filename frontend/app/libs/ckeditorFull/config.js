/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
         config.enterMode = CKEDITOR.ENTER_BR;
         
       
         config.extraPlugins = 'tabletools';
        
        //config.extraPlugins = 'maximize';
//        config.extraPlugins = 'colordialog';
        
        config.extraPlugins = 'autogrow';           //editor gets bigger when more content is inserted
         
          // Remove one plugin.
        config.removePlugins = 'magicline';
        
          config.extraPlugins = 'tableresize';
        
        config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		//{ name: 'links' },
		{ name: 'insert' },
		//{ name: 'forms' },
		{ name: 'tools', groups: [ 'Maximize' ] },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		//{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		//{ name: 'about' }
	];
};
