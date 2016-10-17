<?php

function _thrive_get_main_wrapper_class( $options = null ) {
	if ( ! $options ) {
		$options = thrive_get_theme_options();
	}

	if ( $options['blog_layout'] == "default" || $options['blog_layout'] == "full_width" ) {
		if ( is_archive() || is_author() || is_tag() || is_category() ) {
			return "wrp cnt cidx";
		}

		return "wrp cnt ind";
	}
	if ( $options['blog_layout'] == "grid_full_width" || $options['blog_layout'] == "grid_sidebar" ) {
		return "wrp cnt gin";
	}
	if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ) {
		return "wrp cnt mryv";
	}

	return "wrp cnt cidx";
}

function _thrive_get_main_section_class( $options = null ) {
	if ( ! $options ) {
		$options = thrive_get_theme_options();
	}
	if ( is_page() ) {
		$sidebar_is_active = is_active_sidebar( 'sidebar-2' );
	} else {
		$sidebar_is_active = is_active_sidebar( 'sidebar-1' );
	}
	$infinite_class = ( $options['enable_infinite_scroll'] == "on" ) ? " tt-container-infinite" : "";
	$masonry_class  = "";
	if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ) {
		$masonry_class = " mry";
	}
	if ( $options['blog_layout'] == "full_width" || $options['blog_layout'] == "grid_full_width" || $options['blog_layout'] == "masonry_full_width" || ! $sidebar_is_active ) {
		return "bSe fullWidth" . $masonry_class . $infinite_class;
	}

	$sidebar_alignement = ( $options['sidebar_alignement'] == "right" ) ? "left" : "right";

	return "bSe " . $sidebar_alignement . $masonry_class . $infinite_class;
}

function _thrive_is_active_sidebar( $options = null ) {
	if ( _thrive_check_is_woocommerce_page() ) {
		return is_active_sidebar( 'sidebar-woo' );
	}
	if ( ! $options ) {
		$options = thrive_get_theme_options();
	}
	if ( is_singular() ) {
		$post_template = _thrive_get_item_template( get_the_ID() );
		if ( $post_template == "Narrow" || $post_template == "Full Width" || $post_template == "Landing Page" ) {
			return false;
		}
	}
	if ( is_page() ) {
		$sidebar_is_active = is_active_sidebar( 'sidebar-2' );
	} else {
		$sidebar_is_active = is_active_sidebar( 'sidebar-1' );
	}
	if ( is_singular() ) {
		if ( $options['blog_post_layout'] == "full_width" || $options['blog_post_layout'] == "narrow" ) {
			return false;
		}

		return $sidebar_is_active;
	}
	if ( $options['blog_layout'] == "full_width" || $options['blog_layout'] == "grid_full_width" || $options['blog_layout'] == "masonry_full_width" || ! $sidebar_is_active ) {
		return false;
	}

	return true;
}

function _thrive_get_author_info( $author_id = 0 ) {
	if ( $author_id == 0 ) {
		if ( is_single() || is_page() ) {
			global $post;
			$author_id = $post->post_author;
		} elseif ( is_author() ) {
			$author_id = get_the_author_meta( 'ID' );
		}
	}
	$user_info = get_userdata( $author_id );
	if ( ! $user_info ) {
		return false;
	}
	$social_links = ( array(
		"twitter" => get_the_author_meta( 'twitter', $author_id ),
		"fb"      => get_the_author_meta( 'facebook', $author_id ),
		"g_plus"  => get_the_author_meta( 'gplus', $author_id )
	) );

	return array(
		'avatar'         => get_avatar( $user_info->user_email, 125 ),
		'display_name'   => $user_info->display_name,
		'description'    => $user_info->description,
		'social_links'   => $social_links,
		'posts_url'      => get_author_posts_url( $author_id ),
		'author_website' => get_the_author_meta( 'thrive_author_website', $author_id )
	);
}

function _thrive_get_featured_image_src( $style = null, $post_id = null, $featured_image_size = null ) {
	if ( ! $style ) {
		$style = thrive_get_theme_options( 'featured_image_style' );
	}
	if ( ! $post_id ) {
		$post_id = get_the_ID();
	}

	$featured_img_data = thrive_get_post_featured_image( $post_id, $style );
	$featured_img      = $featured_img_data['image_src'];

	return $featured_img;
}

function _thrive_get_footer_col_class( $num_cols ) {
	$f_class = "";
	switch ( $num_cols ) {
		case 0:
			return "";
		case 1:
			return "";
		case 2:
			return "colm twc";
		case 3:
			return "colm oth";
	}

	return $f_class;
}

function _thrive_get_footer_active_widget_areas() {
	$num            = 0;
	$active_footers = array();
	while ( $num < 4 ) {
		$num ++;
		if ( is_active_sidebar( 'footer-' . $num ) ) {
			array_push( $active_footers, 'footer-' . $num );
		}
	}

	return $active_footers;
}

