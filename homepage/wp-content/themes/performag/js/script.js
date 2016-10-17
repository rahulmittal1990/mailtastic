/*
 *
 * Namespace for all the scripts implemented in the frontend
 */
if ( ThriveApp === undefined ) {
	var ThriveApp = {};
}

var _isAdmin = 0;
ThriveApp.bind_comments = false;

ThriveApp.winWidth = jQuery( window ).width();
ThriveApp.viewportHeight = jQuery( window ).height();
ThriveApp.number_init = false;

jQuery( window ).load( function () {
	ThriveApp.resize_blank_page();
} );

jQuery( function () {
	_isAdmin = jQuery( '#wpadminbar' ).length;
	ThriveApp.menuPositionTop = (
		jQuery( ".nav_c nav" ).length
	) ? jQuery( ".nav_c nav" ).position().top : 0;
	ThriveApp.menuResponsive();
	ThriveApp.shortcodeTabsResize();
	ThriveApp.setPageSectionHeight();
	ThriveApp.bind_comments_handlers();
	ThriveApp.check_comments_hash();
	ThriveApp.videoShorcode();
	ThriveApp.image_post_resize();
	ThriveApp.blog_gallery();
	jQuery( '.cdt' ).thrive_timer();
	ThriveApp.multimenu();
	ThriveApp.post_video_play();
	ThriveApp.gallery_post();
	ThriveApp.social_sharing_icons();
	ThriveApp.bind_share_buttons();
	ThriveApp.grid_layout( '.gin', '.art' );
	ThriveApp.grid_layout( '.scbg', '.scc' );


	if ( ThriveApp.infinite_scroll == 1 && ThriveApp.is_singular != 1 && jQuery( ".tt-container-infinite" ).length > 0 ) {
		ThriveApp.bind_inifite_scroll();
	}

	if ( ThriveApp.infinite_scroll == 1 && ThriveApp.is_singular == 1 && jQuery( "#tt-related-container" ).length > 0 ) {
		ThriveApp.bind_inifite_scroll_for_post();
	}
	if ( jQuery( ".tt-latest-posts-container" ).length > 0 ) {
		ThriveApp.bind_homepage_custom_infinite_scroll();
	}
	if ( jQuery( "#tt-show-more-posts" ).length > 0 ) {
		jQuery( "#tt-show-more-posts" ).click( ThriveApp.bind_homepage_custom_infinite_click );
	}

	if ( ThriveApp.is_singular == 1 ) {
		var post_data = {
			action: 'thrive_get_share_count',
			post_id: ThriveApp.currentPostId
		};
		if ( window.TVE_Dash && ! TVE_Dash.ajax_sent ) {
			jQuery( document ).on( 'tve-dash.load', function () {
				TVE_Dash.add_load_item( 'theme_shares', post_data );
			} );
		} else {
			jQuery.post( ThriveApp.ajax_url, post_data );
		}
	}

	/*
	 * attach events to .flex-cnt because when infinte scroll is active
	 * the elements don't exist in the DOM and the events are not attached
	 * to the elements
	 * */

	jQuery( document ).on( 'mouseover', '.sm_icons, .scfm .ss', function () {
		jQuery( '.bubb', this ).css( 'left', function () {
			return (
				       jQuery( this ).parent().width() - jQuery( this ).width()
			       ) / 2;
		} ).show( 0 );
	} ).on( 'mouseout', '.sm_icons, .scfm .ss', function () {
		jQuery( '.bubb', this ).hide();
	} ).on( 'mouseover', '.tmw', function () {
		jQuery( this ).find( '.tmm' ).slideDown();
	} ).on( 'mouseout', '.tmw', function () {
		jQuery( this ).find( '.tmm' ).slideUp();
	} ).on( 'click', '.faqB', function () {
		var $toggle = jQuery( this ).parents( '.faqI' );
		$toggle.toggleClass( 'oFaq' );
		jQuery( '.faqC', $toggle ).slideToggle( 'fast' );
		return false;
	} ).on( 'click', '.accss .acc-h', function () {
		var accordion_element = jQuery( this ),
			accordion_context = jQuery( this ).parents( '.accs' ),
			accordion_parent = accordion_context.find( '.accss' );
		if ( accordion_element.parent().hasClass( 'opac' ) ) {
			return false;
		}
		accordion_element.parents( '.accs' ).find( '.opac' ).find( '.accsi' ).slideUp( function () {
			accordion_parent.removeClass( 'opac' );
		} );
		accordion_element.next( '.accsi' ).slideDown( function () {
			accordion_element.parents( '.accss' ).addClass( 'opac' );
		} );
	} ).on( 'click', '.far.f2', function () {
		jQuery( this ).addClass( 'fof' );
		e.preventDefault;
	} ).on( 'click', '#shf', function () {
		jQuery( '.lrp.hid' ).slideToggle();
	} );


	if ( jQuery( ".thrive-borderless .wp-video-shortcode" ).length > 0 ) {
		jQuery( ".thrive-borderless .wp-video-shortcode" ).css( 'width', '100%' );
		jQuery( ".thrive-borderless div" ).css( 'width', '100%' );
	}

	ThriveApp.comments_page = 1;
	if ( ThriveApp.lazy_load_comments == 1 ) {
		jQuery( window ).scroll( ThriveApp.bind_scroll );
		ThriveApp.load_comments();
	}

	jQuery( window ).trigger( 'scroll' );

	//initialize masonry layout
	ThriveApp.bind_masonry_layout();

	jQuery( window ).resize( function () {
		var winNewWidth = window.innerWidth;
		var winNewViewportHeight = jQuery( window ).height();

		if ( ThriveApp.winWidth !== winNewWidth ) {
			ThriveApp.delay( function () {
				ThriveApp.menuResponsive();
			}, 1 );
		}
		ThriveApp.winWidth = winNewWidth;
		ThriveApp.viewportHeight = winNewViewportHeight;
		ThriveApp.shortcodeTabsResize();
		ThriveApp.videoShorcode();
		ThriveApp.setVideoPosition();
		ThriveApp.setPageSectionHeight();
		ThriveApp.image_post_resize();
		ThriveApp.grid_layout( '.gin', '.art' );
		ThriveApp.grid_layout( '.scbg', '.scc' );
	} );


	if ( jQuery( "#tt-hidden-video-youtube-autoplay" ).length > 0 && ThriveApp.is_singular == 1 ) {
		jQuery( ".scvps .pvb" ).trigger( "click" );
		jQuery( ".pv .ovp, .pv .ovr" ).trigger( "click" );
	}

	jQuery( 'body' ).on( 'added_to_cart', function ( event, fragments, cart_hash, $thisbutton ) {
		var _a = (
			jQuery( fragments['.mini-cart-contents'] ).find( 'a.cart-contents-btn' )
		);
		_a.removeClass( "cart-contents-btn" );
		jQuery( '.mobile-mini-cart' ).html( '' ).append( _a );
	} );

	if ( window.FB && window.FB.XFBML ) {
		jQuery( '.fb-comments' ).each( function () {
			window.FB.XFBML.parse( this.parentNode );
		} );
	}

} );

