<?php
$options             = thrive_get_options_for_post( get_the_ID() );
$featured_image_data = thrive_get_post_featured_image( get_the_ID(), $options['featured_image_style'] );
?>
<article>
	<?php if ( _thrive_get_item_template( get_the_ID() ) != "Landing Page" ): ?>
	<div class="awr"><?php endif; ?>
		<?php if ( _thrive_get_item_template( get_the_ID() ) != "Landing Page" ): ?>
			<div class="met">
				<div class="full"><!--max 3 -->
					<?php
					if ( $options['enable_social_buttons'] == 1 && strpos( $options['social_display_location'], "posts" ) !== false ):
						_thrive_render_share_block( array(
							'block_position_class' => 'right',
							'layout'               => 'default',
							'options'              => $options,
							'url'                  => get_permalink( get_the_ID() ),
							'share_count'          => json_decode( get_post_meta( get_the_ID(), 'thrive_share_count', true ) )
						) );
					endif;
					?>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
		<?php endif; ?>

		<?php if ( ( $options['featured_image_style'] == "wide" ) && has_post_thumbnail() ): ?>
			<div class="fwit">
				<img src="<?php echo $featured_image_data['image_src'] ?>"
				     alt="<?php echo $featured_image_data['image_alt'] ?>"
				     title="<?php echo $featured_image_data['image_title'] ?>"/>
			</div>
		<?php endif; ?>

		<?php if ( ( $options['featured_image_style'] == "thumbnail" ) && has_post_thumbnail() ): ?>
			<div class="afim">
				<img src="<?php echo $featured_image_data['image_src'] ?>"
				     alt="<?php echo $featured_image_data['image_alt'] ?>"
				     title="<?php echo $featured_image_data['image_title'] ?>"/>
			</div>
		<?php endif; ?>

		<?php if ( $ttAd = _thrive_get_ad_for_position( array(
			'ad_location'       => 'in_content',
			'ad_location_value' => 'beginning'
		) )
		): ?>
			<div class="<?php echo _thrive_get_in_content_ad_container_class( $ttAd['parent'] ); ?>">
				<?php echo $ttAd['embed_code']; ?>
			</div>
		<?php endif; ?>

		<?php the_content(); ?>

		<?php if ( $ttAd = _thrive_get_ad_for_position( array(
			'ad_location'       => 'in_content',
			'ad_location_value' => 'end_of_post'
		) )
		): ?>
			<div class="<?php echo _thrive_get_in_content_ad_container_class( $ttAd['parent'] ); ?>">
				<?php echo $ttAd['embed_code']; ?>
			</div>
			<div class="clear"></div>
		<?php endif; ?>

		<?php
		wp_link_pages( array(
			'before'           => '<p class="ctr pgn">',
			'after'            => '</p>',
			'next_or_number'   => 'next_and_number',
			'nextpagelink'     => __( 'Next', 'thrive' ),
			'previouspagelink' => __( 'Previous', 'thrive' ),
			'echo'             => 1
		) );
		?>

		<?php if ( _thrive_get_item_template( get_the_ID() ) != "Landing Page" ): ?></div><?php endif; ?>
</article>

<?php
if ( thrive_check_bottom_focus_area() ):
	thrive_render_top_focus_area( "bottom" );
	?>
<?php endif; ?>
