<?php
global $post;
$lazy_load_comments = thrive_get_theme_options( "comments_lazy" );
$enable_fb_comments = thrive_get_theme_options( "enable_fb_comments" );
$fb_app_id          = thrive_get_theme_options( "fb_app_id" );

?>

<?php if ( $lazy_load_comments == 1 ): ?>
	<script type="text/javascript">
		_thriveCurrentPost = <?php echo json_encode( get_the_ID() ); ?>;
	</script>

<?php endif; ?>
<?php tha_comments_before(); ?>
<?php if ( $enable_fb_comments != "only_fb" ): ?>
	<article id="comments">
		<?php if ( comments_open() && ! post_password_required() ) : ?>
			<div class="awr cmm" <?php if ( get_comments_number() == 0 ): ?> style="display:none;"<?php endif; ?>>
				<h6><?php echo get_comments_number(); ?><?php echo _thrive_get_comments_txt( get_comments_number() ); ?></h6>
			</div>
		<?php endif; ?>

		<?php if ( $lazy_load_comments != 1 ): thrive_theme_comment_nav(); endif; ?>

		<div class="cmc" style="margin-left: 0px;" id="thrive_container_list_comments">
			<?php if ( $lazy_load_comments != 1 ): ?>
				<?php wp_list_comments( array( 'callback' => 'thrive_comments' ) ); ?>
			<?php endif; ?>
		</div>
		<!-- /comment_list -->

		<?php if ( $lazy_load_comments != 1 ): thrive_theme_comment_nav(); endif; ?>

		<?php if ( comments_open() && ! post_password_required() ) : ?>
			<div class="btn blue small right" id="shf">
				<span><?php _e( "Click here to add a comment", "thrive" ) ?></span>
			</div>
			<div class="clear"></div>
			<?php if ( $lazy_load_comments == 1 ): ?>
				<div class="ctb ctr" style="display: none;" id="thrive_container_preload_comments">
					loading ...
					<img class="preloader" src="<?php echo get_template_directory_uri() ?>/images/loading.gif" alt=""/>
				</div>
			<?php endif; ?>
			<div class="lrp <?php if ( $lazy_load_comments != 1 ): ?>hid<?php endif; ?>"
			     id="thrive_container_form_add_comment">
				<h4><?php _e( "Leave a comment:", 'thrive' ); ?></h4>
				<form action="<?php echo get_option( 'siteurl' ); ?>/wp-comments-post.php" method="post"
				      id="commentform">
					<?php if ( ! is_user_logged_in() ): ?>
						<label
							for="author"><?php _e( "Name ", "thrive" ) ?><?php if ( get_option( "require_name_email" ) == 1 ) { ?>*<?php } ?></label>
						<input type="text" placeholder="" id="author" author="author" class="text_field author"
						       name="author"/>
						<div class="clear"></div>
						<label
							for="author"><?php _e( "Email ", "thrive" ) ?><?php if ( get_option( "require_name_email" ) == 1 ) { ?>*<?php } ?></label>
						<input type="text" placeholder="" id="email" author="email" class="text_field email"
						       name="email"/>
						<div class="clear"></div>
						<label for="author"><?php _e( "Website", "thrive" ) ?></label>
						<input type="text" placeholder="" id="website" author="website" class="text_field website lst"
						       name="url"/>
						<div class="clear"></div>
					<?php endif; ?>
					<div class="clear"></div>
					<label for="comment"><?php _e( "Comment", "thrive" ) ?></label>
					<textarea id="comment" name="comment" class="textarea"></textarea>
					<div class="clear"></div>
					<div class="btn blue small">
						<input type="submit" value="<?php _e( "POST COMMENT", 'thrive' ); ?>"/>
					</div>
					<?php comment_id_fields(); ?>
					<?php do_action( 'comment_form', $post->ID ); ?>
					<div class="clear"></div>
				</form>
			</div>
		<?php elseif ( ( ! comments_open() || post_password_required() ) && get_comments_number() > 0 ): ?>
			<div class="no_comm">
				<h4 class="ctr">
					<?php _e( "Comments are closed", 'thrive' ); ?>
				</h4>
			</div>
		<?php endif; ?>
	</article>
	<div id="comment-bottom"></div>
<?php endif; ?>
<?php if ( ( $enable_fb_comments == "only_fb" || $enable_fb_comments == "both_fb_regular" || ( ! comments_open() && $enable_fb_comments == "fb_when_disabled" ) ) && ! empty( $fb_app_id ) ) : ?>
	<article id="comments_fb" style="min-height: 100px; border: 1px solid #ccc;">
		<div class="fb-comments" data-href="<?php echo get_permalink( get_the_ID() ); ?>"
		     data-numposts="<?php echo thrive_get_theme_options( "fb_no_comments" ) ?>" data-width="100%"
		     data-colorscheme="<?php echo thrive_get_theme_options( "fb_color_scheme" ) ?>"></div>
	</article>
<?php endif; ?>
<?php tha_comments_after(); ?>