<?php

class Thrive_Ad_Default extends WP_Widget {

	public function __construct() {
		$widget_ops = array(
			'classname'   => 'widget_thrive_ad_default',
			'description' => __( "Thrive Default Ads", 'thrive' )
		);
		parent::__construct( 'widget_thrive_ad_default', __( 'Thrive Default Ads', 'thrive' ), $widget_ops );

		add_action( 'save_post', array( &$this, 'flush_widget_cache' ) );
		add_action( 'deleted_post', array( &$this, 'flush_widget_cache' ) );
		add_action( 'switch_theme', array( &$this, 'flush_widget_cache' ) );
	}

	function widget( $args, $instance ) {
		if ( ! isset( $args['widget_id'] ) ) {
			$args['widget_id'] = "widget-thrive" . rand( 0, 999 );
		}

		$adGroupJson = ( isset( $instance['ad_group'] ) ) ? $instance['ad_group'] : "";
		$adsGroups   = json_decode( $adGroupJson );
		if ( ! $adsGroups || ! is_array( $adsGroups ) ) {
			$adsGroups = array();
		}
		if ( count( $adsGroups ) == 0 ) {
			return;
		}
		$randKey         = rand( 0, count( $adsGroups ) - 1 );
		$adGroupId       = $adsGroups[ $randKey ];
		$isAdGroupActive = get_post_meta( $adGroupId, "_thrive_meta_ad_group_status", true );
		if ( $isAdGroupActive != "active" ) {
			return;
		}
		$rand_ad = _thrive_get_random_ad_for_group( $adGroupId );

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
		<section id="<?php echo $this->id; ?>">
			<div class="scn">
				<div class="ad-w">
					<?php echo $rand_ad['embed_code']; ?>
				</div>
			</div>
		</section>
		<?php
	}

	function update( $new_instance, $old_instance ) {
		$instance             = $old_instance;
		$instance['ad_group'] = $new_instance['ad_group'];

		$this->flush_widget_cache();

		$alloptions = wp_cache_get( 'alloptions', 'options' );
		if ( isset( $alloptions['widget_thrive_ad_default'] ) ) {
			delete_option( 'widget_thrive_ad_default' );
		}

		return $instance;
	}

	function flush_widget_cache() {
		wp_cache_delete( 'widget_thrive_ad_default', 'widget' );
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
		$ad_group            = ( isset( $instance['ad_group'] ) ) ? $instance['ad_group'] : "";
		$adsGroups           = json_decode( $ad_group );
		if ( ! $adsGroups || ! is_array( $adsGroups ) ) {
			$adsGroups = array();
		}

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
			       id="<?php echo $this->get_field_id( 'ad_group' ); ?>" value='<?php echo $ad_group; ?>'/>
		</p>

		<?php
	}

}