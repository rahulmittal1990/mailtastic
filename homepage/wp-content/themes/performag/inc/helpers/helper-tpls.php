<?php

function _thrive_get_page_template_privacy() {
	$options = array(
		'website' => thrive_get_theme_options( 'privacy_tpl_website' ),
		'company' => thrive_get_theme_options( 'privacy_tpl_company' ),
		'contact' => thrive_get_theme_options( 'privacy_tpl_contact' ),
		'address' => thrive_get_theme_options( 'privacy_tpl_address' ),
	);

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/privacy.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_disclaimer() {

	$options = array(
		'website' => thrive_get_theme_options( 'privacy_tpl_website' ),
		'company' => thrive_get_theme_options( 'privacy_tpl_company' ),
		'contact' => thrive_get_theme_options( 'privacy_tpl_contact' ),
		'address' => thrive_get_theme_options( 'privacy_tpl_address' ),
	);

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/disclaimer.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_lead_gen( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/lead_gen.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_email_confirmation() {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/email_confirmation.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_video_lead_gen( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/video_lead_gen.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_homepage1( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/homepage1.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_homepage2( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";
	$content    = "<h1>This is Your Big, <span style='color: #4174dc;'><strong>Bold Headline</strong></span>
to Grab Attention.</h1>
[page_section image='" . $images_dir . "/urban_building.jpg' textstyle='light' position='default' padding_bottom='on' padding_top='on' img_static='on']
<p style='text-align: right; margin-bottom: 12em;'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non euismod elit, et tempor augue.</p>
[/page_section]
<h3 style='text-align: center;'>Lorem Ipsum Dolor Sit Amet</h3>
<p style='text-align: center;'>Mauris venenatis ac nulla nec pharetra. Nam interdum lectus diam, ac pulvinar velit vehicula ut. Duis a vulputate tellus. Sed mattis justo diam, non vehicula orci auctor rutrum.</p>
[divider style='dark']

[one_third_first]<img class='aligncenter size-full wp-image-433' alt='icon1b' src='" . $images_dir . "/icon1b.png' width='78' height='68' />
<h4 style='text-align: center;'>Lorem Ipsum</h4>
<p style='text-align: center;'>Praesent tortor nibh, faucibus at purus nec, tincidunt condimentum ligula. Sed lobortis laoreet lorem, nec fermentum enim suscipit non.</p>
<p style='text-align: center;'>[/one_third_first][one_third]<img class='aligncenter size-full wp-image-434' alt='icon2b' src='" . $images_dir . "/icon2b.png' width='78' height='68' /></p>

<h4 style='text-align: center;'>Dolor Sit Amet</h4>
<p style='text-align: center;'>Phasellus est lacus, congue sodales urna tristique, vehicula vulputate ligula. Phasellus leo dui, adipiscing eu mollis sed, rhoncus vel sapien.</p>
[/one_third][one_third_last]<img class='aligncenter size-full wp-image-435' alt='icon3b' src='" . $images_dir . "/icon3b.png' width='78' height='68' />
<h4 style='text-align: center;'>Consectetur Adipiscing</h4>
<p style='text-align: center;'>Mauris venenatis ac nulla nec pharetra. Nam interdum lectus diam, ac pulvinar velit vehicula ut. Duis a vulputate tellus. Sed mattis justo diam.</p>
[/one_third_last]

[page_section color='#ededed' textstyle='dark' position='default' padding_top='on']
<h2 style='text-align: center;'>Our Recent Contributions</h2>
[thrive_posts_gallery title='' no_posts='4' filter='recent']

[/page_section][page_section image='" . $images_dir . "/urban_building.jpg' textstyle='light' position='default' padding_bottom='on' img_static='on']
<h2 style='text-align: center;'>Our Clients</h2>
[one_third_first]<img class='aligncenter size-full wp-image-438' alt='fastforward-white-2' src='" . $images_dir . "/fastforward-white-2.png' width='400' height='140' />[/one_third_first][one_third]<img class='aligncenter size-full wp-image-440' alt='morning-star-white-2' src='" . $images_dir . "/morning-star-white-2.png' width='400' height='140' />[/one_third][one_third_last]<img class='aligncenter size-full wp-image-441' alt='wastingtime-white-2' src='" . $images_dir . "/wastingtime-white-2.png' width='400' height='140' />[/one_third_last]

&nbsp;

[/page_section]
<h3 style='text-align: center;'>Praesent at Leo Pellentesque</h3>
<p style='text-align: center;'>Cras interdum et justo sed posuere. In hac habitasse platea dictumst. Quisque pharetra, purus quis viverra aliquet, sem libero congue lectus, nec consequat justo mi tempus felis. Curabitur ut tempor augue. Phasellus venenatis venenatis pellentesque. Aliquam erat volutpat.</p>
[thrive_link color='blue' link='#' target='_self' size='medium' align='aligncenter']Get a Quote[/thrive_link]

[page_section color='#ededed' textstyle='dark' position='bottom' padding_top='on'][thrive_follow_me facebook='http://facebook.com/imimpact' twitter='shanerqr' linkedin='555'][/page_section]";

	return $content;
}

function _thrive_get_page_template_sales() {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/sales.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_thank_you_dld() {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-theme/thank_you_dld.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_lorem_ipsum_post_content() {
	$content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean volutpat lacus sit amet hendrerit cursus. Mauris id justo et nunc tempus dictum. Aenean vestibulum id neque ac sollicitudin. Praesent hendrerit nisl vitae tellus fringilla, in condimentum risus vehicula. Etiam quis luctus sem. Nulla sed tempor augue. Cras ac neque egestas, ultrices metus in, eleifend felis. Nullam laoreet ac felis in mattis.

Sed nulla erat, viverra nec orci vel, lacinia suscipit ligula. Proin diam tortor, porttitor eu enim vel, porttitor tempor ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed a arcu sed elit placerat accumsan rutrum non erat. Cras hendrerit metus eget mattis suscipit. Etiam scelerisque dui id purus gravida, molestie vulputate libero fermentum. Suspendisse potenti. Pellentesque tristique odio quis tellus auctor malesuada. Aenean vestibulum in enim a varius. Quisque tellus diam, viverra eget libero eget, malesuada mollis quam. Vivamus auctor pharetra placerat. Quisque sagittis commodo elit, vestibulum cursus nisl accumsan pulvinar. Praesent consequat mollis quam ut aliquet. Pellentesque nulla enim, tempor eu egestas sed, posuere ut purus. Morbi ultricies arcu a dapibus euismod.

Etiam mattis quis tortor id luctus. Ut aliquam odio eu velit interdum tincidunt. Etiam semper leo id eros gravida tempor. Curabitur posuere erat lectus, a ultricies ipsum scelerisque eu. Curabitur tempus varius massa nec dignissim. Phasellus pretium a risus condimentum porta. Nam eu urna velit. Nulla vitae molestie nisl. Aliquam posuere rhoncus tortor, eu laoreet massa imperdiet nec.

Morbi justo turpis, placerat vel lectus id, ultrices ultrices eros. Praesent molestie dolor non est ultrices interdum. Nunc pellentesque pharetra ligula, quis commodo mi luctus vitae. Aenean et nulla ut nibh molestie adipiscing id vitae mauris. Phasellus vitae tellus accumsan, mattis urna at, euismod leo. Aenean aliquet egestas erat, nec fringilla tellus imperdiet sed. Maecenas nisi augue, placerat molestie bibendum eu, congue in nisl.

Cras nec mi euismod velit consectetur sagittis. Mauris sollicitudin massa vitae nisl scelerisque, sed adipiscing ante fermentum. Aenean odio arcu, consequat vitae scelerisque ut, rutrum id lectus. Donec dolor ipsum, porttitor et quam tincidunt, commodo placerat dui. Fusce commodo orci ac quam iaculis, eu dignissim odio accumsan. Mauris sed condimentum erat. Sed tincidunt, magna ut ultrices feugiat, massa ante vulputate augue, a porttitor lectus diam eget sem. Etiam sit amet tincidunt massa. Duis accumsan non nibh vitae venenatis. Cras nec lectus massa. Cras at diam in nisl vestibulum consequat sed quis risus. Aenean eu arcu tortor.";

	return $content;
}

function _thrive_get_page_template_tcb_privacy() {
	$options = array(
		'website' => thrive_get_theme_options( 'privacy_tpl_website' ),
		'company' => thrive_get_theme_options( 'privacy_tpl_company' ),
		'contact' => thrive_get_theme_options( 'privacy_tpl_contact' ),
		'address' => thrive_get_theme_options( 'privacy_tpl_address' ),
	);

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-tcb/privacy.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_tcb_disclaimer() {

	$options = array(
		'website' => thrive_get_theme_options( 'privacy_tpl_website' ),
		'company' => thrive_get_theme_options( 'privacy_tpl_company' ),
		'contact' => thrive_get_theme_options( 'privacy_tpl_contact' ),
		'address' => thrive_get_theme_options( 'privacy_tpl_address' ),
	);

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-tcb/disclaimer.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_tcb_lead_gen( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-tcb/lead_gen.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_tcb_email_confirmation() {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-tcb/email_confirmation.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_tcb_video_lead_gen( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-tcb/video_lead_gen.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_tcb_homepage1( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";
	$content    = "";

	return $content;
}

function _thrive_get_page_template_tcb_homepage2( $optin_id = 0 ) {
	$images_dir = get_template_directory_uri() . "/images/templates";
	$content    = "";

	return $content;
}

function _thrive_get_page_template_tcb_homepage3( $optin_id = 0 ) {

	$images_dir = get_template_directory_uri() . "/images/templates";
	$content    = "";

	return $content;
}

function _thrive_get_page_template_tcb_sales() {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-tcb/sales.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}

function _thrive_get_page_template_tcb_thank_you_dld() {
	$images_dir = get_template_directory_uri() . "/images/templates";

	ob_start();
	include plugin_dir_path( __FILE__ ) . 'tpl-tcb/thank_you_dld.php';
	$content = ob_get_contents();
	ob_end_clean();

	return $content;
}