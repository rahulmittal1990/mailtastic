<?php
$options           = thrive_get_theme_options();
$sidebar_is_active = _thrive_is_active_sidebar( $options );
$exclude_woo_pages = array(
	intval( get_option( 'woocommerce_cart_page_id' ) ),
	intval( get_option( 'woocommerce_checkout_page_id' ) ),
	intval( get_option( 'woocommerce_pay_page_id' ) ),
	intval( get_option( 'woocommerce_thanks_page_id' ) ),
	intval( get_option( 'woocommerce_myaccount_page_id' ) ),
	intval( get_option( 'woocommerce_edit_address_page_id' ) ),
	intval( get_option( 'woocommerce_view_order_page_id' ) ),
	intval( get_option( 'woocommerce_terms_page_id' ) )
);
?>
<?php get_header(); ?>

	<div class="<?php echo _thrive_get_main_wrapper_class( $options ); ?>">

		<?php if ( $options['sidebar_alignement'] == "left" && $sidebar_is_active ): ?>
			<?php get_sidebar(); ?>
		<?php endif; ?>
		<?php if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ): ?>
			<div class="cata">
				<h2><?php _e( "Search Results for", 'thrive' ); ?> <span> <?php echo get_search_query(); ?></span></h2>
			</div>
		<?php endif ?>
		<?php if ( _thrive_is_active_sidebar( $options ) ): ?>
		<div class="bSeCont"><?php endif; ?>
			<section class="<?php echo _thrive_get_main_section_class( $options ); ?>">
				<?php if ( $options['blog_layout'] != "masonry_full_width" && $options['blog_layout'] != "masonry_sidebar" ): ?>
					<div class="cata">
						<h2><?php _e( "Search Results for", 'thrive' ); ?>
							<span><?php echo get_search_query(); ?></span></h2>
					</div>
				<?php endif ?>
				<?php if ( $options['blog_layout'] == "masonry_full_width" || $options['blog_layout'] == "masonry_sidebar" ): ?>
					<div class="mry-g"></div>
				<?php endif; ?>
				<?php if ( have_posts() ): ?>
					<?php while ( have_posts() ): ?>
						<?php the_post(); ?>
						<?php if ( in_array( get_the_ID(), $exclude_woo_pages ) ): continue; endif; ?>
						<?php get_template_part( 'content', _thrive_get_post_content_template( $options ) ); ?>
					<?php endwhile; ?>
					<?php if ( _thrive_check_focus_area_for_pages( "archive", "bottom" ) ): ?>
						<?php if ( strpos( $options['blog_layout'], 'masonry' ) === false && strpos( $options['blog_layout'], 'grid' ) === false ): ?>
							<?php thrive_render_top_focus_area( "bottom", "archive" ); ?>
							<div class="spr"></div>
						<?php endif; ?>
					<?php endif; ?>

				<?php else: ?>
					<!--No contents-->
				<?php endif ?>
			</section>

			<?php if ( _thrive_is_active_sidebar( $options ) ): ?></div><?php endif; ?>
		<?php if ( $options['sidebar_alignement'] == "right" && $sidebar_is_active ): ?>
			<?php get_sidebar(); ?>
		<?php endif; ?>
	</div>
<?php get_footer(); ?>