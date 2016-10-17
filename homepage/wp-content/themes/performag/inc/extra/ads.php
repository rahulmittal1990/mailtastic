<?php

define( 'THRIVE_CHECK_AD_LOCATION_STATUS_FAIL', 1 );
define( 'THRIVE_CHECK_AD_LOCATION_STATUS_SUCCESS', 2 );

add_action( 'add_meta_boxes', 'thrive_add_ads_custom_fields' );
add_action( 'save_post', 'thrive_save_ads_postdata' );

add_action( "wp_ajax_nopriv_thrive_check_ad_location_group", "thrive_check_ad_location_group" );
add_action( "wp_ajax_thrive_check_ad_location_group", "thrive_check_ad_location_group" );

add_filter( 'manage_edit-thrive_ad_group_columns', 'thrive_set_ad_group_custom_columns' );
add_action( 'manage_thrive_ad_group_posts_custom_column', 'thrive_ad_group_custom_column', 10, 2 );

function thrive_set_ad_group_custom_columns( $columns ) {

	$columns['thrive_ad_group_status'] = __( 'Ad Status', 'thrive' );

	return $columns;
}

function thrive_ad_group_custom_column( $column, $post_id ) {
	if ( $column == "thrive_ad_group_status" ) {
		$value_ad_group_status = get_post_meta( $post_id, '_thrive_meta_ad_group_status', true );
		echo $value_ad_group_status;
	}
}

function thrive_add_ads_custom_fields() {
	add_meta_box( 'thrive_ads_options', __( 'Build Your Ad Group', 'thrive' ), 'thrive_meta_ad_group_options', "thrive_ad_group", "advanced", "high" );
}

function thrive_save_ads_postdata( $post_id ) {

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( ! isset( $_POST['thrive_noncename'] ) || ! wp_verify_nonce( $_POST['thrive_noncename'], plugin_basename( __FILE__ ) ) ) {
		return;
	}

	if ( 'thrive_ad_group' == $_POST['post_type'] ) {
		_thrive_save_ad_group_options( $_POST );
	}
	if ( $_POST['post_type'] == 'post' || $_POST['post_type'] == 'page' || $_POST['post_type'] == 'thrive_slideshow' ) {
		_thrive_save_post_ad_group_options( $_POST );
	}
}

function thrive_meta_ad_post_options( $post ) {
	wp_nonce_field( plugin_basename( __FILE__ ), 'thrive_noncename' );

	$value_ad_group_header      = get_post_meta( $post->ID, '_thrive_ad_group_header', true );
	$value_ad_group_beginning   = get_post_meta( $post->ID, '_thrive_ad_group_beginning', true );
	$value_ad_group_end_of_post = get_post_meta( $post->ID, '_thrive_ad_group_end_of_post', true );

	$args = array(
		'post_type'  => 'thrive_ad_group',
		'meta_query' => array(
			array(
				'key'   => '_thrive_meta_ad_group_status',
				'value' => "active",
			)
		)
	);

	$query               = new WP_Query( $args );
	$available_ad_groups = $query->get_posts();
	require( get_template_directory() . "/inc/templates/admin-post-ad-options.php" );
}

