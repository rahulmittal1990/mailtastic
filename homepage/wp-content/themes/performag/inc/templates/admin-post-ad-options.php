<table class="form-table postEdit">
	<tr>
		<th scope="row">
			<label> <?php _e( "Header Ad", 'thrive' ); ?></label>
		</th>
		<td>
			<select name="thrive_ad_group_header">
				<option value="default"><?php _e( "Default", 'thrive' ); ?></option>
				<?php foreach ( $available_ad_groups as $ad_group ): ?>
					<option value="<?php echo $ad_group->ID; ?>"
					        <?php if ( $value_ad_group_header == $ad_group->ID ): ?>selected<?php endif; ?>>
						<?php echo $ad_group->post_title; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</td>
	</tr>
	<tr>
		<th scope="row">
			<label> <?php _e( "Top of Post", 'thrive' ); ?></label>
		</th>
		<td>
			<select name="thrive_ad_group_beginning">
				<option value="default"><?php _e( "Default", 'thrive' ); ?></option>
				<?php foreach ( $available_ad_groups as $ad_group ): ?>
					<option value="<?php echo $ad_group->ID; ?>"
					        <?php if ( $value_ad_group_beginning == $ad_group->ID ): ?>selected<?php endif; ?>>
						<?php echo $ad_group->post_title; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</td>
	</tr>
	<tr>
		<th scope="row">
			<label> <?php _e( "End of Post", 'thrive' ); ?></label>
		</th>
		<td>
			<select name="thrive_ad_group_end_of_post">
				<option value="default"><?php _e( "Default", 'thrive' ); ?></option>
				<?php foreach ( $available_ad_groups as $ad_group ): ?>
					<option value="<?php echo $ad_group->ID; ?>"
					        <?php if ( $value_ad_group_end_of_post == $ad_group->ID ): ?>selected<?php endif; ?>>
						<?php echo $ad_group->post_title; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</td>
	</tr>
</table> 