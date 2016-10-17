<table class="form-table postEdit" id="tt-ad-group-options-table">
	<tr>
		<th scope="row">
			<label for=""><?php _e( "Choose Ad Location", 'thrive' ) ?></label>
		</th>
		<td>
			<select name="thrive_meta_ad_location" id="thrive_meta_ad_location">
				<?php foreach ( $ad_locations as $key => $val ): ?>
					<option value="<?php echo $key; ?>"
					        <?php if ( $value_ad_location == $key ): ?>selected<?php endif; ?>><?php echo $val; ?></option>
				<?php endforeach; ?>
			</select>
			<input type="hidden" name="thrive_meta_ad_location_value" id="hidden_thrive_meta_ad_location_value"
			       value=""/>
			<span id="tt-check-location-message"></span>
		</td>
	</tr>
	<tr id="tr_thrive_meta_ad_location_value_in_content" style="display:none;">
		<td><?php _e( "In Content Location", 'thrive' ); ?></td>
		<td>
			<select id="sel_thrive_meta_ad_location_value_in_content">
				<option value="beginning"
				        <?php if ( $value_ad_location_value == "beginning" ): ?>selected<?php endif; ?>><?php _e( "Beginning", 'thrive' ); ?></option>
				<option value="after_x_paragraphs"
				        <?php if ( $value_ad_location_value == "after_x_paragraphs" ): ?>selected<?php endif; ?>><?php _e( "After X Paragraphs", 'thrive' ); ?></option>
				<option value="after_x_images"
				        <?php if ( $value_ad_location_value == "after_x_images" ): ?>selected<?php endif; ?>><?php _e( "After X Images", 'thrive' ); ?></option>
				<option value="end_of_post"
				        <?php if ( $value_ad_location_value == "end_of_post" ): ?>selected<?php endif; ?>><?php _e( "End of post", 'thrive' ); ?></option>
			</select>

			&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<?php _e( "Alignment", 'thrive' ); ?>
			<select id="sel_thrive_ad_alignement" name="thrive_meta_ad_alignement">
				<option value="center"
				        <?php if ( $value_ad_alignement == "center" ): ?>selected<?php endif; ?>><?php _e( "Center", 'thrive' ); ?></option>
				<option value="left"
				        <?php if ( $value_ad_alignement == "left" ): ?>selected<?php endif; ?>><?php _e( "Left", 'thrive' ); ?></option>
				<option value="right"
				        <?php if ( $value_ad_alignement == "right" ): ?>selected<?php endif; ?>><?php _e( "Right", 'thrive' ); ?></option>
			</select>

			<div id="thrive_container_ad_location_position">
				<br/>
				<?php _e( "Show ad after ", 'thrive' ); ?>
				<input type="text" id="txt_thrive_ad_location_position"
				       value="<?php echo $value_ad_location_position; ?>" name="thrive_meta_ad_location_position"
				       style="width: 80px;"/>
				<span id="thrive_container_ad_location_position_paragraph"><?php _e( "paragraphs", 'thrive' ); ?></span>
				<span id="thrive_container_ad_location_position_images"><?php _e( "images", 'thrive' ); ?></span>
			</div>

		</td>
	</tr>
	<tr id="tr_thrive_meta_ad_location_value_blog_view" style="display:none;">
		<td><?php _e( "Show After Post Nr.", 'thrive' ); ?></td>
		<td>
			<select id="sel_thrive_meta_ad_location_value_between_posts">
				<?php for ( $index = 1; $index < 20; $index ++ ): ?>
					<option value="<?php echo $index; ?>"
					        <?php if ( $value_ad_location_value == $index ): ?>selected<?php endif; ?>><?php echo $index; ?></option>
				<?php endfor; ?>
			</select>
		</td>
	</tr>
	<tr class="thrive_ad_targeting_row">
		<th scope="row" colspan="2" style="border-bottom: 0px;">
			<label><b><?php _e( "Ad Targeting", 'thrive' ) ?></b></label><br/>
		</th>
	</tr>
	<tr class="thrive_ad_targeting_row">
		<th scope="row">
			<label for=""><?php _e( "Show in", 'thrive' ) ?></label>
		</th>
		<td>
			<?php foreach ( $ad_targets as $key => $val ): ?>
				<label for=";-<?php echo $key; ?>"><input
						id="tt-meta-ad-target-radio-<?php echo $key; ?>" class="tt-meta-ad-target-radio" type="radio"
						name="thrive_meta_ad_target_in" value="<?php echo $key; ?>"
						<?php if ( $value_ad_target_in == $key ): ?>checked<?php endif ?> /> <?php echo $val; ?></label>
			<?php endforeach; ?>

		</td>
	</tr>
	<tr class="thrive_ad_targeting_row">
		<th scope="row">
			<label for=""><?php _e( "Target by", 'thrive' ) ?></label>
		</th>
		<td>
			<input type="radio" class="tt-meta-ad-target-by-radio" name="thrive_meta_ad_target_by" value="categories"
			       <?php if ( $value_ad_target_by == "categories" ): ?>checked<?php endif ?> /> <?php _e( "Categories", 'thrive' ); ?>
			<input type="radio" class="tt-meta-ad-target-by-radio" name="thrive_meta_ad_target_by" value="tags"
			       <?php if ( $value_ad_target_by != "categories" ): ?>checked<?php endif ?> /> <?php _e( "Tags", 'thrive' ); ?>
			<?php
				$cats = '[';
				if(!empty($value_ad_target_by_value)) {
					foreach($value_ad_target_by_value as $category) {
						$cats .= '"'.$category .'",';
					}
					$cats = substr($cats, 0, -1);
				}
				$cats .= ']';
			?>

			<input type="hidden" name="thrive_meta_ad_target_by_value" id="thrive_hidden_meta_ad_target_by_value"
			       value='<?php echo $cats; ?>'/>
		</td>
	</tr>
	<tr id="tr_thrive_meta_ad_target_by_value_cats" style="display:none;" class="thrive_ad_targeting_row">
		<th scope="row">
			<label for=""><?php _e( "Show in categories", 'thrive' ) ?></label>
		</th>
		<td>
			<select id="sel_thrive_meta_ad_target_by_value_cats" style="width: 220px;" multiple>
				<?php foreach ( $categories_array as $cat ): ?>
					<option value="<?php echo $cat['id']; ?>"
					        <?php if ( in_array( $cat['id'], $value_ad_target_by_value ) && $value_ad_target_by == "categories" ): ?>selected<?php endif; ?>><?php echo $cat['name']; ?></option>
				<?php endforeach; ?>
			</select>
			<br/><span>Leave this blank to show the ad in all categories</span>
		</td>
	</tr>
	<tr id="tr_thrive_meta_ad_target_by_value_tags" style="display:none;" class="thrive_ad_targeting_row">
		<th scope="row">
			<label for=""><?php _e( "Show in tags", 'thrive' ) ?></label>
		</th>
		<td>
			<select id="sel_thrive_meta_ad_target_by_value_tags" style="width: 220px;" multiple>
				<?php foreach ( $tags_array as $tag ): ?>
					<option value="<?php echo $tag['id']; ?>"
					        <?php if ( in_array( $tag['id'], $value_ad_target_by_value ) && $value_ad_target_by == "tags" ): ?>selected<?php endif; ?>><?php echo $tag['name']; ?></option>
				<?php endforeach; ?>
			</select>
			<br/><span>Leave this blank to show the ad in all tags</span>
		</td>
	</tr>
	<tr>
		<th scope="row" colspan="2" style="border-bottom: 0px;">
			<label><b><?php _e( "Ads", 'thrive' ) ?></b></label>
			<input type="button" class="add-new-h2" id="tt-btn-add-new-ad"
			       value="<?php _e( "Add a new ad", 'thrive' ); ?>"/>
			<input type="hidden" id="tt-hidden-ad-list-field" value="" name="thrive_meta_ad_list"/>
		</th>
	</tr>
	<tr>
		<td colspan="2">
			<div id="tt-ad-list-container">

				<?php foreach ( $ads_list as $key => $ad ): ?>
					<div class="tt-ad-item-row">
						<div class="tt-ad-item-header">
							<span class="tt-ad-index-label">Ad</span>
							<span class="tt-ad-name-label">- <?php echo $ad['name']; ?></span>
							<span class="tt-ad-toggle-table">Show/Hide</span>
							<span class="tt-ad-remove-btn"><?php _e( "Remove", 'thrive' ); ?> | </span>
							<span
								class="tt-ad-status-indicator <?php if ( $ad['status'] == "active" ): ?>tt-ad-active<?php endif; ?>"></span>
						</div>
						<table class="tt-ad-item-table" style="display: none;">
							<tr>
								<td><?php _e( "Ad Name", 'thrive' ); ?></td>
								<td>
									<input type="text" class="tt-ad-name" value="<?php echo $ad['name']; ?>"/>
									<input type="hidden" class="tt-ad-id" value="<?php echo $ad['ID']; ?>"/>
								</td>
							</tr>
							<tr>
								<td>
									<?php _e( "Ad Size", 'thrive' ); ?>
									<span class="tooltips"
									      title="Note that the size setting here is only for labelling purposes. Since ads are usually script based, we can't resize them within the theme. Choosing the correct ad size here will help you tell your ads apart and manage them more effectively."></span>
								</td>
								<td>
									<select autocomplete="off" class="tt-ad-size">
										<?php foreach ( $ad_sizes as $size ): ?>
											<option value="<?php echo $size; ?>"
											        <?php if ( $ad['size'] == $size ): ?>selected<?php endif; ?>><?php echo $size; ?></option>
										<?php endforeach; ?>
									</select>
								</td>
							</tr>
							<!--<tr> Some markup for the custom image
                                <td></td>
                                <td>
                                    <input type="radio" name="tt-ad-custom-img-<?php echo $key; ?>" <?php if ( $ad['custom'] != "on" ): ?>checked<?php endif; ?> /> <?php _e( "Embed code", 'thrive' ); ?>
                                    <input type="radio" name="tt-ad-custom-img-<?php echo $key; ?>" <?php if ( $ad['custom'] == "on" ): ?>checked<?php endif; ?> /> <?php _e( "Custom image", 'thrive' ); ?>
                                </td>
                            </tr>
                            <tr class="tt-custom-img-upload-row">
                                <td><?php _e( "Image", 'thrive' ); ?></td>
                                <td>
                                    <input type="text" class="tt-custom-img-txt" value="<?php echo $ad['custom_img']; ?>" />
                                    <input type="button" class="tt-custom-img-btn" value="<?php _e( "Select image", 'thrive' ); ?>" />
                                </td>
                            </tr>
                            <tr class="tt-custom-img-upload-row">
                                <td><?php _e( "Url", 'thrive' ); ?></td>
                                <td>
                                    <input type="text" class="tt-custom-url-txt" value="<?php echo $ad['custom_url']; ?>" />
                                </td>
                            </tr>-->
							<tr class="tt-embed-code-row"
							    <?php if ( $ad['custom'] == "on" ): ?>style="display:none;"<?php endif; ?>>
								<td><?php _e( "Embed Code", 'thrive' ); ?></td>
								<td><textarea class="tt-ad-embed-code"><?php echo $ad['embed_code']; ?></textarea></td>
							</tr>
							<tr class="tt-ad-mobile-option-wrapper">
								<td><?php _e( "Mobile Ad", 'thrive' ); ?></td>
								<td>
									<input type="radio" value="on" class="tt-ad-mobile-ad"
									       name="tt-ad-mobile-ad-<?php echo $key; ?>"
									       <?php if ( $ad['mobile'] == "on" ): ?>checked<?php endif; ?> /> <?php _e( "On", 'thrive' ); ?>
									<input type="radio" value="off" class="tt-ad-mobile-ad"
									       name="tt-ad-mobile-ad-<?php echo $key; ?>"
									       <?php if ( $ad['mobile'] != "on" ): ?>checked<?php endif; ?> /> <?php _e( "Off", 'thrive' ); ?>
								</td>
							</tr>
							<tr class="tt-mobile-ad-size-row tt-ad-mobile-option-wrapper"
							    <?php if ( $ad['mobile'] != "on" ): ?>style="display:none;<?php endif; ?>">
								<td>
									<?php _e( "Mobile Ad Size", 'thrive' ); ?>
									<span class="tooltips"
									      title="Note that the size setting here is only for labelling purposes. Since ads are usually script based, we can't resize them within the theme. Choosing the correct ad size here will help you tell your ads apart and manage them more effectively."></span>
								</td>
								<td>
									<select autocomplete="off" class="tt-mobile-ad-size">
										<?php foreach ( $mobile_ad_sizes as $size ): ?>
											<option value="<?php echo $size; ?>"
											        <?php if ( $ad['mobile_size'] == $size ): ?>selected<?php endif; ?>><?php echo $size; ?></option>
										<?php endforeach; ?>
									</select>
								</td>
							</tr>
							<tr class="tt-mobile-ad-embed-code-row tt-ad-mobile-option-wrapper"
							    <?php if ( $ad['mobile'] != "on" ): ?>style="display:none;<?php endif; ?>">
								<td><?php _e( "Mobile Embed Code", 'thrive' ); ?></td>
								<td><textarea
										class="tt-mobile-ad-embed-code"><?php echo $ad['mobile_embed_code']; ?></textarea>
								</td>
							</tr>
							<tr class="tt-mobile-ad-make-default-row"
							    <?php if ( $ad['mobile'] != "on" ): ?>style="display:none;<?php endif; ?>">
								<td></td>
								<td>
									<input type="checkbox" class="tt-chk-make-default-mobile-ad" value="1"
									       <?php if ( $ad['mobile_default'] == 1 ): ?>checked<?php endif; ?> />
									<?php _e( "Make this the Default Mobile Ad", 'thrive' ); ?>
								</td>
							</tr>
							<tr>
								<td><?php _e( "Status", 'thrive' ); ?></td>
								<td>
									<input type="radio" value="active" class="tt-ad-status"
									       name="tt-ad-status-<?php echo $key; ?>"
									       <?php if ( $ad['status'] == "active" ): ?>checked<?php endif; ?> /> <?php _e( "Active", 'thrive' ); ?>
									<input type="radio" value="inactive" class="tt-ad-status"
									       name="tt-ad-status-<?php echo $key; ?>"
									       <?php if ( $ad['status'] != "active" ): ?>checked<?php endif; ?> /> <?php _e( "Inactive", 'thrive' ); ?>
								</td>
							</tr>
						</table>
					</div>
				<?php endforeach; ?>

			</div>
		</td>
	</tr>

	<tr>
		<th scope="row">
			<label for=""><?php _e( "Ad Group Status", 'thrive' ) ?></label>
		</th>
		<td>
			<input type="radio" class="tt-meta-ad-group-status" name="thrive_meta_ad_group_status" value="active"
			       <?php if ( $value_ad_group_status == "active" ): ?>checked<?php endif ?> /> <?php _e( "Active", 'thrive' ); ?>
			<input type="radio" class="tt-meta-ad-group-status" name="thrive_meta_ad_group_status" value="inactive"
			       <?php if ( $value_ad_group_status != "active" ): ?>checked<?php endif ?> /> <?php _e( "Inactive", 'thrive' ); ?>
		</td>
	</tr>

