<?php

class Thrive_Ad_Button extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'classname'   => 'widget_thrive_ad_button',
			'description' => __( "Thrive Button Ads", 'thrive' )
		);
		parent::__construct( 'widget_thrive_ad_button', __( 'Thrive Button Ads', 'thrive' ), $widget_ops );

		add_action( 'save_post', array( &$this, 'flush_widget_cache' ) );
		add_action( 'deleted_post', array( &$this, 'flush_widget_cache' ) );
		add_action( 'switch_theme', array( &$this, 'flush_widget_cache' ) );
	}

	function widget( $args, $instance ) {
		if ( ! isset( $args['widget_id'] ) ) {
			$args['widget_id'] = "widget-thrive" . rand( 0, 999 );
		}
		$maxNumber = ( isset( $instance['max_number'] ) && ! empty( $instance['max_number'] ) )
			? (int) $instance['max_number'] : 5;

		$adGroupJson = ( isset( $instance['ad_group'] ) ) ? $instance['ad_group'] : "";
		$adsGroups   = json_decode( $adGroupJson );

		if ( ! $adsGroups || ! is_array( $adsGroups ) ) {
			$adsGroups = array();
		}
		if ( count( $adsGroups ) == 0 ) {
			return;
		}

		$randKey   = rand( 0, count( $adsGroups ) - 1 );
		$adGroupId = $adsGroups[ $randKey ];

		$isAdGroupActive = get_post_meta( $adGroupId, "_thrive_meta_ad_group_status", true );
		if ( $isAdGroupActive != "active" ) {
			return;
		}
		$ads_list = _thrive_get_ads_list_object( $adGroupId );
		shuffle( $ads_list );
		$ads_list = array_slice( $ads_list, 0, $maxNumber );
		if ( ! $ads_list || count( $ads_list ) == 0 ) {
			return;
		}

		$target_in = get_post_meta( $adGroupId, "_thrive_meta_ad_target_in", true );
		$target_by = get_post_meta( $adGroupId, "_thrive_meta_ad_target_by", true );
		$target_value = get_post_meta( $adGroupId, "_thrive_meta_ad_target_by_value", true );

		$target_value == 'null' || $target_value == '[]' ? $target_value = array() : $target_value = explode(',', str_replace(array( '[', ']', '"' ), '', $target_value));

		if( $target_in == 'post' && !empty($target_value)) {
			if(($target_by == "tags" && !has_tag($target_value)) || ($target_by == "categories" && !in_category($target_value)) ) {
				return;
			}
			if(!is_single()) {
				return;
			}
		} elseif ($target_in == 'page' && !is_page() ) {
			return;
		} elseif ($target_in == 'blog' && !is_home() && !is_category() && !is_tag() ) {
			return;
		} elseif ($target_in == 'blog' && !empty($target_value) ) {
			if(($target_by == "tags" && !is_tag($target_value)) || ($target_by == "categories" && !is_category($target_value))) {
				return;
			}
		}
		?>
		<section class="ad-btn" id="<?php echo $this->id; ?>">
			<div class='scn'>
				<?php foreach ( $ads_list as $key => $ad ): ?>
					<div class='ad-item'>
						<?php if ( wp_is_mobile() && $ad['mobile'] == "on" ): ?>
							<?php echo $ad['mobile_embed_code']; ?>
						<?php else: ?>
							<?php echo $ad['embed_code']; ?>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
				<div class="clear"></div>
			</div>
		</section>
		<?php
	}

	function update( $new_instance, $old_instance ) {
		$instance               = $old_instance;
		$instance['ad_group']   = ( $new_instance['ad_group'] );
		$instance['max_number'] = ( $new_instance['max_number'] );
		$this->flush_widget_cache();

		$alloptions = wp_cache_get( 'alloptions', 'options' );
		if ( isset( $alloptions['widget_thrive_ad_button'] ) ) {
			delete_option( 'widget_thrive_ad_button' );
		}

		return $instance;
	}

	function flush_widget_cache() {
		wp_cache_delete( 'widget_thrive_ad_button', 'widget' );
	}

	function form( $instance ) {

		$args = array(
			'post_type'  => 'thrive_ad_group',
			'meta_query' => array(
				array(
					'key'   => '_thrive_meta_ad_group_status',
					'value' => "active",
				)
			)
		);

		$query = new WP_Query( $args );

		$available_ad_groups = $query->get_posts();

		$ad_group  = ( isset( $instance['ad_group'] ) ) ? $instance['ad_group'] : "";
		$adsGroups = json_decode( $ad_group );
		if ( ! $adsGroups || ! is_array( $adsGroups ) ) {
			$adsGroups = array();
		}

		$max_number = ( isset( $instance['max_number'] ) ) ? $instance['max_number'] : 5;
		?>
		<p>
			<label
				for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"><?php _e( 'Select the ad groups', 'thrive' ); ?></label>
			<br/>
			<select multiple class="tt-widget-ad-sel-groups" style="width:200px;">
				<?php foreach ( $available_ad_groups as $key => $group ): ?>
					<option <?php if ( in_array( $group->ID, $adsGroups ) ): ?>selected<?php endif; ?>
					        value="<?php echo $group->ID; ?>"><?php echo $group->post_title; ?></option>
				<?php endforeach; ?>
			</select>
			<input type="hidden" name="<?php echo $this->get_field_name( 'ad_group' ); ?>"
			       class="tt-hidden-sel-ad-groups"
			       id="<?php echo $this->get_field_id( 'ad_group' ); ?>" value=""/>
		</p>

		<p><label
				for="<?php echo esc_attr( $this->get_field_id( 'max_number' ) ); ?>"><?php _e( 'Number of ads to show:', 'thrive' ); ?></label>
			<input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'max_number' ) ); ?>"
			       name="<?php echo esc_attr( $this->get_field_name( 'max_number' ) ); ?>" type="text"
			       value="<?php echo esc_attr( $max_number ); ?>"/></p>

		<?php
	}

}