ThriveApp.grid_layout = function ( gridWrapper, gridElement ) {
	if ( jQuery( gridWrapper ).length > 0 ) {
		jQuery( gridWrapper ).each( function () {
			var gridBlock = jQuery( gridElement, this ),
				noOfItems = gridBlock.length;
			var setGridHeights = function ( noOfElementsOnRow ) {
				var _condition = '';
				for ( var i = 0; i < noOfItems; i += noOfElementsOnRow ) {
					if ( noOfElementsOnRow == 4 ) {
						_condition = ':eq(' + i + '),:eq(' + (
						             i + 1
							) + '),:eq(' + (
						             i + 2
						             ) + '),:eq(' + (
						             i + 3
						             ) + ')';
					}

					if ( noOfElementsOnRow == 3 ) {
						_condition = ':eq(' + i + '),:eq(' + (
						             i + 1
							) + '),:eq(' + (
						             i + 2
						             ) + ')';
					}

					if ( noOfElementsOnRow == 2 ) {
						_condition = ':eq(' + i + '),:eq(' + (
						             i + 1
							) + ')';
					}

					var gridGroup = gridBlock.filter( _condition ),
						elementHeights = jQuery( gridGroup ).map( function () {
							gridGroup.css( 'height', '' );//reset height so that we can recalculate
							return jQuery( this ).height();
						} ),
						maxHeight = Math.max.apply( null, elementHeights );
					gridGroup.height( maxHeight );
				}
			};
			var grid_cols = 3;
			if ( ThriveApp.winWidth >= 1080 ) {
				if ( gridWrapper == '.scbg' && (
						jQuery( '.bSe' ).hasClass( 'fullWidth' ) || jQuery( this ).children( '#tt-related-container' ).length > 0
					) ) {
					grid_cols = 4;
				}

			} else if ( 1080 > ThriveApp.winWidth && ThriveApp.winWidth >= 940 ) {

				if ( ! jQuery( '.bSe' ).hasClass( 'fullWidth' ) || gridWrapper == ".gin" ) {
					grid_cols = 2;
				}
			} else if ( 940 > ThriveApp.winWidth && ThriveApp.winWidth >= 775 ) {
				grid_cols = 2;
			}

			setGridHeights( grid_cols );
		} );


	}
};

ThriveApp.bind_masonry_layout = function () {
	if ( jQuery( '.bSe' ).hasClass( 'mry' ) ) {
		var container = document.querySelector( '.mry' );
		var msnry = new Masonry( container, {
			itemSelector: '.mry-i',
			gutter: ".mry-g"
		} );
	}
};

ThriveApp.social_sharing_icons = function () {
	if ( ThriveApp.is_singular == "1" ) {
		var _social_buttons = jQuery( '.iqs' );
		jQuery( '.fwit, .fwi, .afim img, blockquote, .pulQ, img[class*="wp-image"]' ).each( function () {
			jQuery( this ).mouseenter( function () {
				var _left = jQuery( this ).offset().left,
					_top = jQuery( this ).offset().top,
					_this_width = 40;
				_social_buttons.css( {
					top: _top + 'px',
					left: _left - _this_width + 'px'
				} );
				_social_buttons.show();
			} );
			jQuery( this ).mouseleave( function () {
				_social_buttons.hide();
			} );
			_social_buttons.mouseenter( function () {
				jQuery( this ).show();
			} );
			_social_buttons.mouseleave( function () {
				jQuery( this ).hide();
			} );
		} );
	}
}

ThriveApp.number_counter = function () {
	jQuery( '.nbc.nsds' ).each( function () {
		var counter_element = jQuery( '.nbcn', this ),
			count_to = counter_element.attr( 'data-counter' );
		var i = 0, t = null, step = 1;
		if ( jQuery( this ).attr( 'data-started' ) == 'false' ) {
			stepper( i, count_to );
			jQuery( this ).attr( 'data-started', 'true' );
		}
		function stepper( i, count_to ) {
			step = Math.ceil( count_to / 100 );

			if ( i <= count_to ) {
				counter_element.text( i );
				i += step;
				if ( i + step > count_to ) {
					counter_element.text( count_to );
					clearTimeout( t );
				}
				t = setTimeout( function () {
					stepper( i, count_to )
				}, 50 );
			} else {
				clearTimeout( t );
			}
		}
	} );
};

ThriveApp.image_post_resize = function () {
	jQuery( '.dmy, .bt.im img' ).css( {
		'max-height': ThriveApp.viewportHeight,
		'max-width': ThriveApp.winWidth
	} );
};

ThriveApp.setPageSectionHeight = function () {
	var containerWidthElement = jQuery( '.wrp .bpd , .wrp .fullWidth ,.wrp .lnd  ' ),
		isFullWidth = containerWidthElement.length,
		defaultWidth = isFullWidth ? (
			ThriveApp.winWidth + 'px'
		) : '100%';

	//jQuery('.pdfbg.pdwbg').css({
	//    'box-sizing': "border-box",
	//    width: defaultWidth,
	//    height: ThriveApp.viewportHeight + 'px'
	//});

	jQuery( '.pddbg, .scvps' ).css( 'max-width', ThriveApp.winWidth + 'px' );

	jQuery( '.pdfbg' ).each( function () {
		var img = jQuery( this ).css( "box-sizing", "border-box" ),
			imgHeight = img.attr( 'data-height' ),
			imgWidth = img.attr( 'data-width' );

		if ( imgHeight === undefined || imgWidth === undefined ) {
			img.css( "min-height", '100%' );
		} else {
			var _parentWidth = img.parent().width(),
				ratio = (
					        _parentWidth * imgHeight
				        ) / imgWidth;
			if ( _parentWidth <= imgWidth ) {
				img.css( 'min-height', ratio + 'px' );
			} else {
				img.css( {
					'min-height': imgHeight + 'px'
				} );
			}
			//img.css('min-height', parseInt((_parentWidth * imgHeight) / imgWidth) + 'px');
		}
	} );
	/*jQuery('.in').each(function(){
	 if(jQuery(this).hasClass('c-img')) {
	 var full_background = jQuery(this).attr('data-full'),
	 tablet_background = jQuery(this).attr('data-tablet'),
	 phone_background = jQuery(this).attr('data-phone');
	 if (ThriveApp.winWidth > 940) {
	 jQuery(this).css('background-image', 'url(' + full_background + ')');
	 } else if (ThriveApp.winWidth > 480) {
	 if(tablet_background != null || tablet_background != undefined) {
	 jQuery(this).css('background-image', 'url(' + tablet_background + ')');
	 }
	 } else if (480 > ThriveApp.winWidth) {
	 if(phone_background != null || phone_background != undefined) {
	 jQuery(this).css('background-image', 'url(' + phone_background + ')');
	 }
	 }
	 }
	 });*/
};

ThriveApp.multimenu = function () {
	jQuery( '.ml a' ).each( function () {
		var multimenuRel = jQuery( this ).attr( 'data-rel' ),
			multimenuParent = jQuery( this ).parents( '.mmi' ),
			multimenuCategories = multimenuParent.find( '.mi .mic' );
		jQuery( this ).mouseenter( function () {
			multimenuParent.find( '.ml a' ).removeClass( 'ml-f' );
			jQuery( this ).addClass( 'ml-f' );
			multimenuCategories.hide( 0 );
			multimenuCategories.filter( function () {
				return jQuery( this ).attr( 'data-rel' ) === multimenuRel;
			} ).fadeIn( 0 );
		} );
		jQuery( this ).mouseout( function () {
			multimenuParent.find( '.ml a' ).removeClass( 'ml-f' ).first().addClass( 'ml-f' );
		} );
	} );
}

