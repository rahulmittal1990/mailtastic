<?php
/*
  Template Name: Full Width
 */
?>
<?php $options = thrive_get_options_for_post( get_the_ID() ); ?>
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
			<section class="bSe fullWidth">
				<?php get_template_part( 'content-page' ); ?>

				<?php if ( ! post_password_required() && $options['comments_on_pages'] != 0 ) : ?>
					<?php comments_template( '', true ); ?>
				<?php elseif ( ( ! comments_open() ) && get_comments_number() > 0 ): ?>
					<?php comments_template( '/comments-disabled.php' ); ?>
				<?php endif; ?>
			</section>
			<div class="clear"></div>
		</div>


	<?php endwhile; ?>
<?php endif; ?>

<?php get_footer(); ?>