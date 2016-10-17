<?php
$focus_area_class = $current_attrs['_thrive_meta_focus_color'][0];
$btn_class        = ( empty( $current_attrs['_thrive_meta_focus_button_color'][0] ) ) ? "blue" : strtolower( $current_attrs['_thrive_meta_focus_button_color'][0] );
$optin_form_class = "f1f";
if ( $optinFieldsArray ) {
	$optin_form_class = ( count( $optinFieldsArray ) <= 4 ) ? "f" . count( $optinFieldsArray ) . "f" : "f14";
}
?>

<div class="far fab f4 <?php echo $focus_area_class; ?>">
	<h3><?php echo $current_attrs['_thrive_meta_focus_heading_text'][0]; ?></h3>

	<div class="frm <?php echo $optin_form_class; ?> clearfix">
		<form action="<?php echo $optinFormAction; ?>" method="<?php echo $optinFormMethod ?>">

			<?php echo $optinHiddenInputs; ?>

			<?php echo $optinNotVisibleInputs; ?>

			<?php if ( $optinFieldsArray ): ?>
				<?php foreach ( $optinFieldsArray as $name_attr => $field_label ): ?>
					<?php echo Thrive_OptIn::getInstance()->getInputHtml( $name_attr, $field_label ); ?>
				<?php endforeach; ?>
			<?php endif; ?>

			<div class="btn medium <?php echo $btn_class; ?>">
				<input type="submit" value="<?php echo $current_attrs['_thrive_meta_focus_button_text'][0]; ?>"/>
			</div>
			<div class="clear"></div>
		</form>
	</div>
	<div class="clear"></div>
	<?php if ( ! empty( $current_attrs['_thrive_meta_focus_image'][0] ) ): ?>
		<img src="<?php echo $current_attrs['_thrive_meta_focus_image'][0]; ?>" alt="" class="fa-i">
	<?php endif; ?>
	<p><?php echo nl2br( do_shortcode( $current_attrs['_thrive_meta_focus_subheading_text'][0] ) ); ?></p>

	<div class="clear"></div>

</div>