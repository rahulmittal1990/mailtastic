<?php
if ( $params['categories'] && count( $params['categories'] ) > 0 ):
	?>
	<?php foreach ( $params['categories'] as $key => $cat ): ?>
	<div
		class="cat_b <?php echo $params['position_class']; ?> <?php echo _thrive_get_meta_category_class( $cat->term_id ); ?>">
		<a href="<?php echo get_category_link( $cat->term_id ); ?>">
			<?php echo $cat->cat_name; ?>
		</a>
	</div>
	<?php if ( ! empty( $params['single'] ) )
		break ?>
<?php endforeach; ?>
	<div class="clear"></div>
<?php endif; ?>