function _thrive_get_post_content_template( $options = null ) {
	if ( ! $options ) {
		$options = thrive_get_theme_options();
	}

	if ( ( is_archive() || is_author() || is_tag() || is_category() ) && ( $options['blog_layout'] == "default" || $options['blog_layout'] == "full_width" ) ) {
		return "archive";
	}

	if ( $options['blog_layout'] == "default" || $options['blog_layout'] == "full_width" ) {
		return "default";
	}
	if ( $options['blog_layout'] == "grid_full_width" || $options['blog_layout'] == "grid_sidebar" ) {
		return "grid";
	}
	if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ) {
		return "masonry";
	}

	return "default";
}

function _thrive_get_ad_for_position( $params = array() ) {
	if ( ! isset( $params['ad_location'] ) ) {
		return false;
	}

	if ( $params['ad_location'] == "blog_or_index" ) {
		if ( $params['blog_layout'] == "grid_full_width" || ( $params['blog_layout'] == "grid_sidebar" && ! $params['sidebar_is_active'] ) ) {
			$params['ad_location_value'] = ( $params['ad_location_value'] % 3 == 0 ) ? intval( $params['ad_location_value'] / 3 ) : - 1;
		}
		if ( $params['blog_layout'] == "grid_sidebar" && $params['sidebar_is_active'] ) {
			$params['ad_location_value'] = ( $params['ad_location_value'] % 2 == 0 ) ? intval( $params['ad_location_value'] / 2 ) : - 1;
		}
	}

	if ( ! isset( $params['ad_target_in'] ) ) {
		if ( is_singular() ) {
			if ( is_page() ) {
				$params['ad_target_in'] = "pages";
			} else {
				$params['ad_target_in'] = "posts";
			}
		}
	}

	$custom_ad_group_id = null;
	$ad_group           = null;

	if ( is_singular() ) {
		if ( $params['ad_location'] == "header" ) {
			$custom_ad_group_id = get_post_meta( get_the_ID(), "_thrive_ad_group_header", true );
		}
		if ( $params['ad_location'] == "in_content" && $params['ad_location_value'] == "beginning" ) {
			$custom_ad_group_id = get_post_meta( get_the_ID(), "_thrive_ad_group_beginning", true );
		}
		if ( $params['ad_location'] == "in_content" && $params['ad_location_value'] == "end_of_post" ) {
			$custom_ad_group_id = get_post_meta( get_the_ID(), "_thrive_ad_group_end_of_post", true );
		}
		$params['current_cat'] = get_the_category();
		if ( is_numeric( $custom_ad_group_id ) ) {
			$ad_group = get_post( $custom_ad_group_id );
		}
	}

	//If no custom ad group is set get the default ones
	if ( ! $ad_group || ! $ad_group->ID ) {
		$groups = _thrive_get_ad_location_group( $params );

		if ( count( $groups ) == 0 || ! $groups || ! isset( $groups[0] ) ) {
			return false;
		}
		if ( is_single() ) {
			foreach ( $groups as $group ) {
				$_target_by       = get_post_meta( $group->ID, '_thrive_meta_ad_target_by', true );
				$_target_by_value = json_decode( get_post_meta( $group->ID, '_thrive_meta_ad_target_by_value', true ) );
				if ( empty( $_target_by_value ) ) {
					return _thrive_get_random_ad_for_group( $groups[0]->ID );
				}

				switch ( $_target_by ) {
					case 'categories':
						$cats = get_the_category();
						if ( $cats === false ) {
							break;
						}
						foreach ( $cats as $cat ) {
							if ( in_array( $cat->term_id, $_target_by_value ) ) {
								return _thrive_get_random_ad_for_group( $group->ID );
							}
						}
						break;
					case 'tags':
						$tags = get_the_tags();
						if ( $tags === false ) {
							break;
						}
						foreach ( $tags as $tag ) {
							if ( in_array( $tag->term_id, $_target_by_value ) ) {
								return _thrive_get_random_ad_for_group( $group->ID );
							}
						}
						break;
				}
			}

			return false;
		} else {
			return _thrive_get_random_ad_for_group( $groups[0]->ID );
		}
	}

	return _thrive_get_random_ad_for_group( $ad_group->ID );
}

function _thrive_get_random_ad_for_group( $adGroupId ) {
	$ads_list = _thrive_get_ads_list_object( $adGroupId );

	if ( ! $ads_list || count( $ads_list ) == 0 ) {
		return false;
	}

	foreach ( $ads_list as $key => $ad ) {
		if ( $ad['status'] != 'active' ) {
			unset( $ads_list[ $key ] );
		}
	}

	$rand_key = array_rand( $ads_list );
	$rand_ad  = $ads_list[ $rand_key ];

	if ( wp_is_mobile() ) {
		if ( $rand_ad['mobile'] == "on" ) {
			$rand_ad['embed_code'] = $rand_ad['mobile_embed_code'];
		}
	}

	return $rand_ad;
}

function _thrive_get_read_more_text( $read_more_option = null ) {
	if ( ! $read_more_option ) {
		$read_more_option = thrive_get_theme_options( "other_read_more_text" );
	}
	$read_more_text = ( ! empty( $read_more_option ) ) ? $read_more_option : __( "Read more", 'thrive' );

	return $read_more_text;
}

