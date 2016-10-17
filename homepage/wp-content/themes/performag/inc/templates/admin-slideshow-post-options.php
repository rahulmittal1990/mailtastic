<input type="button" value="<?php _e( "Add a new slide", 'thrive' ); ?>" class="add-new-h2" id="tt-btn-add-new-slide"/>
<br/><br/>
<input type="hidden" name="thrive_meta_slideshow_items" value="" id="thrive_hidden_meta_slideshow_items"/>

<div id="tt-item-list-container">

	<?php foreach ( $items_list as $key => $item ): ?>

		<div class="tt-slide-item-row">
			<div class="tt-slide-item-header">
				<span class="tt-item-index-label">Slide #</span>
				<span class="tt-item-toggle-table">Show/Hide</span>
				<span class="tt-item-remove-btn"><?php _e( "Remove", 'thrive' ); ?> | </span>
			</div>
			<table class="tt-slide-item-table" style="display: none;">
				<tr>
					<td><?php _e( "Title", 'thrive' ); ?></td>
					<td>
						<input type="text" class="tt-item-title" value="<?php echo $item['title']; ?>"/> <br/>
						<input type="hidden" class="tt-item-id" value="<?php echo $item['ID']; ?>"/>
					</td>
				</tr>
				<tr class="tt-custom-img-upload-row">
					<td><?php _e( "Image", 'thrive' ); ?></td>
					<td>
						<input type="text" class="tt-item-img" value="<?php echo $item['image']; ?>"/>
						<input type="button" class="thrive_options pure-button upload tt-item-img-btn"
						       value="<?php _e( "Select image", 'thrive' ); ?>"/>
						<div class="tt-item-preview-img">
							<img src="<?php echo $item['image']; ?>"/>
						</div>
						<br/>
					</td>
				</tr>
				<tr>
					<td><?php _e( "Description", 'thrive' ); ?></td>
					<td>
						<textarea class="tt-item-description"><?php echo $item['description']; ?></textarea> <br/>
					</td>
				</tr>
				<tr>
					<td><?php _e( "Source URL", 'thrive' ); ?></td>
					<td>
						<input type="text" class="tt-item-source-url" value="<?php echo $item['source_url']; ?>"/> <br/>
					</td>
				</tr>
				<tr>
					<td><?php _e( "Source Text", 'thrive' ); ?></td>
					<td>
						<input type="text" class="tt-item-source-text" value="<?php echo $item['source_text']; ?>"/>
						<br/>
					</td>
				</tr>
			</table>
		</div>

	<?php endforeach; ?>

</div>

<div id="tt-item-clone-row" class="tt-slide-item-row" style="display: none;">
	<div class="tt-slide-item-header">
		<span class="tt-item-index-label">Slide #</span>
		<span class="tt-item-toggle-table">Show/Hide</span>
		<span class="tt-item-remove-btn"><?php _e( "Remove", 'thrive' ); ?> | </span>
	</div>
	<table class="tt-slide-item-table" style="display: none;">
		<tr>
			<td><?php _e( "Title", 'thrive' ); ?></td>
			<td>
				<input type="text" class="tt-item-title"/> <br/>
				<input type="hidden" class="tt-item-id" value="0"/>
			</td>
		</tr>
		<tr class="tt-custom-img-upload-row">
			<td><?php _e( "Image", 'thrive' ); ?></td>
			<td>
				<input type="text" class="tt-item-img" value=""/>
				<input type="button" class="thrive_options pure-button upload tt-item-img-btn"
				       value="<?php _e( "Select image", 'thrive' ); ?>"/>
				<div class="tt-item-preview-img">
					<img src=""/>
				</div>
				<br/>
			</td>
		</tr>
		<tr>
			<td><?php _e( "Description", 'thrive' ); ?></td>
			<td>
				<textarea class="tt-item-description"></textarea> <br/>
			</td>
		</tr>
		<tr>
			<td><?php _e( "Source URL", 'thrive' ); ?></td>
			<td>
				<input type="text" class="tt-item-source-url"/> <br/>
			</td>
		</tr>
		<tr>
			<td><?php _e( "Source Text", 'thrive' ); ?></td>
			<td>
				<input type="text" class="tt-item-source-text"/> <br/>
			</td>
		</tr>
	</table>
</div>


<table class="form-table postEdit">
	<tr>
		<th scope="row">
			<label for="thrive_sel_meta_slideshow_side_ad"> <?php _e( "Side Ad Group", 'thrive' ); ?></label>
		</th>
		<td>
			<select id='thrive_sel_meta_slideshow_side_ad' name='thrive_meta_slideshow_side_ad'>
				<option value="-1">None</option>
				<?php foreach ( $available_ad_groups as $adGroup ): ?>
					<option <?php if ( $adGroup->ID == $value_slideshow_side_ad ): ?>selected<?php endif; ?>
					        value="<?php echo $adGroup->ID; ?>"><?php echo $adGroup->post_title; ?></option>
				<?php endforeach ?>
			</select>
		</td>
	</tr>
	<tr>
		<th scope="row">
			<label for="thrive_sel_meta_slideshow_top_ad"> <?php _e( "Top Ad Group", 'thrive' ); ?></label>
		</th>
		<td>
			<select id='thrive_sel_meta_slideshow_top_ad' name='thrive_meta_slideshow_top_ad'>
				<option value="-1">None</option>
				<?php foreach ( $available_ad_groups as $adGroup ): ?>
					<option <?php if ( $adGroup->ID == $value_slideshow_top_ad ): ?>selected<?php endif; ?>
					        value="<?php echo $adGroup->ID; ?>"><?php echo $adGroup->post_title; ?></option>
				<?php endforeach ?>
			</select>
		</td>
	</tr>
</table>
