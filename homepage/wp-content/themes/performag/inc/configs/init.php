<?php

require( get_template_directory() . "/inc/configs/constants.php" );
require( get_template_directory() . "/inc/image-resize.php" );
/**
 * Sets up the theme and provides some helper functions, which are used in the
 * theme as custom template tags. Others are attached to action and filter
 * hooks in WordPress to change core functionality.
 *
 */
if ( ! function_exists( 'thrive_setup' ) ):
	/*
	 * Sets up the current theme's main options and include the additional files
	 */

	function thrive_setup() {

		$default_background_color = 'e2e2e2';

		add_theme_support( 'custom-background', array(
			'default-color' => $default_background_color,
		) );

		add_theme_support( 'post-thumbnails' );
		require( get_template_directory() . "/inc/helpers/labels.php" );
		require( get_template_directory() . "/inc/page-templates.php" );
		require( get_template_directory() . "/inc/theme-options.php" );
		require( get_template_directory() . "/inc/meta-options.php" );
		require( get_template_directory() . "/inc/widgets/widget-author.php" );
		require( get_template_directory() . "/inc/widgets/widget-follow.php" );
		require( get_template_directory() . "/inc/widgets/widget-optin.php" );
		require( get_template_directory() . "/inc/widgets/widget-call.php" );
		require( get_template_directory() . "/inc/widgets/widget-tabs.php" );
		require( get_template_directory() . "/inc/widgets/widget-custom-text.php" );
		require( get_template_directory() . "/inc/widgets/widget-related.php" );
		require( get_template_directory() . "/inc/shortcodes/admin-shortcodes.php" );
		require( get_template_directory() . "/inc/extra/theme-options.php" );
		require( get_template_directory() . "/inc/home-layout.php" );
		require( get_template_directory() . "/inc/extra/ads.php" );
		require( get_template_directory() . "/inc/extra/slideshow-post.php" );
		require( get_template_directory() . "/inc/widgets/widget-ad-default.php" );
		require( get_template_directory() . "/inc/widgets/widget-ad-button.php" );
		//require the helper for get users
		require( get_template_directory() . "/inc/helpers/users-autocomplete.php" );
		//require the category landing pages plugin
		require( get_template_directory() . "/inc/thrive-category-landing-pages.php" );

		if ( thrive_get_theme_options( 'related_posts_enabled' ) == 1 ) {
			require( get_template_directory() . "/inc/helpers/related-posts.php" );
		}
		//include the woocommerce methods only if the plugin is active
		if ( class_exists( 'WooCommerce' ) ) {
			include( get_template_directory() . '/inc/woocommerce.php' );
		}

		register_nav_menu( 'primary', __( 'Primary Menu', 'thrive' ) );
		register_nav_menu( 'footer', __( 'Footer menu', 'thrive' ) );

		require_once get_template_directory() . "/inc/thrive-setup.php";

		do_action( 'thrive_theme_setup' );

		require_once get_template_directory() . "/inc/thrive-optin.php";
	}

endif;
add_action( 'after_setup_theme', 'thrive_setup' );

/*
 * Register and queue up the styles and the javascript used in the frontend
 */