function thrive_meta_ad_group_options( $post ) {
	wp_enqueue_script( "thrive-ads-groups" );
	wp_nonce_field( plugin_basename( __FILE__ ), 'thrive_noncename' );

	$value_ad_location          = get_post_meta( $post->ID, '_thrive_meta_ad_location', true );
	$value_ad_location_value    = get_post_meta( $post->ID, '_thrive_meta_ad_location_value', true );
	$value_ad_location_position = get_post_meta( $post->ID, '_thrive_meta_ad_location_position', true );
	$value_ad_alignement        = get_post_meta( $post->ID, '_thrive_meta_ad_alignement', true );
	$value_ad_target_in         = get_post_meta( $post->ID, '_thrive_meta_ad_target_in', true );
	$value_ad_target_by         = get_post_meta( $post->ID, '_thrive_meta_ad_target_by', true );
	$value_ad_target_by_value   = json_decode( get_post_meta( $post->ID, '_thrive_meta_ad_target_by_value', true ) );
	$value_ad_list              = json_decode( get_post_meta( $post->ID, '_thrive_meta_ad_list', true ) );
	$value_ad_group_status      = get_post_meta( $post->ID, '_thrive_meta_ad_group_status', true );

	if ( empty( $value_ad_target_in ) ) {
		$value_ad_target_in = "post";
	}

	$wpnonce         = wp_create_nonce( "thrive_check_ad_location_nonce" );
	$js_params_array = array(
		'noonce'             => $wpnonce,
		'id_post'            => $post->ID,
		'checkAdLocationUrl' => admin_url( 'admin-ajax.php?action=thrive_check_ad_location_group&nonce=' . $wpnonce )
	);
	wp_localize_script( 'thrive-ads-groups', 'ThriveAdsOptions', $js_params_array );

	$ad_locations    = _thrive_get_ad_group_locations();
	$ad_targets      = _thrive_get_ad_group_targets();
	$ad_sizes        = _thrive_get_ad_sizes_list();
	$mobile_ad_sizes = _thrive_get_mobile_ad_sizes_list();

	$all_categories   = get_categories();
	$categories_array = array();
	foreach ( $all_categories as $cat ) {
		array_push( $categories_array, array( 'id' => $cat->cat_ID, 'name' => $cat->cat_name ) );
	}
	$all_tags   = get_tags();
	$tags_array = array();
	foreach ( $all_tags as $tag ) {
		array_push( $tags_array, array( 'id' => $tag->term_id, 'name' => $tag->name ) );
	}

	if ( ! is_array( $value_ad_target_by_value ) ) {
		$value_ad_target_by_value = array();
	}
	if ( ! is_array( $value_ad_list ) ) {
		$value_ad_list = array();
	}

	$ads_list = _thrive_get_ads_list_object( $post->ID );

	require( get_template_directory() . "/inc/templates/admin-ad-group-options.php" );
}

