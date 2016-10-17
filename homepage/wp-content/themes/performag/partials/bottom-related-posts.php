<div class="scbg">
	<h5><?php echo $options['related_posts_title'] ?></h5>

	<div>
		<?php foreach ( $relatedPosts as $p ): ?>

			<div class="scc left">
				<?php if ( $options['related_posts_images'] == 1 ): ?>
					<a class="rmich" href="<?php echo get_permalink( $p->ID ); ?>">
						<?php if ( has_post_thumbnail( $p->ID ) ): ?>
							<?php
							$featured_image_data = thrive_get_post_featured_image( $p->ID, "tt_related_posts" );
							$featured_image      = $featured_image_data['image_src'];
							?>
							<div class="rimc" style="background-image: url('<?php echo $featured_image; ?>')"></div>
						<?php else: ?>
							<div class="rimc"
							     style="background-image: url('<?php echo get_template_directory_uri(); ?>/images/default_related_posts.jpg')"></div>
						<?php endif; ?>
					</a>
				<?php endif; ?>
				<div class="scbt">
					<h5>
						<a href="<?php echo get_permalink( $p->ID ); ?>">
							<?php echo get_the_title( $p->ID ) ?>
						</a>
					</h5>
                    <span class="scd">
                        <?php if ( $options['meta_post_date'] == 1 ): ?>
	                        <?php echo get_the_time( 'M d, Y', $p->ID ); ?>
                        <?php endif; ?>
	                    <?php if ( $options['meta_author_name'] == 1 && $options['meta_post_date'] == 1 ): ?>
		                    /
	                    <?php endif; ?>
	                    <?php if ( $options['meta_author_name'] == 1 ): ?>
		                    <?php _e( "By", 'thrive' ); ?>
		                    <a href="<?php echo esc_url( get_author_posts_url( $p->post_author ) ); ?>">
			                    <?php echo get_the_author_meta( 'display_name', $p->post_author ); ?>
		                    </a>
	                    <?php endif; ?>
                    </span>
				</div>
			</div>
		<?php endforeach; ?>
		<?php if ( empty( $relatedPosts ) ): ?>
			<span><?php echo $options['related_no_text'] ?></span>
		<?php endif; ?>
	</div>
</div>