function thrive_enqueue_scripts() {
	// Load our main stylesheet.
	wp_enqueue_style( 'performag-style', get_stylesheet_uri() );

	$options                 = thrive_get_theme_options();
	$options['color_scheme'] = in_array( $options['color_scheme'], array(
		'green',
		'red',
		'purple',
		'orange',
		'blue',
		'teal'
	) ) ? $options['color_scheme'] : 'red';
	$options['color_theme']  = in_array( $options['color_theme'], array(
		'light',
		'dark'
	) ) ? $options['color_theme'] : 'light';
	$main_css_path           = get_template_directory_uri() . '/css/main_' . $options['color_scheme'] . '_' . $options['color_theme'] . '.css';

	if ( ! is_admin() ) {
		wp_enqueue_script( 'jquery', false, false, "", true );
	}

	wp_register_script( 'jquerytouchwipe', get_template_directory_uri() . '/js/jquery.touchwipe.js', array( 'jquery' ), "", true );
	wp_register_script( 'thrive-main-script', get_template_directory_uri() . '/js/script.min.js', array( 'jquery' ), "", true );
	wp_register_script( 'thrive-masonry-lib', get_template_directory_uri() . '/js/masonry.pkgd.min.js', array( 'jquery' ), "", true );
	wp_register_script( 'thrive-waypoints-lib', get_template_directory_uri() . '/js/waypoints.min.js', array( 'jquery' ), "", true );

	wp_register_style( 'thrive-main-style', $main_css_path, array( "thrive-reset" ), '5566', 'all' );
	wp_register_style( 'thrive-reset', get_template_directory_uri() . '/css/reset.css', array(), '20120208', 'all' );

	if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ) {
		wp_enqueue_script( 'thrive-masonry-lib' );
	}

	$infinite_scroll = 0;

	if ( ( $options['enable_infinite_scroll'] == "on" && ! is_singular() )
	     || ( $options['enable_infinite_scroll_single'] == "on" && is_singular() )
	     || ( is_singular() && $options['enable_home_custom_layout'] == "on" && $options['homepage_layout_page'] == get_the_ID() )
	) {
		wp_enqueue_script( 'thrive-waypoints-lib' );
		$infinite_scroll = 1;
	}

	wp_enqueue_script( 'thrive-main-script' );

	wp_enqueue_style( 'thrive-reset' );
	wp_enqueue_style( 'thrive-main-style' );
	$lazy_load_comments = isset( $options['comments_lazy'] ) ? $options['comments_lazy'] : 0;

	$currentPostId = 0;
	if ( is_singular() ) {
		$currentPostId = get_the_ID();
	}
	$params_array = array(
		'ajax_url'               => admin_url( 'admin-ajax.php' ),
		'lazy_load_comments'     => $lazy_load_comments,
		'comments_loaded'        => 0,
		'theme_uri'              => get_template_directory_uri(),
		'infinite_scroll'        => $infinite_scroll,
		'is_singular'            => ( is_singular() ) ? 1 : 0,
		'load_posts_url'         => admin_url( 'admin-ajax.php?action=thrive_load_more_posts' ),
		'load_related_posts_url' => admin_url( 'admin-ajax.php?action=thrive_load_more_related_posts' ),
		'load_latest_posts_url'  => admin_url( 'admin-ajax.php?action=thrive_load_more_latest_posts' ),
		'current_page'           => 1,
		'currentPostId'          => $currentPostId,
		'translations'           => array(
			'ProductDetails' => __( 'Product Details', 'thrive' )
		)
	);
	wp_localize_script( 'thrive-main-script', 'ThriveApp', $params_array );
}

add_action( 'wp_enqueue_scripts', 'thrive_enqueue_scripts' );

/*
 * Register theme's current widgets and the 2 sidebars used in the theme
 */

function thrive_init_widgets() {
	register_widget( 'Thrive_Author_Widget' );
	register_widget( 'Thrive_Follow_Widget' );
	register_widget( 'Thrive_Optin_Widget' );
	register_widget( 'Thrive_Call_Widget' );
	register_widget( 'Thrive_Tabs_Widget' );
	register_widget( 'Thrive_Custom_Text' );
	register_widget( 'Thrive_Related_Widget' );
	register_widget( 'Thrive_Ad_Default' );
	register_widget( 'Thrive_Ad_Button' );

	register_sidebar( array(
		'name'          => __( 'Main Sidebar', 'thrive' ),
		'id'            => 'sidebar-1',
		'before_widget' => '<section id="%1$s"><div class="awr scn">',
		'after_widget'  => '</div></section>',
		'before_title'  => '<div class="twr"><p class="ttl">',
		'after_title'   => '</p></div>',
	) );

	register_sidebar( array(
		'name'          => __( 'Pages Sidebar', 'thrive' ),
		'id'            => 'sidebar-2',
		'before_widget' => '<section id="%1$s"><div class="awr scn">',
		'after_widget'  => '</div></section>',
		'before_title'  => '<div class="twr"><p class="ttl">',
		'after_title'   => '</p></div>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 1', 'thrive' ),
		'id'            => 'footer-1',
		'before_widget' => '<section id="%1$s"><div class="scn">',
		'after_widget'  => '</div></section>',
		'before_title'  => '<div class="twr"><p class="ttl">',
		'after_title'   => '</p></div>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 2', 'thrive' ),
		'id'            => 'footer-2',
		'before_widget' => '<section id="%1$s"><div class="scn">',
		'after_widget'  => '</div></section>',
		'before_title'  => '<div class="twr"><p class="ttl">',
		'after_title'   => '</p></div>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer Column 3', 'thrive' ),
		'id'            => 'footer-3',
		'before_widget' => '<section id="%1$s"><div class="scn">',
		'after_widget'  => '</div></section>',
		'before_title'  => '<div class="twr"><p class="ttl">',
		'after_title'   => '</div></p>',
	) );
}

