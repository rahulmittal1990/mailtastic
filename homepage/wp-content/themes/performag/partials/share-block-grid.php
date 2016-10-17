<?php $post_id = ! empty( $params['post_id'] ) ? $params['post_id'] : get_the_ID(); ?>
<?php $post_title = ! empty( $params['post_title'] ) ? $params['post_title'] : get_the_title(); ?>
<div class="ixs">
	<div class="ixt" data-id="<?php echo $post_id; ?>"><?php echo $params['share_count']->total; ?> Shares</div>
	<ul class="ixb"><!-- max 3-->
		<?php if ( $params['options']['enable_facebook_button'] == 1 ): ?>
			<li class="fb"><a href="//www.facebook.com/sharer/sharer.php?u=<?php echo $params['url']; ?>"></a></li>
		<?php endif; ?>
		<?php if ( $params['options']['enable_twitter_button'] == 1 ): ?>
			<li class="twitter"><a
					href="https://twitter.com/share?text=<?php echo $post_title; ?>:&url=<?php echo $params['url']; ?>"
					onclick="return ThriveApp.open_share_popup(this.href, 545, 433);"></a></li>
		<?php endif; ?>
		<?php if ( $params['options']['enable_pinterest_button'] == 1 ): ?>
			<li class="prinster"><a data-pin-do="skipLink"
			                        href="http://pinterest.com/pin/create/button/?url=<?php echo $params['url'] ?>&media=<?php echo _thrive_get_pinterest_media_param( $post_id ); ?>"
			                        onclick="return ThriveApp.open_share_popup(this.href, 545, 433);"></a></li>
		<?php endif; ?>
		<?php if ( $params['options']['enable_google_button'] == 1 ): ?>
			<li class="g_plus"><a href="https://plus.google.com/share?url=<?php echo $params['url']; ?>"
			                      onclick="return ThriveApp.open_share_popup(this.href, 545, 433);"></a></li>
		<?php endif; ?>
		<?php if ( $params['options']['enable_linkedin_button'] == 1 ): ?>
			<li class="linkedin"><a href="https://www.linkedin.com/cws/share?url=<?php echo $params['url']; ?>"
			                        onclick="return ThriveApp.open_share_popup(this.href, 545, 433);"></a></li>
		<?php endif; ?>
	</ul>
</div>