function _thrive_get_post_format_fields( $format, $post_id ) {
	$options = array();
	switch ( $format ) {
		case "audio":
			$options['audio_type']                  = get_post_meta( $post_id, '_thrive_meta_postformat_audio_type', true );
			$options['audio_file']                  = get_post_meta( $post_id, '_thrive_meta_postformat_audio_file', true );
			$options['audio_soundcloud_embed_code'] = get_post_meta( $post_id, '_thrive_meta_postformat_audio_soundcloud_embed_code', true );
			break;
		case "gallery":
			$options['gallery_images'] = get_post_meta( $post_id, '_thrive_meta_postformat_gallery_images', true );
			$options['gallery_ids']    = explode( ",", $options['gallery_images'] );
			break;
		case "quote":
			$options['quote_text']   = get_post_meta( $post_id, '_thrive_meta_postformat_quote_text', true );
			$options['quote_author'] = get_post_meta( $post_id, '_thrive_meta_postformat_quote_author', true );
			break;
		case "video":
			$thrive_meta_postformat_video_type        = get_post_meta( $post_id, '_thrive_meta_postformat_video_type', true );
			$thrive_meta_postformat_video_youtube_url = get_post_meta( $post_id, '_thrive_meta_postformat_video_youtube_url', true );
			$thrive_meta_postformat_video_vimeo_url   = get_post_meta( $post_id, '_thrive_meta_postformat_video_vimeo_url', true );
			$thrive_meta_postformat_video_custom_url  = get_post_meta( $post_id, '_thrive_meta_postformat_video_custom_url', true );

			$youtube_attrs = array(
				'hide_logo'       => get_post_meta( $post_id, '_thrive_meta_postformat_video_youtube_hide_logo', true ),
				'hide_controls'   => get_post_meta( $post_id, '_thrive_meta_postformat_video_youtube_hide_controls', true ),
				'hide_related'    => get_post_meta( $post_id, '_thrive_meta_postformat_video_youtube_hide_related', true ),
				'hide_title'      => get_post_meta( $post_id, '_thrive_meta_postformat_video_youtube_hide_title', true ),
				'autoplay'        => get_post_meta( $post_id, '_thrive_meta_postformat_video_youtube_autoplay', true ),
				'hide_fullscreen' => get_post_meta( $post_id, '_thrive_meta_postformat_video_youtube_hide_fullscreen', true ),
				'video_width'     => 1080
			);

			if ( $thrive_meta_postformat_video_type == "youtube" ) {
				$options['youtube_autoplay'] = $youtube_attrs['autoplay'];
				$video_code                  = _thrive_get_youtube_embed_code( $thrive_meta_postformat_video_youtube_url, $youtube_attrs );
			} elseif ( $thrive_meta_postformat_video_type == "vimeo" ) {
				$video_code = _thrive_get_vimeo_embed_code( $thrive_meta_postformat_video_vimeo_url );
			} else {
				if ( strpos( $thrive_meta_postformat_video_custom_url, "<" ) !== false || strpos( $thrive_meta_postformat_video_custom_url, "[" ) !== false ) { //if embeded code or shortcode
					$video_code = do_shortcode( $thrive_meta_postformat_video_custom_url );
				} else {
					$video_code = do_shortcode( "[video src='" . $thrive_meta_postformat_video_custom_url . "']" );
				}
			}
			$options['video_type'] = $thrive_meta_postformat_video_type;
			$options['video_code'] = $video_code;
			break;
	}

	return $options;
}

function _thrive_get_authorbox_social_array() {
	$thrive_social = array_filter( array(
		"tw"   => get_the_author_meta( 'twitter' ),
		"fk"   => get_the_author_meta( 'facebook' ),
		"gg"   => get_the_author_meta( 'gplus' ),
		"lnk"  => get_the_author_meta( 'linkedin' ),
		"xing" => get_the_author_meta( 'xing' )
	) );

	return $thrive_social;
}

function _thrive_get_single_post_section_class( $sidebar_alignement, $post_template, $sidebar_is_active, $options = array() ) {

	if ( empty( $options ) ) {
		$options = thrive_get_theme_options();
	}

	if ( ! $sidebar_alignement ) {
		$sidebar_alignement = thrive_get_theme_options( "sidebar_alignement" );
	}

	if ( $post_template == "Narrow" ) {
		return "bSe bpd";
	}
	if ( $post_template == "Full Width" ) {
		return "bSe fullWidth";
	}
	if ( $post_template == "Landing Page" ) {
		return "bSe fullWidth lnd";
	}

	if ( ! is_page() && $options['blog_post_layout'] == "narrow" ) {
		return "bSe bpd";
	}

	if ( ! $sidebar_is_active ) {

		return "bSe fullWidth";
	}

	$sidebar_alignement = ( $sidebar_alignement == "right" ) ? "left" : "right";

	return "bSe " . $sidebar_alignement;
}

function _thrive_get_featured_image_with_default_src( $style = null, $post_id = null, $featured_image_size = null ) {
	$img_src = _thrive_get_featured_image_src( $style, $post_id, $featured_image_size );
	if ( ! $img_src ) {
		$img_src = get_template_directory_uri() . "/images/default_featured.jpg";
	}

	return $img_src;
}