add_action( 'widgets_init', 'thrive_init_widgets' );


// if no title then add widget content wrapper to before widget
add_filter( 'dynamic_sidebar_params', 'thrive_check_sidebar_params' );
/*
 * Checks the place of a widget in order to generate the right markup
 * @param array $params Widget params
 * @return array The widget params formatted
 */

function thrive_check_sidebar_params( $params ) {

	if ( ! isset( $params[0] ) || ! isset( $params[1] ) || ! isset( $params[1]['number'] ) ) {
		return $params;
	}

	global $wp_registered_widgets;
	$settings_getter = $wp_registered_widgets[ $params[0]['widget_id'] ]['callback'][0];

	if ( ! $settings_getter || ! is_object( $settings_getter ) ) {
		return $params;
	}

	$widgets_without_default_titles = array(
		'Search',
		'Calendar',
		'Text',
		'Custom Menu',
		'Links',
		'Image Widget',
		'Dropdown Menu'
	);

	$settings = $settings_getter->get_settings();

	if ( ! isset( $params[1]['number'] ) || ! isset( $settings[ $params[1]['number'] ] ) ) {
		return $params;
	}

	$settings = $settings[ $params[1]['number'] ];

	/*
	 * Add the correct markup for the widgets that don't have a default title set
	 * by Wordpress
	 */
	if ( $params[0]['after_widget'] == '</div></section>' && isset( $settings['title'] ) && empty( $settings['title'] ) && ( $params[0]['id'] == "sidebar-1" || $params[0]['id'] == "sidebar-2" ) ) {

		if ( in_array( $params[0]['widget_name'], $widgets_without_default_titles ) ) {
			//$params[0]['before_widget'] = '<section><div class="awr scn">';
			//$params[0]['after_widget'] = '</div></section>';
		}
	}

	return $params;
}

/*
 * Includes various helper functions
 */
require( get_template_directory() . "/inc/helpers/helpers.php" );

/*
 *  Register and queue up the necessary js and stylesheets for the admin section
 */

