if ( ThriveHomeLayout === undefined ) {
	var ThriveHomeLayout = {};
}

jQuery( document ).ready( function () {

	jQuery( "#home-layout-blocks-menu" ).sortable();

	ThriveHomeLayout.bind_menu_controls();

	jQuery( "#tt-btn-add-new-block" ).click( function () {
		ThriveHomeLayout.add_new_block( jQuery( "#tt-sel-new-block" ).val() );
		return false;
	} );

	ThriveHomeLayout.display_featured_containers();

	jQuery( "#tt-sel-featured-posts" ).on( "change", function ( e ) {
		_tt_custom_posts.push( e.val );
	} );

	jQuery( "#tt-sel-featured-posts" ).select2( {
		maximumSelectionSize: 4,
		minimumInputLength: 3,
		multiple: true,
		allowClear: false,
		ajax: { // instead of writing the function to execute the request we use Select2's convenient helper
			url: ajaxurl,
			dataType: 'json',
			quietMillis: 250,
			data: function ( term, page ) {
				return {
					action: 'thrive_search_posts',
					q: term // search term
				};
			},
			processResults: function ( data ) {
				return {
					results: jQuery.map( data, function ( item ) {
						return {
							text: item.text,
							id: item.id
						}
					} )
				};
			},
			cache: true
		}
	} );

} );


ThriveHomeLayout.add_new_block = function ( type ) {
	var _clone_item = jQuery( "#home-layout-clone-items .tt-block-" + type ).clone();
	jQuery( "#home-layout-blocks-menu" ).append( _clone_item );
	ThriveHomeLayout.bind_menu_controls();
};

ThriveHomeLayout.remove_block = function () {
	jQuery( this ).parents( "li" ).remove();
	if ( jQuery( "#home-layout-blocks-menu li" ).length == 1 ) {
		jQuery( "#tt-block-empty" ).show();
	} else {
		jQuery( "#tt-block-empty" ).hide();
	}
};

ThriveHomeLayout.bind_menu_controls = function () {

	jQuery( ".tt-menu-item-label" ).unbind( 'click' ).click( function () {
		jQuery( this ).siblings( ".tt-menu-item-container" ).toggle();
	} );

	jQuery( ".tt-menu-item-remove" ).click( ThriveHomeLayout.remove_block );

	if ( jQuery( "#home-layout-blocks-menu li" ).length == 1 ) {
		jQuery( "#tt-block-empty" ).show();
	} else {
		jQuery( "#tt-block-empty" ).hide();
	}

	jQuery( ".tt-featured-block-display-radio" ).click( ThriveHomeLayout.display_featured_containers );
	jQuery( ".tt-featured-block-custom-radio" ).click( ThriveHomeLayout.display_featured_containers );
};

ThriveHomeLayout.build_options_obj = function () {

	var _featured_custom_objs = jQuery( "#tt-sel-featured-posts" ).select2( "data" );
	var _temp_custom_ids = [];
	for ( index = 0; index < _featured_custom_objs.length; index ++ ) {
		_temp_custom_ids[index] = _featured_custom_objs[index].id;
	}

	var _home_options = {
		display_featured: jQuery( ".tt-featured-block-display-radio:checked" ).val(),
		featured_custom: jQuery( ".tt-featured-block-custom-radio:checked" ).val(),
		featured_custom_ids: _temp_custom_ids,
		display_infinite: jQuery( ".tt-infinite-block-display-radio:checked" ).val(),
		display_infinite_method: jQuery( ".tt-sel-loading-method" ).val(),
		blocks: []
	};

	jQuery( "#home-layout-blocks-menu li" ).each( function ( index ) {
		var _item_type = jQuery( this ).attr( 'data-type' );
		var _temp_item = {
			item_index: index,
			category: jQuery( this ).find( ".tt-sel-cat" ).length > 0 ? jQuery( this ).find( ".tt-sel-cat" ).val() : "",
			title: jQuery( this ).find( ".tt-block-title" ).length > 0 ? jQuery( this ).find( ".tt-block-title" ).val() : "",
			ad_zone: jQuery( this ).find( ".tt-ad-block-name" ).length > 0 ? jQuery( this ).find( ".tt-ad-block-name" ).val() : "",
			type: _item_type
		};

		if ( _item_type != "empty" ) {
			_home_options.blocks.push( _temp_item );
		}
	} );
	return _home_options;
};

ThriveHomeLayout.display_featured_containers = function () {
	var _display_featured = jQuery( ".tt-featured-block-display-radio:checked" ).val();
	if ( _display_featured == "1" ) {
		jQuery( "#tt-featured-block-custom" ).show();
		var _featured_custom = jQuery( ".tt-featured-block-custom-radio:checked" ).val();
		if ( _featured_custom == "1" ) {
			jQuery( ".tt-sel-featured-posts-container" ).show();
		} else {
			jQuery( ".tt-sel-featured-posts-container" ).hide();
		}
	} else {
		jQuery( "#tt-featured-block-custom" ).hide();
	}
};