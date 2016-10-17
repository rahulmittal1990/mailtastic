<?php
$focus_area_class   = $current_attrs['_thrive_meta_focus_color'][0];
$wrapper_class      = ( $position == "top" ) ? "wrp" : "wrp lfa";
$section_position   = ( $position == "bottom" ) ? "farb" : "";
$btn_class          = ( empty( $current_attrs['_thrive_meta_focus_button_color'][0] ) ) ? "blue" : strtolower( $current_attrs['_thrive_meta_focus_button_color'][0] );
$action_link_target = ( $current_attrs['_thrive_meta_focus_new_tab'][0] == 1 ) ? "_blank" : "_self";
?>

<div class="far fab f3 <?php echo $focus_area_class; ?>">
	<h3><?php echo $current_attrs['_thrive_meta_focus_heading_text'][0]; ?></h3>

	<a href="<?php echo $current_attrs['_thrive_meta_focus_button_link'][0]; ?>" class="fob right"
	   target="<?php echo $action_link_target; ?>">
		<span><?php echo $current_attrs['_thrive_meta_focus_button_text'][0]; ?></span>
	</a>
	<?php if ( ! empty( $current_attrs['_thrive_meta_focus_image'][0] ) ): ?>
		<img src="<?php echo $current_attrs['_thrive_meta_focus_image'][0]; ?>" alt="" class="fa-i">
	<?php endif; ?>
	<p>
		<?php echo nl2br( do_shortcode( $current_attrs['_thrive_meta_focus_subheading_text'][0] ) ); ?>
	</p>
	<div class="clear"></div>
</div>