function thrive_enqueue_admin() {

	// list of focus blog admin pages
	// only load scripts on our own admin pages
	$focus_blog_pages = array(
		'focus_area',
		'thrive_optin',
		'thrive-dashboard_page_thrive_admin_options',
		'post',
		'page',
		'widgets',
		'tcb_lightbox',
		'thrive-options_page_thrive_admin_page_templates',
		'thrive-themes_page_thrive_admin_home_layout',
		'thrive_ad_group',
		'thrive_slideshow'
	);

	$screen = get_current_screen();

	if ( in_array( $screen->id, $focus_blog_pages ) || $screen->base == "post" ) {
		if ( ! thrive_check_license() ) {
			thrive_license_notice();
		} else {

			wp_register_style( 'thrive-admin-focus', get_template_directory_uri() . '/inc/css/admin-focusareas.css' );
			wp_register_style( 'thrive-admin-focustemplates', get_template_directory_uri() . '/css/focus_areas.css' );
			wp_register_style( 'thrive-select2-style', get_template_directory_uri() . '/inc/libs/select2.css' );
			wp_register_style( 'thrive-admin-responsivefocus', get_template_directory_uri() . '/inc/css/focus_areas_responsive.css' );

			wp_register_script( 'thrive-nouislider', get_template_directory_uri() . '/inc/libs/jquery.nouislider.min.js', array( 'jquery' ) );
			wp_register_script( 'thrive-select2', get_template_directory_uri() . '/inc/libs/select2.js', array( 'jquery' ) );
			wp_register_script( 'thrive-focus-options', get_template_directory_uri() . '/inc/js/focus-areas.js', array( 'jquery' ) );
			wp_register_script( 'thrive-optin-options', get_template_directory_uri() . '/inc/js/optin-options.js', array( 'jquery' ) );
			wp_register_script( 'thrive-admin-shortcodes', get_template_directory_uri() . '/inc/js/shortcodes.js', array( 'jquery' ) );
			wp_register_script( 'thrive-admin-postedit', get_template_directory_uri() . '/inc/js/post-edit.js', array( 'jquery' ) );
			wp_register_script( 'thrive-admin-tooltips', get_template_directory_uri() . '/inc/js/tooltip/jquery.powertip.min.js', array( 'jquery' ) );
			wp_register_script( 'thrive-admin-tooltips-setup', get_template_directory_uri() . '/inc/js/admin-tooltips.js', array(
				'jquery',
				'thrive-admin-tooltips'
			) );
			wp_register_script( 'thrive-theme-options', get_template_directory_uri() . '/inc/js/theme-options.js', array(
				'jquery',
				'jquery-ui-sortable',
				'media-upload',
				'thickbox'
			) );

			wp_register_script( 'thrive-slideshow-post', get_template_directory_uri() . '/inc/js/slideshow-post.js', array(
				'jquery',
				'media-upload',
				'thickbox'
			) );
			wp_register_script( 'thrive-ads-groups', get_template_directory_uri() . '/inc/js/advs-groups.js', array(
				'jquery',
				'media-upload',
				'thickbox'
			) );
			wp_register_script( 'thrive-home-layout', get_template_directory_uri() . '/inc/js/home-layout.js', array(
				'jquery',
				'media-upload',
				'thickbox'
			) );

			wp_register_style( 'thrive-nouislider-css', get_template_directory_uri() . '/inc/css/jquery.nouislider.min.css' );
			wp_register_style( 'thrive-base-css', get_template_directory_uri() . '/inc/css/pure-base-min.css' );
			wp_register_style( 'thrive-pure-css', get_template_directory_uri() . '/inc/css/pure-min.css' );
			wp_register_style( 'thrive-admin-colors', get_template_directory_uri() . '/inc/css/thrive_admin_colours.css' );
			wp_register_style( 'thrive-admin-tooltips', get_template_directory_uri() . '/inc/js/tooltip/css/jquery.powertip-green.css' );

			wp_enqueue_style( 'thickbox' );

			wp_enqueue_script( 'jquery' );
			wp_enqueue_script( 'thickbox' );
			wp_enqueue_script( 'media-upload' );

			wp_enqueue_style( 'thrive-theme-options', get_template_directory_uri() . '/inc/css/theme-options.css', false, '2013-07-03' );

			wp_enqueue_style( 'thrive-admin-colors' );
			wp_enqueue_style( 'thrive-base-css' );
			wp_enqueue_style( 'thrive-pure-css' );
			wp_enqueue_style( 'thrive-admin-tooltips' );

			wp_enqueue_script( 'thrive-admin-tooltips' );
			wp_enqueue_script( 'thrive-admin-tooltips-setup' );

			wp_enqueue_script( 'wp-color-picker' );
			wp_enqueue_style( 'wp-color-picker' );
		}
	}

	if ( $screen->base == "post" || $screen->id == 'tcb_lightbox' ) {
		wp_enqueue_script( 'thrive-admin-postedit' );
		wp_enqueue_script( 'thrive-theme-options' );
		wp_enqueue_script( 'thrive-select2' );
		//datetime picker
		wp_enqueue_script( 'thrive-admin-datetime-picker', get_template_directory_uri() . '/inc/js/jquery-ui-timepicker.js', array(
			'jquery-ui-datepicker',
			'jquery-ui-slider'
		) );
	}

	if ( $screen->id == "thrive-dashboard_page_thrive_admin_options" ) {
		wp_enqueue_media();
		wp_enqueue_script( 'thrive-admin-postedit' );
		wp_enqueue_script( 'thrive-select2' );
		wp_enqueue_script( 'thrive-nouislider' );
		wp_enqueue_style( 'thrive-nouislider-css' );
		wp_enqueue_style( 'thrive-theme-options', get_template_directory_uri() . '/inc/css/theme-options.css', false, '2013-07-03' );
	}

	if ( $screen->id == 'nav-menus' ) {
		wp_enqueue_media();
		wp_enqueue_style( 'thrive-admin-colors', get_template_directory_uri() . '/inc/css/thrive_admin_colours.css' );
		wp_enqueue_script( 'admin-menu-gallery', get_template_directory_uri() . '/inc/js/admin-menu.js', array( 'jquery' ) );
	}

	if ( $screen->id == "admin_page_thrive_admin_page_templates" ) {
		wp_enqueue_media();
		wp_enqueue_style( 'thrive-theme-options', get_template_directory_uri() . '/inc/css/theme-options.css', false, '2013-07-03' );
		wp_enqueue_style( 'thrive-admin-colors', get_template_directory_uri() . '/inc/css/thrive_admin_colours.css' );
		wp_enqueue_style( 'thrive-pure-css' );
	}

	if ( $screen->id == "focus_area" ) {
		add_editor_style( get_template_directory_uri() . '/inc/css/custom-editor-style.css' );
	}

	if ( $screen && ( $screen->base == "widgets" || $screen->id == "widgets" ) ) {
		wp_enqueue_media();
		wp_enqueue_style( 'thrive-select2-style' );
		wp_enqueue_script( 'thrive-select2' );
		wp_enqueue_script( "jquery-ui-autocomplete" );
		wp_enqueue_style( "jquery-ui-autocomplete" );
		wp_enqueue_script( 'thrive-widgets-options', get_template_directory_uri() . '/inc/js/widgets-options.js', array(
			'jquery',
			'media-upload',
			'thickbox',
			'jquery-ui-autocomplete'
		) );

		//prepare the javascript params
		$getUsersWpnonce = wp_create_nonce( "thrive_helper_get_users" );
		$getUsersUrl     = admin_url( 'admin-ajax.php?action=thrive_helper_get_users&nonce=' . $getUsersWpnonce );

		$js_params_array = array(
			'getUsersUrl' => $getUsersUrl,
			'noonce'      => $getUsersWpnonce
		);
		wp_localize_script( 'thrive-widgets-options', 'ThriveWidgetsOptions', $js_params_array );
	}

	if ( $screen->id == "thrive-dashboard_page_thrive_admin_options" || $screen->id == "focus_area" || $screen->id == "thrive_ad_group" || $screen->id == "customize" ) {
		wp_enqueue_style( 'thrive-select2-style', get_template_directory_uri() . '/inc/libs/select2.css' );
		wp_enqueue_script( 'thrive-select2', get_template_directory_uri() . '/inc/libs/select2.js', array( 'jquery' ) );
	}

	if ( $screen->id == "thrive_optin" ) {
		wp_enqueue_script( 'thrive-optin-params' );
	}
}

