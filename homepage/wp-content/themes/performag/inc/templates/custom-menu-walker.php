<?php

class thrive_custom_menu_walker extends Walker_Nav_Menu {

	//start of the sub menu wrap
	function start_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '<ul class="sub-menu">';
	}

	//end of the sub menu wrap
	function end_lvl( &$output, $depth = 0, $args = array() ) {
		$output .= '</ul>';
	}

	//add the description to the menu item output
	function start_el( &$output, $item, $depth = 0, $args = array(), $current_object_id = 0 ) {
		global $wp_query;

		if ( ! is_object( $args ) ) {
			$args = (object) $args;
		}

		$indent      = ( $depth ) ? str_repeat( "\t", $depth ) : '';
		$class_names = $value = '';

		$classes        = empty( $item->classes ) ? array() : (array) $item->classes;
		$category_color = 'def';
		$options        = get_option( 'category_custom_color' );
		$cat_id         = $item->object_id;
		if ( $cat_id != 0 && is_array( $options ) && array_key_exists( $cat_id, $options ) ) {
			$category_color = $options[ $cat_id ];
		}
		$category_color = "c_" . $category_color;
		$class_names    = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item ) );
		if ( $item->post_gallery == 'on' ) {
			$class_names .= ' mult menu-item-has-children ';
		}

		$class_names = ' class="' . $category_color . ' ' . esc_attr( $class_names ) . ' "';
		$output .= $indent . '<li ' . ' id="menu-item-' . $item->ID . '"' . $value . $class_names . '>';

		$atts           = array();
		$atts['title']  = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target ) ? $item->target : '';
		$atts['rel']    = ! empty( $item->xfn ) ? $item->xfn : '';
		$atts['href']   = ! empty( $item->url ) ? $item->url : '';

		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args, $depth );

		$attributes = '';
		foreach ( $atts as $attr => $value ) {
			if ( ! empty( $value ) ) {
				$value = ( 'href' === $attr ) ? esc_url( $value ) : esc_attr( $value );
				$attributes .= ' ' . $attr . '="' . $value . '"';
			}
		}

		if ( $args && isset( $args->before ) ) {
			$item_output = $args->before;
		} else {
			$item_output = "";
		}
		$item_output .= '<a' . $attributes . '>';
		if ( $args && isset( $args->link_before ) ) {
			$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
		} else {
			$item_output .= apply_filters( 'the_title', $item->title, $item->ID );
		}

		$item_output .= '</a>';
		if ( $args && isset( $args->after ) ) {
			$item_output .= $args->after;
		}

		if ( $item->post_gallery == 'on' ) {
			$item_output .= '<div class="mm clearfix"><div class="mmi">';
			if ( $item->subcat_gallery == 'on' ) {

				$subcategories = get_categories( array( 'parent' => $cat_id, 'hide_empty' => 0 ) );
				if ( empty( $subcategories ) ) {
					$subcategories   = array();
					$subcategories[] = get_category( $cat_id, false );
				}
				$item_output .= '<div class="ml">';
				foreach ( $subcategories as $key => $subcat ) {
					$item_output .= '<a href="' . get_category_link( $subcat->cat_ID ) . '" data-rel="' . $subcat->name . '" ' . ( $key == 0 ? 'class="ml-f"' : '' ) . '>' . $subcat->name . '</a>';
				}
				$item_output .= '</div>';
			} else {
				$subcategories   = array();
				$subcategories[] = get_category( $cat_id, false );
			}

			$item_output .= '<div class="mi">';
			foreach ( $subcategories as $key => $subcat ) {
				$item_output .= '<div class="mic" ' . ( $key == 0 ? 'style="display:block;"' : '' ) . ' data-rel="' . $subcat->name . '"><div class="csc clearfix">';
				$posts = get_posts( array(
					'category'       => $subcat->cat_ID,
					'posts_per_page' => 5,
					'post_type'      => array( 'post', 'thrive_slideshow' )
				) );
				foreach ( $posts as $post ) {

					if ( has_post_thumbnail( $post->ID ) ) {
						$image_data = thrive_get_post_featured_image( $post->ID, "tt_extended_menu" );
						$image      = $image_data['image_src'];

						if ( ! $image ) {
							$image = get_template_directory_uri() . "/images/default_featured.jpg";
						}
					} else {
						$image = get_template_directory_uri() . "/images/default_featured.jpg";
					}
					$item_output .= '<div class="colm fic"><a href="' . get_permalink( $post->ID ) . '">';
					$item_output .= '<div class="mig" style="background-image: url(' . $image . ')"></div>';
					$item_output .= '<b>' . $post->post_title . '</b>';

					$item_output .= '</div>';
				}
				$item_output .= '</a></div></div>';
			}
			$item_output .= '</div>';
		}

		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}

}

