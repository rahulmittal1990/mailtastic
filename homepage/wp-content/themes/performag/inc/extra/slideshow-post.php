<?php

add_action( 'add_meta_boxes', 'thrive_add_slideshow_custom_fields' );
add_action( 'save_post', 'thrive_save_slideshow_postdata' );

function thrive_add_slideshow_custom_fields() {

	add_meta_box( 'thrive_slideshow_post_options', __( 'Build the slideshow', 'thrive' ), 'thrive_meta_slideshow_post_options', "thrive_slideshow", "advanced", "high" );
}

function thrive_save_slideshow_postdata( $post_id ) {

	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	if ( ! isset( $_POST['post_type'] ) ) {
		return;
	}

	if ( 'thrive_slideshow' == $_POST['post_type'] ) {
		_thrive_save_slideshow_post_options( $_POST );
	}
}

function thrive_meta_slideshow_post_options( $post ) {
	wp_enqueue_script( "thrive-slideshow-post" );
	wp_enqueue_media();
	wp_nonce_field( plugin_basename( __FILE__ ), 'thrive_noncename' );

	$js_params_array = array( 'id_post' => $post->ID );

	wp_localize_script( 'thrive-slideshow-post', 'ThriveSlideshowOptions', $js_params_array );

	$value_slideshow_side_ad = get_post_meta( $post->ID, '_thrive_meta_slideshow_side_ad', true );
	$value_slideshow_top_ad  = get_post_meta( $post->ID, '_thrive_meta_slideshow_top_ad', true );

	$items_list = _thrive_get_slideshow_items_list( $post->ID );

	$args  = array(
		'post_type'  => 'thrive_ad_group',
		'meta_query' => array(
			array(
				'key'   => '_thrive_meta_ad_group_status',
				'value' => "active",
			)
		)
	);
	$query = new WP_Query( $args );
	//$available_ad_groups = $query->get_posts();
	$available_ad_groups = _thrive_get_ad_location_group( array( 'ad_location' => 'slideshow' ) );

	require( get_template_directory() . "/inc/templates/admin-slideshow-post-options.php" );
}

function _thrive_save_slideshow_post_options( $post_data ) {
	remove_action( 'save_post', 'thrive_save_slideshow_postdata' );

	$post_ID = $post_data['post_ID'];

	$thrive_meta_slideshow_items = ( $post_data['thrive_meta_slideshow_items'] );

	$items_list = json_decode( stripslashes( $thrive_meta_slideshow_items ), true );

	if ( ! is_array( $items_list ) ) {
		$items_list = array();
	}

	$temp_items_ids = array();

	$prev_items_list = _thrive_get_slideshow_items_list( $post_ID );

	foreach ( $items_list as $item ) {
		$temp_item = array(
			'post_title'   => $item['title'],
			'post_parent'  => $post_ID,
			'post_type'    => 'thrive_slide_item',
			'post_content' => $item['description'],
			'post_author'  => 1
		);
		if ( isset( $item['id'] ) && $item['id'] > 0 ) {
			$temp_item['ID']  = $item['id'];
			$temp_items_ids[] = $item['id'];
		}

		$item_id = wp_insert_post( $temp_item );

		add_post_meta( $item_id, '_thrive_meta_image', $item['image'], true ) or
		update_post_meta( $item_id, '_thrive_meta_image', $item['image'] );
		add_post_meta( $item_id, '_thrive_meta_source_url', $item['source_url'], true ) or
		update_post_meta( $item_id, '_thrive_meta_source_url', $item['source_url'] );
		add_post_meta( $item_id, '_thrive_meta_source_text', $item['source_text'], true ) or
		update_post_meta( $item_id, '_thrive_meta_source_text', $item['source_text'] );
	}

	foreach ( $prev_items_list as $item ) {
		if ( ! in_array( $item['ID'], $temp_items_ids ) ) {
			wp_delete_post( $item['ID'], true );
		}
	}

	add_post_meta( $post_ID, '_thrive_meta_slideshow_side_ad', $post_data['thrive_meta_slideshow_side_ad'], true ) or
	update_post_meta( $post_ID, '_thrive_meta_slideshow_side_ad', $post_data['thrive_meta_slideshow_side_ad'] );
	add_post_meta( $post_ID, '_thrive_meta_slideshow_top_ad', $post_data['thrive_meta_slideshow_top_ad'], true ) or
	update_post_meta( $post_ID, '_thrive_meta_slideshow_top_ad', $post_data['thrive_meta_slideshow_top_ad'] );

	add_action( 'save_post', 'thrive_save_slideshow_postdata' );
}

function _thrive_get_slideshow_items_list( $parentId, $limit = 500 ) {

	$args = array(
		'post_type'      => 'thrive_slide_item',
		'post_parent'    => $parentId,
		'posts_per_page' => $limit,
		'orderby'        => 'date',
		'order'          => 'ASC',
		'post_status'    => array( 'pending', 'draft', 'future', 'publish', 'private' )
	);

	$query = new WP_Query( $args );
	$items = $query->get_posts();

	$temp_array = array();
	foreach ( $items as $item ) {
		$temp_item = array(
			'title'       => $item->post_title,
			'ID'          => $item->ID,
			'parent'      => $item->post_parent,
			'description' => $item->post_content,
			'image'       => get_post_meta( $item->ID, '_thrive_meta_image', true ),
			'source_url'  => get_post_meta( $item->ID, '_thrive_meta_source_url', true ),
			'source_text' => get_post_meta( $item->ID, '_thrive_meta_source_text', true )
		);
		array_push( $temp_array, $temp_item );
	}

	return $temp_array;
}

function _thrive_get_latest_slideshow_posts( $excludePosts = array(), $limit = 3 ) {
	$args       = array(
		'post_type'      => 'thrive_slideshow',
		'post__not_in'   => $excludePosts,
		'posts_per_page' => $limit
	);
	$posts_list = get_posts( $args );
	$temp_list  = array();
	foreach ( $posts_list as $tempPost ) {
		$tempPost               = (array) $tempPost;
		$slides                 = _thrive_get_slideshow_items_list( $tempPost['ID'], 1 );
		$tempPost['image']      = ( $slides && isset( $slides[0]['image'] ) && ! empty( $slides[0]['image'] ) ) ? $slides[0]['image'] : get_template_directory_uri() . "/images/default_featured.jpg";
		$tempPost['categories'] = get_the_category( $tempPost['ID'] );
		$tempPost['date']       = get_the_date( $tempPost['post_date'] );

		$user_info               = get_userdata( $tempPost['post_author'] );
		$tempPost['author_name'] = ( ! empty( $user_info->first_name ) || ! empty( $user_info->last_name ) ) ? $user_info->first_name . " " . $user_info->last_name : $user_info->display_name;


		array_push( $temp_list, $tempPost );
	}

	return $temp_list;
}

?>