</table>
<div id="tt-ad-clone-row" class="tt-ad-item-row" style="display: none;">
	<div class="tt-ad-item-header">
		<span class="tt-ad-index-label">Ad</span>
		<span class="tt-ad-toggle-table">Show/Hide</span>
		<span class="tt-ad-remove-btn"><?php _e( "Remove", 'thrive' ); ?> | </span>
		<span class="tt-ad-status-indicator tt-ad-active"></span>
	</div>
	<table class="tt-ad-item-table" style="display: none;">
		<tr>
			<td><?php _e( "Ad Name", 'thrive' ); ?></td>
			<td>
				<input type="text" class="tt-ad-name"/>
				<input type="hidden" class="tt-ad-id" value="0"/>
			</td>
		</tr>
		<tr>
			<td>
				<?php _e( "Ad Size", 'thrive' ); ?>
				<span class="cloneTooltips"
				      title="Note that the size setting here is only for labelling purposes. Since ads are usually script based, we can't resize them within the theme. Choosing the correct ad size here will help you tell your ads apart and manage them more effectively."></span>
			</td>
			<td>
				<select class="tt-ad-size">
					<?php foreach ( $ad_sizes as $size ): ?>
						<option value="<?php echo $size; ?>"><?php echo $size; ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr>
			<td><?php _e( "Embed Code", 'thrive' ); ?></td>
			<td><textarea class="tt-ad-embed-code"></textarea></td>
		</tr>
		<tr class="tt-ad-mobile-option-wrapper">
			<td><?php _e( "Mobile Ad", 'thrive' ); ?></td>
			<td>
				<input type="radio" value="on" class="tt-ad-mobile-ad" name="tt-ad-mobile-ad"
				       checked/> <?php _e( "On", 'thrive' ); ?>
				<input type="radio" value="off" class="tt-ad-mobile-ad"
				       name="tt-ad-mobile-ad"/> <?php _e( "Off", 'thrive' ); ?>
			</td>
		</tr>
		<tr class="tt-mobile-ad-size-row tt-ad-mobile-option-wrapper">
			<td>
				<?php _e( "Mobile Ad Size", 'thrive' ); ?>
				<span class="cloneTooltips"
				      title="Note that the size setting here is only for labelling purposes. Since ads are usually script based, we can't resize them within the theme. Choosing the correct ad size here will help you tell your ads apart and manage them more effectively."></span>
			</td>
			<td>
				<select class="tt-mobile-ad-size">
					<?php foreach ( $ad_sizes as $size ): ?>
						<option value="<?php echo $size; ?>"><?php echo $size; ?></option>
					<?php endforeach; ?>
				</select>
			</td>
		</tr>
		<tr class="tt-mobile-ad-embed-code-row tt-ad-mobile-option-wrapper">
			<td><?php _e( "Mobile Embed Code", 'thrive' ); ?></td>
			<td><textarea class="tt-mobile-ad-embed-code"></textarea></td>
		</tr>
		<tr class="tt-mobile-ad-make-default-row">
			<td></td>
			<td>
				<input type="checkbox" class="tt-chk-make-default-mobile-ad"
				       value="1"/> <?php _e( "Make this the Default Mobile Ad", 'thrive' ); ?>
			</td>
		</tr>
		<tr>
			<td><?php _e( "Status", 'thrive' ); ?></td>
			<td>
				<input type="radio" value="active" class="tt-ad-status" name="tt-ad-status"
				       checked/> <?php _e( "Active", 'thrive' ); ?>
				<input type="radio" value="inactive" class="tt-ad-status"
				       name="thrive_meta_ad_group_status"/> <?php _e( "Inactive", 'thrive' ); ?>
			</td>
		</tr>
	</table>
</div>