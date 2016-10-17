<?php
$options = thrive_get_theme_options();
if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ) {
	$author_info = _thrive_get_author_info( get_the_author_meta( 'ID' ) );
}
$share_count = json_decode( get_post_meta( get_the_ID(), 'thrive_share_count', true ) );
?>

<article>
	<div class="awr">
		<?php if ( has_post_thumbnail() ): ?>
			<a href="<?php the_permalink(); ?>" class="idxi"
			   style="background-image: url('<?php echo _thrive_get_featured_image_src( null, get_the_ID(), "large" ); ?>');">
			</a>
		<?php else: ?>
			<?php $items_list = _thrive_get_slideshow_items_list( get_the_ID() ); ?>
			<?php if ( $items_list && isset( $items_list[0] ) ): ?>
				<a href="<?php the_permalink(); ?>" class="idxi"
				   style="background-image: url('<?php echo $items_list[0]['image']; ?>');">
					<div class="glp">
						<div class="op">
							<span><?php _e( "OPEN GALLERY", 'thrive' ); ?></span>
						</div>
					</div>
				</a>
			<?php endif; ?>
		<?php endif; ?>
		<div
			class="idxt <?php if ( ! has_post_thumbnail() && get_post_type( get_the_ID() ) != 'thrive_slideshow' ): ?>idxt-n<?php endif; ?>">

			<?php
			if ( $options['enable_share_buttons_on_blog'] == "on" ) {
				_thrive_render_share_block( array(
					'share_count'          => $share_count,
					'block_position_class' => 'right',
					'layout'               => 'grid',
					'options'              => $options,
					'url'                  => get_permalink( get_the_ID() )
				) );
			}
			?>

			<div class="clear"></div>
			<h1 class="entry-title">
				<a href="<?php the_permalink(); ?>">
					<?php the_title(); ?>
				</a>
			</h1>
            <span class="ixmt">
                <?php if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ): ?>
	                <?php _e( "By", 'thrive' ); ?>
	                <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
		                <?php echo $author_info['display_name']; ?>
	                </a>
                <?php endif; ?>
	            <?php if ( $options['meta_post_date'] == 1 && $options['meta_author_name'] == 1 ): ?>/<?php endif; ?>
	            <?php if ( isset( $options['meta_post_date'] ) && $options['meta_post_date'] == 1 ): ?>
		            <?php if ( $options['relative_time'] == 1 ): ?>
			            <?php echo thrive_human_time( get_the_time( 'U' ) ); ?>
		            <?php else: ?>
			            <?php echo get_the_date(); ?>
		            <?php endif; ?>
	            <?php endif; ?>
            </span>
			<?php the_excerpt(); ?>
		</div>
		<div class="clear"></div>
	</div>
</article>