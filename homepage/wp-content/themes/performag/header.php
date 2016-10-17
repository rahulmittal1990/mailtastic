<?php
$options = thrive_get_options_for_post();
$enable_fb_comments = thrive_get_theme_options( "enable_fb_comments" );
$fb_app_id = thrive_get_theme_options( "fb_app_id" );
$logo_pos_class = ( $options['logo_position'] != "top" ) ? "side_logo" : "center_logo";
$header_layout = get_theme_mod( 'thrivetheme_header_layout' ) == '' ? 'center' : get_theme_mod( 'thrivetheme_header_layout' );
$float_menu_attr = ( $options['navigation_type'] == "float" ) ? " data-float='scroll'" : "";

if ( $options['logo_position'] == 'top' ) {
	$header_layout = 'center';
} else {
	$header_layout = 'side';
}
?><!DOCTYPE html>
<?php tha_html_before(); ?>
<html <?php language_attributes(); ?>>
<head>
	<?php tha_head_top(); ?>
	<title><?php wp_title( '|', true, 'right' ); ?></title>
	<!--[if lt IE 9]>
	<script src="<?php echo get_template_directory_uri() ?>/js/html5/dist/html5shiv.js"></script>
	<script src="//css3-mediaqueries-js.googlecode.com/svn/trunk/css3-mediaqueries.js"></script>
	<![endif]-->
	<!--[if IE 8]>
	<link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri() ?>/css/ie8.css"/>
	<![endif]-->
	<!--[if IE 7]>
	<link rel="stylesheet" type="text/css" href="<?php echo get_template_directory_uri() ?>/css/ie7.css"/>
	<![endif]-->
	<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<?php if ( $options['favicon'] && $options['favicon'] != "" ): ?>
		<link rel="shortcut icon" href="<?php echo $options['favicon']; ?>"/>
	<?php endif; ?>

	<?php if ( isset( $options['analytics_header_script'] ) && $options['analytics_header_script'] != "" ): ?>
		<?php echo $options['analytics_header_script']; ?>
	<?php endif; ?>

	<?php thrive_enqueue_head_fonts(); ?>
	<?php wp_head(); ?>
	<?php if ( isset( $options['custom_css'] ) && $options['custom_css'] != "" ): ?>
		<style type="text/css"><?php echo $options['custom_css']; ?></style>
	<?php endif; ?>
	<?php tha_head_bottom(); ?>
</head>
<body <?php body_class() ?>>

<?php if ( isset( $options['analytics_body_script_top'] ) && ! empty( $options['analytics_body_script_top'] ) ): ?>
	<?php echo $options['analytics_body_script_top']; ?>
<?php endif; ?>
<?php if ( is_singular() && $enable_fb_comments != "off" && ! empty( $fb_app_id ) ) : ?>
	<?php include get_template_directory() . '/partials/fb-script.php' ?>
