<div class="mets <?php echo $params['block_position_class']; ?> tt-share" data-url="<?php echo $params['url']; ?>"
     data-id="<?php echo get_the_ID(); ?>"><!--max 3 -->
	<div class="bps">
		<?php if ( $params['options']['enable_facebook_button'] == 1 ): ?>
			<div class="ss">
				<a class="fb" href="//www.facebook.com/sharer/sharer.php?u=<?php echo $params['url']; ?>"
				   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
                    <span>
                        <?php _e( "Share", 'thrive' ); ?>
                    </span>
					<?php if ( $params['options']['social_attention_grabber'] == "count" ): ?>
						<span class="ct">
                            <?php echo isset( $params['share_count']->facebook ) ? $params['share_count']->facebook : 0; ?>
                        </span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>
		<?php if ( $params['options']['enable_twitter_button'] == 1 ): ?>
			<div class="ss">
				<a class="twitter"
				   href="https://twitter.com/share?text=<?php echo rawurlencode( wp_strip_all_tags( get_the_title() ) ); ?>:&url=<?php echo $params['url']; ?>"
				   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
					<span><?php _e( "Tweet", 'thrive' ); ?></span>
				</a>
			</div>
		<?php endif; ?>
		<?php if ( $params['options']['enable_pinterest_button'] == 1 ): ?>
			<div class="ss">
				<a class="prinster" data-pin-do="skipLink"
				   href="http://pinterest.com/pin/create/button/?url=<?php echo $params['url']; ?>&media=<?php echo _thrive_get_pinterest_media_param( get_the_ID() ); ?>"
				   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
                    <span>
                        <?php _e( "Pin", 'thrive' ); ?>
                    </span>
					<?php if ( $params['options']['social_attention_grabber'] == "count" ): ?>
						<span class="ct">
                            <?php echo isset( $params['share_count']->pinterest ) ? $params['share_count']->pinterest : 0; ?>
                        </span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>
		<?php if ( $params['options']['enable_google_button'] == 1 ): ?>
			<div class="ss">
				<a class="g_plus" href="https://plus.google.com/share?url=<?php echo $params['url']; ?>"
				   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
                    <span>
                        <?php _e( "Share", 'thrive' ); ?>
                    </span>
					<?php if ( $params['options']['social_attention_grabber'] == "count" ): ?>
						<span class="ct">
                            <?php echo isset( $params['share_count']->plusone ) ? $params['share_count']->plusone : 0; ?>
                        </span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>
		<?php if ( $params['options']['enable_linkedin_button'] == 1 ): ?>
			<div class="ss">
				<a class="linkedin" href="https://www.linkedin.com/cws/share?url=<?php echo $params['url']; ?>"
				   onclick="return ThriveApp.open_share_popup(this.href, 545, 433);">
					<span><?php _e( "Share", 'thrive' ); ?></span>
					<?php if ( $params['options']['social_attention_grabber'] == "count" ): ?>
						<span class="ct">
                            <?php echo isset( $params['share_count']->linkedin ) ? $params['share_count']->linkedin : 0; ?>
                        </span>
					<?php endif; ?>
				</a>
			</div>
		<?php endif; ?>
	</div>
</div>