function _thrive_save_ad_group_options( $post_data ) {
	remove_action( 'save_post', 'thrive_save_ads_postdata' );

	$post_ID = $post_data['post_ID'];

	$thrive_meta_ad_location          = ( $post_data['thrive_meta_ad_location'] );
	$thrive_meta_ad_location_value    = ( $post_data['thrive_meta_ad_location_value'] );
	$thrive_meta_ad_location_position = ( $post_data['thrive_meta_ad_location_position'] );
	$thrive_meta_ad_alignement        = ( $post_data['thrive_meta_ad_alignement'] );
	$thrive_meta_ad_target_in         = ( $post_data['thrive_meta_ad_target_in'] );
	$thrive_meta_ad_target_by         = ( $post_data['thrive_meta_ad_target_by'] );
	$thrive_meta_ad_target_by_value   = ( $post_data['thrive_meta_ad_target_by_value'] );
	$thrive_meta_ad_list              = ( $post_data['thrive_meta_ad_list'] );
	$thrive_meta_ad_group_status      = ( $post_data['thrive_meta_ad_group_status'] );

	$ad_list = json_decode( stripslashes( $thrive_meta_ad_list ), true );

	if ( ! is_array( $ad_list ) ) {
		$ad_list = array();
	}

	$previous_ads_list = _thrive_get_ads_list_object( $post_ID );
	$temp_ads_ids      = array();

	foreach ( $ad_list as $ad ) {
		$temp_ad = array(
			'post_title'   => $ad['name'],
			'post_parent'  => $post_ID,
			'post_type'    => 'thrive_ad',
			'post_content' => "",
			'post_status'  => 'publish',
			'post_author'  => 1
		);
		if ( isset( $ad['id'] ) && $ad['id'] > 0 ) {
			$temp_ad['ID']  = $ad['id'];
			$temp_ads_ids[] = $ad['id'];
		}

		$ad_id = wp_insert_post( $temp_ad );

		add_post_meta( $ad_id, '_thrive_meta_size', $ad['size'], true ) or
		update_post_meta( $ad_id, '_thrive_meta_size', $ad['size'] );
		add_post_meta( $ad_id, '_thrive_meta_embed_code', $ad['embed_code'], true ) or
		update_post_meta( $ad_id, '_thrive_meta_embed_code', $ad['embed_code'] );
		add_post_meta( $ad_id, '_thrive_meta_mobile', $ad['mobile'], true ) or
		update_post_meta( $ad_id, '_thrive_meta_mobile', $ad['mobile'] );
		add_post_meta( $ad_id, '_thrive_meta_mobile_size', $ad['mobile_size'], true ) or
		update_post_meta( $ad_id, '_thrive_meta_mobile_size', $ad['mobile_size'] );
		add_post_meta( $ad_id, '_thrive_meta_mobile_embed_code', $ad['mobile_embed_code'], true ) or
		update_post_meta( $ad_id, '_thrive_meta_mobile_embed_code', $ad['mobile_embed_code'] );
		add_post_meta( $ad_id, '_thrive_meta_mobile_default', $ad['mobile_default'], true ) or
		update_post_meta( $ad_id, '_thrive_meta_mobile_default', $ad['mobile_default'] );
		add_post_meta( $ad_id, '_thrive_meta_status', $ad['status'], true ) or
		update_post_meta( $ad_id, '_thrive_meta_status', $ad['status'] );
	}
	//echo "<pre>" . print_r($temp_ads_ids, true) . "</pre>";
	//echo "<pre>" . print_r($previous_ads_list, true) . "</pre>"; die;

	foreach ( $previous_ads_list as $myAd ) {
		if ( ! in_array( $myAd['ID'], $temp_ads_ids ) ) {
			wp_delete_post( $myAd['ID'], true );
		}
	}

	add_post_meta( $post_ID, '_thrive_meta_ad_location', $thrive_meta_ad_location, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_location', $thrive_meta_ad_location );
	add_post_meta( $post_ID, '_thrive_meta_ad_location_value', $thrive_meta_ad_location_value, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_location_value', $thrive_meta_ad_location_value );
	add_post_meta( $post_ID, '_thrive_meta_ad_location_position', $thrive_meta_ad_location_position, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_location_position', $thrive_meta_ad_location_position );
	add_post_meta( $post_ID, '_thrive_meta_ad_alignement', $thrive_meta_ad_alignement, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_alignement', $thrive_meta_ad_alignement );
	add_post_meta( $post_ID, '_thrive_meta_ad_target_in', $thrive_meta_ad_target_in, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_target_in', $thrive_meta_ad_target_in );
	add_post_meta( $post_ID, '_thrive_meta_ad_target_by', $thrive_meta_ad_target_by, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_target_by', $thrive_meta_ad_target_by );
	add_post_meta( $post_ID, '_thrive_meta_ad_target_by_value', $thrive_meta_ad_target_by_value, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_target_by_value', $thrive_meta_ad_target_by_value );
	add_post_meta( $post_ID, '_thrive_meta_ad_list', $thrive_meta_ad_list, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_list', $thrive_meta_ad_list );
	add_post_meta( $post_ID, '_thrive_meta_ad_group_status', $thrive_meta_ad_group_status, true ) or
	update_post_meta( $post_ID, '_thrive_meta_ad_group_status', $thrive_meta_ad_group_status );

	add_action( 'save_post', 'thrive_save_ads_postdata' );
}

function _thrive_save_post_ad_group_options( $post_data ) {
	$post_ID                     = $post_data['post_ID'];
	$thrive_ad_group_header      = ( $post_data['thrive_ad_group_header'] );
	$thrive_ad_group_beginning   = ( $post_data['thrive_ad_group_beginning'] );
	$thrive_ad_group_end_of_post = ( $post_data['thrive_ad_group_end_of_post'] );

	add_post_meta( $post_ID, '_thrive_ad_group_header', $thrive_ad_group_header, true ) or
	update_post_meta( $post_ID, '_thrive_ad_group_header', $thrive_ad_group_header );
	add_post_meta( $post_ID, '_thrive_ad_group_beginning', $thrive_ad_group_beginning, true ) or
	update_post_meta( $post_ID, '_thrive_ad_group_beginning', $thrive_ad_group_beginning );
	add_post_meta( $post_ID, '_thrive_ad_group_end_of_post', $thrive_ad_group_end_of_post, true ) or
	update_post_meta( $post_ID, '_thrive_ad_group_end_of_post', $thrive_ad_group_end_of_post );
}

function thrive_check_ad_location_group() {
	if ( ! wp_verify_nonce( $_REQUEST['nonce'], "thrive_check_ad_location_nonce" ) ) {
		echo 0;
		die;
	}

	$check_params = array(
		'ad_location'                => $_POST['ad_location'],
		'ad_target_in'               => $_POST['ad_target_in'],
		'ad_target_by'               => $_POST['ad_target_by'],
		'ad_target_by_value'         => $_POST['ad_target_by_value'],
		'ad_location_value'          => $_POST['ad_location_value'],
		'ad_location_value_position' => $_POST['ad_location_value_position'],
		'exclude_ad_group'           => ( isset( $_POST['current_ad_group'] ) ) ? $_POST['current_ad_group'] : 0
	);

	$groups = _thrive_get_ad_location_group( $check_params );

	if ( ! $groups ) {
		echo THRIVE_CHECK_AD_LOCATION_STATUS_SUCCESS;
		die;
	}
	if ( ( $check_params['ad_location'] != 'widget_buttons' && $check_params['ad_location'] != 'widget_standard' ) && count( $groups ) > 0 ) {
		echo THRIVE_CHECK_AD_LOCATION_STATUS_FAIL;
		die;
	}

	echo THRIVE_CHECK_AD_LOCATION_STATUS_SUCCESS;
	die;
}

function _thrive_get_ad_location_group( $params = array() ) {
	if ( ! isset( $params['ad_location'] ) ) {
		return false;
	}
	if ( ! isset( $params['ad_group_status'] ) ) {
		$params['ad_group_status'] = "active";
	}

	$args = array(
		'post_type'  => 'thrive_ad_group',
		'meta_query' => array(
			'relation' => 'AND',
			array(
				'key'   => '_thrive_meta_ad_location',
				'value' => $params['ad_location'],
			),
			array(
				'key'   => '_thrive_meta_ad_group_status',
				'value' => $params['ad_group_status'],
			)
		)
	);

	if ( isset( $params['ad_target_in'] ) && ! empty( $params['ad_target_in'] ) ) {
		array_push( $args['meta_query'], array(
			'key'     => '_thrive_meta_ad_target_in',
			'value'   => $params['ad_target_in'],
			'compare' => '='
		) );
	}

	if ( isset( $params['exclude_ad_group'] ) ) {
		$args['post__not_in'] = $params['exclude_ad_group'];
	}

	if ( $params['ad_location'] == "in_content" ) {

		if ( isset( $params['ad_location_value'] ) && ! empty( $params['ad_location_value'] ) ) {
			array_push( $args['meta_query'], array(
				'key'     => '_thrive_meta_ad_location_value',
				'value'   => $params['ad_location_value'],
				'compare' => '='
			) );
		}
		if ( isset( $params['ad_location_value_position'] ) && ! empty( $params['ad_location_value_position'] ) &&
		     ( $params['ad_location_value'] == "after_x_paragraphs" || $params['ad_location_value'] == "after_x_images" )
		) {
			array_push( $args['meta_query'], array(
				'key'     => '_thrive_meta_ad_location_position',
				'value'   => $params['ad_location_value_position'],
				'compare' => '='
			) );
		}

		$query = new WP_Query( $args );

		return $query->get_posts();
	}

	if ( $params['ad_location'] == "blog_or_index" ) {
		if ( isset( $params['ad_location_value'] ) && ! empty( $params['ad_location_value'] ) ) {
			array_push( $args['meta_query'], array(
				'key'     => '_thrive_meta_ad_location_value',
				'value'   => $params['ad_location_value'],
				'compare' => '='
			) );
		}

		$query = new WP_Query( $args );
		//$posts = $query->get_posts();
		//echo '<pre>' . print_r($args, true);
		//echo '<pre>' . print_r($posts, true);
		//die;
		return $query->get_posts();
	}


	$query = new WP_Query( $args );

	return $query->get_posts();
}

function _thrive_get_ads_list_object( $adGroupId ) {

	$args = array(
		'post_type'   => 'thrive_ad',
		'post_parent' => $adGroupId
	);

	$query = new WP_Query( $args );
	$ads   = $query->get_posts();

	$temp_array = array();
	foreach ( $ads as $ad ) {
		$temp_item = array(
			'name'              => $ad->post_title,
			'ID'                => $ad->ID,
			'parent'            => $ad->post_parent,
			'size'              => get_post_meta( $ad->ID, '_thrive_meta_size', true ),
			'embed_code'        => get_post_meta( $ad->ID, '_thrive_meta_embed_code', true ),
			'mobile'            => get_post_meta( $ad->ID, '_thrive_meta_mobile', true ),
			'mobile_size'       => get_post_meta( $ad->ID, '_thrive_meta_mobile_size', true ),
			'mobile_embed_code' => get_post_meta( $ad->ID, '_thrive_meta_mobile_embed_code', true ),
			'mobile_default'    => get_post_meta( $ad->ID, '_thrive_meta_mobile_default', true ),
			'status'            => get_post_meta( $ad->ID, '_thrive_meta_status', true ),
			'custom'            => 'off',
			'custom_url'        => '',
			'custom_img'        => ''
		);
		array_push( $temp_array, $temp_item );
	}

	return $temp_array;
}

?>