function thrive_function_admin_custom_menu_walker( $walker, $menu_id ) {
	return 'thrive_admin_custom_menu_walker';
}

class thrive_admin_custom_menu_walker extends Walker_Nav_Menu {

	/**
	 * Starts the list before the elements are added.
	 *
	 * @see Walker_Nav_Menu::start_lvl()
	 *
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference.
	 * @param int $depth Depth of menu item. Used for padding.
	 * @param array $args Not used.
	 */
	function start_lvl( &$output, $depth = 0, $args = array() ) {

	}

	/**
	 * Ends the list of after the elements are added.
	 *
	 * @see Walker_Nav_Menu::end_lvl()
	 *
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference.
	 * @param int $depth Depth of menu item. Used for padding.
	 * @param array $args Not used.
	 */
	function end_lvl( &$output, $depth = 0, $args = array() ) {

	}

	/**
	 * Start the element output.
	 *
	 * @see Walker_Nav_Menu::start_el()
	 * @since 3.0.0
	 *
	 * @param string $output Passed by reference. Used to append additional content.
	 * @param object $item Menu item data object.
	 * @param int $depth Depth of menu item. Used for padding.
	 * @param array $args Not used.
	 * @param int $id Not used.
	 */
	function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

		global $_wp_nav_menu_max_depth;
		$_wp_nav_menu_max_depth = $depth > $_wp_nav_menu_max_depth ? $depth : $_wp_nav_menu_max_depth;

		ob_start();
		$item_id      = esc_attr( $item->ID );
		$removed_args = array(
			'action',
			'customlink-tab',
			'edit-menu-item',
			'menu-item',
			'page-tab',
			'_wpnonce',
		);

		$original_title = '';
		if ( 'taxonomy' == $item->type ) {
			$original_title = get_term_field( 'name', $item->object_id, $item->object, 'raw' );
			if ( is_wp_error( $original_title ) ) {
				$original_title = false;
			}
		} elseif ( 'post_type' == $item->type ) {
			$original_object = get_post( $item->object_id );
			$original_title  = get_the_title( $original_object->ID );
		}

		$classes = array(
			'menu-item menu-item-depth-' . $depth,
			'menu-item-' . esc_attr( $item->object ),
			'menu-item-edit-' . ( ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? 'active' : 'inactive' ),
		);
		if ( $item->object == 'category' ) {
			$classes[] = 'catErr';
		}

		$title = $item->title;


		if ( ! empty( $item->_invalid ) ) {
			$classes[] = 'menu-item-invalid';
			/* translators: %s: title of menu item which is invalid */
			$title = sprintf( __( '%s (Invalid)', 'thrive' ), $item->title );
		} elseif ( isset( $item->post_status ) && 'draft' == $item->post_status ) {
			$classes[] = 'pending';
			/* translators: %s: title of menu item in draft status */
			$title = sprintf( __( '%s (Pending)', 'thrive' ), $item->title );
		}

		$title = ( ! isset( $item->label ) || '' == $item->label ) ? $title : $item->label;