function _thrive_get_category_color( $catId ) {
	$options = get_option( 'category_custom_color' );
	if ( $catId != 0 && is_array( $options ) && array_key_exists( $catId, $options ) ) {
		return $options[ $catId ];
	} else {
		return 'def';
	}
}

function _thrive_get_meta_category_class( $catId ) {
	$cat_color = _thrive_get_category_color( $catId );
	if ( $cat_color == "def" ) {
		$cat_color = "red"; //red is the default color scheme for this theme
	}

	return "cat_" . $cat_color;
}

function _thrive_get_homepage_featured_block_category_class( $catId ) {
	$cat_color = _thrive_get_category_color( $catId );
	if ( $cat_color == "def" ) {
		$cat_color = "red"; //red is the default color scheme for this theme
	}

	return "tt_" . $cat_color;
}

function _thrive_get_homepage_featured_block_container_class( $index ) {
	switch ( $index ) {
		case 0:
			return "bp-m";
		case 1:
			return "bp-s";
		case 2:
			return "bp-l";
	}

	return "";
}

function _thrive_get_homepage_featured_block_posts( $numberPosts = 4, $blockOptions = null ) {

	$postsList = array();

	if ( ! $blockOptions ) {
		$blockOptions = _thrive_get_homepage_layout_obj();
	}

	if ( $blockOptions['featured_custom'] == "1" && ! empty( $blockOptions['featured_custom_ids'] ) ) {
		foreach ( $blockOptions['featured_custom_ids'] as $pid ) {
			$tempPost = (array) get_post( $pid );
			$tempCat  = get_the_category( $pid );
			if ( $tempCat && isset( $tempCat[0] ) ) {
				$tempPost['catID'] = $tempCat[0]->term_id;
				$postsList[]       = $tempPost;
			}
		}

		return $postsList;
	}

	$tempPostsList = array();
	$categories    = get_categories();

	$maxPostsCount   = 0;
	$excludePostsIds = array();
	$catIds          = array();

	foreach ( $categories as $cat ) {
		$tempPosts = get_posts( array(
			'numberposts' => $numberPosts,
			'category'    => $cat->cat_ID
		) );
		if ( count( $tempPosts ) > 0 ) {
			array_push( $tempPostsList, $tempPosts );
			array_push( $catIds, $cat->cat_ID );

			if ( count( $tempPosts ) > $maxPostsCount ) {
				$maxPostsCount = count( $tempPostsList );
			}
		}
	}

	for ( $i = 0; $i < $maxPostsCount; $i ++ ) {
		if ( count( $postsList ) < $numberPosts ) {
			foreach ( $tempPostsList as $key => $tempList ) {
				if ( isset( $tempList[ $i ] ) && count( $postsList ) < $numberPosts && ! in_array( $tempList[ $i ]->ID, $excludePostsIds ) ) {
					$tempPost          = (array) $tempList[ $i ];
					$tempPost['catID'] = ( isset( $catIds[ $key ] ) ) ? $catIds[ $key ] : 0;
					array_push( $excludePostsIds, $tempPost['ID'] );
					array_push( $postsList, $tempPost );
				}
			}
		}
	}

	return $postsList;
}

function _thrive_get_homepage_block_contents( $block, $excludePosts = array(), $numberPosts = 4 ) {

	if ( $block['type'] == "category" ) {
		return _thrive_get_homepage_category_block_posts( $block['category'], $excludePosts );
	}
	if ( $block['type'] == "media" ) {
		$tempPosts = _thrive_get_homepage_media_block_posts( $block['category'], $excludePosts );

		return ( isset( $tempPosts[0] ) ) ? $tempPosts[0] : null;
	}
	if ( $block['type'] == "image" ) {
		$tempPosts = _thrive_get_homepage_image_block_posts( $block['category'], $excludePosts );

		return ( isset( $tempPosts[0] ) ) ? $tempPosts[0] : null;
	}
}

function _thrive_get_homepage_category_block_posts( $catId, $excludePosts = array(), $numberPosts = 4 ) {
	$args = array(
		'post__not_in'   => $excludePosts,
		'posts_per_page' => $numberPosts,
		'category'       => $catId != 0 ? $catId : ""
	);

	$posts = get_posts( $args );

	return $posts;
}

function _thrive_get_homepage_media_block_posts( $catId = null, $excludePosts = array(), $numberPosts = 1 ) {
	$args = array(
		'post__not_in'   => $excludePosts,
		'posts_per_page' => $numberPosts,
		'category'       => $catId != 0 ? $catId : "",
		'tax_query'      => array(
			array(
				'taxonomy' => 'post_format',
				'field'    => 'slug',
				'terms'    => array( 'post-format-audio', 'post-format-video' ),
				'operator' => 'IN'
			)
		)
	);

	//echo "<pre>" . print_r($args, true); die;

	$posts = get_posts( $args );

	return $posts;
}

function _thrive_get_homepage_image_block_posts( $catId = null, $excludePosts = array(), $numberPosts = 1 ) {
	$args = array(
		'post__not_in'   => $excludePosts,
		'posts_per_page' => $numberPosts,
		'category'       => $catId != 0 ? $catId : "",
		'meta_key'       => '_thumbnail_id', // with featured image
		/*'tax_query' => array(
			array(
				'taxonomy' => 'post_format',
				'field' => 'slug',
				'terms' => array('post-format-image'),
				'operator' => 'IN'
			)
		)*/
	);

	$posts = get_posts( $args );

	return $posts;
}