add_action( 'admin_enqueue_scripts', 'thrive_enqueue_admin' );
add_action( 'admin_head', 'thrive_admin_head' );

/*
 * Ads specific customization options for the theme
 */
require( get_template_directory() . "/inc/theme-customize.php" );

add_action( 'init', 'thrive_create_post_types' );

/*
 * Register the new content types used by this theme
 * (focus_area and thrive_optin)
 */

function thrive_create_post_types() {

	register_post_type( 'focus_area', array(
		'labels'      => array(
			'name'          => __( 'Focus Areas', 'thrive' ),
			'singular_name' => __( 'FocusArea', 'thrive' )
		),
		'public'      => false,
		'show_ui'     => true,
		'has_archive' => false,
		'supports'    => array( 'title', 'editor' )
	) );

	remove_post_type_support( 'focus_area', 'editor' );

	register_post_type( 'thrive_optin', array(
		'labels'      => array(
			'name'          => __( 'Thrive Opt-In', 'thrive' ),
			'singular_name' => __( 'OptIn', 'thrive' )
		),
		'public'      => false,
		'show_ui'     => true,
		'has_archive' => false,
		'supports'    => array( 'title' )
	) );

	register_post_type( 'thrive_ad_group', array(
		'labels'      => array(
			'name'          => __( 'Thrive Ad Group', 'thrive' ),
			'singular_name' => __( 'Ad Group', 'thrive' )
		),
		'public'      => false,
		'show_ui'     => true,
		'has_archive' => false,
		'supports'    => array( 'title' )
	) );

	register_post_type( 'thrive_ad', array(
		'public'      => false,
		'has_archive' => false,
		'supports'    => array( 'title' )
	) );

	register_post_type( 'thrive_slideshow', array(
		'labels'      => array(
			'name'          => __( 'Thrive Slideshow', 'thrive' ),
			'singular_name' => __( 'Slideshow', 'thrive' )
		),
		'public'      => true,
		'has_archive' => false,
		'taxonomies'  => array( 'category', 'post_tag' ),
		'supports'    => array( 'title', 'editor', 'thumbnail' ),
		'rewrite'     => false,
	) );

	register_post_type( 'thrive_slide_item', array(
		'public'      => false,
		'has_archive' => false,
		'supports'    => array( 'title' )
	) );
	//add post formats
	add_theme_support( 'post-formats', array( 'audio', 'image', 'quote', 'video' ) );
}

