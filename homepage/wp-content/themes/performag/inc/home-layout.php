<?php

function thrive_admin_home_layout() {
	wp_enqueue_script( 'thrive-home-layout' );

	//prepare the javascript params
	$wpnonce               = wp_create_nonce( "thrive_preview_header_number_nonce" );
	$headerPhonePreviewUrl = admin_url( 'admin-ajax.php?action=header_number_render_preview&nonce=' . $wpnonce );

	$related_nonce      = wp_create_nonce( "thrive_generate_related_posts" );
	$generateRelatedUrl = admin_url( 'admin-ajax.php?action=thrive_generate_related_posts&nonce=' . $related_nonce );

	$js_params_array = array(
		'headerPhonePreviewUrl' => $headerPhonePreviewUrl,
		'generateRelatedUrl'    => $generateRelatedUrl,
		'noonce'                => $wpnonce
	);

	wp_localize_script( 'thrive-home-layout', 'ThriveHomeLayout', $js_params_array );

	require( get_template_directory() . "/inc/templates/admin-home-layout.php" );
}

?>
