<?php
$options = thrive_get_theme_options();
?>
<?php get_header(); ?>

	<div class="wrp cnt">
		<section class="bSe fullWidth">
			<article class="lost">
				<div class="awr">
					<h1>404</h1>

					<h2><?php _e( "Oops... the page you are looking for doesn't exist.", 'thrive' ); ?></h2>

					<h3>
						<a href="<?php echo home_url( '/' ); ?>"><?php _e( "Click here", 'thrive' ); ?></a> <?php _e( "to return to the homepage or try searching below", 'thrive' ); ?>
					</h3>

					<form action="<?php echo home_url( '/' ); ?>" method="get">
						<input id="search-field" type="text" placeholder="<?php _e( "Search keyword", 'thrive' ); ?>"
						       name="s"/>

						<div class="btn medium">
							<input type="submit" value="<?php _e( "Search", 'thrive' ); ?>">
						</div>
						<div class="clear"></div>
					</form>
					<?php if ( ! empty( $options['404_custom_text'] ) ): ?>
						<p><?php echo do_shortcode( $options['404_custom_text'] ); ?></p>
					<?php endif; ?>

					<?php
					if ( isset( $options['404_display_sitemap'] ) && $options['404_display_sitemap'] == "on" ):
						$categories = get_categories();
						$pages = get_pages();
						?>
						<div class="csc">
							<div class="colm thc">
								<h3><?php _e( "Categories", 'thrive' ); ?></h3>
								<ul class="tt_sitemap_list">
									<?php foreach ( $categories as $cat ): ?>
										<li>
											<a href='<?php echo get_category_link( $cat->term_id ); ?>'><?php echo $cat->name; ?></a>
										</li>
									<?php endforeach; ?>
								</ul>
							</div>
							<div class="colm thc">
								<h3><?php _e( "Archives", 'thrive' ); ?></h3>
								<ul>
									<?php wp_get_archives(); ?>
								</ul>
							</div>
							<div class="colm thc lst">
								<h3><?php _e( "Pages", 'thrive' ); ?></h3>
								<ul class="tt_sitemap_list">
									<?php foreach ( $pages as $page ): ?>
										<li>
											<a href='<?php echo get_page_link( $page->ID ); ?>'><?php echo get_the_title( $page->ID ); ?></a>
										</li>
									<?php endforeach; ?>
								</ul>
							</div>
							<div class="clear"></div>
						</div>
					<?php endif; ?>
				</div>
			</article>
		</section>
	</div>

<?php get_footer(); ?>