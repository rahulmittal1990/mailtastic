<?php
$options            = thrive_get_options_for_post();
$enable_fb_comments = thrive_get_theme_options( "enable_fb_comments" );
$fb_app_id          = thrive_get_theme_options( "fb_app_id" );
?>
<!DOCTYPE html>
<?php tha_html_before(); ?>
<html <?php language_attributes(); ?>>
<head>
	<?php tha_head_top(); ?>
	<title>
		<?php wp_title( '' ); ?>
	</title>
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
<div class="flex-cnt">
	<header class="lnd">
		<div class="wrp">
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

		</div>
	</header>