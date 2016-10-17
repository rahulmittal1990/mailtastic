<?php
$author_info          = _thrive_get_author_info( get_the_author_meta( 'ID' ) );
$thrive_social        = _thrive_get_authorbox_social_array();
$show_social_profiles = explode( ',', get_the_author_meta( 'show_social_profiles' ) );
$show_social_profiles = array_filter( $show_social_profiles );
if ( empty( $show_social_profiles ) ) { // back-compatibility
	$show_social_profiles = array( 'e', 'fk', 'tw', 'gg' );
}
?>
<div class="aut">
	<div class="ha">
		<span class="left"><?php _e( "About the author", 'thrive' ); ?></span>
		<ul class="right">
			<?php
			foreach ( $thrive_social as $service => $url ):
				if ( in_array( $service, $show_social_profiles ) || empty( $show_social_profiles[0] ) ):
					?>
					<li>
						<a href="<?php echo _thrive_get_social_link( $url, $service ); ?>"
						   class="<?php echo $service; ?>" target="_blank"></a>
					</li>
				<?php endif; ?>
			<?php endforeach; ?>
		</ul>
		<div class="clear"></div>
	</div>
	<div class="ta">
		<div class="left tai">
			<div class="auti"
			     style="background-image: url('<?php echo _thrive_get_avatar_url( $author_info['avatar'] ); ?>')"></div>
		</div>
		<div class="left tat">
			<h4><?php echo $author_info['display_name']; ?></h4>

			<p>
				<?php echo $author_info['description']; ?>
			</p>
		</div>
		<div class="clear"></div>
	</div>
</div>
