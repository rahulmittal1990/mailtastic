<?php if ( have_posts() ): ?>

	<?php while ( have_posts() ): ?>

		<?php the_post(); ?>
		<?php
		$options           = thrive_get_options_for_post( get_the_ID() );
		$sidebar_is_active = _thrive_is_active_sidebar( $options );
		if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ) {
			$author_info = _thrive_get_author_info( get_the_author_meta( 'ID' ) );
		}
		$post_template     = _thrive_get_item_template( get_the_ID() );
		$items_list        = _thrive_get_slideshow_items_list( get_the_ID() );
		$latest_slideshows = _thrive_get_latest_slideshow_posts( array( get_the_ID() ) );
		?>

		<?php
		if ( $post_template != "Landing Page" ) {
			get_header();
		} else {
			get_header( "landing" );
		}
		?>

		<div class="bt dp">
			<div class="wrp">
				<?php if ( $post_template == "Narrow" ): ?>
				<div class="bpd"><?php endif; ?>
					<h1 class="entry-title"><?php the_title(); ?></h1>
					<?php if ( $post_template == "Narrow" ): ?></div><?php endif; ?>
			</div>
		</div>

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
												<?php foreach ( $categories as $cat ): ?>
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

							<!-- slideshow lightbox-->
							<div class="go">
								<div id="gcs">
									<?php _e( "Close", 'thrive' ); ?>
								</div>
								<!--Handle the display of the ads-->
								<?php if ( $ttTopAds = _thrive_get_ads_list_object( get_post_meta( get_the_ID(), '_thrive_meta_slideshow_top_ad', true ) ) ): ?>
									<?php if ( count( $ttTopAds ) > 0 ): ?>
										<div class="tadd" data-count="<?php echo count( $ttTopAds ); ?>" data-index="0">
											<?php foreach ( $ttTopAds as $key => $tempAd ): ?>
												<div class="tt-top-ad-container"
												     id="tt-top-ad-container-<?php echo $key; ?>"
												     <?php if ( $key > 0 ): ?>style="display:none;<?php endif; ?>">
													<?php echo $tempAd['embed_code']; ?>
												</div>
											<?php endforeach; ?>
										</div>
									<?php endif; ?>
								<?php endif; ?>
								<div class="gwi">
									<div class="gw">
										<div class="gs wrp" data-count="<?php echo count( $items_list ) + 1; ?>"
										     data-index="0">
											<div class="st-d">
												<img class="st-i" src="<?php
												if ( $items_list && isset( $items_list[0] ) ): echo $items_list[0]['image'];
												endif;
												?>">
												<div class="rpdmy">
													<div class="scbg">
														<div class="scbgi">
															<h4><?php _e( "Latest slideshows", 'thrive' ); ?></h4>
															<?php foreach ( $latest_slideshows as $mySlide ): ?>
																<div class="scc left">
																	<a class="rmich"
																	   href="<?php echo get_permalink( $mySlide['ID'] ); ?>">
																		<div class="rimc"
																		     style="background-image: url('<?php echo $mySlide['image']; ?>')"></div>
																	</a>
																	<div class="scbt">
																		<?php if ( $mySlide['categories'] && count( $mySlide['categories'] ) > 0 ): ?>
																			<?php foreach ( $mySlide['categories'] as $cat ): ?>
																				<div
																					class="cat_b <?php echo _thrive_get_meta_category_class( $cat->term_id ); ?>">
																					<a href="<?php echo get_category_link( $cat->term_id ); ?>">
																						<?php echo $cat->cat_name; ?>
																					</a>
																				</div>
																			<?php endforeach; ?>
																			<div class="clear"></div>
																		<?php endif; ?>
																		<h5>
																			<a href="<?php echo get_permalink( $mySlide['ID'] ); ?>">
																				<?php echo $mySlide['post_title']; ?>
																			</a>
																		</h5>
																		<span
																			class="scd"><?php echo $mySlide['date']; ?>
																			/ <?php _e( "By", 'thrive' ); ?> <?php echo $mySlide['author_name']; ?></span>
																	</div>
																</div>
															<?php endforeach; ?>
															<div class="clear"></div>
														</div>
													</div>
												</div>
											</div>
											<div class="gdmy">
												<?php foreach ( $items_list as $key => $item ): ?>
													<div id="gi-<?php echo $key; ?>"
													     data-title="<?php echo str_replace( '"', "'", $item['title'] ); ?>"
													     data-caption="<?php echo str_replace( '"', "'", $item['description'] ); ?>"
													     data-src="<?php echo $item['image']; ?>"
													     data-index="<?php echo $key; ?>">
													</div>
												<?php endforeach; ?>
											</div>
										</div>
										<?php if ( $ttSideAds = _thrive_get_ads_list_object( get_post_meta( get_the_ID(), '_thrive_meta_slideshow_side_ad', true ) ) ): ?>
											<?php if ( count( $ttSideAds ) > 0 ): ?>
												<div class="radd" data-count="<?php echo count( $ttSideAds ); ?>"
												     data-index="0">
													<?php foreach ( $ttSideAds as $key => $tempAd ): ?>
														<div class="tt-side-ad-container"
														     id="tt-side-ad-container-<?php echo $key; ?>"
														     <?php if ( $key > 0 ): ?>style="display:none;<?php endif; ?>">
															<?php echo $tempAd['embed_code']; ?>
														</div>
													<?php endforeach; ?>
												</div>
											<?php endif; ?>
										<?php endif; ?>
									</div>
									<div class="gno wrp">
										<div class="gn">
											<div class="ssb">
												<div class="sb">
													<?php _e( "Share", 'thrive' ); ?>
												</div>
												<?php if ( $options['enable_social_buttons'] == 1 ): ?>
													<ul>
														<?php if ( $options['enable_facebook_button'] == 1 ): ?>
															<li class="ss fb"
															    onclick="return ThriveApp.open_share_popup('//www.facebook.com/sharer/sharer.php?u=<?php the_permalink() ?>', 545, 433);">
																<a href=""></a></li>
														<?php endif; ?>
														<?php if ( $options['enable_google_button'] == 1 ): ?>
															<li class="ss g_plus"
															    onclick="return ThriveApp.open_share_popup('https://plus.google.com/share?url=<?php the_permalink() ?>', 545, 433);">
																<a href=""></a></li>
														<?php endif; ?>
														<?php if ( $options['enable_linkedin_button'] == 1 ): ?>
															<li class="ss linkedin"
															    onclick="return ThriveApp.open_share_popup('https://www.linkedin.com/cws/share?url=<?php the_permalink() ?>', 545, 433);">
																<a href=""></a></li>
														<?php endif; ?>
														<?php if ( $options['enable_pinterest_button'] == 1 ): ?>
															<li class="ss prinster"
															    onclick="return ThriveApp.open_share_popup('//pinterest.com/pin/create/button/?url=<?php the_permalink() ?>; ?>&media=<?php the_permalink() ?>', 545, 433);">
																<a href=""></a></li>
														<?php endif; ?>
														<?php if ( $options['enable_twitter_button'] == 1 ): ?>
															<li class="ss twitter"
															    onclick="return ThriveApp.open_share_popup('https://twitter.com/share?text=<?php the_title(); ?>:&url=<?php the_permalink() ?>', 545, 433);">
																<a href=""></a></li>
														<?php endif; ?>
													</ul>
												<?php endif; ?>
											</div>
											<div class="ssn">
												<span id="gpr" class="dsb"><?php _e( "Prev", 'thrive' ); ?></span>
												<span id="gnx"><?php _e( "Next", 'thrive' ); ?></span>
												<div class="clear"></div>
											</div>
											<div class="clear"></div>
										</div>
									</div>
								</div>
								<div class="gc">
									<div class="wrp">
										<div class="git">
											<h2 id="g-tt"><?php
												if ( $items_list && isset( $items_list[0] ) ): echo $items_list[0]['title'];
												endif;
												?></h2>
											<p id="g-cp"><?php
												if ( $items_list && isset( $items_list[0] ) ): echo $items_list[0]['description'];
												endif;
												?></p>
										</div>
										<div class="gic">
											<h2><?php _e( "Image sources", 'thrive' ); ?></h2>
											<?php if ( count( $items_list ) > 0 ): ?>
												<ul>
													<?php foreach ( $items_list as $key => $item ): ?>
														<?php if ( ! empty( $item['source_url'] ) ): ?>
															<li><a href="<?php echo $item['source_url']; ?>"
															       target="_blank"><?php echo $item['source_text']; ?></a>
															</li>
														<?php endif; ?>
													<?php endforeach; ?>
												</ul>
											<?php endif; ?>
										</div>
									</div>
								</div>
							</div>
							<?php if ( $items_list && isset( $items_list[0] ) ): ?>
								<div class="glp">
									<div class="op">
										<span><?php _e( "OPEN GALLERY", 'thrive' ); ?></span>
									</div>
									<img src="<?php echo $items_list[0]['image']; ?>" alt=""/>
								</div>
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
									class="<?php echo _thrive_get_in_content_ad_container_class( $ttAd['parent'], "end_of_post" ); ?>">
									<?php echo $ttAd['embed_code']; ?>
								</div>
							<?php endif; ?>

						</div>
					</article>

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

				</section>
				<?php if ( $sidebar_is_active ): ?></div><?php endif; ?>
			<?php if ( $options['sidebar_alignement'] == "right" && $sidebar_is_active ): ?>
				<?php get_sidebar(); ?>
			<?php endif; ?>

			<div class="clear"></div>
			<?php
			if ( $options['enable_infinite_scroll_single'] == "on" ):
				$excludePostsArray = array();
				$related_posts = _thrive_get_single_page_latest_posts( get_the_ID(), 0, array( get_the_ID() ) );
				?>
				<div class="scbg">
					<h4><?php _e( "Related posts", 'thrive' ); ?></h4>

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

		<?php if ( $options['enable_infinite_scroll_single'] == "on" ): ?>
			<?php require 'partials/loading-container.php'; ?>
		<?php endif; ?>

		<?php get_footer(); ?>

	<?php endwhile; ?>
<?php endif; ?>