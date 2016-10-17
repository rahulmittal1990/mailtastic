<?php
$options           = thrive_get_theme_options();
$sidebar_is_active = _thrive_is_active_sidebar( $options );
?>
<?php get_header(); ?>

	<div class="<?php echo _thrive_get_main_wrapper_class( $options ); ?>">

		<?php if ( $options['sidebar_alignement'] == "left" && $sidebar_is_active ): ?>
			<?php get_sidebar(); ?>
		<?php endif; ?>
		<?php if ( _thrive_is_active_sidebar( $options ) ): ?>
		<div class="bSeCont"><?php endif; ?>

			<section class="<?php echo _thrive_get_main_section_class( $options ); ?>">
				<?php if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ): ?>
					<div class="mry-g"></div>
				<?php endif; ?>
				<?php if ( have_posts() ): ?>
					<?php
					$index             = 0;
					$excludePostsArray = array();
					while ( have_posts() ):
						?>
						<?php the_post(); ?>
						<?php get_template_part( 'content', _thrive_get_post_content_template( $options ) ); ?>

						<?php
						$excludePostsArray[] = get_the_ID();
						if ( $ttBlogAd = _thrive_get_ad_for_position( array(
							'ad_location'       => 'blog_or_index',
							'ad_location_value' => $index + 1,
							'blog_layout'       => $options['blog_layout'],
							'sidebar_is_active' => $sidebar_is_active
						) )
						):
							?>
							<?php if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ): ?><div class="mry-i"><?php endif; ?>
							<div class="add-ind">
								<div class="awr">
									<?php echo $ttBlogAd['embed_code']; ?>
								</div>
							</div>
							<?php if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ): ?></div><?php endif; ?>
						<?php endif; ?>

						<?php if ( ( $options['blog_layout'] == "default" || $options['blog_layout'] == "full_width" )
						           && thrive_check_blog_focus_area( $index + 1 )
					): ?>
						<?php thrive_render_top_focus_area( "between_posts", $index + 1 ); ?>
					<?php endif; ?>

						<?php
						$index ++;
					endwhile;
					?>

					<?php if ( $options['enable_infinite_scroll'] != "on" && $options['blog_layout'] != "masonry_full_width" && $options['blog_layout'] != "masonry_sidebar" ): ?>

						<?php if ( _thrive_check_focus_area_for_pages( "archive", "bottom" ) ): ?>
							<?php if ( strpos( $options['blog_layout'], 'masonry' ) === false && strpos( $options['blog_layout'], 'grid' ) === false ): ?>
								<?php thrive_render_top_focus_area( "bottom", "archive" ); ?>
								<div class="spr"></div>
							<?php endif; ?>
						<?php endif; ?>

						<div class="clear"></div>
						<div class="pgn left">
							<?php thrive_pagination(); ?>
						</div>

						<div class="pgnc right">
							<?php echo _thrive_get_no_of_pages_string(); ?>
						</div>
						<div class="clear"></div>
					<?php endif; ?>

				<?php else: ?>
					<!--No contents-->
				<?php endif; ?>
			</section>

			<?php if ( _thrive_is_active_sidebar( $options ) ): ?></div><?php endif; ?>
		<?php if ( $options['sidebar_alignement'] == "right" && $sidebar_is_active ): ?>
			<?php get_sidebar(); ?>
		<?php endif; ?>

		<?php if ( $options['enable_infinite_scroll'] != "on" && ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ) ): ?>
			<div class="clear"></div>
			<div class="pgn left">
				<?php thrive_pagination(); ?>
			</div>

			<div class="pgnc right">
				<?php echo _thrive_get_no_of_pages_string(); ?>
			</div>
			<div class="clear"></div>
		<?php endif; ?>
	</div>
	<div class="clear"></div>

<?php if ( $options['enable_infinite_scroll'] == "on" ): ?>
	<input type="hidden" id="tt-hidden-exclude-posts" value="<?php echo implode( ",", $excludePostsArray ); ?>"/>
	<?php require 'partials/loading-container.php'; ?>
<?php endif; ?>

<?php get_footer(); ?>