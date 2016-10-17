<?php
$focus_area_class   = $current_attrs['_thrive_meta_focus_color'][0];
$action_link_target = ( $current_attrs['_thrive_meta_focus_new_tab'][0] == 1 ) ? "_blank" : "_self";
?>


<div class="far fat f1 <?php echo $focus_area_class; ?>">
	<a href="<?php echo $current_attrs['_thrive_meta_focus_button_link'][0]; ?>"
	   target="<?php echo $action_link_target; ?>">
		<div class="wrp">
			<h4>
				<?php echo $current_attrs['_thrive_meta_focus_heading_text'][0]; ?>
				<span>»</span>
			</h4>
		</div>
	</a>
</div>