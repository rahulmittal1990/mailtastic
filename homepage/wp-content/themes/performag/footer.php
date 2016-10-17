<?php tha_content_bottom(); ?>
<?php
global $thrive_is_custom_homepage;
$options        = thrive_get_options_for_post( get_the_ID() );
$active_footers = _thrive_get_footer_active_widget_areas();
$f_class        = _thrive_get_footer_col_class( count( $active_footers ) );
$num_cols       = count( $active_footers );
?>
</div>
<div class="clear"></div>
<footer>
	<?php if ( _thrive_get_item_template( get_the_ID() ) != "Landing Page" ): ?>

		<div class="ftw">
			<?php tha_footer_top(); ?>
			<div class="wrp">
				<?php
				$num = 0;
				foreach ( $active_footers as $name ):
					$num ++;
					?>
					<div class="<?php echo $f_class; ?> <?php echo ( $num == $num_cols ) ? 'lst' : ''; ?>">
						<?php dynamic_sidebar( $name ); ?>
					</div>
				<?php endforeach; ?>
				<div class="clear"></div>
			</div>
		</div>

	<?php endif; ?>
	<div class="ftm <?php if ( _thrive_get_item_template( get_the_ID() ) == "Landing Page" ): ?> lfp <?php endif; ?>">
		<div class="wrp">
			<p>
				<?php if ( isset( $options['footer_copyright'] ) && $options['footer_copyright'] ): ?>
					<?php echo str_replace( '{Y}', date( 'Y' ), $options['footer_copyright'] ); ?>
				<?php endif; ?>
				<?php if ( isset( $options['footer_copyright_links'] ) && $options['footer_copyright_links'] == 1 ): ?>
					&nbsp;&nbsp;-&nbsp;&nbsp;Designed by
					<a href="//www.thrivethemes.com" target="_blank" style="text-decoration: underline;">Thrive
						Themes</a>
					| Powered by <a style="text-decoration: underline;" href="//www.wordpress.org" target="_blank">WordPress</a>
				<?php endif; ?>
			</p>
			<?php if ( has_nav_menu( "footer" ) ): ?>
				<?php wp_nav_menu( array(
					'theme_location' => 'footer',
					'depth'          => 1,
					'menu_class'     => 'right',
					'container'      => ''
				) ); ?>
			<?php endif; ?>
			<div class="clear"></div>
		</div>
	</div>
</footer>
<?php if ( empty( $thrive_is_custom_homepage ) && is_singular() && $options['enable_social_buttons'] == 1 ): ?>
	<div class="iqs">
		<ul>
			<?php if ( $options['enable_facebook_button'] == 1 ): ?>
				<li class="fk"
				    onclick="return ThriveApp.open_share_popup('//www.facebook.com/sharer/sharer.php?u=<?php the_permalink() ?>', 545, 433);">
					<a href=""></a></li>
			<?php endif; ?>
			<?php if ( $options['enable_google_button'] == 1 ): ?>
				<li class="gg"
				    onclick="return ThriveApp.open_share_popup('https://plus.google.com/share?url=<?php the_permalink() ?>', 545, 433);">
					<a href=""></a></li>
			<?php endif; ?>
			<?php if ( $options['enable_linkedin_button'] == 1 ): ?>
				<li class="lk"
				    onclick="return ThriveApp.open_share_popup('https://www.linkedin.com/cws/share?url=<?php the_permalink() ?>', 545, 433);">
					<a href=""></a></li>
			<?php endif; ?>
			<?php if ( $options['enable_pinterest_button'] == 1 ): ?>
				<li class="pt"
				    onclick="return ThriveApp.open_share_popup('//pinterest.com/pin/create/button/?url=<?php the_permalink() ?>&media=<?php echo _thrive_get_pinterest_media_param( get_the_ID() ) ?>', 545, 433);">
					<a href=""></a></li>
			<?php endif; ?>
			<?php if ( $options['enable_twitter_button'] == 1 ): ?>
				<li class="tw"
				    onclick="return ThriveApp.open_share_popup('https://twitter.com/share?text=<?php the_title(); ?>:&url=<?php the_permalink() ?>', 545, 433);">
					<a href=""></a></li>
			<?php endif; ?>
		</ul>
	</div>
<?php endif; ?>

<?php if ( isset( $options['analytics_body_script'] ) && $options['analytics_body_script'] != "" ): ?>
	<?php echo $options['analytics_body_script']; ?>
<?php endif; ?>

<?php wp_footer(); ?>
<?php tha_body_bottom(); ?>
</body>
</html>