ThriveApp.showMenu = function () {
	jQuery( '.nav_c nav ul li' ).each( function () {
		if ( jQuery( this ).hasClass( 'mult' ) ) {
			jQuery( this ).mouseenter( function () {
				jQuery( this ).children( '.mm' ).stop().fadeIn( 'fast' );
			} );
			jQuery( this ).mouseleave( function () {
				jQuery( this ).children( '.mm' ).stop().fadeOut( 'fast' );
			} );
		} else {
			jQuery( this ).mouseenter( function () {
				jQuery( this ).children( '.sub-menu' ).stop().fadeIn( 'fast' );
			} );
			jQuery( this ).mouseleave( function () {
				jQuery( this ).children( '.sub-menu' ).stop().fadeOut( 'fast' );
			} );
		}
	} );
};

ThriveApp.menuResponsive = function () {
	if ( ThriveApp.winWidth <= 774 ) {
		//jQuery(".nav_c nav").css('max-height', (ThriveApp.viewportHeight - ThriveApp.menuPositionTop - 150) + "px");
		jQuery( '.nav_c nav ul li' ).each( function () {
			jQuery( this ).unbind( 'mouseenter' );
			jQuery( this ).unbind( 'mouseleave' );
		} );
		jQuery( '.hsm' ).unbind( 'click' ).on( 'click', function () {
			var headerHeight = jQuery( 'header' ).height() + 40,
				topBar = jQuery( '#wpadminbar' ).length ? 46 : 0,
				distanceFromTop = headerHeight + topBar,
				menuMaxHeight = ThriveApp.viewportHeight - distanceFromTop;
			console.log( headerHeight, topBar, ThriveApp.viewportHeight );
			jQuery( '.nav_c' ).fadeToggle( 'fast', function () {
				var menuHeight = jQuery( '.nav_c nav' ).height();
				if ( ThriveApp.viewportHeight <= menuHeight + distanceFromTop ) {
					jQuery( ".nav_c nav" ).css( {
						'max-height': menuMaxHeight + "px"
					} );
					jQuery( 'html' ).addClass( 'html-hidden' );
				}
				if ( menuHeight <= 0 ) {
					jQuery( 'html' ).removeClass( 'html-hidden' );
				}
			} );
		} );
	} else if ( ThriveApp.winWidth >= 775 ) {
		jQuery( ".nav_c nav" ).css( 'max-height', 'auto' );
		jQuery( '.nav_c' ).attr( 'style', '' );
		ThriveApp.showMenu();
	}
}

ThriveApp.shortcodeTabsResize = function () {
	jQuery( '.flex-cnt, footer' ).on( 'click', '.scT > ul.scT-tab li', function ( e ) {
		var $li = jQuery( this ),
			tabs_wrapper = $li.parents( ".shortcode_tabs, .tabs_widget" ).first(),
			target_tab = tabs_wrapper.find( ".scTC" ).eq( $li.index() );
		tabs_wrapper.find( ".tS" ).removeClass( "tS" );
		$li.addClass( 'tS' );
		tabs_wrapper.find( ".scTC" ).hide();
		target_tab.show();
		e.preventDefault();
	} );
};

ThriveApp.delay = (function () {
	var timer = 0;
	return function ( callback, ms ) {
		clearTimeout( timer );
		timer = setTimeout( callback, ms );
	};
})();

ThriveApp.check_comments_hash = function () {
	if ( location.hash ) {
		//this part is commented because when you click on the comments link and the lazy load is on, it takes you to the bottom of the page and it freezes until all comments are loaded.
		//if (location.hash.indexOf("#comments") >= 0) {
		//    var aTag = jQuery("#commentform");
		//    jQuery('html,body').animate({
		//        scrollTop: aTag.offset().top
		//    }, 'slow');
		//    return;
		//}

		var tempNo = location.hash.indexOf( "#comment-" ) + 9;
		var comment_id = location.hash.substring( tempNo, location.hash.length );

		var aTag = jQuery( "#comment-container-" + comment_id );
		if ( aTag.length !== 0 ) {
			jQuery( 'html,body' ).animate( {
				scrollTop: aTag.offset().top - 30
			}, 'slow' );
		}
	}
};