function _thrive_get_homepage_latest( $page = 0, $excludePosts = array() ) {

	$hide_cat_option = thrive_get_theme_options( 'hide_cats_from_blog' );

	if ( ! is_string( $hide_cat_option ) ) {
		$hide_cat_option = "";
	}

	$hide_categories = is_array( json_decode( $hide_cat_option ) ) ? json_decode( $hide_cat_option ) : array();
	$posts_per_page  = get_option( 'posts_per_page' );

	$args = array(
		'posts_per_page'   => $posts_per_page,
		'offset'           => ( $page * $posts_per_page ),
		'post__not_in'     => $excludePosts,
		'category__not_in' => $hide_categories
	);

	$posts_list = get_posts( $args );

	return $posts_list;
}

function _thrive_render_share_block( $params = array() ) {

	$allowedLayouts = array( 'default', 'grid' );

	if ( ! isset( $params['layout'] ) || ! in_array( $params['layout'], $allowedLayouts ) ) {
		$params['layout'] = 'default';
	}
	if ( ! isset( $params['options'] ) ) {
		$params['options'] = thrive_get_theme_options();
	}
	if ( ! isset( $params['block_position_class'] ) ) {
		$params['block_position_class'] = "left";
	}
	if ( ! isset( $params['block_position_class'] ) ) {
		$params['url'] = "";
	}
	if ( $params['share_count'] == null ) {
		$params['share_count']           = new stdClass();
		$params['share_count']->total    = 0;
		$params['share_count']->facebook = 0;
		$params['share_count']->twitter  = 0;
		$params['share_count']->plusone  = 0;
		$params['share_count']->linkedin = 0;
	}
	require get_template_directory() . '/partials/share-block-' . $params['layout'] . '.php';
}

function _thrive_render_category_meta_block( $params = array() ) {
	if ( ! isset( $params['categories'] ) || ! $params['categories'] ) {
		$params['categories'] = get_the_category();
	}
	if ( ! $params['categories'] ) {
		return;
	}
	if ( ! isset( $params['position_class'] ) ) {
		$params['position_class'] = "";
	}
	require get_template_directory() . '/partials/category-meta.php';
}

function _thrive_get_post_content_excerpt( $postContent, $postId = 0, $limit = 60, $force_excerpt = false, $more = '' ) {
	return _thrive_get_post_text_content_excerpt( $postContent, $postId, $limit, array(), $force_excerpt, $more );
}

function _thrive_get_post_text_content_excerpt( $content, $postId = 0, $limit = 120, $allowTags = array(), $force_excerpt = false, $more = '' ) {
	$GLOBALS['thrive_post_excerpts']   = isset( $GLOBALS['thrive_post_excerpts'] ) ? $GLOBALS['thrive_post_excerpts'] : array();
	$GLOBALS['thrive_post_excerpts'][] = $postId;

	//get the global post
	global $post;

	//save it temporary
	$current_post = $post;

	//set the global post the post received as parameter
	$post = get_post( $postId );

	if ( $force_excerpt || ! empty( $GLOBALS['thrive_theme_options']['other_show_excerpt'] ) ) {
		$content = strip_shortcodes( $content );
	}

	$content = apply_filters( 'the_content', $content );

	//set the global post back to original
	$post = $current_post;

	//remove the continue reading text
	$read_more_type   = thrive_get_theme_options( 'other_read_more_type' );
	$read_more_option = thrive_get_theme_options( "other_read_more_text" );
	$read_more_text   = ( $read_more_option != "" ) ? $read_more_option : "Read more";

	if ( $read_more_type === 'button' ) {
		/**
		 * if there is a button we need to remove it entirely
		 * @see thrive_more_link
		 */
		$content = preg_replace( '/<a\sclass=\"(.*?)\"\shref=\"(.*?)\"><span>' . $read_more_text . '<\/span><\/a>/s', "", $content );
	} else if ( $read_more_type === 'text' ) {
		$content = preg_replace( '/<a\sclass=\"(.*?)\"\shref=\"(.*?)\">' . str_replace( array( '[', ']' ), array(
				'\\[',
				'\\]'
			), $read_more_text ) . '<\/a>/s', "", $content );
	} else {
		//default case
		$content = str_replace( $read_more_text, "", $content );
	}

	//remove empty P tags
	$content = preg_replace( '/<p><\/p>/s', "", $content );

	//if post content is check in thrive options for In Blog List Display
	if ( ! $force_excerpt && isset( $GLOBALS['thrive_theme_options']['other_show_excerpt'] ) && $GLOBALS['thrive_theme_options']['other_show_excerpt'] == 0 ) {
		return $content;
	}

	$start = '\[';
	$end   = '\]';
	if ( isset( $allowTags['br'] ) ) {
		$content = nl2br( $content );
	}
	$content = wp_kses( $content, $allowTags );
	$content = preg_replace( '#(' . $start . ')(.*)(' . $end . ')#si', '', $content );
	if ( strpos( $content, "[" ) < $limit ) {
		$subcontent = substr( $content, strpos( $content, "]" ), $limit );
		if ( strpos( $subcontent, "[" ) === false ) {
			return _thrive_substring( $content, $limit, $more );
		}
	}

	return _thrive_substring( $content, $limit, $more );
}

