<div class="tt-home-layout-container">
	<table class="form-table">
		<tr>
			<th scope="row">
				<?php _e( "Select Page", 'thrive' ); ?>
				<span class="tooltips"
				      title="<?php _e( "Select the page where you want the homepage layout to be applied. Typically this is either the same page as your homepage or your blog page.", 'thrive' ); ?>"></span>
			</th>
			<td>
				<select id="tt-sel-homepage-layout-page" name="thrive_theme_options[homepage_layout_page]">
					<option value="0"></option>
					<?php foreach ( $all_pages as $page ): ?>
						<option value="<?php echo $page->ID; ?>"
						        <?php if ( $home_options_page == $page->ID ): ?>selected<?php endif; ?>><?php echo $page->post_title; ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<th scope="row">
				<?php _e( "Add new block", 'thrive' ); ?>
				<span class="tooltips"
				      title="<?php _e( "You can add different blocks that show your posts in different layouts on the homepage. Below, you can change the order of those blocks and see examples of what they look like.", 'thrive' ); ?>"></span>
			</th>
			<td>
				<select id="tt-sel-new-block">
					<option value="ad"><?php _e( "Ad", 'thrive' ); ?></option>
					<option value="category"><?php _e( "Category", 'thrive' ); ?></option>
					<option value="image"><?php _e( "Image", 'thrive' ); ?></option>
					<option value="media"><?php _e( "Media", 'thrive' ); ?></option>
				</select>
				<input type="button" id="tt-btn-add-new-block" value="<?php _e( "Add new block", 'thrive' ); ?>"
				       class="button button-primary"/>
			</td>
		</tr>
	</table>
	<div class="home-layouts-container">
		<ul id="home-layout-featured-menu" class="home-layout-menu">
			<li>
				<span class="tt-menu-item-label">Featured block</span>
				<div class="tt-menu-item-container" style="display:none;">
					<div class="block-heading">
						<span class="label-block left">Display featured block?</span>
						<input type='radio' id='tt-featured-block-radio-on' name='tt-featured-block-display' value='1'
						       class="toggle toggle-left tt-featured-block-display-radio"
						       <?php if ( $home_options_obj && $home_options_obj['display_featured'] == 1 ): ?>checked<?php endif; ?> />
						<label for='tt-featured-block-radio-on' class='btn'>On</label>
						<input type='radio' id='tt-featured-block-radio-off' name='tt-featured-block-display' value='0'
						       class="toggle toggle-right tt-featured-block-display-radio"
						       <?php if ( ( $home_options_obj && $home_options_obj['display_featured'] != 1 ) || ! $home_options_obj ): ?>checked<?php endif; ?> />
						<label for='tt-featured-block-radio-off' class='btn'>Off</label>
						<div class="clear"></div>
					</div>
					<div id="tt-featured-block-custom" style="display: none;">
						<div class="block-heading">
							<span class="label-block left">Enable Custom Posts</span>
							<input type='radio' id='tt-featured-block-custom-radio-on' name='tt-featured-block-custom'
							       value='1'
							       class="toggle toggle-left tt-featured-block-custom-radio"
							       <?php if ( $home_options_obj && $home_options_obj['featured_custom'] == 1 ): ?>checked<?php endif; ?> />
							<label for='tt-featured-block-custom-radio-on' class='btn'>On</label>
							<input type='radio' id='tt-featured-block-custom-radio-off' name='tt-featured-block-custom'
							       value='0'
							       class="toggle toggle-right tt-featured-block-custom-radio"
							       <?php if ( ( $home_options_obj && $home_options_obj['featured_custom'] != 1 ) || ! $home_options_obj ): ?>checked<?php endif; ?> />
							<label for='tt-featured-block-custom-radio-off' class='btn'>Off</label>
							<div class="clear"></div>
						</div>
						<div class="tt-sel-featured-posts-container">
							<select id="tt-sel-featured-posts"  multiple="multiple" style="width: 100%;">
								<?php foreach ( $home_options_obj['selected_featured_custom'] as $option ) { ?>
									<option value="<?php echo $option['id']; ?>" selected="selected"><?php echo $option['text']; ?></option>
								<?php } ?>
							</select>
							<input type="hidden" id="tt-hidden-featured-custom-ids"
							       value='<?php echo json_encode( $home_options_obj['featured_custom_ids'] ); ?>'/>
						</div>
					</div>
				</div>
			</li>
		</ul>

		<ul id="home-layout-blocks-menu" class="home-layout-menu">
			<li id="tt-block-empty" data-type="empty">
				<?php _e( "Add a block here", 'thrive' ); ?>
			</li>
			<?php if ( $home_options_obj ): ?>
				<?php foreach ( $home_options_obj['blocks'] as $block ): ?>
					<li class="tt-block-category" data-type="<?php echo $block['type']; ?>">
						<span
							class="tt-menu-item-label"><?php echo _thrive_get_homepage_layout_block_label( $block['type'] ); ?></span>
						<span class="tt-menu-item-remove">x</span>
						<div class="tt-menu-item-container" style="display:none;">
							<div class="tt-block-options-top">
								<?php if ( $block['type'] == "ad" ): ?>
									<div class="block-heading">
										<div class="tt-block-options-top">
											<span
												class="label-block left"><?php _e( "Ad zone name", 'thrive' ); ?></span>
											<input type="text" class="tt-ad-block-name left"
											       value="<?php echo $block['ad_zone']; ?>"/>
											<div class="clear"></div>
										</div>
									</div>
								<?php else: ?>
									<div class="block-heading">
										<span class="label-block left"><?php _e( "Category", 'thrive' ); ?></span>
										<select class="tt-sel-cat left">
											<?php if ( $block['type'] == "media" || $block['type'] == "image" ): ?>
												<option value="0"><?php _e( "All categories", 'thrive' ); ?></option>
											<?php endif; ?>
											<?php foreach ( $all_categories as $cat ): ?>
												<option value="<?php echo $cat->cat_ID; ?>"
												        <?php if ( isset( $block['category'] ) && $block['category'] == $cat->cat_ID ): ?>selected<?php endif; ?>><?php echo $cat->cat_name; ?></option>
											<?php endforeach; ?>
										</select>
										<div class="clear"></div>
									</div>
									<div class="tt-block-options-top block-heading">
										<span
											class="label-block left"><?php _e( "Title (optional)", 'thrive' ); ?></span>
										<input class="left tt-block-title" type="text"
										       <?php if ( isset( $block['title'] ) && $block['title'] ): ?>value="<?php echo $block['title']; ?>"<?php endif; ?> />
										<div class="clear"></div>
									</div>
								<?php endif; ?>

							</div>
							<?php if ( $block['type'] == "category" ): ?>
								<div class="tt-block-options-preview">
									<img
										src="<?php echo get_template_directory_uri() . "/inc/images/category_block.jpg"; ?>"/>
								</div>
							<?php endif; ?>
							<?php if ( $block['type'] == "media" ): ?>
								<div class="tt-block-options-preview">
									<img
										src="<?php echo get_template_directory_uri() . "/inc/images/media_block.jpg"; ?>"/>
								</div>
							<?php endif; ?>
							<?php if ( $block['type'] == "image" ): ?>
								<div class="tt-block-options-preview">
									<img
										src="<?php echo get_template_directory_uri() . "/inc/images/image_block.jpg"; ?>"/>
								</div>
							<?php endif; ?>
						</div>
					</li>
				<?php endforeach; ?>
			<?php endif; ?>
		</ul>

		<ul id="home-layout-infinite-scroll-menu" class="home-layout-menu">
			<li>
				<span class="tt-menu-item-label"><?php _e( "More Posts", 'thrive' ); ?></span>
				<div class="tt-menu-item-container" style="display:none;">
					<div class="block-heading">
						<span class="label-block left"><?php _e( "Display more posts?", 'thrive' ); ?></span>
						<input type='radio' id='tt-infinite-block-radio-on' name='tt-infinite-block-display' value='1'
						       class="toggle toggle-left tt-infinite-block-display-radio"
						       <?php if ( $home_options_obj && $home_options_obj['display_infinite'] == 1 ): ?>checked<?php endif; ?> />
						<label for='tt-infinite-block-radio-on' class='btn'>On</label>
						<input type='radio' id='tt-infinite-block-radio-off' name='tt-infinite-block-display' value='0'
						       class="toggle toggle-right tt-infinite-block-display-radio"
						       <?php if ( ( $home_options_obj && $home_options_obj['display_infinite'] != 1 ) || ! $home_options_obj ): ?>checked<?php endif; ?> />
						<label for='tt-infinite-block-radio-off' class='btn'>Off</label>
						<div class="clear"></div>
					</div>
					<div class="block-heading">
						<span class="label-block left"><?php _e( "Loading Method", 'thrive' ); ?></span>
						<select class="tt-sel-loading-method left">
							<option value="click"
							        <?php if ( $home_options_obj['display_infinite_method'] == "click" ): ?>selected<?php endif; ?> >
								<?php _e( "Load More Posts on Click", 'thrive' ); ?>
							</option>
							<option value="scroll"
							        <?php if ( $home_options_obj['display_infinite_method'] == "scroll" ): ?>selected<?php endif; ?> >
								<?php _e( "Automatically Load New Posts on Scroll", 'thrive' ); ?>
							</option>
						</select>
						<div class="clear"></div>
					</div>
					<div class="clear">
						<div>
						</div>
			</li>
		</ul>

		<ul id="home-layout-clone-items" style="display:none;">
			<li class="tt-block-category" data-type="category">
				<span class="tt-menu-item-label"><?php _e( "Category block", 'thrive' ); ?></span>
				<span class="tt-menu-item-remove">x</span>
				<div class="tt-menu-item-container" style="display:none;">
					<div class="block-heading">
						<div class="tt-block-options-top">
							<span class="label-block left"><?php _e( "Category", 'thrive' ); ?></span>
							<select class="left">
								<?php foreach ( $all_categories as $cat ): ?>
									<option value="<?php echo $cat->cat_ID; ?>"><?php echo $cat->cat_name; ?></option>
								<?php endforeach; ?>
							</select>
							<div class="clear"></div>
						</div>
						<div class="tt-block-options-top">
							<span class="label-block left"><?php _e( "Title (optional)", 'thrive' ); ?></span>
							<input class="left tt-block-title" type="text"/>
							<div class="clear"></div>
						</div>
					</div>
					<div class="tt-block-options-preview">
						<img src="<?php echo get_template_directory_uri() . "/inc/images/category_block.jpg"; ?>"/>
					</div>
				</div>
			</li>
			<li class="tt-block-media" data-type="media">
				<span class="tt-menu-item-label"><?php _e( "Media block", 'thrive' ); ?></span>
				<span class="tt-menu-item-remove">x</span>
				<div class="tt-menu-item-container" style="display:none;">
					<div class="block-heading">
						<div class="tt-block-options-top">
							<span class="label-block left"><?php _e( "Category", 'thrive' ); ?></span>
							<select class="left">
								<option value="0"><?php _e( "All categories", 'thrive' ); ?></option>
								<?php foreach ( $all_categories as $cat ): ?>
									<option value="<?php echo $cat->cat_ID; ?>"><?php echo $cat->cat_name; ?></option>
								<?php endforeach; ?>
							</select>
							<div class="clear"></div>
						</div>
						<div class="tt-block-options-top">
							<span class="label-block left"><?php _e( "Title (optional)", 'thrive' ); ?></span>
							<input class="left tt-block-title" type="text"/>
							<div class="clear"></div>
						</div>
					</div>
					<div class="tt-block-options-preview">
						<img src="<?php echo get_template_directory_uri() . "/inc/images/media_block.jpg"; ?>"/>
					</div>
				</div>
			</li>
			<li class="tt-block-image" data-type="image">
				<span class="tt-menu-item-label"><?php _e( "Image block", 'thrive' ); ?></span>
				<span class="tt-menu-item-remove">x</span>
				<div class="tt-menu-item-container" style="display:none;">
					<div class="block-heading">
						<div class="tt-block-options-top">
							<span class="label-block left"><?php _e( "Category", 'thrive' ); ?></span>
							<select class="left">
								<option value="0"><?php _e( "All categories", 'thrive' ); ?></option>
								<?php foreach ( $all_categories as $cat ): ?>
									<option value="<?php echo $cat->cat_ID; ?>"><?php echo $cat->cat_name; ?></option>
								<?php endforeach; ?>
							</select>
							<div class="clear"></div>
						</div>
						<div class="tt-block-options-top">
							<span class="label-block left"><?php _e( "Title (optional)", 'thrive' ); ?></span>
							<input class="left tt-block-title" type="text"/>
							<div class="clear"></div>
						</div>
					</div>
					<div class="tt-block-options-preview">
						<img src="<?php echo get_template_directory_uri() . "/inc/images/image_block.jpg"; ?>"/>
					</div>
				</div>
			</li>
			<li class="tt-block-ad" data-type="ad">
				<span class="tt-menu-item-label"><?php _e( "Ad block", 'thrive' ); ?></span>
				<span class="tt-menu-item-remove">x</span>
				<div class="tt-menu-item-container" style="display:none;">
					<div class="block-heading">
						<div class="tt-block-options-top">
							<span class="label-block left"><?php _e( "Ad zone name", 'thrive' ); ?></span>
							<input type="text" class="tt-ad-block-name left" value=""/>
							<div class="clear"></div>
						</div>
					</div>
					<!-- <div class="tt-block-options-preview">
                                         <img src="<?php echo get_template_directory_uri() . "/inc/images/preview_featured.jpg"; ?>" />
                                     </div>-->
				</div>
			</li>
		</ul>
	</div>
</div>

<script>
	//build the select2 helper array for the custom posts
	var _tt_custom_posts = <?php echo json_encode( $home_options_obj['featured_custom_ids'] );?>;
</script>