ThriveApp.videoShorcode = function () {
	jQuery( '.flex-cnt' ).on( 'click', '.scvps .pvb a', function ( event ) {
		event.preventDefault();
	} ).on( 'click', '.scvps .pvb', function () {
		var elementHeight = jQuery( this ).parents( '.scvps' ).height();
		jQuery( this ).parents( '.scvps' ).css( 'height', elementHeight + 'px' );
		jQuery( this ).parents( ".vdc" ).find( "h1" ).hide();
		jQuery( this ).parents( ".vdc" ).find( "h3" ).hide();
		jQuery( this ).hide();
		jQuery( this ).parents( ".scvps" ).find( ".video-container" ).show();

		if ( jQuery( this ).parents( ".scvps" ).find( "iframe" ).length > 0 ) {
			var _current_iframe = jQuery( this ).parents( ".scvps" ).find( "iframe" );
			var _container_width = jQuery( this ).parents( ".scvps" ).outerWidth();
			var _iframe_width = _current_iframe.attr( 'width' );
			if ( jQuery( this ).hasClass( 'is-video-format' ) ) {
				var _container_height = jQuery( this ).parents( ".scvps" ).outerHeight();
			} else {
				var _container_height = (
					                        _container_width * 9
				                        ) / 16;
			}
			if ( _container_width < _iframe_width ) {
				_current_iframe.attr( 'width', _container_width );
				_current_iframe.attr( 'height', _container_height );
			}
		}

		var _video_element = jQuery( this ).parents( ".scvps" ).find( ".vwr" );
		var _video_el_top = jQuery( this ).parents( ".scvps" ).outerHeight() / 2 - _video_element.height() / 2;
		_video_element.css( {
			top: (
				_video_el_top < 0
			) ? 0 : _video_el_top,
			left: jQuery( this ).parents( ".scvps" ).outerWidth() / 2 - _video_element.width() / 2
		} );

		if ( jQuery( this ).parents().is( '.bt.vp' ) && _video_element.height() > jQuery( this ).parents( '.bt.vp' ).height() ) {
			jQuery( this ).parents( '.bt.vp' ).addClass( 'st-vd' );
		}

		if ( jQuery( this ).parents( ".scvps" ).find( "video" ).length > 0 ) {
			var _player_element = jQuery( this ).parents( ".scvps" ).find( "video" )[0];
			if ( jQuery( this ).hasClass( 'is-video-format' ) ) {
				/*var  _container_height = jQuery(this).parents(".scvps").outerHeight();
				 var _container_width = jQuery(this).parents(".scvps").outerWidth();
				 _player_element.height = _container_height;
				 _player_element.width = _container_width;*/
			}
			_player_element.player.play();
		}
		if ( jQuery( this ).parents( ".scvps" ).find( "iframe" ).length > 0 ) {
			var _current_iframe = jQuery( this ).parents( ".scvps" ).find( "iframe" );
			var _iframe_id = _current_iframe.attr( 'id' );
			var _iframe_src = _current_iframe.attr( 'src' );

			if ( _iframe_src.indexOf( "vimeo" ) >= 0 ) {
				_current_iframe.attr( 'src', ThriveApp.updateQueryStringParameter( _iframe_src, "autoplay", "1" ) );
			} else if ( _iframe_src.indexOf( "youtube" ) >= 0 ) {
				_current_iframe.attr( 'src', ThriveApp.updateQueryStringParameter( _iframe_src, "autoplay", "1" ) );
			}
			jQuery( this ).parents( ".scvps" ).find( "iframe" ).trigger( "click" );
		}
	} );
//    jQuery(".scvps .pvb a").click(function (event) {
//        event.preventDefault();
//        //return false;
//    });

//    jQuery(".scvps .pvb").click(function () {
//        var elementHeight = jQuery(this).parents('.scvps').height();
//        jQuery(this).parents('.scvps').css('height', elementHeight + 'px');
//        jQuery(this).parents(".vdc").find("h1").hide();
//        jQuery(this).parents(".vdc").find("h3").hide();
//        jQuery(this).hide();
//        jQuery(this).parents(".scvps").find(".video-container").show();
//
//        if (jQuery(this).parents(".scvps").find("iframe").length > 0) {
//            var _current_iframe = jQuery(this).parents(".scvps").find("iframe");
//            var _container_width = jQuery(this).parents(".scvps").outerWidth();
//            var _iframe_width = _current_iframe.attr('width');
//            if (jQuery(this).hasClass('is-video-format')) {
//                var _container_height = jQuery(this).parents(".scvps").outerHeight();
//            } else {
//                var _container_height = (_container_width * 9) / 16;
//            }
//            if (_container_width < _iframe_width) {
//                _current_iframe.attr('width', _container_width);
//                _current_iframe.attr('height', _container_height);
//            }
//        }
//
//        var _video_element = jQuery(this).parents(".scvps").find(".vwr");
//        var _video_el_top = jQuery(this).parents(".scvps").outerHeight() / 2 - _video_element.height() / 2;
//        _video_element.css({
//            top: (_video_el_top < 0) ? 0 : _video_el_top,
//            left: jQuery(this).parents(".scvps").outerWidth() / 2 - _video_element.width() / 2
//        });
//
//        if (jQuery(this).parents().is('.bt.vp') && _video_element.height() > jQuery(this).parents('.bt.vp').height()) {
//            jQuery(this).parents('.bt.vp').addClass('st-vd');
//        }
//
//        if (jQuery(this).parents(".scvps").find("video").length > 0) {
//            var _player_element = jQuery(this).parents(".scvps").find("video")[0];
//            if (jQuery(this).hasClass('is-video-format')) {
//                /*var  _container_height = jQuery(this).parents(".scvps").outerHeight();
//                 var _container_width = jQuery(this).parents(".scvps").outerWidth();
//                 _player_element.height = _container_height;
//                 _player_element.width = _container_width;*/
//            }
//            _player_element.player.play();
//        }
//        if (jQuery(this).parents(".scvps").find("iframe").length > 0) {
//            var _current_iframe = jQuery(this).parents(".scvps").find("iframe");
//            var _iframe_id = _current_iframe.attr('id');
//            var _iframe_src = _current_iframe.attr('src');
//
//            if (_iframe_src.indexOf("vimeo") >= 0) {
//                _current_iframe.attr('src', ThriveApp.updateQueryStringParameter(_iframe_src, "autoplay", "1"));
//            } else if (_iframe_src.indexOf("youtube") >= 0) {
//                _current_iframe.attr('src', ThriveApp.updateQueryStringParameter(_iframe_src, "autoplay", "1"));
//            }
//            jQuery(this).parents(".scvps").find("iframe").trigger("click");
//        }
//    });

};

ThriveApp.post_video_play = function () {
	jQuery( '.flex-cnt' ).on( 'click', '.pv .ovp, .pv .ovr', function () {
		if ( jQuery( this ).parents().is( '.vf' ) ) {
			jQuery( this ).parents( '.mov' ).hide();
			jQuery( this ).parents( '.vf' ).find( '.movi' ).show();
		} else {
			jQuery( this ).hide();
		}

		if ( jQuery( this ).parents( ".rve" ).find( "video" ).length > 0 ) {
			var _player_element = jQuery( this ).parents( ".rve" ).find( "video" )[0];
			if ( jQuery( this ).hasClass( 'is-video-format' ) ) {
			}
			_player_element.player.play();
		}
		if ( jQuery( this ).parents( ".rve" ).find( "iframe" ).length > 0 ) {
			var _current_iframe = jQuery( this ).parents( ".rve" ).find( "iframe" );
			var _iframe_id = _current_iframe.attr( 'id' );
			var _iframe_src = _current_iframe.attr( 'src' );

			if ( _iframe_src.indexOf( "vimeo" ) >= 0 ) {
				_current_iframe.attr( 'src', ThriveApp.updateQueryStringParameter( _iframe_src, "autoplay", "1" ) );
			} else if ( _iframe_src.indexOf( "youtube" ) >= 0 ) {
				_current_iframe.attr( 'src', ThriveApp.updateQueryStringParameter( _iframe_src, "autoplay", "1" ) );
			}
			jQuery( this ).parents( ".rve" ).find( "iframe" ).trigger( "click" );
		}
	} );
};

ThriveApp.bind_scroll = function () {
	if ( jQuery( "#comment-bottom" ).length > 0 ) {
		var top = jQuery( "#comment-bottom" ).offset().top;
		if ( top > 0 && top < jQuery( window ).height() + jQuery( document ).scrollTop() ) {
			ThriveApp.load_comments();
		}
	}
};

ThriveApp.load_comments = function () {
	if ( ThriveApp.comments_loaded == 1 ) {
		return;
	} else {
		ThriveApp.comments_loaded = 1;
	}

	if ( typeof _thriveCurrentPost === 'undefined' ) {
		_thriveCurrentPost = 0;
	}
	jQuery( "#thrive_container_preload_comments" ).show();
	var post_data = {
		action: 'thrive_lazy_load_comments',
		post_id: _thriveCurrentPost,
		comment_page: ThriveApp.comments_page
	};
	jQuery.post( ThriveApp.ajax_url, post_data, ThriveApp.load_comments_handle );
};

ThriveApp.load_comments_handle = function ( response ) {
	ThriveApp.comments_page ++;
	if ( response == '' ) {
		ThriveApp.comments_loaded = 1;
	} else {
		ThriveApp.comments_loaded = 0;
	}

	jQuery( "#thrive_container_preload_comments" ).hide();
	jQuery( "#thrive_container_list_comments" ).append( response );
	jQuery( "#thrive_container_form_add_comment" ).show();
	if ( ThriveApp.bind_comments === false ) {
		ThriveApp.bind_comments_handlers();
	}
	ThriveApp.check_comments_hash();
};

ThriveApp.bind_comments_handlers = function () {

	ThriveApp.bind_comments = true;
	jQuery( document ).on( 'click', ".txt_thrive_link_to_comments", function () {
		var aTag = jQuery( "#commentform" );
		jQuery( 'html,body' ).animate( {
			scrollTop: aTag.offset().top
		}, 'slow' );
		return false;
	} );

	jQuery( document ).on( 'click', ".reply", function () {
		var comment_id = jQuery( this ).attr( 'cid' );
		jQuery( "#respond-container-" + comment_id ).slideDown();
		return false;
	} );

	jQuery( document ).on( 'click', '.cancel_reply', function () {
		var comment_id = jQuery( this ).attr( 'cid' );
		jQuery( "#respond-container-" + comment_id ).slideUp();
		return false;
	} );
};