/**
 * Cut the content to the limit without cutting the last word
 *
 * @param $content
 * @param $limit
 *
 * @return string
 */
function _thrive_substring( $content, $limit, $append = '' ) {
	if ( strlen( $content ) <= $limit ) {
		return $content;
	}
	$length = strpos( $content, " ", $limit );

	/**
	 * this means there's a really long word there, which has no space after it
	 */
	if ( false === $length ) {
		$trimmed = substr( $content, 0, $limit ) . '...';
	} else {
		$trimmed = substr( $content, 0, $length );
	}
	if ( strlen( $trimmed ) < strlen( $content ) ) {
		$trimmed .= $append;
	}

	return $trimmed;
}

function _thrive_get_header( $post_template = "" ) {
	if ( $post_template == "Landing Page" ) {
		get_header( "landing" );
	} else {
		get_header();
	}
}

function _thrive_get_share_count_for_post( $postId ) {
	$shareCount = json_decode( get_post_meta( $postId, 'thrive_share_count', true ) );
	if ( ! $shareCount ) {
		$shareCount            = new stdClass();
		$shareCount->total     = 0;
		$shareCount->facebook  = 0;
		$shareCount->twitter   = 0;
		$shareCount->plusone   = 0;
		$shareCount->pinterest = 0;
		$shareCount->linkedin  = 0;
	}

	return $shareCount;
}

function _thrive_get_pinterest_media_param( $postId ) {
	return _thrive_get_featured_image_with_default_src( "large", $postId, "large" );
}

function _thrive_get_in_content_ad_container_class( $groupAdId, $position = "beginning" ) {

	$position           = get_post_meta( $groupAdId, "_thrive_meta_ad_alignement", true );
	$availablePositions = array( 'center', 'left', 'right' );
	if ( ! in_array( $position, $availablePositions ) ) {
		$position = "center";
	}

	if ( $position == "beginning" ) {
		return "tt-beggining-of-post-ad " . $position;
	} else {
		return "tt-end-of-post-ad " . $position;
	}
}

add_action( 'tha_head_top', 'thrive_include_meta_post_tags' );

