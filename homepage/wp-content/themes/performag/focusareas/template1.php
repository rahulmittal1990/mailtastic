<?php
$focus_area_class = $current_attrs['_thrive_meta_focus_color'][0];
$section_position = ( $position == "bottom" ) ? "fab" : "fat";
?>

<div class="far fat f2 <?php echo $focus_area_class; ?>">
	<div class="wrp">
		<h4>
			<?php echo $current_attrs['_thrive_meta_focus_heading_text'][0]; ?>
			<span>»</span>
		</h4>
		<div class="frm">
			<form class="frm" action="<?php echo $optinFormAction; ?>" method="<?php echo $optinFormMethod ?>">

				<?php echo $optinHiddenInputs; ?>

				<?php echo $optinNotVisibleInputs; ?>

				<?php if ( $optinFieldsArray ): ?>
					<?php foreach ( $optinFieldsArray as $name_attr => $field_label ): ?>
						<?php echo Thrive_OptIn::getInstance()->getInputHtml( $name_attr, $field_label ); ?>
					<?php endforeach; ?>
				<?php endif; ?>

				<div class="fob">
					<input type="submit" value="<?php echo $current_attrs['_thrive_meta_focus_button_text'][0]; ?>"
					       class=""/>
				</div>
			</form>
		</div>
	</div>
</div>