ThriveApp.youtube_play = function ( vcode, width, height ) {
	"use strict";
	jQuery( "#videoContainer" ).html( '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + vcode + '?autoplay=1&loop=1&rel=0&wmode=transparent" frameborder="0" allowfullscreen wmode="Opaque"></iframe>' );
};

ThriveApp._get_element_height = function ( elmID ) {
	var elmHeight, elmMargin, elm = document.getElementById( elmID );
	if ( document.all ) {// IE
		elmHeight = elm.currentStyle.height;
		elmMargin = parseInt( elm.currentStyle.marginTop, 10 ) + parseInt( elm.currentStyle.marginBottom, 10 ) + "px";
	} else {// Mozilla
		elmHeight = document.defaultView.getComputedStyle( elm, '' ).getPropertyValue( 'height' );
		elmMargin = parseInt( document.defaultView.getComputedStyle( elm, '' ).getPropertyValue( 'margin-top' ) ) + parseInt( document.defaultView.getComputedStyle( elm, '' ).getPropertyValue( 'margin-bottom' ) ) + "px";
	}
	return (
		elmHeight + elmMargin
	);
};

ThriveApp.updateQueryStringParameter = function ( uri, key, value ) {
	var re = new RegExp( "([?|&])" + key + "=.*?(&|$)", "i" );
	separator = uri.indexOf( '?' ) !== - 1 ? "&" : "?";
	if ( uri.match( re ) ) {
		return uri.replace( re, '$1' + key + "=" + value + '$2' );
	}
	else {
		return uri + separator + key + "=" + value;
	}
};


ThriveApp.social_scripts = {
	twitter: {src: "https://platform.twitter.com/widgets.js", loaded: 0},
	google: {src: "https://apis.google.com/js/plusone.js?onload=onLoadCallback", loaded: 0},
	facebook: {src: "://platform.twitter.com/widgets.js", loaded: 0},
	linkedin: {src: "//platform.linkedin.com/in.js", loaded: 0},
	pinterest: {src: "//assets.pinterest.com/js/pinit.js", loaded: 0},
	youtube: {src: "https://apis.google.com/js/platform.js", loaded: 0}
};

ThriveApp.load_script = function ( script_name ) {
	if ( ThriveApp.social_scripts[script_name].loaded === 0 ) {
		/**
		 * We did this to avoid a conflict when there is a pinterest button in THRIVE FOOTER WIDGET
		 * and you add a pinterest button from the TCB (social sharing buttons - default design)
		 * */
		if ( ThriveApp.social_scripts[script_name].src == "//assets.pinterest.com/js/pinit.js" ) {
			var s = document.createElement( "script" );
			s.type = "text/javascript";
			s.async = true;
			s.src = "http://assets.pinterest.com/js/pinit.js";
			s["data-pin-build"] = "parsePins";

			var x = document.getElementsByTagName( "script" )[0];

			x.parentNode.insertBefore( s, x );
			ThriveApp.social_scripts[script_name].loaded = 1;
		} else {
			jQuery.getScript( ThriveApp.social_scripts[script_name].src, function () {
				ThriveApp.social_scripts[script_name].loaded = 1;
			} );
		}
	}
};

ThriveApp.setVideoPosition = function () {
	jQuery( '.scvps .pvb' ).each( function () {
		var _video_element = jQuery( this ).parents( ".scvps" ).find( ".vwr" );
		_video_element.css( {
			top: jQuery( this ).parents( ".scvps" ).outerHeight() / 2 - _video_element.height() / 2,
			left: jQuery( this ).parents( ".scvps" ).outerWidth() / 2 - _video_element.width() / 2
		} );
	} );
};

ThriveApp.open_share_popup = function ( url, width, height ) {
	var leftPosition, topPosition;
	leftPosition = (
		               window.screen.width / 2
	               ) - (
		               (
			               width / 2
		               ) + 10
	               );
	topPosition = (
		              window.screen.height / 2
	              ) - (
		              (
			              height / 2
		              ) + 50
	              );
	window.open( url, "Window", "status=no,height=" + height + ",width=" + width + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no" );
	return false;
};


ThriveApp.hasFloatingMenu = jQuery( 'header .bh' ).attr( 'data-float' ) === 'scroll';
ThriveApp.hasSocialIcons = jQuery( 'header .bh' ).attr( 'data-social' ) === 'off';

ThriveApp.menu_float = {
	current_scroll_top: 0,
	scroll_dir: 'down',
	hasScroll: function () {
		return this.current_scroll_top > 0;
	},
	onScroll: function ( st ) {
		if ( this.current_scroll_top < st ) {
			this.scroll_dir = 'down';
		} else {
			this.scroll_dir = 'up';
		}
		this.current_scroll_top = st;
		return this.handle();
	},
	handle: function () {
		var _socialElement = jQuery( '.fln' ),
			_header = jQuery( 'header' ),
			_theMenu = jQuery( '.bh' ),
			_headerHeight = _header.outerHeight(),
			_nextElement = jQuery( '.bSe' ).offset().top,
			_post_height = jQuery( '.bSe .awr' ).outerHeight(),
			_bottom_limit = _nextElement + _post_height;

		if ( _isAdmin ) {
			_socialElement.addClass( 'adm' );
			_theMenu.addClass( 'adm' );
		}

		if ( this.scroll_dir == 'down' ) {
			if ( ThriveApp.winWidth > 774 ) {
				_header.css( 'height', _headerHeight + 'px' );
			}
			if ( ThriveApp.hasSocialIcons && this.current_scroll_top > _nextElement ) {
				_theMenu.addClass( 'fbh' );
			} else {
				if ( this.current_scroll_top > _nextElement ) {
					_socialElement.addClass( 'fff' );
					if ( this.current_scroll_top > _bottom_limit ) {
						_socialElement.removeClass( 'fff' );
						_theMenu.addClass( 'fbh' );
					}
				}
			}
		} else {
			if ( ! ThriveApp.hasSocialIcons ) {
				if ( this.current_scroll_top < _bottom_limit ) {
					_theMenu.removeClass( 'fbh' );
					_socialElement.addClass( 'fff' );
				}
			}
			if ( this.current_scroll_top < _nextElement ) {
				_socialElement.removeClass( 'fff' );
				_theMenu.removeClass( 'fbh' );
			}
		}
	}
}

ThriveApp.show_shortcodes = function ( position ) {
	jQuery( '.nsd' ).each( function () {
		var $this = jQuery( this );
		if ( position + ThriveApp.viewportHeight >= $this.offset().top + $this.outerHeight() ) {
			$this.addClass( 'nsds' );
			ThriveApp.number_counter();
		}
	} );
}

ThriveApp.bind_share_buttons = function () {
	jQuery( document ).on( 'click', '.ixs ul.ixb li', function ( event ) {
		var url = jQuery( this ).children( 'a' ).attr( 'href' );

		var id = jQuery( this ).parent().siblings( '.ixt' ).attr( 'data-id' );
		var post_data = {
			action: 'thrive_get_share_count',
			post_id: id
		};
		jQuery.post( ThriveApp.ajax_url, post_data );
		ThriveApp.open_share_popup( url, 545, 433 );
	} );
}

var _overlayElement = jQuery( '.galleryOverlay' );

ThriveApp.blog_gallery = (
	function ( $ ) {
		return function () {
			var currentImageIndex = 0,
				timer = 0;

			function createGalleryItem( $link, $container ) {
				$( '<div class="galleryWrapper"><img data-pos="' + $link.attr( 'data-position' ) + '" data-cap="' + $link.attr( 'data-caption' ) + '" data-index="' + $link.attr( 'data-index' ) + '" src="' + $link.attr( 'data-src' ) + '" alt=""/></div>' )
					.appendTo( $container );
			}

			function showImage( $container, index, animate ) {
				if ( ! animate ) {
					$container.addClass( 'g-n-a' );
				} else {
					$container.removeClass( 'g-n-a' );
				}

				var toBeShown = $container.find( 'img[data-index=' + index + ']' ),
					_cap = toBeShown.attr( 'data-cap' ),
					_pos = toBeShown.attr( 'data-pos' );

				index = toBeShown.parent().index();
				$container.css( {
					left: '-' + (
						index * 100
					) + '%'
				} );
				currentImageIndex = index;
				if ( ThriveApp.winWidth > 650 ) {
					positionCloseBtn( toBeShown );
				}
				jQuery( '.img_count' ).text( _pos );
				jQuery( '.cap_txt' ).text( _cap );
				if ( _cap != "" ) {
					jQuery( ".mob_text" ).text( _cap );
				} else {
					jQuery( ".mob_text" ).text( " - Swipe left/right to see more" );
				}
			}

			function positionCloseBtn( $img ) {
				var $closeBtn = $img.parents( '.galleryOverlay' ).first().find( '.nav_close' );
				if ( ! $img.width() ) {
					return $closeBtn.css( {
						top: '20px',
						right: '20px'
					} );
				}
				var l = $img.position().left - $img.parent().position().left + $img.width(),
					t = $img.position().top;

				if ( $img.width() >= ThriveApp.winWidth ) {
					l -= 16;
					t += 16;
				}

				if ( _isAdmin && $img.position().top <= 32 ) {
					t += 32;
				}

				$closeBtn.css( {
					top: (
						     t - 16
					     ) + 'px',
					left: (
						      l - 16
					      ) + 'px'
				} );
			}

			$( '.gallery' ).each( function () {
				var $gallery = $( this ), // images container
					$overlay = $( this ).find( '.galleryOverlay' ),
					$stage = $( this ).find( '.galleryStage' ),
					total = $gallery.find( '.gallery-item a' ).length,
					isOpen = false,
					animating = false,
					showNext = function () {
						if ( animating ) {
							return;
						}
						if ( currentImageIndex < total - 1 ) {
							showImage( $stage, currentImageIndex + 1, true );
						} else {
							$stage.addClass( 'g-n-a' ).css( 'left', '100%' );
							animating = true;
							setTimeout( function () {
								showImage( $stage, 0, true );
								animating = false;
							}, 20 );
						}
					},
					showPrev = function () {
						if ( animating ) {
							return;
						}
						if ( currentImageIndex > 0 ) {
							showImage( $stage, currentImageIndex - 1, true );
						} else {
							$stage.addClass( 'g-n-a' ).css( 'left', - 100 * (
									total
								) + '%' );
							animating = true;
							setTimeout( function () {
								showImage( $stage, total - 1, true );
								animating = false;
							}, 20 );
						}
					};

				$gallery.find( '.gallery-item a' ).each( function ( index ) {
					$( this ).click( function () {
						if ( jQuery( this ).parents( '.gallery ' ).hasClass( 'no-gallery' ) ) {
							return false;
						}
						isOpen = true;
						$overlay.show( 0 ).addClass( 'g-v' );
						showImage( $stage, index, false );
						return false;
					} );
					createGalleryItem( $( this ), $overlay.find( '.galleryStage' ) );
				} );

				$gallery.find( 'a.nav_prev' ).click( function () {
					showPrev();
					return false;
				} );
				$gallery.find( 'a.nav_next' ).click( function () {
					showNext();
					return false;
				} );
				$gallery.find( '.nav_close' ).click( function () {
					isOpen = false;
					$overlay.removeClass( 'g-v' ).hide();
					return false;
				} );
				$gallery.find( '.galleryWrapper' ).touchwipe( {
					wipeLeft: function () {
						showNext();
					},
					wipeRight: function () {
						showPrev();
					},
					wipeUp: function () {
						isOpen = false;
						$overlay.removeClass( 'g-v' ).hide();
					},
					wipeDown: function () {
						return false
					},
					min_move_x: 20,
					min_move_y: 20,
					preventDefaultEvents: true
				} );
				if ( ThriveApp.winWidth <= 650 ) {
					$stage.click( function () {
						var $target = $( e.target );
						if ( $target.is( 'img' ) ) {
							return false;
						}
						isOpen = false;
						$overlay.removeClass( 'g-v' ).hide();
//                    jQuery(".gl_ctrl_mob").toggle();
//                    return false;
					} );
				} else {
					$stage.click( function ( e ) {
						var $target = $( e.target );
						if ( $target.is( 'img' ) ) {
							return false;
						}
						isOpen = false;
						$overlay.removeClass( 'g-v' ).hide();
					} );
					$gallery.mousemove( function ( e ) {
						clearTimeout( timer );
						$( '.gl_ctrl, .gl_ctrl_mob' ).fadeIn( 200 );
						if ( ThriveApp.winWidth <= 650 ) {
							return;
						}
						if ( ! $( e.target ).is( '.gl_ctrl,.gl_ctrl_mob' ) ) {
							timer = setTimeout( function () {
								jQuery( '.gl_ctrl, .gl_ctrl_mob' ).fadeOut( 200 );
							}, 1000 );
						}
					} );
				}
				$( 'html' ).unbind( 'keydown' ).keydown( function ( e ) {
					if ( ! isOpen ) {
						return true;
					}
					if ( e.keyCode == 37 ) {
						showPrev();
						return false;
					}
					if ( e.keyCode == 39 ) {
						showNext();
						return false;
					}
					if ( e.keyCode == 27 ) {
						$overlay.removeClass( 'g-v' ).hide();
						return false;
					}
				} );
			} );
		}

	}( jQuery )
);

jQuery.fn.thrive_timer = function () {
	return this.each( function () {
		var el = jQuery( this ),
			server_time = el.attr( 'data-server-now' ),
			now = server_time ? new Date( server_time ) : new Date(),
			event_date = new Date( el.attr( 'data-date' ) ),
			day = 0, hour = 0, min = 0, sec = 0, day_digits = 2,
			fade = el.attr( 'data-fade' ),
			message = el.attr( 'data-message' ),
			interval_id;

		/* utility functions */
		/**
		 * setup html <span>s to hold each of the digits making up seconds, minutes, hours, days
		 *
		 * check the number of digits required for days (this might be bigger than 2)
		 */
		var htmlSetup = function () {

			/**
			 * create a new span containing the value
			 *
			 * @param index
			 * @param value
			 * @returns {jQuery|jQuery}
			 * @private
			 */
			var _span = function ( index, value ) {
				return jQuery( '<span class="part-' + index + '">' + value + '</span>' );
			}
			el.find( '.second .cdfc' )
			  .append( _span( 2, Math.floor( sec / 10 ) ) )
			  .append( _span( 1, sec % 10 ) );
			el.find( '.minute .cdfc' )
			  .append( _span( 2, Math.floor( min / 10 ) ) )
			  .append( _span( 1, min % 10 ) );
			el.find( '.hour .cdfc' )
			  .append( _span( 2, Math.floor( hour / 10 ) ) )
			  .append( _span( 1, hour % 10 ) );

			var $dayContainer = el.find( '.day .cdfc' ),
				total_days = day;
			for ( var i = 1; i <= day_digits; i ++ ) {
				$dayContainer.append( _span( i, total_days % 10 ) );
				total_days = Math.floor( total_days / 10 );
			}
			setValues( $dayContainer.css( 'min-width', (
				                                           30 * day_digits
			                                           ) + 'px' ), day, day_digits );
		};

		/**
		 * if value is the same as current value, do nothing, else, we need to create animation
		 *
		 * @param $part
		 * @param value
		 */
		var setValue = function ( $part, value ) {
			if ( $part.html() == value ) {
				return $part;
			}
			$part.removeClass( 'next' );
			//create another span, and insert it before the original part, in order to animate it nicely
			var _new = $part.clone().removeClass( 'go-down' ).addClass( 'next' ).html( value );
			$part.before( _new ).next( '.go-down' ).remove();
			$part.addClass( 'go-down' );
			setTimeout( function () {
				_new.addClass( 'go-down' );
			}, 20 );

			return $part;
		};

		/**
		 * set each of the new values on a group (seconds, minutes, hours, days)
		 * @param container
		 * @param value
		 * @param number_length
		 */
		var setValues = function ( container, value, number_length ) {

			if ( typeof number_length === 'undefined' ) {
				number_length = false;
			}
			var index = 0;
			if ( value <= 99 ) {
				setValue( container.find( '.part-1' ).first(), value % 10 );
				setValue( container.find( '.part-2' ).first(), Math.floor( value / 10 ) );
				index = 2;
			} else {
				while ( value ) {
					index ++;
					setValue( container.find( '.part-' + index ).first(), value % 10 );
					value = Math.floor( value / 10 );
				}
			}
			if ( number_length !== false && index < number_length ) {
				for ( var i = index + 1; i <= number_length; i ++ ) {
					setValue( container.find( '.part-' + i ).first(), 0 );
				}
			}
		}

		/**
		 * called every second, it decrements the time and updates the HTML accordingly
		 */
		var step = function () {
			sec --;

			if ( sec < 0 ) {
				sec = 59;
				min --;
			}
			if ( min < 0 ) {
				min = 59;
				hour --;
			}
			if ( hour < 0 ) {
				hour = 23;
				day --;
			}
			setValues( el.find( '.second .cdfc' ), sec );
			setValues( el.find( '.minute .cdfc' ), min );
			setValues( el.find( '.hour .cdfc' ), hour );
			setValues( el.find( '.day .cdfc' ), day, day_digits );

			if ( day == 0 && hour == 0 && min == 0 && sec == 0 ) {
				//done!
				clearInterval( interval_id );
				finished();
			}
		}

		/**
		 * finished counting, or the event time is somewhere in the past
		 */
		var finished = function () {
			if ( fade == '1' ) {
				el.find( '.cdti' ).addClass( 'fdtc' );
			} else {
				el.find( '.cdti' ).addClass( 'fv' );
			}
			if ( message == '1' ) {
				el.find( '.cdti' ).addClass( 'fdtc' );
				setTimeout( function () {
					el.find( '.cdtm' ).fadeIn( 2000 );
				}, 500 );
			}
		}

		if ( now > event_date ) {
			finished();
		} else {

			sec = Math.floor( (
				                  event_date.getTime() - now.getTime()
			                  ) / 1000 );
			min = Math.floor( sec / 60 );
			sec = sec % 60;
			hour = Math.floor( min / 60 );
			min = min % 60;
			day = Math.floor( hour / 24 );
			hour = hour % 24;
			if ( day > 99 ) {
				day_digits = day.toString().length;
			}

			htmlSetup();
			el.find( '.cdti' ).addClass( 'init_done' );
			// setup the interval function
			interval_id = setInterval( step, 1000 );
		}
	} );
}
ThriveApp.gallery_post = function () {
	var _parent_element = jQuery( '.gs' ),
		_staging_image = jQuery( '.st-i' ),
		_prev_btn = jQuery( '#gpr' ),
		_next_btn = jQuery( '#gnx' ),
		_img_title = jQuery( '#g-tt' ),
		_img_caption = jQuery( '#g-cp' ),
		_img_captions = jQuery( '.git' ),
		_img_credits = jQuery( '.gic' );

	if ( _isAdmin ) {
		jQuery( '#gcs' ).css( 'top', '36px' );
	}

	var start_gallery = function () {
		_next_btn.removeClass( 'dsb' );
		_parent_element.removeClass( 'end' );
		_img_credits.hide();
		_img_captions.fadeIn();
	};

	var close_gallery = function () {
		jQuery( '.go' ).fadeOut();
		//reset counters
		var _first_element = jQuery( '#gi-0' );
		_parent_element.attr( 'data-index', '0' );
		_staging_image.attr( 'src', _first_element.attr( 'data-src' ) );
		_img_title.text( _first_element.attr( "data-title" ) );
		_img_caption.text( _first_element.attr( "data-caption" ) );
		_prev_btn.addClass( 'dsb' );
		start_gallery();
	}

	var prev_slide = function () {
		start_gallery();
		var _currentIndex = parseInt( _parent_element.attr( "data-index" ) );
		var _prevIndex = _currentIndex - 1;
		if ( _prevIndex < 0 ) {
			_prev_btn.addClass( 'dsb' );
			return false;
		}
		if ( jQuery( "#gi-" + _prevIndex ).length > 0 ) {
			_parent_element.attr( "data-index", jQuery( "#gi-" + _prevIndex ).attr( "data-index" ) );
			_staging_image.fadeOut( 300 );
			setTimeout( function () {
				var _changing_element = jQuery( "#gi-" + _prevIndex );
				_staging_image.attr( 'src', _changing_element.attr( "data-src" ) ).fadeIn( 0 );
				_img_title.text( _changing_element.attr( "data-title" ) );
				_img_caption.text( _changing_element.attr( "data-caption" ) );
			}, 200 );
		}
		rotate_ads();
		return false;
	}

	var next_slide = function () {
		_prev_btn.removeClass( 'dsb' );
		var _currentIndex = parseInt( _parent_element.attr( "data-index" ) );
		var _nextIndex = _currentIndex + 1;
		if ( _nextIndex + 1 == _parent_element.attr( "data-count" ) ) {
			_parent_element.addClass( 'end' );
			_next_btn.addClass( 'dsb' );
			_img_captions.hide();
			_img_credits.fadeIn();
		}
		if ( jQuery( "#gi-" + _nextIndex ).length > 0 ) {
			_parent_element.attr( "data-index", jQuery( "#gi-" + _nextIndex ).attr( "data-index" ) );
			_staging_image.fadeOut( 300 );
			setTimeout( function () {
				var _changing_element = jQuery( "#gi-" + _nextIndex );
				_staging_image.attr( 'src', _changing_element.attr( "data-src" ) ).fadeIn( 0 );
				_img_title.text( _changing_element.attr( "data-title" ) );
				_img_caption.text( _changing_element.attr( "data-caption" ) );
			}, 200 );
		}
		rotate_ads();
		return false;
	};

	var rotate_ads = function () {
		//top ad
		var _topAdIndex = parseInt( jQuery( ".tadd" ).attr( "data-index" ) );
		var _topAdCount = parseInt( jQuery( ".tadd" ).attr( "data-count" ) );
		var _topAdNext = _topAdIndex + 1;
		if ( _topAdNext >= _topAdCount ) {
			_topAdNext = 0;
		}
		if ( jQuery( "#tt-top-ad-container-" + _topAdNext ).length > 0 ) {
			jQuery( ".tt-top-ad-container" ).hide();
			jQuery( "#tt-top-ad-container-" + _topAdNext ).show();
			jQuery( ".tadd" ).attr( "data-index", _topAdNext );
		}
		//side ad
		var _sideAdIndex = parseInt( jQuery( ".tadd" ).attr( "data-index" ) );
		var _sideAdCount = parseInt( jQuery( ".tadd" ).attr( "data-count" ) );
		var _sideAdNext = _sideAdIndex + 1;
		if ( _sideAdNext >= _sideAdCount ) {
			_sideAdNext = 0;
		}
		if ( jQuery( "#tt-side-ad-container-" + _sideAdNext ).length > 0 ) {
			jQuery( ".tt-side-ad-container" ).hide();
			jQuery( "#tt-side-ad-container-" + _sideAdNext ).show();
			jQuery( ".tadd" ).attr( "data-index", _sideAdNext );
		}
	};

	//open gallery
	jQuery( '.op' ).on( 'click', function () {
		jQuery( '.go' ).fadeIn();
	} );
	//close gallery
	jQuery( '#gcs' ).on( 'click', function () {
		close_gallery();
	} );

	_prev_btn.click( function () {
		prev_slide();
	} );

	_next_btn.click( function () {
		next_slide();
	} );

	//key press actions
	jQuery( document ).keydown( function ( e ) {
		switch ( e.which ) {
			case 27:
				close_gallery();// esc
				break;

			case 39:
				next_slide()// right
				break;

			case 37:
				prev_slide()// left
				break;

			default:
				return; // exit this handler for other keys
		}
	} );
	//mobile click on sharing buttons
	if ( ThriveApp.winWidth <= 774 ) {
		jQuery( '.ssb' ).find( '.sb' ).on( 'click', function () {
			jQuery( this ).parents( '.ssb' ).addClass( 'ssb-s' );
		} );
	}
}

jQuery( window ).scroll( function () {
	var position = jQuery( window ).scrollTop();
	ThriveApp.show_shortcodes( position );
	if ( ThriveApp.hasFloatingMenu && ThriveApp.is_singular == '1' ) {
		ThriveApp.menu_float.onScroll( position );
	}
} );

ThriveApp._get_share_count_display_text = function ( number, decPlaces ) {
	decPlaces = Math.pow( 10, decPlaces );
	var abbrev = ["k", "m"];
	for ( var i = abbrev.length - 1; i >= 0; i -- ) {
		var size = Math.pow( 10, (
			                         i + 1
		                         ) * 3 );
		if ( size <= number ) {
			number = Math.round( number * decPlaces / size ) / decPlaces;
			if ( (
				     number == 1000
			     ) && (
				     i < abbrev.length - 1
			     ) ) {
				number = 1;
				i ++;
			}
			number += abbrev[i];
			break;
		}
	}
	return number;
};

ThriveApp.bind_inifite_scroll = function () {
	jQuery( '#tt-infinite-scroll-waypoint' ).waypoint( function ( direction ) {
		if ( direction === "down" ) {
			var _post_params = {
				page: ThriveApp.current_page - 1,
				excludePosts: jQuery( "#tt-hidden-exclude-posts" ).val()
			};
			jQuery( "#tt-infinite-scroll-loading" ).show();
			jQuery.post( ThriveApp.load_posts_url, _post_params, function ( result ) {
				jQuery( "#tt-infinite-scroll-loading" ).hide();
				if ( result == 0 ) {
					jQuery.waypoints( 'destroy' );
				} else {
					ThriveApp.current_page ++;
					jQuery( ".tt-container-infinite" ).append( result );
					ThriveApp.grid_layout( '.gin', '.art' );
					ThriveApp.grid_layout( '.scbg', '.scc' );
					ThriveApp.bind_masonry_layout();
					jQuery.waypoints( 'refresh' );
				}
			} );
		}
	}, {
		offset: "130%"
	} );
};

ThriveApp.bind_inifite_scroll_for_post = function () {
	jQuery( '#tt-infinite-scroll-waypoint' ).waypoint( function ( direction ) {
		if ( direction === "down" ) {
			var _post_params = {
				page: ThriveApp.current_page,
				postId: jQuery( "#tt-related-container" ).attr( "data-post-id" ),
				excludePosts: jQuery( "#tt-hidden-exclude-posts" ).val()
			};
			jQuery( "#tt-infinite-scroll-loading" ).show();
			jQuery.post( ThriveApp.load_related_posts_url, _post_params, function ( result ) {
				jQuery( "#tt-infinite-scroll-loading" ).hide();
				if ( result == 0 ) {
					jQuery.waypoints( 'destroy' );
				} else {
					ThriveApp.current_page ++;
					jQuery( "#tt-related-container" ).append( result );
					ThriveApp.grid_layout( '.gin', '.art' );
					ThriveApp.grid_layout( '.scbg', '.scc' );
					jQuery.waypoints( 'refresh' );
				}
			} );
		}
	}, {
		offset: "130%"
	} );
};

ThriveApp.bind_homepage_custom_infinite_scroll = function () {
	jQuery( '#tt-infinite-scroll-waypoint' ).waypoint( function ( direction ) {
		if ( direction === "down" ) {
			var _post_params = {
				page: ThriveApp.current_page - 1,
				excludePosts: jQuery( "#tt-hidden-exclude-posts" ).val()
			};
			jQuery( "#tt-infinite-scroll-loading" ).show();
			jQuery.post( ThriveApp.load_latest_posts_url, _post_params, function ( result ) {
				jQuery( "#tt-infinite-scroll-loading" ).hide();
				if ( result == 0 ) {
					jQuery.waypoints( 'destroy' );
				} else {
					ThriveApp.current_page ++;
					jQuery( "#tt-latest-container" ).append( result );
					ThriveApp.grid_layout( '.gin', '.art' );
					ThriveApp.grid_layout( '.scbg', '.scc' );
					jQuery.waypoints( 'refresh' );
				}
			} );
		}
	}, {
		offset: "130%"
	} );
};

ThriveApp.bind_homepage_custom_infinite_click = function () {
	var _post_params = {
		page: ThriveApp.current_page - 1,
		excludePosts: jQuery( "#tt-hidden-exclude-posts" ).val()
	};
	jQuery( "#tt-infinite-scroll-loading" ).show();
	jQuery.post( ThriveApp.load_latest_posts_url, _post_params, function ( result ) {
		jQuery( "#tt-infinite-scroll-loading" ).hide();
		if ( result == 0 ) {
			jQuery( "#tt-show-more-posts" ).hide();
		} else {
			ThriveApp.current_page ++;
			jQuery( "#tt-latest-container" ).append( result );
			ThriveApp.grid_layout( '.gin', '.art' );
			ThriveApp.grid_layout( '.scbg', '.scc' );
		}
	} );
};

ThriveApp.resize_blank_page = function () {
	_is_blankPage = jQuery( 'html.bp-th' ).length;
	if ( _is_blankPage ) {
		var contentHeight = jQuery( '.wrp' ).outerHeight(),
			$body = jQuery( 'body' );
		if ( ThriveApp.viewportHeight >= contentHeight ) {
			$body.css( 'height', ThriveApp.viewportHeight );
		} else {
			$body.css( 'height', contentHeight );
		}
	}
};