function thrive_include_meta_post_tags() {

	if ( _thrive_check_is_woocommerce_page() ) {
		return false;
	}


	$theme_options = thrive_get_options_for_post();

	if ( ! isset( $theme_options['social_site_meta_enable'] ) || $theme_options['social_site_meta_enable'] === null || $theme_options['social_site_meta_enable'] == "" ) {
		$theme_options['social_site_meta_enable'] = _thrive_get_social_site_meta_enable_default_value();
	}

	if ( $theme_options['social_site_meta_enable'] != 1 ) {
		return false;
	}

	if ( is_single() || is_page() ) {
		$plugin_file_path = thrive_get_wp_admin_dir() . "/includes/plugin.php";
		include_once( $plugin_file_path );
		if ( is_plugin_active( 'wordpress-seo/wp-seo.php' ) ) {
			if ( ( ! isset( $theme_options['social_site_title'] ) || $theme_options['social_site_title'] == '' ) &&
			     ( ! isset( $theme_options['social_site_image'] ) || $theme_options['social_site_image'] == '' ) &&
			     ( ! isset( $theme_options['social_site_description'] ) || $theme_options['social_site_description'] == '' ) &&
			     ( ! isset( $theme_options['social_site_twitter_username'] ) || $theme_options['social_site_twitter_username'] == '' )
			) {
				return;
			} else {
				thrive_remove_yoast_meta_description();
			}
		}

		$page_type = 'article';
		if ( ! isset( $theme_options['social_site_title'] ) || $theme_options['social_site_title'] == '' ) {
			$theme_options['social_site_title'] = wp_strip_all_tags( get_the_title() );
		}
		if ( ! isset( $theme_options['social_site_image'] ) || $theme_options['social_site_image'] == '' ) {
			if ( has_post_thumbnail( get_the_ID() ) ) {
				$featured_image = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ) );
				if ( $featured_image && isset( $featured_image[0] ) ) {
					$theme_options['social_site_image'] = $featured_image[0];
				}
			}
		}
		if ( ! isset( $theme_options['social_site_description'] ) || $theme_options['social_site_description'] == '' ) {
			$post    = get_post();
			$content = strip_shortcodes( $post->post_content );
			$content = strip_tags( $content );
			$content = preg_replace( "/\s+/", " ", $content );
			$content = str_replace( '&nbsp;', ' ', $content );

			$first_dot         = strpos( $content, '.' ) !== false ? strpos( $content, '.' ) : strlen( $content );
			$first_question    = strpos( $content, '.' ) !== false ? strpos( $content, '.' ) : strlen( $content );
			$first_exclamation = strpos( $content, '.' ) !== false ? strpos( $content, '.' ) : strlen( $content );

			$fist_sentence                            = min( $first_dot, $first_exclamation, $first_question );
			$content                                  = substr( $content, 0, intval( $fist_sentence ) + 1 );
			$theme_options['social_site_description'] = addslashes( $content );
		}
	} else {
		$page_type = 'website';
	}
	$current_url = get_permalink();

	$meta = array(
		//uniqueID => meta
		'og:type'      => array(
			//attribute -> value
			'property' => 'og:type',
			'content'  => $page_type,
		),
		'og:url'       => array(
			'property' => 'og:url',
			'content'  => $current_url,
		),
		'twitter:card' => array(
			'name'    => 'twitter:card',
			'content' => 'summary_large_image'
		),
	);

	if ( isset( $theme_options['social_site_name'] ) && $theme_options['social_site_name'] != '' ) {
		$meta['og:site_name'] = array(
			'property' => 'og:site_name',
			'content'  => str_replace( '"', "'", $theme_options['social_site_name'] )
		);
	}
	if ( isset( $theme_options['social_site_title'] ) && $theme_options['social_site_title'] != '' ) {
		$meta['og:title']      = array(
			'property' => 'og:title',
			'content'  => str_replace( '"', "'", $theme_options['social_site_title'] ),
		);
		$meta['twitter:title'] = array(
			'name'    => 'twitter:title',
			'content' => str_replace( '"', "'", $theme_options['social_site_title'] )
		);
	}
	if ( isset( $theme_options['social_site_image'] ) && $theme_options['social_site_image'] != '' ) {
		$meta['og:image']          = array(
			'property' => 'og:image',
			'content'  => str_replace( '"', "'", $theme_options['social_site_image'] ),
		);
		$meta['twitter:image:src'] = array(
			'name'    => 'twitter:image:src',
			'content' => str_replace( '"', "'", $theme_options['social_site_image'] )
		);

	}
	if ( isset( $theme_options['social_site_description'] ) && $theme_options['social_site_description'] != '' ) {
		$meta['og:description']      = array(
			'property' => 'og:description',
			'content'  => str_replace( '"', "'", $theme_options['social_site_description'] )
		);
		$meta['twitter:description'] = array(
			'name'    => 'twitter:description',
			'content' => str_replace( '"', "'", $theme_options['social_site_description'] )
		);
	}
	if ( isset( $theme_options['social_site_twitter_username'] ) && $theme_options['social_site_twitter_username'] != '' ) {
		$meta['twitter:creator'] = array(
			'name'    => 'twitter:creator',
			'content' => '@' . str_replace( '"', "'", $theme_options['social_site_twitter_username'] )
		);
		$meta['twitter:site']    = array(
			'name'    => 'twitter:site',
			'content' => '@' . str_replace( '"', "'", $theme_options['social_site_twitter_username'] )
		);
	}

	$meta = apply_filters( 'tha_social_meta', $meta );

	if ( empty( $meta ) ) {
		return;
	}
	echo "\n";
	//display all the meta
	foreach ( $meta as $uniquekey => $attributes ) {
		if ( empty( $attributes ) || ! is_array( $attributes ) ) {
			continue;
		}
		echo "<meta ";
		foreach ( $attributes as $attr_name => $attr_value ) {
			echo $attr_name . '="' . $attr_value . '" ';
		}
		echo "/>\n";
	}
	echo "\n";
}

function thrive_remove_yoast_meta_description() {
	if ( has_action( 'wpseo_head' ) ) {
		if ( isset( $GLOBALS['wpseo_og'] ) ) {
			remove_action( 'wpseo_head', array( $GLOBALS['wpseo_og'], 'opengraph' ), 30 );
		}
		remove_action( 'wpseo_head', array( 'WPSEO_Twitter', 'get_instance' ), 40 );
		remove_action( 'wpseo_head', array( 'WPSEO_GooglePlus', 'get_instance' ), 35 );
	}
}

function _thrive_render_bottom_related_posts( $postId, $options = null ) {
	if ( ! $postId || ! is_single() ) {
		return false;
	}
	if ( ! $options ) {
		$options = thrive_get_options_for_post( $postId );
	}
	if ( $options['related_posts_box'] != 1 ) {
		return false;
	}

	$postType = get_post_type( $postId );
	if ( $postType != "post" ) {
		return false;
	}

	if ( thrive_get_theme_options( 'related_posts_enabled' ) == 1 ) {
		$relatedPosts = _thrive_get_related_posts( $postId, 'array', $options['related_posts_number'] );
	} else {
		$relatedPosts = get_posts( array(
			'category__in' => wp_get_post_categories( $postId ),
			'numberposts'  => $options['related_posts_number'],
			'post__not_in' => array( $postId )
		) );
	}

	require get_template_directory() . '/partials/bottom-related-posts.php';
}

function thrive_get_quote_excerpt( $str, $maxLength = 70 ) {
	if ( strlen( $str ) > $maxLength ) {
		$excerpt   = substr( $str, 0, $maxLength - 3 );
		$lastSpace = strrpos( $excerpt, ' ' );
		$excerpt   = substr( $excerpt, 0, $lastSpace );
		$excerpt .= '...';
	} else {
		$excerpt = $str;
	}

	return $excerpt;
}