<?php endif; ?>
<?php tha_body_top(); ?>
<?php tha_header_before(); ?>
<?php
$header_type  = get_theme_mod( 'thrivetheme_theme_background' );
$header_class = '';
$header_style = '';
switch ( $header_type ) {
	case 'default-header':
		$header_class = '';
		$header_style = '';
		break;
	case '#customize-control-thrivetheme_background_value':
		$header_class = 'hbc';
		$header_style = 'background-image: none; background-color:' . get_theme_mod( 'thrivetheme_background_value' );
		break;
	case '#customize-control-thrivetheme_header_pattern':
		$header_class   = 'hbp';
		$header_pattern = get_theme_mod( 'thrivetheme_header_pattern' );
		if ( $header_pattern != 'anopattern' && strpos( $header_pattern, '#' ) === false ) {
			$header_style = 'background-image:url(' . get_bloginfo( 'template_url' ) . '/images/patterns/' . $header_pattern . '.png);';
		}
		break;
	case '#customize-control-thrivetheme_header_background_image, #customize-control-thrivetheme_header_image_type, #customize-control-thrivetheme_header_image_height':
		switch ( get_theme_mod( 'thrivetheme_header_image_type' ) ) {
			case 'full':
				$header_class = 'hif';
				$header_style = 'background-image:url(' . get_theme_mod( 'thrivetheme_header_background_image' ) . '); height:' . get_theme_mod( 'thrivetheme_header_image_height' ) . 'px;';
				break;
			case 'centered':
				$header_class = 'hic';
				$header_style = 'background-image:url(' . get_theme_mod( 'thrivetheme_header_background_image' ) . '); height:' . get_theme_mod( 'thrivetheme_header_image_height' ) . 'px;';
				break;
		}
		break;
}
?>
<?php
if ( display_social_sharing_block( $options, 'floating' ) ):
	$share_count = _thrive_get_share_count_for_post( get_the_ID() );
	?>
	<div class="fln">
		<div class="wrp clearfix">
			<?php if ( $options['logo_type'] == "text" ): ?>
				<a class="left <?php if ( $options['logo_color'] == "default" ): ?>default_color<?php else: ?><?php echo $options['logo_color'] ?><?php endif; ?> "
				   href="<?php echo home_url( '/' ); ?>" id="text_logo">
					<?php echo $options['logo_text']; ?>
				</a>
			<?php elseif ( ! empty( $options['logo'] ) ): ?>
				<a class="left" href="<?php echo home_url( '/' ); ?>" id="logo">
					<img src="<?php echo $options['logo']; ?>" alt="">
				</a>
			<?php endif; ?>
			<div class="ssf left clearfix">
				<?php if ( ! empty( $options['social_attention_grabber'] ) && $options['social_attention_grabber'] === 'count' && ( ! empty( $options['enable_facebook_button'] ) || ! empty( $options['enable_google_button'] ) || ! empty( $options['enable_linkedin_button'] ) ) ) : ?>
					<div class="cou"><?php echo $share_count->total; ?><?php _e( "Shares", 'thrive' ); ?></div>
				<?php endif; ?>
				<div class="mets">
					<div class="bps">
						<?php if ( $options['enable_facebook_button'] == 1 ): ?>
							<div class="ss">
								<a class="fb"
								   href="//www.facebook.com/sharer/sharer.php?u=<?php echo get_permalink( get_the_ID() ); ?>"
								   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
                                            <span>
                                                <?php _e( "Share", 'thrive' ); ?>
                                            </span>
                                            <span class="ct" style="display:none;">
                                                <?php echo $share_count->facebook; ?>
                                            </span>
								</a>
							</div>
						<?php endif; ?>
						<?php if ( $options['enable_twitter_button'] == 1 ): ?>
							<div class="ss">
								<a class="twitter"
								   href="https://twitter.com/share?text=<?php echo rawurlencode( wp_strip_all_tags( get_the_title() ) ); ?>:&url=<?php echo get_permalink( get_the_ID() ); ?>"
								   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
									<span><?php _e( "Tweet", 'thrive' ); ?></span>
								</a>
							</div>
						<?php endif; ?>
						<?php if ( $options['enable_pinterest_button'] == 1 ): ?>
							<div class="ss">
								<a class="prinster" data-pin-do="skipLink"
								   href="//pinterest.com/pin/create/button/?url=<?php echo get_permalink( get_the_ID() ); ?>&media=<?php echo _thrive_get_pinterest_media_param( get_the_ID() ); ?>"
								   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
                                            <span>
                                                <?php _e( "Pin", 'thrive' ); ?>
                                            </span>
                                            <span class="ct" style="display:none;">
                                                <?php echo $share_count->facebook; ?>
                                            </span>
								</a>
							</div>
						<?php endif; ?>
						<?php if ( $options['enable_google_button'] == 1 ): ?>
							<div class="ss">
								<a class="g_plus"
								   href="https://plus.google.com/share?url=<?php echo get_permalink( get_the_ID() ); ?>"
								   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
                                            <span>
                                                <?php _e( "Share", 'thrive' ); ?>
                                            </span>
                                            <span class="ct" style="display:none;">
                                                <?php echo $share_count->plusone; ?>
                                            </span>
								</a>
							</div>
						<?php endif; ?>
						<?php if ( $options['enable_linkedin_button'] == 1 ): ?>
							<div class="ss">
								<a class="linkedin"
								   href="https://www.linkedin.com/cws/share?url=<?php echo get_permalink( get_the_ID() ); ?>"
								   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
									<span><?php _e( "Share", 'thrive' ); ?></span>
                                            <span class="ct" style="display:none;">
                                                <?php echo $share_count->linkedin; ?>
                                            </span>
								</a>
							</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	</div>
