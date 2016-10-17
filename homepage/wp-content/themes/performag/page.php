<?php
$options           = thrive_get_options_for_post( get_the_ID() );
$sidebar_is_active = _thrive_is_active_sidebar();
$post_template     = _thrive_get_item_template( get_the_ID() );
?>
<?php get_header(); ?>

<?php if ( have_posts() ): ?>

	<?php while ( have_posts() ): ?>

		<?php the_post(); ?>

		<?php if ( $options['show_post_title'] != 0 ): ?>
			<div class="bt dp">
				<div class="wrp">
					<h1 class="entry-title"><?php the_title(); ?></h1>
				</div>
			</div>
		<?php endif; ?>
		<div class="wrp cnt p-s">
			<?php if ( $options['sidebar_alignement'] == "left" && $sidebar_is_active ): ?>
				<?php get_sidebar(); ?>
			<?php endif; ?>
			<?php if ( $sidebar_is_active ): ?>
			<div class="bSeCont">
				<?php endif; ?>
				<section
					class="<?php echo _thrive_get_single_post_section_class( $options['sidebar_alignement'], $post_template, $sidebar_is_active ); ?>">

					<?php get_template_part( 'content-page' ); ?>

					<?php if ( ! post_password_required() && $options['comments_on_pages'] != 0 ) : ?>
						<?php comments_template( '', true ); ?>
					<?php elseif ( ( ! comments_open() ) && get_comments_number() > 0 ): ?>
						<?php comments_template( '/comments-disabled.php' ); ?>
					<?php endif; ?>

				</section>
				<?php if ( $sidebar_is_active ): ?>
			</div>
		<?php endif; ?>
			<?php if ( $options['sidebar_alignement'] == "right" && $sidebar_is_active ): ?>
				<?php get_sidebar(); ?>
			<?php endif; ?>
		</div>

	<?php endwhile; ?>
<?php endif; ?>

<?php get_footer(); ?>