		$submenu_text = '';
		if ( 0 == $depth ) {
			$submenu_text = 'style="display: none;"';
		}
		?>
	<li id="menu-item-<?php echo $item_id; ?>" class="<?php echo implode( ' ', $classes ); ?>">
		<dl class="menu-item-bar">
			<dt class="menu-item-handle">
				<span class="item-title"><span class="menu-item-title"><?php echo esc_html( $title ); ?></span> <span
						class="is-submenu" <?php echo $submenu_text; ?>><?php _e( 'sub item', 'thrive' ); ?></span></span>
                <span class="item-controls">
                    <span class="item-type"><?php echo esc_html( $item->type_label ); ?></span>
                    <span class="item-order hide-if-js">
                        <a href="<?php
                        echo wp_nonce_url(
	                        add_query_arg(
		                        array(
			                        'action'    => 'move-up-menu-item',
			                        'menu-item' => $item_id,
		                        ), remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) )
	                        ), 'move-menu_item'
                        );
                        ?>" class="item-move-up"><abbr title="<?php esc_attr_e( 'Move up', 'thrive' ); ?>">
		                        &#8593;</abbr></a>
                        |
                        <a href="<?php
                        echo wp_nonce_url(
	                        add_query_arg(
		                        array(
			                        'action'    => 'move-down-menu-item',
			                        'menu-item' => $item_id,
		                        ), remove_query_arg( $removed_args, admin_url( 'nav-menus.php' ) )
	                        ), 'move-menu_item'
                        );
                        ?>" class="item-move-down"><abbr title="<?php esc_attr_e( 'Move down', 'thrive' ); ?>">
		                        &#8595;</abbr></a>
                    </span>
                    <a class="item-edit" id="edit-<?php echo $item_id; ?>"
                       title="<?php esc_attr_e( 'Edit Menu Item', 'thrive' ); ?>" href="<?php
                    echo ( isset( $_GET['edit-menu-item'] ) && $item_id == $_GET['edit-menu-item'] ) ? admin_url( 'nav-menus.php' ) : add_query_arg( 'edit-menu-item', $item_id, remove_query_arg( $removed_args, admin_url( 'nav-menus.php#menu-item-settings-' . $item_id ) ) );
                    ?>"><?php _e( 'Edit Menu Item', 'thrive' ); ?></a>
                </span>
			</dt>
		</dl>

		<div class="menu-item-settings" id="menu-item-settings-<?php echo $item_id; ?>">
			<?php if ( 'custom' == $item->type ) : ?>
				<p class="field-url description description-wide">
					<label for="edit-menu-item-url-<?php echo $item_id; ?>">
						<?php _e( 'URL', 'thrive' ); ?><br/>
						<input type="text" id="edit-menu-item-url-<?php echo $item_id; ?>"
						       class="widefat code edit-menu-item-url" name="menu-item-url[<?php echo $item_id; ?>]"
						       value="<?php echo esc_attr( $item->url ); ?>"/>
					</label>
				</p>
			<?php endif; ?>
			<p class="description description-thin">
				<label for="edit-menu-item-title-<?php echo $item_id; ?>">
					<?php _e( 'Navigation Label', 'thrive' ); ?><br/>
					<input type="text" id="edit-menu-item-title-<?php echo $item_id; ?>"
					       class="widefat edit-menu-item-title" name="menu-item-title[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( $item->title ); ?>"/>
				</label>
			</p>
			<p class="description description-thin">
				<label for="edit-menu-item-attr-title-<?php echo $item_id; ?>">
					<?php _e( 'Title Attribute', 'thrive' ); ?><br/>
					<input type="text" id="edit-menu-item-attr-title-<?php echo $item_id; ?>"
					       class="widefat edit-menu-item-attr-title"
					       name="menu-item-attr-title[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( $item->post_excerpt ); ?>"/>
				</label>
			</p>
			<p class="field-link-target description">
				<label for="edit-menu-item-target-<?php echo $item_id; ?>">
					<input type="checkbox" id="edit-menu-item-target-<?php echo $item_id; ?>" value="_blank"
					       name="menu-item-target[<?php echo $item_id; ?>]"<?php checked( $item->target, '_blank' ); ?> />
					<?php _e( 'Open link in a new window/tab', 'thrive' ); ?>
				</label>
			</p>
			<p class="field-css-classes description description-thin">
				<label for="edit-menu-item-classes-<?php echo $item_id; ?>">
					<?php _e( 'CSS Classes (optional)', 'thrive' ); ?><br/>
					<input type="text" id="edit-menu-item-classes-<?php echo $item_id; ?>"
					       class="widefat code edit-menu-item-classes" name="menu-item-classes[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( implode( ' ', $item->classes ) ); ?>"/>
				</label>
			</p>
			<p class="field-xfn description description-thin">
				<label for="edit-menu-item-xfn-<?php echo $item_id; ?>">
					<?php _e( 'Link Relationship (XFN)', 'thrive' ); ?><br/>
					<input type="text" id="edit-menu-item-xfn-<?php echo $item_id; ?>"
					       class="widefat code edit-menu-item-xfn" name="menu-item-xfn[<?php echo $item_id; ?>]"
					       value="<?php echo esc_attr( $item->xfn ); ?>"/>
				</label>
			</p>
			<p class="field-description description description-wide">
				<label for="edit-menu-item-description-<?php echo $item_id; ?>">
					<?php _e( 'Description', 'thrive' ); ?><br/>
					<textarea id="edit-menu-item-description-<?php echo $item_id; ?>"
					          class="widefat edit-menu-item-description" rows="3" cols="20"
					          name="menu-item-description[<?php echo $item_id; ?>]"><?php echo esc_html( $item->description ); // textarea_escaped                                      ?></textarea>
					<span
						class="description"><?php _e( 'The description will be displayed in the menu if the current theme supports it.', 'thrive' ); ?></span>
				</label>
			</p>

			<!-- Custom fields for the menu -->
			<?php if ( ( $depth == 0 && $item->object == "category" ) ): ?>
				<p class="description description-wide item-post-gallery">
					<label for="edit-menu-item-post-gallery-<?php echo $item_id; ?>">
						<input type="checkbox" id="edit-menu-item-post-gallery-<?php echo $item_id; ?>"
						       name="menu-item-post-gallery[<?php echo $item_id; ?>]"<?php checked( $item->post_gallery, 'on' ); ?> />
						<?php _e( 'Show Post Gallery', 'thrive' ); ?>
					</label>
				</p>

				<p class="description description-wide item-post-subcat">
					<label for="edit-menu-item-subcat-gallery-<?php echo $item_id; ?>">
						<input type="checkbox" id="edit-menu-item-subcat-gallery-<?php echo $item_id; ?>"
						       name="menu-item-subcat-gallery[<?php echo $item_id; ?>]"<?php checked( $item->subcat_gallery, 'on' ); ?> />
						<?php _e( 'Show Sub-categories in Post Gallery', 'thrive' ); ?>
					</label>
				</p>
			<?php endif; ?>

			<?php do_action( 'wp_nav_menu_item_custom_fields', $item_id, $item, $depth, $args ); ?>
			<!-- End custom fields for the menu -->

			<p class="field-move hide-if-no-js description description-wide">
				<label>
					<span><?php _e( 'Move', 'thrive' ); ?></span>
					<a href="#" data-dir="up" class="menus-move menus-move-up"><?php _e( 'Up one' ); ?></a>
					<a href="#" data-dir="down" class="menus-move menus-move-down"><?php _e( 'Down one' ); ?></a>
					<a href="#" data-dir="left" class="menus-move menus-move-left"></a>
					<a href="#" data-dir="right" class="menus-move menus-move-right"></a>
					<a href="#" data-dir="top" class="menus-move menus-move-top"><?php _e( 'To the top' ); ?></a>
				</label>
			</p>

			<div class="menu-item-actions description-wide submitbox">
				<?php if ( 'custom' != $item->type && $original_title !== false ) : ?>
					<p class="link-to-original">
						<?php printf( __( 'Original: %s', 'thrive' ), '<a href="' . esc_attr( $item->url ) . '">' . esc_html( $original_title ) . '</a>' ); ?>
					</p>
				<?php endif; ?>
				<a class="item-delete submitdelete deletion" id="delete-<?php echo $item_id; ?>" href="<?php
				echo wp_nonce_url(
					add_query_arg(
						array(
							'action'    => 'delete-menu-item',
							'menu-item' => $item_id,
						), admin_url( 'nav-menus.php' )
					), 'delete-menu_item_' . $item_id
				);
				?>"><?php _e( 'Remove', 'thrive' ); ?></a> <span class="meta-sep hide-if-no-js"> | </span> <a
					class="item-cancel submitcancel hide-if-no-js" id="cancel-<?php echo $item_id; ?>"
					href="<?php echo esc_url( add_query_arg( array(
						'edit-menu-item' => $item_id,
						'cancel'         => time()
					), admin_url( 'nav-menus.php' ) ) );
					?>#menu-item-settings-<?php echo $item_id; ?>"><?php _e( 'Cancel', 'thrive' ); ?></a>
			</div>

			<input class="menu-item-data-db-id" type="hidden" name="menu-item-db-id[<?php echo $item_id; ?>]"
			       value="<?php echo $item_id; ?>"/>
			<input class="menu-item-data-object-id" type="hidden" name="menu-item-object-id[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->object_id ); ?>"/>
			<input class="menu-item-data-object" type="hidden" name="menu-item-object[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->object ); ?>"/>
			<input class="menu-item-data-parent-id" type="hidden" name="menu-item-parent-id[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->menu_item_parent ); ?>"/>
			<input class="menu-item-data-position" type="hidden" name="menu-item-position[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->menu_order ); ?>"/>
			<input class="menu-item-data-type" type="hidden" name="menu-item-type[<?php echo $item_id; ?>]"
			       value="<?php echo esc_attr( $item->type ); ?>"/>
		</div><!-- .menu-item-settings-->
		<ul class="menu-item-transport"></ul>

		<?php
		$output .= ob_get_clean();
	}

}

// Walker_Nav_Menu_Edit


