<?php
/**
 * Created by PhpStorm.
 * User: sala
 * Date: 10-Dec-15
 * Time: 15:15
 */

/**
 * the priority here must be lower than the one set from thrive-dashboard/version.php
 */
add_action( 'after_setup_theme', 'thrive_load_dash_version', 1 );
/**
 * Save current theme dashboard version
 */
function thrive_load_dash_version() {
	$_dash_path      = get_template_directory() . '/thrive-dashboard';
	$_dash_file_path = $_dash_path . '/version.php';

	if ( is_file( $_dash_file_path ) ) {
		$version                                  = require_once( $_dash_file_path );
		$GLOBALS['tve_dash_versions'][ $version ] = $_dash_path . '/thrive-dashboard.php';

		$GLOBALS['tve_dash_versions'][ $version ] = array(
			'path'   => $_dash_path . '/thrive-dashboard.php',
			'folder' => 'performag',
			'from'   => 'themes'
		);
	}
}


add_filter( 'tve_dash_installed_products', 'thrive_add_to_dashboard' );
/**
 * Add theme to the dashboard
 *
 * @param $items
 *
 * @return array
 */
function thrive_add_to_dashboard( $items ) {
	include_once 'Theme_Product.php';

	$theme = new Theme_Product();

	$items[] = $theme;

	return $items;
}

/**
 * Add menu pages but hide them
 */
function thrive_add_admin_pages() {

	add_submenu_page( null, null, null, "edit_theme_options", "thrive_admin_page_templates", "thrive_page_templates_admin_page" );
	add_submenu_page( null, null, null, "edit_theme_options", "thrive_license_validation", "thrive_license_validation" );
	add_submenu_page( "tve_dash_section", "Thrive Options", "Theme Options", "edit_theme_options", "thrive_admin_options", "thrive_theme_options_render_page" );
}

add_action( 'admin_menu', 'thrive_add_admin_pages', 11 );

/**
 * Check license status
 * @return bool
 */
function thrive_check_license() {
	return TVE_Dash_Product_LicenseManager::getInstance()->itemActivated( TVE_Dash_Product_LicenseManager::TAG_PERFORMAG );
}

add_action( 'init', 'thrive_add_license_notice' );
/*
 * Display top warning if the theme has not activated.
 */
function thrive_add_license_notice() {
	if ( ! thrive_check_license() ) {
		add_action( 'admin_notices', 'thrive_admin_notice' );
	}
}

add_filter( 'tve_dash_features', 'thrive_dashboard_add_features' );
/**
 * make sure all the features required by THEME are shown in the dashboard
 *
 * @param array $features
 *
 * @return array
 */
function thrive_dashboard_add_features( $features ) {
	$features['font_manager'] = true;

	return $features;
}