/*
 * Overwrites the rendering of the default template file for a specific post that
 * has a particular template assigned to it
 */

function thrive_template_include( $template ) {

	// don't apply template redirects unless single post / page is being displayed.
	if ( ! is_singular() || _thrive_check_is_woocommerce_page() ) {
		return $template;
	}
	
	if ( thrive_get_theme_options( "enable_home_custom_layout" ) == "on" ) {
		if ( thrive_get_theme_options( "homepage_layout_page" ) == get_the_ID() ) {
			global $thrive_is_custom_homepage;
			$thrive_is_custom_homepage = true;

			return TEMPLATEPATH . '/homepage-custom.php';
		}
	}

	return $template;
	$template_name      = get_post_custom_values( '_thrive_meta_post_template', get_the_ID() );
	$template_name      = isset( $template_name[0] ) ? $template_name[0] : "";
	$template_page_name = null;
	switch ( $template_name ) {
		case "Full Width":
			$template_page_name = 'fullwidth-page.php';
			break;
		case "Landing Page":
			$template_page_name = 'landing-page.php';
			break;
		case "Narrow":
			$template_page_name = 'narrow-page.php';
			break;
	}

	if ( $template_page_name !== null ) {
		include TEMPLATEPATH . '/' . $template_page_name;
		exit;
	} elseif ( is_single() ) {
		$default_blog_post_layout = thrive_get_theme_options( "blog_post_layout" );
		if ( $default_blog_post_layout == "full_width" ) {
			include TEMPLATEPATH . "/fullwidth-page.php";
			exit;
		} elseif ( $default_blog_post_layout == "narrow" ) {
			include TEMPLATEPATH . "/narrow-page.php";
			exit;
		}
	}
}

add_filter( 'template_include', 'thrive_template_include' );

/*
 * Function to remove the preview and view post buttons for custom post types where it doesn't apply
 */

function thrive_admin_head() {
	global $post_type;
	if ( $post_type == 'thrive_optin' || $post_type == 'focus_area' ) {
		echo '<style type="text/css">#preview-action,#edit-slug-box,#view-post-btn,#post-preview,.updated p a{display: none;}</style>';
	}
	echo '<script type="text/javascript">var ThriveThemeUrl = "' . get_template_directory_uri() . '";</script>';
	//Workaround for the bug that causes the wp enqueue function not to work in the admin widgets section
	$screen = get_current_screen();
	if ( $screen && ( $screen->base == "widgets" || $screen->id == "widgets" ) ) {
		//echo "<script type='text/javascript' src='" . get_template_directory_uri() . "/inc/js/widgets-options.js'></script>";
	}
}

// Setup the language file
add_action( 'after_setup_theme', 'thrive_language' );

/**
 * Make theme available for translation
 */
function thrive_language() {
	$locale = get_locale();

	$domain = 'thrive';

	$theme = wp_get_theme();

	if ( $theme->get( 'Template' ) ) {
		//if we're in a child theme, we get the parent template
		$theme_name = strtolower( $theme->get( 'Template' ) );
	} else {
		$theme_name = strtolower( $theme );
	}

	// wp-content/languages/thrive/{$theme}-{$locale}.mo
	load_textdomain( $domain, trailingslashit( WP_LANG_DIR ) . 'thrive/' . $theme_name . '-' . $locale . '.mo' );
	// wp-content/themes/thrive/languages/{$locale}.mo
	load_theme_textdomain( $domain, get_stylesheet_directory() . '/languages' );
	// wp-content/themes/thrive/languages/{$locale}.mo
	load_theme_textdomain( $domain, get_template_directory() . '/languages' );

}

/*
 * Hook into the ThriveContentBuilder filter and add the predefined colors for the page sections shortcode
 */
add_filter( "tcb_page_section_colours", "thrive_add_tcb_page_sections_colors" );

