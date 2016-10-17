<?php
$options                         = thrive_get_theme_options();
$GLOBALS['thrive_theme_options'] = $options;
if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ) {
	$author_info = _thrive_get_author_info( get_the_author_meta( 'ID' ) );
}
$post_format         = get_post_format();
$post_format_options = _thrive_get_post_format_fields( $post_format, get_the_ID() );
$share_count         = json_decode( get_post_meta( get_the_ID(), 'thrive_share_count', true ) );

$featured_image_data  = thrive_get_post_featured_image( get_the_ID(), "tt_grid_layout" );
$featured_image       = $featured_image_data['image_src'];
$featured_image_alt   = $featured_image_data['image_alt'];
$featured_image_title = $featured_image_data['image_title'];
?>

<article class="art">
	<?php if ( $post_format == "quote" ): ?>

		<div class="bt qu nw"
		     <?php if ( has_post_thumbnail() ): ?>style="background-image: url('<?php echo $featured_image; ?>')"<?php endif; ?>>
			<div class="wrp">
				<a href="<?php the_permalink(); ?>">
					<h2 class="entry-title">
						<?php echo thrive_get_quote_excerpt( $post_format_options['quote_text'] ); ?>
					</h2>

					<?php if ( ! empty( $post_format_options['quote_author'] ) ): ?>
						<p> - <?php echo $post_format_options['quote_author']; ?></p>
					<?php endif; ?>
				</a>
			</div>
		</div>

	<?php else: ?>
		<div class="awr">
			<?php if ( has_post_thumbnail() ): ?>
				<a class="fwit" href="<?php the_permalink(); ?>"
				   style="background-image: url('<?php echo $featured_image; ?>')"></a>
			<?php else: ?>
				<?php $items_list = _thrive_get_slideshow_items_list( get_the_ID() ); ?>
				<?php if ( $items_list && isset( $items_list[0] ) ): ?>
					<a class="fwit" href="<?php the_permalink(); ?>"
					   style="background-image: url('<?php echo $items_list[0]['image']; ?>')">
						<div class="glp">
							<div class="op">
								<span><?php _e( "OPEN GALLERY", 'thrive' ); ?></span>
							</div>
						</div>
					</a>
				<?php else: ?>
					<a class="fwit" href="<?php the_permalink(); ?>"
					   style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/default_featured.jpg')"></a>
				<?php endif; ?>
			<?php endif; ?>

			<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>

			<div class="met">
				<div class="meta left">
					<div class="left mc">
						<?php
						$categories = get_the_category();
						if ( $categories && count( $categories ) > 0 ):
							?>
							<?php foreach ( $categories as $key => $cat ): ?>
							<div class="cat_b left <?php echo _thrive_get_meta_category_class( $cat->term_id ); ?>">
								<a href="<?php echo get_category_link( $cat->term_id ); ?>">
									<?php echo $cat->cat_name; ?>
								</a>
							</div>
						<?php endforeach; ?>
							<div class="clear"></div>
						<?php endif; ?>
						<span>
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
					</div>
					<div class="clear"></div>
				</div>
				<div class="clear"></div>
			</div>
			<div class="trim">
				<?php if ( has_excerpt() ): ?>
					<?php echo _thrive_get_post_text_content_excerpt( get_the_excerpt(), get_the_ID(), 100 ); ?>
				<?php else: ?>
					<?php echo _thrive_get_post_text_content_excerpt( get_the_content(), get_the_ID(), 100 ); ?>
				<?php endif; ?>
			</div>
			<a class="mre"
			   href="<?php the_permalink(); ?>"><?php echo _thrive_get_read_more_text( $options['other_read_more_text'] ); ?>
				&gt;</a>

			<?php
			if ( $options['enable_share_buttons_on_blog'] == "on" ):
				_thrive_render_share_block( array(
					'share_count'          => $share_count,
					'block_position_class' => 'left',
					'layout'               => 'grid',
					'options'              => $options,
					'url'                  => get_permalink( get_the_ID() )
				) );
			endif;
			?>
		</div>
	<?php endif; ?>
</article>