<?php endif; ?>
<div class="flex-cnt">
	<header class="<?php echo $header_layout . ' ' . $header_class; ?>" style="<?php echo $header_style; ?>">
		<?php if ( $header_class == "hic" ): ?>
			<img class="dmy" src="<?php echo get_theme_mod( 'thrivetheme_header_background_image' ); ?>"/>
		<?php endif; ?>
		<div class="h-i">
			<div class="th">
				<div class="wrp clearfix">
					<?php if ( $header_layout == 'center' ): ?>

						<?php if ( get_theme_mod( 'thrivetheme_header_logo' ) != 'hide' ): ?>
							<?php if ( $options['logo_type'] == "text" ): ?>
								<a class="<?php if ( $options['logo_color'] == "default" ): ?><?php echo $options['color_scheme'] ?><?php else: ?><?php echo $options['logo_color'] ?><?php endif; ?> "
								   href="<?php echo home_url( '/' ); ?>" id="text_logo">
									<?php echo $options['logo_text']; ?>
								</a>
							<?php elseif ( ! empty( $options['logo'] ) ): ?>
								<a class="" href="<?php echo home_url( '/' ); ?>" id="logo">
									<img src="<?php echo $options['logo']; ?>" alt="">
								</a>
							<?php endif; ?>
						<?php endif; ?>
						<div class="ha">
							<div class="tt-adp-header-main">
								<?php if ( $ttHeaderAd = _thrive_get_ad_for_position( array( 'ad_location' => 'header' ) ) ): ?>
									<?php echo $ttHeaderAd['embed_code']; ?>
								<?php endif; ?>
							</div>
						</div>

					<?php else: ?>

						<div class="hi clearfix">
							<div class="ha">
								<div class="tt-adp-header-main">
									<?php if ( $ttHeaderAd = _thrive_get_ad_for_position( array( 'ad_location' => 'header' ) ) ): ?>
										<?php echo $ttHeaderAd['embed_code']; ?>
									<?php endif; ?>
								</div>
							</div>
							<div class="hs right">
								<ul>
									<?php if ( ! empty( $options['social_facebook'] ) ): ?>
										<li><a class="fb" href="<?php echo $options['social_facebook']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_twitter'] ) ): ?>
										<li><a class="twitter" href="<?php echo $options['social_twitter']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_gplus'] ) ): ?>
										<li><a class="g_plus" href="<?php echo $options['social_gplus']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_pinterest'] ) ): ?>
										<li><a data-pin-do="skipLink" class="prinster"
										       href="<?php echo $options['social_pinterest']; ?>" target="_blank"></a>
										</li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_linkedin'] ) ): ?>
										<li><a class="linkedin" href="<?php echo $options['social_linkedin']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_youtube'] ) ): ?>
										<li><a class="youtube" href="<?php echo $options['social_youtube']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
								</ul>
							</div>
							<form class="hf right" action="<?php echo home_url( '/' ); ?>" method="get">
								<input type="text" placeholder="<?php _e( "Search", 'thrive' ); ?>" name="s"/>
								<button></button>
							</form>
						</div>

					<?php endif; ?>

				</div>
			</div>
			<div class="bh clearfix" <?php echo $float_menu_attr; ?>
			     <?php if ( $options['navigation_type'] == "float" && $options['enable_social_buttons'] != 1 ): ?>data-social="off"<?php endif; ?>>
				<div class="wrp clearfix">
					<div class="hsm"></div>

					<?php if ( $header_layout != 'center' ): ?>
						<?php if ( get_theme_mod( 'thrivetheme_header_logo' ) != 'hide' ): ?>
							<?php if ( $options['logo_type'] == "text" ): ?>
								<a class="<?php if ( $options['logo_color'] == "default" ): ?><?php echo $options['color_scheme'] ?><?php else: ?><?php echo $options['logo_color'] ?><?php endif; ?> "
								   href="<?php echo home_url( '/' ); ?>" id="text_logo">
									<?php echo $options['logo_text']; ?>
								</a>
							<?php elseif ( ! empty( $options['logo'] ) ): ?>
								<a class="" href="<?php echo home_url( '/' ); ?>" id="logo">
									<img src="<?php echo $options['logo']; ?>" alt="">
								</a>
							<?php endif; ?>
						<?php endif; ?>
					<?php endif; ?>

					<div class="nav_c">
						<?php if ( has_nav_menu( "primary" ) ): ?>
							<?php require_once get_template_directory() . '/inc/templates/woocommerce-navbar-mini-cart.php'; ?>
							<?php wp_nav_menu( array(
								'container'      => 'nav',
								'theme_location' => 'primary',
								'menu_class'     => 'menu',
								'walker'         => new thrive_custom_menu_walker()
							) ); ?>
						<?php else: ?>
							<div class="dfm">
								<?php _e( "Assign a 'primary' menu", 'thrive' ); ?>
							</div>
						<?php endif; ?>
					</div>

					<?php if ( $header_layout == 'center' ): ?>
						<div class="hi">
							<form action="<?php echo home_url( '/' ); ?>" method="get" class="hf left">
								<input type="text" placeholder="<?php _e( "Search", 'thrive' ); ?>" name="s"/>
								<button></button>
							</form>
							<div class="hs right">
								<ul>
									<?php if ( ! empty( $options['social_facebook'] ) ): ?>
										<li><a class="fb" href="<?php echo $options['social_facebook']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_twitter'] ) ): ?>
										<li><a class="twitter" href="<?php echo $options['social_twitter']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_gplus'] ) ): ?>
										<li><a class="g_plus" href="<?php echo $options['social_gplus']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_pinterest'] ) ): ?>
										<li><a class="prinster" href="<?php echo $options['social_pinterest']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_linkedin'] ) ): ?>
										<li><a class="linkedin" href="<?php echo $options['social_linkedin']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
									<?php if ( ! empty( $options['social_youtube'] ) ): ?>
										<li><a class="youtube" href="<?php echo $options['social_youtube']; ?>"
										       target="_blank"></a></li>
									<?php endif; ?>
								</ul>
							</div>
						</div>
					<?php endif; ?>

				</div>
			</div>
		</div>
	</header>

	<?php get_template_part( 'breadcrumbs' ); ?>

<?php
if ( ( is_archive() || is_search() ) && _thrive_check_focus_area_for_pages( "archive", "top" ) ) {
	thrive_render_top_focus_area( "top", "archive" );
} elseif ( is_home() && _thrive_check_focus_area_for_pages( "blog", "top" ) ) {
	thrive_render_top_focus_area( "top", "blog" );
} elseif ( thrive_check_top_focus_area() ) {
	thrive_render_top_focus_area();
}
?>