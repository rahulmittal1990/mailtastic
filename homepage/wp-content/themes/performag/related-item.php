<?php
$author_info = _thrive_get_author_info( get_the_author_meta( 'ID' ) );
$options     = thrive_get_theme_options();
?>
<div class="scc left">
	<a class="rmich" href="<?php the_permalink(); ?>">
		<?php if ( has_post_thumbnail() ): ?>
			<?php
			$featured_image_data = thrive_get_post_featured_image( $post->ID, "tt_related_posts" );
			$featured_image      = $featured_image_data['image_src'];
			?>
			<div class="rimc" style="background-image: url('<?php echo $featured_image; ?>')"></div>
		<?php else: ?>
			<div class="rimc"
			     style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/default_related_posts.jpg')"></div>
		<?php endif; ?>
	</a>

	<div class="scbt">
		<?php if ( $options['meta_post_category'] == 1 ): ?>
			<?php
			$categories = get_the_category();
			$cat        = isset( $categories[0] ) ? $categories[0] : null;
			?>
			<?php if ( $cat ): ?>
				<div class="cat_b <?php echo _thrive_get_meta_category_class( $cat->term_id ); ?>">
					<a href="<?php echo get_category_link( $cat->term_id ); ?>"><?php echo $cat->cat_name; ?></a>
				</div>
			<?php endif; ?>
		<?php endif; ?>

		<h5><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h5>
        <span class="scd">
            <?php if ( $options['meta_post_date'] == 1 ): ?>
	            <?php echo get_the_date(); ?>
            <?php endif; ?>
	        <?php if ( $options['meta_author_name'] == 1 && $options['meta_post_date'] == 1 ): ?>
		        /
	        <?php endif; ?>
	        <?php if ( $options['meta_author_name'] == 1 ): ?>
		        <?php _e( "By", 'thrive' ); ?>
		        <a href="<?php echo esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ); ?>">
			        <?php echo $author_info['display_name']; ?>
		        </a>
	        <?php endif; ?>
        </span>
	</div>
</div>