function thrive_add_tcb_page_sections_colors( $colours ) {
	if ( ! is_array( $colours ) ) {
		$colours = array();
	}
	$colours['pattern1'] = array(
		'color'     => '#2980B9',
		'shadow'    => '',
		'image'     => '',
		'pattern'   => '',
		'textstyle' => 'light'
	);
	$colours['pattern2'] = array(
		'color'     => '#C0392B',
		'shadow'    => '',
		'image'     => '',
		'pattern'   => '',
		'textstyle' => 'light'
	);
	$colours['pattern3'] = array(
		'color'     => '#2ECC71',
		'shadow'    => '',
		'image'     => '',
		'pattern'   => '',
		'textstyle' => 'light'
	);

	return $colours;
}

// notice to be displayed if license not validated - going to load the styles inline because there are so few lines and not worth an extra server hit.
function thrive_license_notice() {
	?>
	<div id="tve_license_notice">
		<img src="<?php echo get_template_directory_uri(); ?>/inc/images/TT-logo-small.png"
		     class="thrive_admin_logo"/>

		<p>You need to <a
				href="<?php echo admin_url( 'admin.php?page=tve_dash_license_manager_section&return=' . rawurlencode( admin_url( 'admin.php?page=thrive_admin_options' ) ) ); ?>">activate
				your
				license</a> before you can use the theme!</p></div>
	<style type="text/css">
		#tve_license_notice {
			width: 500px;
			margin: 0 auto;
			text-align: center;
			top: 50%;
			left: 50%;
			margin-top: -100px;
			margin-left: -250px;
			padding: 50px;
			z-index: 3000;
			position: fixed;
			-moz-border-radius-bottomleft: 10px;
			-webkit-border-bottom-left-radius: 10px;
			border-bottom-left-radius: 10px;
			-moz-border-radius-bottomright: 10px;
			-webkit-border-bottom-right-radius: 10px;
			border-bottom-right-radius: 10px;
			border-bottom: 1px solid #bdbdbd;
			background-size: 100%;
			background-image: -webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(20%, #ffffff), color-stop(100%, #e6e6e6));
			background-image: -webkit-linear-gradient(top, #ffffff 20%, #e6e6e6 100%);
			background-image: -moz-linear-gradient(top, #ffffff 20%, #e6e6e6 100%);
			background-image: -o-linear-gradient(top, #ffffff 20%, #e6e6e6 100%);
			background-image: linear-gradient(top, #ffffff 20%, #e6e6e6 100%);
			-moz-border-radius: 10px;
			-webkit-border-radius: 10px;
			border-radius: 10px;
			-webkit-box-shadow: 2px 5px 3px #efefef;
			-moz-box-shadow: 2px 5px 3px #efefef;
			box-shadow: 2px 5px 3px #efefef;
		}
	</style>
	<?php
}

function thrive_license_validation() {
	include( 'license.php' );
}

function thrive_admin_notice() {
	?>
	<div class="update-nag">
		<p>
			<?php _e( 'Your theme has successfully been activated! Next step: please activate your license by entering your email and license key here: ', 'thrive' ); ?>
			<a href="<?php echo admin_url( 'admin.php?page=tve_dash_license_manager_section' ); ?>">License
				Activation</a>
		</p>
	</div>
	<?php
}

/*
 * Display the slideshow post in the blog feed
 */
add_filter( 'pre_get_posts', 'thrive_get_homepage_posts' );
/**
 * @param $query WP_Query
 *
 * @return mixed
 */
function thrive_get_homepage_posts( $query ) {
	/**
	 * do not interfere if this query is made by WooCommerce
	 */
	if ( ! empty( $query->query_vars['wc_query'] ) ) {
		return $query;
	}

	if ( ! is_admin() && ( ( ( is_home() || is_category() || is_search() || is_tag() || is_archive() || is_author() ) && $query->is_main_query() ) || is_feed() ) ) {
		$current_post_types = $query->get( 'post_type' );

		if ( empty( $current_post_types ) ) {
			$current_post_types = array( "post" );
		}

		if ( ! is_array( $current_post_types ) ) {
			$current_post_types = array( $current_post_types );
		}

		$current_post_types[] = "thrive_slideshow";

		$query->set( 'post_type', $current_post_types );
	}

	return $query;
}

?>