function thrive_trim_title_words( $title, $characters = 35 ) {

	if ( strlen( $title ) < $characters ) {
		return $title;
	}

	$final_title = '';
	$space_pos   = 0;
	while ( strlen( $final_title ) < $characters ) {
		if ( strpos( $title, ' ', $space_pos ) === false ) {
			break;
		}
		$space_pos   = strpos( $title, ' ', $space_pos ) + 1;
		$final_title = substr( $title, 0, $space_pos ) . ' ...';
	}
	if ( $final_title == '' ) {
		$final_title = substr( $title, 0, $characters ) . '...';
	}

	return $final_title;
}

function _thrive_get_comments_txt( $no ) {
	if ( $no == 1 ) {
		return __( "comment", 'thrive' );
	} else {
		return __( "comments", 'thrive' );
	}
}

function thrive_get_wp_admin_dir() {
	$wp_include_dir = preg_replace( '/wp-content$/', 'wp-admin', WP_CONTENT_DIR );

	return $wp_include_dir;
}

function _thrive_check_focus_area_for_pages( $page, $position = "top" ) {
	if ( ! $page ) {
		return false;
	}
	if ( $page == "blog" && ! is_home() ) {
		return false;
	}

	if ( $page == "blog" ) {
		$query = new WP_Query( "post_type=focus_area&meta_key=_thrive_meta_focus_page_blog&meta_value=blog&order=ASC" );
	} elseif ( $page == "archive" ) {
		$query = new WP_Query( "post_type=focus_area&meta_key=_thrive_meta_focus_page_archive&meta_value=archive&order=ASC" );
	}

	$focus_areas = $query->get_posts();

	foreach ( $focus_areas as $focus_area ) {
		$post_custom_atr = get_post_custom( $focus_area->ID );
		if ( isset( $post_custom_atr['_thrive_meta_focus_display_location'] )
		     && isset( $post_custom_atr['_thrive_meta_focus_display_location'][0] )
		     && $post_custom_atr['_thrive_meta_focus_display_location'][0] == $position
		) {
			return true;
		}
	}

	return false;
}

function _thrive_get_exclude_posts_array_for_blog() {
	$hide_cat_option = thrive_get_theme_options( 'hide_cats_from_blog' );

	if ( ! is_string( $hide_cat_option ) ) {
		return array();
	}

	$hide_categories = is_array( json_decode( $hide_cat_option ) ) ? json_decode( $hide_cat_option ) : array();

	$temp_query_string_part = "";

	foreach ( $hide_categories as $temp_cat_id ) {
		$temp_query_string_part .= $temp_cat_id . ",";
	}

	$exclude_posts = get_posts( array( 'posts_per_page' => 100, 'category' => $temp_query_string_part ) );

	$postIds = array();

	foreach ( $exclude_posts as $p ) {
		$postIds[] = $p->ID;
	}

	return $postIds;
}

function _thrive_get_homepage_post_excerpt_length() {
	global $tt_homepage_post_excerpt_length;

	if ( ! $tt_homepage_post_excerpt_length ) {
		$tt_homepage_post_excerpt_length = 60;
	}

	return $tt_homepage_post_excerpt_length;
}

function _thrive_set_homepage_post_excerpt_length( $length = 60 ) {
	global $tt_homepage_post_excerpt_length;

	$tt_homepage_post_excerpt_length = $length;
}

/**
 * Check to see where to display the social sharing block
 *
 * @param $options Array theme options
 * @param $style String place of the block
 *
 * @return boolean
 */
function display_social_sharing_block( $options, $style ) {
	if ( $options['enable_social_buttons'] != 1 ) {
		return false;
	}

	switch ( $style ) {
		case 'top':
			if ( is_single() && strpos( $options['social_display_location'], "posts_top" ) !== false ) {
				return true;
			} else if ( is_page() && strpos( $options['social_display_location'], "pages_top" ) !== false ) {
				return true;
			}
			break;
		case 'floating':
			if ( $options['navigation_type'] == "float" ) {
				if ( is_single() && strpos( $options['social_display_location'], "posts," ) !== false ) {
					return true;
				} else if ( is_page() && strpos( $options['social_display_location'], "pages," ) !== false ) {
					return true;
				}
			}
			break;
		default:
			return false;
	}

	return false;

}

add_action( "wp_ajax_nopriv_thrive_search_posts", "_thrive_search_posts" );
add_action( "wp_ajax_thrive_search_posts", "_thrive_search_posts" );

/**
 * Returns a json with posts that match the search query.
 * Currently it's used for autocomplete ajax when user has a lot of posts.
 */
function _thrive_search_posts() {
	if ( isset( $_REQUEST['q'] ) ) {
		$s = wp_unslash( $_REQUEST['q'] );

		/** @var WP_Post[] $posts */
		$posts = get_posts( array(
			'posts_per_page' => - 1,
			'post_status'    => 'publish',
			's'              => $s,
		) );

		$json = array();
		foreach ( $posts as $post ) {
			$json [] = array(
				'id'   => $post->ID,
				'text' => $post->post_title
			);
		}

		wp_send_json( $json );
	} else {
		wp_die( 0 );
	}
}