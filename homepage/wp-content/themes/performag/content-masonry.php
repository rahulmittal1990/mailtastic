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
<div class="mry-i">

	<?php if ( $post_format != "image" || ( $post_format == "image" && ! has_post_thumbnail() ) ): ?>
		<article>
			<?php if ( $post_format == "quote" ): ?>

				<div class="bt qu nw"
				     <?php if ( has_post_thumbnail() ): ?>style="background-image: url('<?php echo $featured_image; ?>')"<?php endif; ?>>
					<div class="wrp">
						<a href="<?php the_permalink(); ?>">
							<h2 class="entry-title"><?php echo $post_format_options['quote_text']; ?></h2>

							<?php if ( ! empty( $post_format_options['quote_author'] ) ): ?>
								<p> - <?php echo $post_format_options['quote_author']; ?></p>
							<?php endif; ?>
						</a>
					</div>
				</div>

			<?php else: ?>
				<div class="awr">
					<?php
					if ( $post_format == "video" ):
						$featured_img_url = ( has_post_thumbnail() ) ? $featured_image : get_template_directory_uri() . '/images/default_featured.jpg';
						?>
						<?php $wistiaVideoCode = ( strpos( $post_format_options['video_code'], "wistia" ) !== false ) ? ' wistia-video-container' : ''; ?>
						<div class="rve pv vf <?php echo $wistiaVideoCode; ?>"
						     style="background-image: url('<?php echo $featured_img_url; ?>')">
							<a class="vpld" href="<?php the_permalink(); ?>"></a>
							<div class="mov">
								<?php if ( isset( $options['meta_post_category'] ) && $options['meta_post_category'] == 1 ): ?>
									<?php
									$categories = get_the_category();
									if ( $categories && count( $categories ) > 0 ):
										?>
										<?php foreach ( $categories as $key => $cat ): ?>
										<div
											class="cat_b <?php echo _thrive_get_meta_category_class( $cat->term_id ); ?>">
											<a href="<?php echo get_category_link( $cat->term_id ); ?>">
												<?php echo $cat->cat_name; ?>
											</a>
										</div>
									<?php endforeach; ?>
										<div class="clear"></div>
									<?php endif; ?>
								<?php endif; ?>

								<div class="movb ovp"></div>
								<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
								</h2>
							</div>
							<div class="movi" style="display:none;">
								<?php echo $post_format_options['video_code']; ?>
							</div>
						</div>
					<?php else: ?>
						<?php if ( has_post_thumbnail() ): ?>
							<a class="fwit" href="<?php the_permalink(); ?>"
							   style="background-image: url('<?php echo $featured_image; ?>')"></a>
						<?php else: ?>
							<?php $items_list = _thrive_get_slideshow_items_list( get_the_ID() ); ?>
							<?php if ( $items_list && isset( $items_list[0] ) ): ?>
								<a href="<?php the_permalink(); ?>">
									<div class="glp">
										<div class="op">
											<span><?php _e( "OPEN GALLERY", 'thrive' ); ?></span>
										</div>
										<img src="<?php echo $items_list[0]['image']; ?>" alt=""/>
									</div>
								</a>
							<?php endif; ?>
						<?php endif; ?>
						<?php if ( $post_format == "audio" ): ?>
							<?php if ( $post_format_options['audio_type'] != "soundcloud" ): ?>
								<?php echo do_shortcode( "[audio src='" . $post_format_options['audio_file'] . "'][/audio]" ); ?>
							<?php else: ?>
								<?php echo $post_format_options['audio_soundcloud_embed_code']; ?>
							<?php endif; ?>
						<?php endif; ?>
						<h2 class="entry-title"><a href="<?php the_permalink(); ?>"><?php echo the_title(); ?></a></h2>
						<div class="met">
							<div class="meta left">
								<div class="left mc">
									<?php if ( isset( $options['meta_post_category'] ) && $options['meta_post_category'] == 1 ): ?>
										<?php
										$categories = get_the_category();
										if ( $categories && count( $categories ) > 0 ):
											?>
											<?php foreach ( $categories as $key => $cat ): ?>
											<div
												class="cat_b left <?php echo _thrive_get_meta_category_class( $cat->term_id ); ?>">
												<a href="<?php echo get_category_link( $cat->term_id ); ?>">
													<?php echo $cat->cat_name; ?>
												</a>
											</div>
										<?php endforeach; ?>
											<div class="clear"></div>
										<?php endif; ?>
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
						<p>
							<?php if ( has_excerpt() ): ?>
								<?php echo _thrive_get_post_text_content_excerpt( get_the_excerpt(), get_the_ID() ); ?>
							<?php else: ?>
								<?php echo _thrive_get_post_text_content_excerpt( get_the_content(), get_the_ID() ); ?>
							<?php endif; ?>
						</p>
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

					<?php endif; ?>
				</div>
			<?php endif; ?>
		</article>
	<?php else: ?>
		<article class="har"
		         style="background-image: url('<?php echo _thrive_get_featured_image_src( $options['featured_image_style'], get_the_ID() ); ?>')">
			<div class="hatt tt_red">
				<?php if ( isset( $options['meta_post_category'] ) && $options['meta_post_category'] == 1 ): ?>
					<?php
					$categories = get_the_category();
					if ( $categories && count( $categories ) > 0 ):
						?>
						<?php foreach ( $categories as $key => $cat ): ?>
						<div class="cat_b <?php echo _thrive_get_meta_category_class( $cat->term_id ); ?>">
							<a href="<?php echo get_category_link( $cat->term_id ); ?>">
								<?php echo $cat->cat_name; ?>
							</a>
						</div>
					<?php endforeach; ?>
					<?php endif; ?>
				<?php endif; ?>
				<h2 class="entry-title">
					<a href="<?php the_permalink(); ?>">
						<?php echo the_title(); ?>
					</a>
				</h2>
			</div>
		</article>
	<?php endif; ?>
</div>