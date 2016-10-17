<?php if ( have_posts() ): ?>

	<?php while ( have_posts() ): ?>

		<?php the_post(); ?>
		<?php
		$options           = thrive_get_options_for_post( get_the_ID() );
		$sidebar_is_active = _thrive_is_active_sidebar( $options );
		if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ) {
			$author_info = _thrive_get_author_info( get_the_author_meta( 'ID' ) );
		}
		$post_template          = _thrive_get_item_template( get_the_ID() );
		$post_format            = get_post_format();
		$post_format_options    = _thrive_get_post_format_fields( $post_format, get_the_ID() );
		$featured_image_data    = thrive_get_post_featured_image( get_the_ID(), "tt_featured_wide_full" );
		$featured_image         = $featured_image_data['image_src'];
		$featured_image_alt     = $featured_image_data['image_alt'];
		$featured_image_title   = $featured_image_data['image_title'];
		?>

		<?php
		_thrive_get_header( $post_template );
		?>

		<?php if ( $post_format == "video" && has_post_thumbnail() && $options['featured_image_style'] != "off" ):

			$featured_image_src = wp_get_attachment_image_src( get_post_thumbnail_id( get_the_ID() ), "tt_featured_wide_full" );
			$featured_image_old = ( isset( $featured_image_src[0] ) ) ? $featured_image_src[0] : "";
			?>
			<div class="bt fw vp"
			     style="background-image: url('<?php echo $featured_image; ?>')">
				<img class="dmy" src="<?php echo $featured_image_old; ?>" alt="<?php echo $featured_image_alt; ?>"
				     title="<?php echo $featured_image_title; ?>"/>
				<?php $wistiaVideoCode = ( strpos( $post_format_options['video_code'], "wistia" ) !== false ) ? ' wistia-video-container' : ''; ?>
				<div class="scvps<?php echo $wistiaVideoCode; ?>">
					<div class="vdc lv">
						<div class="ltx">
							<?php if ( $options['show_post_title'] != 0 ): ?>
								<h1><?php the_title(); ?></h1>
							<?php endif; ?>
							<div class="pvb">
								<a></a>
							</div>
						</div>
					</div>
					<div class="vdc lv video-container" style="display:none;">
						<div class="vwr">
							<?php echo $post_format_options['video_code']; ?>
						</div>
					</div>
				</div>
			</div>
		<?php elseif ( $post_format == "audio" && has_post_thumbnail() ): ?>
			<div class="clear"></div>
			<div class="bt fw ap"
			     style="background-image: url('<?php echo $featured_image; ?>')">
				<img class="dmy" src="<?php echo $featured_image; ?>"
				     alt="<?php echo $featured_image_alt; ?>" title="<?php echo $featured_image_title; ?>"/>

				<div class="wrp">
					<div class="wrpt">
						<?php if ( $options['meta_author_name'] != '' || $options['meta_post_category'] != '' || $options['meta_post_date'] != '' || ( $options['enable_social_buttons'] == 1 && strpos( $options['social_display_location'], "posts" ) !== false ) ): ?>
							<div class="met">
								<div class="meta left">
									<?php if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ): ?>
										<div class="left ma">
											<?php echo $author_info['avatar']; ?>
										</div>
									<?php endif; ?>
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
						<?php endif; ?>
					</div>
					<div class="wrpb">
						<?php if ( $options['show_post_title'] != 0 ): ?>
							<h1 class="entry-title"><?php the_title(); ?></h1>
						<?php endif; ?>
						<?php if ( $post_format_options['audio_type'] != "soundcloud" ): ?>
							<?php echo do_shortcode( "[audio src='" . $post_format_options['audio_file'] . "'][/audio]" ); ?>
						<?php else: ?>
							<?php echo $post_format_options['audio_soundcloud_embed_code']; ?>
						<?php endif; ?>
					</div>
				</div>
			</div>
		<?php elseif ( $post_format == "image" && has_post_thumbnail() ):
			?>
			<div class="bt im">
				<img src="<?php echo $featured_image; ?>" alt="<?php echo $featured_image_alt; ?>"
				     title="<?php echo $featured_image_title; ?>"/>
			</div>
		<?php elseif ( $post_format == "quote" ):
			?>
			<div class="bt qu <?php if ( has_post_thumbnail() ): ?>fw<?php else: ?>nw<?php endif; ?>"
			     <?php if ( has_post_thumbnail() ): ?>style="background-image: url('<?php echo $featured_image; ?>')"<?php endif; ?>>
				<?php if ( has_post_thumbnail() ): ?>
					<img class="dmy" src="<?php echo $featured_image; ?>" alt="<?php echo $featured_image_alt; ?>"
					     title="<?php echo $featured_image_title; ?>"/>
				<?php endif; ?>
				<div class="wrp">
					<h1 class="entry-title"><?php echo $post_format_options['quote_text']; ?></h1>

					<?php if ( ! empty( $post_format_options['quote_author'] ) ): ?>
						<p> - <?php echo $post_format_options['quote_author']; ?></p>
					<?php endif; ?>
				</div>
			</div>
		<?php else:
			?>
			<div class="bt dp">
				<div class="wrp">
					<?php if ( $post_template == "Narrow" ): ?>
					<div class="bpd"><?php endif; ?>
						<?php if ( $options['show_post_title'] != 0 ): ?>
							<h1 class="entry-title"><?php the_title(); ?></h1>
						<?php endif; ?>
						<?php if ( $post_template == "Narrow" ): ?></div><?php endif; ?>
				</div>
			</div>
		<?php endif; ?>

		<div class="wrp cnt p-s">
			<?php if ( $options['sidebar_alignement'] == "left" && $sidebar_is_active ): ?>
				<?php get_sidebar(); ?>
			<?php endif; ?>

			<?php if ( $sidebar_is_active ): ?>
			<div class="bSeCont"><?php endif; ?>

				<section
					class="<?php echo _thrive_get_single_post_section_class( $options['sidebar_alignement'], $post_template, $sidebar_is_active ); ?>">

					<article>
						<div class="awr">
							<?php if ( $post_format != "audio" || ! has_post_thumbnail() ): ?>
								<?php if ( $options['meta_author_name'] != '' || $options['meta_post_category'] != '' || $options['meta_post_date'] != '' || ( $options['enable_social_buttons'] == 1 && strpos( $options['social_display_location'], "posts" ) !== false ) ): ?>
									<div class="met">
										<div class="meta left">
											<?php if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ): ?>
												<div class="left ma">
													<?php echo $author_info['avatar']; ?>
												</div>
											<?php endif; ?>
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
										<?php
										if ( display_social_sharing_block( $options, 'top' ) ):
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

								<?php endif; ?>
							<?php endif; ?>

							<?php if ( $post_format == "audio" && ! has_post_thumbnail() ): ?>
								<?php if ( $post_format_options['audio_type'] != "soundcloud" ): ?>
									<?php echo do_shortcode( "[audio src='" . $post_format_options['audio_file'] . "'][/audio]" ); ?>
								<?php else: ?>
									<?php echo $post_format_options['audio_soundcloud_embed_code']; ?>
								<?php endif; ?>
							<?php endif; ?>
							<?php if ( $post_format == "video" && ( ! has_post_thumbnail() || $options['featured_image_style'] == "off" ) && ! empty( $post_format_options['video_code'] ) ): ?>
								<?php $wistiaVideoCode = ( strpos( $post_format_options['video_code'], "wistia" ) !== false ) ? ' wistia-video-container' : ''; ?>
								<div
									class="<?php if ( $post_format_options['video_type'] != "custom" && $post_format_options['video_type'] != "custom_embed" ): ?>rve<?php endif; ?> pv<?php echo $wistiaVideoCode; ?>">
									<div class="ovr"></div>
									<?php echo $post_format_options['video_code']; ?>
								</div>
							<?php endif; ?>

							<?php if ( ( $options['featured_image_style'] == "wide" ) && $post_format != "quote" && $post_format != "audio" && $post_format != "image" && $post_format != "video" && has_post_thumbnail() ): ?>
								<div class="fwit">
									<img
										src="<?php echo _thrive_get_featured_image_src( $options['featured_image_style'], get_the_ID() ); ?>"
										alt="<?php echo $featured_image_alt ?>"
										title="<?php echo $featured_image_title ?>"/>
								</div>
							<?php endif; ?>

							<?php if ( ( $options['featured_image_style'] == "thumbnail" ) && $post_format != "quote" && $post_format != "audio" && $post_format != "image" && $post_format != "video" && has_post_thumbnail() ): ?>
								<div class="afim">
									<img
										src="<?php echo _thrive_get_featured_image_src( $options['featured_image_style'], get_the_ID() ); ?>"
										alt="<?php echo $featured_image_alt ?>"
										title="<?php echo $featured_image_title ?>"/>
								</div>
							<?php endif; ?>

							<?php if ( $options['show_post_title'] != 0 && $post_format == "image" ): ?>
								<h1 class="entry-title"><?php the_title(); ?></h1>
							<?php endif; ?>

							<?php if ( $ttAd = _thrive_get_ad_for_position( array(
								'ad_location'       => 'in_content',
								'ad_location_value' => 'beginning'
							) )
							): ?>
								<div
									class="<?php echo _thrive_get_in_content_ad_container_class( $ttAd['parent'] ); ?>">
									<?php echo $ttAd['embed_code']; ?>
								</div>
							<?php endif; ?>

							<?php the_content(); ?>

							<?php if ( $ttAd = _thrive_get_ad_for_position( array(
								'ad_location'       => 'in_content',
								'ad_location_value' => 'end_of_post'
							) )
							): ?>
								<div
									class="<?php echo _thrive_get_in_content_ad_container_class( $ttAd['parent'] ); ?>">
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
						</div>
					</article>

					<?php _thrive_render_bottom_related_posts( get_the_ID(), $options ); ?>

					<div class="clear"></div>

					<?php if ( isset( $options['bottom_about_author'] ) && $options['bottom_about_author'] == 1 ): ?>
						<?php get_template_part( 'authorbox' ); ?>
					<?php endif; ?>

					<?php
					if ( thrive_check_bottom_focus_area() ):
						thrive_render_top_focus_area( "bottom" );
						?>
					<?php endif; ?>

					<?php if ( ! post_password_required() ) : ?>
						<?php comments_template( '', true ); ?>
					<?php elseif ( ( ! comments_open() ) && get_comments_number() > 0 ): ?>
						<?php comments_template( '/comments-disabled.php' ); ?>
					<?php endif; ?>

					<?php
					if ( isset( $options['bottom_previous_next'] ) && $options['bottom_previous_next'] == 1 && get_permalink( get_adjacent_post( false, '', false ) ) != "" && get_permalink( get_adjacent_post( false, '', true ) ) != "" ):
						?>
						<div>
							<div class="spr"></div>
							<div class="awr ctr pgn">
								<?php $prev_post = get_adjacent_post( false, '', true ); ?>
								<?php if ( $prev_post ) : ?>
									<a class="page-numbers nxt"
									   href='<?php echo get_permalink( get_adjacent_post( false, '', true ) ); ?>'>&larr;<?php _e( "Previous post", 'thrive' ) ?> </a>
								<?php endif; ?>
								<?php $next_post = get_adjacent_post( false, '', false ); ?>
								<?php if ( $next_post ) : ?>
									<a class="page-numbers prv"
									   href='<?php echo get_permalink( get_adjacent_post( false, '', false ) ); ?>'><?php _e( "Next post", 'thrive' ) ?>&rarr;</a>
								<?php endif; ?>

								<div class="clear"></div>
							</div>
						</div>
					<?php endif; ?>
				</section>
				<?php if ( $sidebar_is_active ): ?></div><?php endif; ?>
			<?php if ( $options['sidebar_alignement'] != "left" && $sidebar_is_active ): ?>
				<?php get_sidebar(); ?>
			<?php endif; ?>

			<div class="clear"></div>
			<hr>
			<?php
			if ( $options['enable_infinite_scroll_single'] === "on" ):
				$excludePostsArray = array();
				$related_posts = _thrive_get_single_page_latest_posts( get_the_ID(), 0, array( get_the_ID() ) );
				?>
				<div class="scbg">
					<h4><?php _e( "Latest posts", 'thrive' ); ?></h4>

					<div class="scbgi" id="tt-related-container" data-post-id="<?php echo get_the_ID(); ?>">
						<?php
						foreach ( $related_posts as $post_object ):
							$excludePostsArray[] = $post_object->ID;
							global $post;
							$post = $post_object;
							setup_postdata( $post );
							?>
							<?php get_template_part( 'related-item' ); ?>
							<?php
						endforeach;
						wp_reset_postdata();
						?>

					</div>
				</div>
				<input type="hidden" id="tt-hidden-exclude-posts"
				       value="<?php echo implode( ",", $excludePostsArray ); ?>"/>
			<?php endif; ?>
		</div>
		<?php if ( $options['enable_infinite_scroll_single'] === "on" ): ?>
			<?php get_template_part( 'partials/loading-container.php' ) ?>
		<?php endif; ?>
		<?php if ( $post_format == "video" && isset( $post_format_options['youtube_autoplay'] ) && $post_format_options['youtube_autoplay'] == "1" ): ?>
			<input type="hidden" id="tt-hidden-video-youtube-autoplay" value="1"/>
		<?php endif; ?>
		<?php get_footer(); ?>
	<?php endwhile; ?>
<?php endif; ?>