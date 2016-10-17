<?php
$block_options     = _thrive_get_homepage_layout_obj();
$excludePostsArray = array();
$options           = thrive_get_theme_options();
?>

<?php get_header(); ?>
	<div class="wrp cnt hml">

		<?php
		if ( $block_options['display_featured'] == 1 ):
			$featuredPosts = _thrive_get_homepage_featured_block_posts( 4, $block_options );
			?>
			<div class="bp">
				<?php
				for ( $index = 0; $index < 3; $index ++ ):
					if ( isset( $featuredPosts[ $index ] ) && isset( $featuredPosts[ $index ]['ID'] ) ):
						$category = get_category( $featuredPosts[ $index ]['catID'] );
						$featured_image_data = thrive_get_post_featured_image( $featuredPosts[ $index ]['ID'], "tt_featured_block_large", true );
						$featured_image = $featured_image_data['image_src'];
						?>
						<div class="bp-c <?php echo _thrive_get_homepage_featured_block_container_class( $index ); ?>">
							<div class="dm-ct">
								<a class="dm-ip"
								   style="background-image: url('<?php echo $featured_image; ?>')"
								   href="<?php echo get_permalink( $featuredPosts[ $index ]['ID'] ) ?>">
								</a>
								<article class="har">
									<div
										class="hatt <?php echo _thrive_get_homepage_featured_block_category_class( $category->cat_ID ); ?>">
										<div
											class="cat_b <?php echo _thrive_get_meta_category_class( $category->cat_ID ); ?>">
											<a href="<?php echo get_category_link( $category->term_id ); ?>">
												<?php echo $category->cat_name; ?>
											</a>
										</div>
										<h2 class="entry-title">
											<a href="<?php echo get_permalink( $featuredPosts[ $index ]['ID'] ) ?>">
												<?php
												echo $featuredPosts[ $index ]['post_title'];
												$excludePostsArray[] = $featuredPosts[ $index ]['ID'];
												?>
											</a>
										</h2>
									</div>
								</article>
							</div>
							<?php
							if ( $index == 2 && isset( $featuredPosts[ $index + 1 ] ) ):
								$index ++;
								$category            = get_category( $featuredPosts[ $index ]['catID'] );
								$featured_image_data = thrive_get_post_featured_image( $featuredPosts[ $index ]['ID'], "tt_featured_block_large", true );
								$featured_image      = $featured_image_data['image_src'];
								?>
								<div class="dm-ct">
									<a class="dm-ip"
									   style="background-image: url('<?php echo $featured_image; ?>')"
									   href="<?php echo get_permalink( $featuredPosts[ $index ]['ID'] ) ?>">
									</a>
									<article class="har"
									>
										<div
											class="hatt <?php echo _thrive_get_homepage_featured_block_category_class( $category->cat_ID ); ?>">
											<div
												class="cat_b <?php echo _thrive_get_meta_category_class( $category->cat_ID ); ?>">
												<a href="<?php echo get_category_link( $category->term_id ); ?>">
													<?php echo $category->cat_name; ?>
												</a>
											</div>
											<h2 class="entry-title">
												<a href="<?php echo get_permalink( $featuredPosts[ $index ]['ID'] ) ?>">
													<?php
													echo $featuredPosts[ $index ]['post_title'];
													$excludePostsArray[] = $featuredPosts[ $index ]['ID'];
													?>
												</a>
											</h2>
										</div>
									</article>
								</div>
							<?php endif; ?>
						</div>
						<?php
					endif;
				endfor;
				?>
				<div class="clear"></div>
			</div>
		<?php endif; ?>
		<section class="bSe fullWidth">
			<?php
			foreach ( $block_options['blocks'] as $block ):
				$blockContents = _thrive_get_homepage_block_contents( $block, $excludePostsArray );
				?>
				<?php if ( $block['type'] == "category" && $blockContents ): ?>

				<div class="hcb">
					<?php if ( isset( $block['title'] ) && ! empty( $block['title'] ) ): ?>
						<h3><?php echo $block['title']; ?></h3>
					<?php endif; ?>
					<?php
					if ( isset( $blockContents[0] ) ):
						$share_count = json_decode( get_post_meta( $blockContents[0]->ID, 'thrive_share_count', true ) );
						if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ) {
							$author_info = _thrive_get_author_info( $blockContents[0]->post_author );
						}
						?>
						<div class="hcb-c hcb-m">
							<article>
								<div class="awr">
									<?php
									if ( $options['enable_social_buttons'] == 1 ):
										_thrive_render_share_block( array(
											'share_count'          => $share_count,
											'post_id'              => $blockContents[0]->ID,
											'post_title'           => $blockContents[0]->post_title,
											'block_position_class' => 'left',
											'layout'               => 'grid',
											'options'              => $options,
											'url'                  => get_permalink( $blockContents[0]->ID )
										) );
									endif;
									?>
									<?php
									$featured_image_data = thrive_get_post_featured_image( $blockContents[0]->ID, "tt_featured_block_large", true );
									$featured_image      = $featured_image_data['image_src'];
									?>
									<a href="<?php echo get_permalink( $blockContents[0]->ID ) ?>" class="fwit"
									   style="background-image: url('<?php echo $featured_image; ?>')"></a>

									<h2 class="entry-title">
										<a href="<?php echo get_permalink( $blockContents[0]->ID ) ?>">
											<?php echo $blockContents[0]->post_title; ?>
										</a>
									</h2>

									<div class="met">
										<div class="meta left">
											<div class="left mc">
												<?php if ( isset( $options['meta_post_category'] ) && $options['meta_post_category'] == 1 ): ?>
													<?php
													_thrive_render_category_meta_block( array(
														'categories'     => get_the_category( $blockContents[0]->ID ),
														'position_class' => 'left'
													) );
													?>
												<?php endif; ?>
												<div class="clear"></div>
                                                <span> 
                                                    <?php if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ): ?>
	                                                    <?php _e( "By", 'thrive' ); ?>
	                                                    <a href="<?php echo $author_info['posts_url']; ?>">
		                                                    <?php echo $author_info['display_name']; ?>
	                                                    </a>
                                                    <?php endif; ?>
                                                </span>
											</div>
											<div class="clear"></div>
										</div>
										<div class="clear"></div>
									</div>
									<p>
										<?php echo _thrive_get_post_content_excerpt( $blockContents[0]->post_content, $blockContents[0]->ID, _thrive_get_homepage_post_excerpt_length(), true, ' [...]' ); ?>
									</p>
								</div>
							</article>
						</div>
						<?php
						$excludePostsArray[] = $blockContents[0]->ID;
					endif;
					?>

					<div class="hcb-c hcb-s">
						<?php
						for ( $i = 1; $i <= 3; $i ++ ):
							if ( isset( $blockContents[ $i ] ) && $blockContents[ $i ] ):
								$share_count = json_decode( get_post_meta( $blockContents[ $i ]->ID, 'thrive_share_count', true ) );
								if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ) {
									$author_info = _thrive_get_author_info( $blockContents[ $i ]->post_author );
								}
								?>
								<article>
									<div class="awr">
										<?php
										if ( $options['enable_social_buttons'] == 1 ):
											_thrive_render_share_block( array(
												'share_count'          => $share_count,
												'post_id'              => $blockContents[ $i ]->ID,
												'post_title'           => $blockContents[ $i ]->post_title,
												'block_position_class' => 'left',
												'layout'               => 'grid',
												'options'              => $options,
												'url'                  => get_permalink( $blockContents[ $i ]->ID )
											) );
										endif;
										?>
										<?php
										$featured_image_data = thrive_get_post_featured_image( $blockContents[ $i ]->ID, "tt_featured_block_small", true );
										$featured_image      = $featured_image_data['image_src'];
										?>
										<a class="fwit" href="<?php echo get_permalink( $blockContents[ $i ]->ID ) ?>"
										   style="background-image: url('<?php echo $featured_image; ?>')"></a>

										<div class="hcb-si">
											<h2 class="entry-title">
												<a href="<?php echo get_permalink( $blockContents[ $i ]->ID ) ?>">
													<?php echo $blockContents[ $i ]->post_title; ?>
												</a>
											</h2>

											<div class="met">
												<div class="meta left">
													<div class="left mc">
														<?php if ( isset( $options['meta_post_category'] ) && $options['meta_post_category'] == 1 ): ?>
															<?php
															_thrive_render_category_meta_block( array(
																'categories'     => get_the_category( $blockContents[ $i ]->ID ),
																'position_class' => 'left'
															) );
															?>
														<?php endif; ?>
														<div class="clear"></div>
                                                        <span> 
                                                            <?php if ( isset( $options['meta_author_name'] ) && $options['meta_author_name'] == 1 ): ?>
	                                                            <?php _e( "By", 'thrive' ); ?>
	                                                            <a href="<?php echo $author_info['posts_url']; ?>">
		                                                            <?php echo $author_info['display_name']; ?>
	                                                            </a>
                                                            <?php endif; ?>
                                                        </span>
													</div>
													<div class="clear"></div>
												</div>
												<div class="clear"></div>
											</div>
										</div>
										<div class="clear"></div>
									</div>
								</article>
								<?php
								$excludePostsArray[] = $blockContents[ $i ]->ID;
							endif;
						endfor;
						?>
					</div>
				</div>


			<?php endif; ?>

				<?php if ( $block['type'] == "image" && $blockContents ): ?>
				<?php if ( isset( $block['title'] ) && ! empty( $block['title'] ) ): ?>
					<h3><?php echo $block['title']; ?></h3>
				<?php endif; ?>
				<?php
				$featured_image_data = thrive_get_post_featured_image( $blockContents->ID, "large", true );
				$featured_image      = $featured_image_data['image_src'];
				?>
				<div class="dm-ct">
					<a class="dm-ip" href="<?php echo get_permalink( $blockContents->ID ); ?>"
					   style="background-image: url('<?php echo $featured_image; ?>')"></a>
					<article class="har bpb">
						<div class="hatt">
							<?php if ( isset( $options['meta_post_category'] ) && $options['meta_post_category'] == 1 ): ?>
								<?php _thrive_render_category_meta_block( array(
									'categories' => get_the_category( $blockContents->ID ),
									'single'     => true
								) ); ?>
							<?php endif; ?>
							<h2 class="entry-title">
								<a href="<?php echo get_permalink( $blockContents->ID ); ?>">
									<?php echo $blockContents->post_title; ?>
								</a>
							</h2>
						</div>
					</article>
				</div>
				<?php
				$excludePostsArray[] = $blockContents->ID;
			endif;
				?>

				<?php if ( $block['type'] == "media" && $blockContents ): ?>
				<?php if ( isset( $block['title'] ) && ! empty( $block['title'] ) ): ?>
					<h3><?php echo $block['title']; ?></h3>
				<?php endif; ?>
				<?php
				$featured_image_data = thrive_get_post_featured_image( $blockContents->ID, "large", true );
				$featured_image      = $featured_image_data['image_src'];
				?>
				<div class="dm-ct">
					<a class="dm-ip" href="<?php echo get_permalink( $blockContents->ID ); ?>"
					   style="background-image: url('<?php echo $featured_image; ?>')"></a>
					<article class="har bpb vap">
						<div class="hatt">
							<?php if ( isset( $options['meta_post_category'] ) && $options['meta_post_category'] == 1 ): ?>
								<?php _thrive_render_category_meta_block( array( 'categories' => get_the_category( $blockContents->ID ) ) ); ?>
							<?php endif; ?>
							<div class="movb"></div>
							<h2 class="entry-title">
								<a href="<?php echo get_permalink( $blockContents->ID ); ?>">
									<?php echo $blockContents->post_title; ?>
								</a>
							</h2>
						</div>
					</article>
				</div>

				<?php
				$excludePostsArray[] = $blockContents->ID;
			endif;
				?>
				<?php if ( $block['type'] == "ad" ):
				?>
				<?php if ( $ttBlogAd = _thrive_get_ad_for_position( array(
				'ad_target_in' => "",
				'ad_location'  => _thrive_get_custom_ad_zone_key( $block['ad_zone'] )
			) )
			): ?>
				<div><?php echo $ttBlogAd['embed_code']; ?></div>
			<?php endif; ?>
			<?php endif; ?>

			<?php endforeach; ?>

			<?php
			if ( $block_options['display_infinite'] == 1 ):
				$latestPosts = _thrive_get_homepage_latest( 0, $excludePostsArray );
				?>

				<div class="scbg">
					<h4><?php _e( "Latest posts", 'thrive' ); ?></h4>

					<div
						class="scbgi <?php if ( $block_options['display_infinite_method'] == "scroll" ): ?>tt-latest-posts-container<?php endif; ?>"
						id="tt-latest-container">
						<?php foreach ( $latestPosts as $post_object ):
							$excludePostsArray[] = $post_object->ID;
							global $post;
							$post = $post_object;
							setup_postdata( $post );
							get_template_part( 'related-item' );
						endforeach;
						wp_reset_postdata();
						?>
					</div>
					<div class="clear"></div>
				</div>
				<input type="hidden" id="tt-hidden-exclude-posts"
				       value="<?php echo implode( ",", $excludePostsArray ); ?>"/>
				<?php require 'partials/loading-container.php'; ?>
				<?php if ( $block_options['display_infinite_method'] == "click" ): ?>
				<div id="tt-show-more-posts">
					<div class="wrp">
						<div class="mrb">
                            <span>
        <?php _e( "Show more posts", 'thrive' ); ?>
                            </span>
						</div>
						<br/>
					</div>
				</div>
			<?php endif; ?>
			<?php endif; ?>
		</section>
	</div>
<?php get_footer(); ?>