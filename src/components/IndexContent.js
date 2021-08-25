import { useEffect, useState } from "react";
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";

// Components
import IndexAboutUs from "./IndexAboutUs";
import IndexAssurance from "./IndexAssurance";
import IndexBanner from "./IndexBanner";
import IndexIntroduction from "./IndexIntroduction";
import IndexServices from "./IndexServices";
import IndexSlider from "./IndexSlider";
import IndexSearch from "./IndexSearch";
import RestaurantCarousel from "./RestaurantCarousel";

// CSS
import '../assets/css/index.css';

const IndexContent = () => {
  const [progressBar, setProgressBar] = useState(0);

  useEffect(() => {
    setProgressBar(100);
    document.getElementById("estiatorio-header").classList.remove("inverted");
    document.getElementById("navbar").classList.remove("hidden");
    document.getElementById("contact").classList.remove("hidden");
    document.getElementById("navbar").classList.remove("removed");
    document.getElementById("contact").classList.remove("removed");
    document.title = ' Home | Estiatorio ';
    
    var babe_lst = {
      "ajax_url": "https:\/\/demo2.wpopal.com\/rominal\/wp-admin\/admin-ajax.php",
      "date_format": "dd\/mm\/yy",
      "drp_date_format": "DD\/MM\/YYYY",
      "date_from": null,
      "date_to": null,
      "time_from": null,
      "time_to": null,
      "guests": [],
      "nonce": "fed92e4cbe",
      "av_cal": [],
      "max_av_cal_date": "29\/06\/2022",
      "basic_booking_period": "",
      "cal_first_click": "",
      "start_lat": "",
      "start_lng": "",
      "start_zoom": "0",
      "marker_icon": "https:\/\/demo2.wpopal.com\/rominal\/wp-content\/plugins\/ba-book-everything",
      "travel_mode_html": "\r\n               <div id=\"travel_mode_panel_modal\">\r\n                <label for=\"travel_mode_modal\">Mode of Travel: <\/label>\r\n                <select id=\"travel_mode_modal\" name=\"travel_mode_modal\">\r\n                <option value=\"WALKING\">Walking<\/option>\r\n                <option value=\"DRIVING\">Driving<\/option>\r\n                <option value=\"BICYCLING\">Bicycling<\/option>\r\n                <\/select>\r\n               <\/div>\r\n               \r\n                <input class=\"address-autocomplete\" name=\"autocomplete\" placeholder=\"Enter your address\" type=\"text\" \/>\r\n                ",
      "unitegallery_args": {
        "gallery_theme": "default",
        "theme_panel_position": "bottom",
        "theme_hide_panel_under_width": 480,
        "gallery_width": 900,
        "gallery_height": 500,
        "gallery_min_width": 320,
        "gallery_min_height": 300,
        "gallery_skin": "default",
        "gallery_images_preload_type": "minimal",
        "gallery_autoplay": true,
        "gallery_play_interval": 7000,
        "gallery_pause_on_mouseover": true,
        "gallery_control_thumbs_mousewheel": false,
        "gallery_control_keyboard": true,
        "gallery_carousel": true,
        "gallery_preserve_ratio": true,
        "gallery_debug_errors": true,
        "gallery_background_color": "",
        "slider_scale_mode": "fill",
        "slider_scale_mode_media": "fill",
        "slider_scale_mode_fullscreen": "down",
        "slider_item_padding_top": 0,
        "slider_item_padding_bottom": 0,
        "slider_item_padding_left": 0,
        "slider_item_padding_right": 0,
        "slider_transition": "slide",
        "slider_transition_speed": 1500,
        "slider_transition_easing": "easeInOutQuad",
        "slider_control_swipe": true,
        "slider_control_zoom": true,
        "slider_zoom_max_ratio": 6,
        "slider_loader_type": 1,
        "slider_loader_color": "white",
        "slider_enable_bullets": false,
        "slider_bullets_skin": "",
        "slider_bullets_space_between": -1,
        "slider_bullets_align_hor": "center",
        "slider_bullets_align_vert": "bottom",
        "slider_bullets_offset_hor": 0,
        "slider_bullets_offset_vert": 10,
        "slider_enable_arrows": true,
        "slider_arrows_skin": "",
        "slider_arrow_left_align_hor": "left",
        "slider_arrow_left_align_vert": "middle",
        "slider_arrow_left_offset_hor": 20,
        "slider_arrow_left_offset_vert": 0,
        "slider_arrow_right_align_hor": "right",
        "slider_arrow_right_align_vert": "middle",
        "slider_arrow_right_offset_hor": 20,
        "slider_arrow_right_offset_vert": 0,
        "slider_enable_progress_indicator": false,
        "slider_progress_indicator_type": "pie",
        "slider_progress_indicator_align_hor": "left",
        "slider_progress_indicator_align_vert": "top",
        "slider_progress_indicator_offset_hor": 16,
        "slider_progress_indicator_offset_vert": 36,
        "slider_progressbar_color": "#ffffff",
        "slider_progressbar_opacity": 0.6,
        "slider_progressbar_line_width": 5,
        "slider_progresspie_type_fill": false,
        "slider_progresspie_color1": "#B5B5B5",
        "slider_progresspie_color2": "#E5E5E5",
        "slider_progresspie_stroke_width": 6,
        "slider_progresspie_width": 30,
        "slider_progresspie_height": 30,
        "slider_enable_play_button": true,
        "slider_play_button_skin": "",
        "slider_play_button_align_hor": "left",
        "slider_play_button_align_vert": "top",
        "slider_play_button_offset_hor": 40,
        "slider_play_button_offset_vert": 8,
        "slider_enable_fullscreen_button": true,
        "slider_fullscreen_button_skin": "",
        "slider_fullscreen_button_align_hor": "left",
        "slider_fullscreen_button_align_vert": "top",
        "slider_fullscreen_button_offset_hor": 11,
        "slider_fullscreen_button_offset_vert": 9,
        "slider_enable_zoom_panel": true,
        "slider_zoompanel_skin": "",
        "slider_zoompanel_align_hor": "right",
        "slider_zoompanel_align_vert": "top",
        "slider_zoompanel_offset_hor": 12,
        "slider_zoompanel_offset_vert": 10,
        "slider_controls_always_on": true,
        "slider_controls_appear_ontap": true,
        "slider_controls_appear_duration": 300,
        "slider_videoplay_button_type": "square",
        "slider_enable_text_panel": false,
        "slider_textpanel_always_on": true,
        "slider_textpanel_text_valign": "middle",
        "slider_textpanel_padding_top": 10,
        "slider_textpanel_padding_bottom": 10,
        "slider_textpanel_height": null,
        "slider_textpanel_padding_title_description": 5,
        "slider_textpanel_padding_right": 11,
        "slider_textpanel_padding_left": 11,
        "slider_textpanel_fade_duration": 200,
        "slider_textpanel_enable_title": true,
        "slider_textpanel_enable_description": true,
        "slider_textpanel_enable_bg": true,
        "slider_textpanel_bg_color": "#000000",
        "slider_textpanel_bg_opacity": 0.4,
        "slider_textpanel_title_color": null,
        "slider_textpanel_title_font_family": null,
        "slider_textpanel_title_text_align": null,
        "slider_textpanel_title_font_size": null,
        "slider_textpanel_title_bold": null,
        "slider_textpanel_desc_color": null,
        "slider_textpanel_desc_font_family": null,
        "slider_textpanel_desc_text_align": null,
        "slider_textpanel_desc_font_size": null,
        "slider_textpanel_desc_bold": null,
        "thumb_width": 88,
        "thumb_height": 50,
        "thumb_fixed_size": true,
        "thumb_border_effect": true,
        "thumb_border_width": 0,
        "thumb_border_color": "#000000",
        "thumb_over_border_width": 0,
        "thumb_over_border_color": "#d9d9d9",
        "thumb_selected_border_width": 1,
        "thumb_selected_border_color": "#d9d9d9",
        "thumb_round_corners_radius": 0,
        "thumb_color_overlay_effect": true,
        "thumb_overlay_color": "#000000",
        "thumb_overlay_opacity": 0.4,
        "thumb_overlay_reverse": false,
        "thumb_image_overlay_effect": false,
        "thumb_image_overlay_type": "bw",
        "thumb_transition_duration": 200,
        "thumb_transition_easing": "easeOutQuad",
        "thumb_show_loader": true,
        "thumb_loader_type": "dark",
        "strippanel_padding_top": 8,
        "strippanel_padding_bottom": 8,
        "strippanel_padding_left": 0,
        "strippanel_padding_right": 0,
        "strippanel_enable_buttons": false,
        "strippanel_buttons_skin": "",
        "strippanel_padding_buttons": 2,
        "strippanel_buttons_role": "scroll_strip",
        "strippanel_enable_handle": true,
        "strippanel_handle_align": "top",
        "strippanel_handle_offset": 0,
        "strippanel_handle_skin": "",
        "strippanel_background_color": "",
        "strip_thumbs_align": "left",
        "strip_space_between_thumbs": 6,
        "strip_thumb_touch_sensetivity": 15,
        "strip_scroll_to_thumb_duration": 500,
        "strip_scroll_to_thumb_easing": "easeOutCubic",
        "strip_control_avia": true,
        "strip_control_touch": true
      },
      "daterangepickerLocale": {
        "applyLabel": "Apply",
        "cancelLabel": "Cancel",
        "fromLabel": "From",
        "toLabel": "To",
        "customRangeLabel": "Custom",
        "weekLabel": "W",
        "daysOfWeek": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        "monthNames": {
          "January": "January",
          "February": "February",
          "March": "March",
          "April": "April",
          "May": "May",
          "June": "June",
          "July": "July",
          "August": "August",
          "September": "September",
          "October": "October",
          "November": "November",
          "December": "December"
        },
        "firstDay": 1
      }
    };
    var _wpUtilSettings = {
      "ajax": {
        "url": "\/rominal\/wp-admin\/admin-ajax.php"
      }
    };
    var rominalAjax = {
      "ajaxurl": "https:\/\/demo2.wpopal.com\/rominal\/wp-admin\/admin-ajax.php"
    };
    var elementorFrontendConfig = {
      "environmentMode": {
        "edit": false,
        "wpPreview": false,
        "isScriptDebug": false
      },
      "i18n": {
        "shareOnFacebook": "Share on Facebook",
        "shareOnTwitter": "Share on Twitter",
        "pinIt": "Pin it",
        "download": "Download",
        "downloadImage": "Download image",
        "fullscreen": "Fullscreen",
        "zoom": "Zoom",
        "share": "Share",
        "playVideo": "Play Video",
        "previous": "Previous",
        "next": "Next",
        "close": "Close"
      },
      "is_rtl": false,
      "breakpoints": {
        "xs": 0,
        "sm": 480,
        "md": 768,
        "lg": 1025,
        "xl": 1440,
        "xxl": 1600
      },
      "responsive": {
        "breakpoints": {
          "mobile": {
            "label": "Mobile",
            "value": 767,
            "direction": "max",
            "is_enabled": true
          },
          "mobile_extra": {
            "label": "Mobile Extra",
            "value": 880,
            "direction": "max",
            "is_enabled": false
          },
          "tablet": {
            "label": "Tablet",
            "value": 1024,
            "direction": "max",
            "is_enabled": true
          },
          "tablet_extra": {
            "label": "Tablet Extra",
            "value": 1365,
            "direction": "max",
            "is_enabled": false
          },
          "laptop": {
            "label": "Laptop",
            "value": 1620,
            "direction": "max",
            "is_enabled": false
          },
          "widescreen": {
            "label": "Widescreen",
            "value": 2400,
            "direction": "min",
            "is_enabled": false
          }
        }
      },
      "version": "3.2.3",
      "is_static": false,
      "experimentalFeatures": {
        "e_dom_optimization": true,
        "a11y_improvements": true,
        "landing-pages": true,
        "form-submissions": true
      },
      "urls": {
        "assets": "https:\/\/demo2.wpopal.com\/rominal\/wp-content\/plugins\/elementor\/assets\/"
      },
      "settings": {
        "page": [],
        "editorPreferences": []
      },
      "kit": {
        "active_breakpoints": ["viewport_mobile", "viewport_tablet"],
        "global_image_lightbox": "yes",
        "lightbox_enable_counter": "yes",
        "lightbox_enable_fullscreen": "yes",
        "lightbox_enable_zoom": "yes",
        "lightbox_enable_share": "yes",
        "lightbox_title_src": "title",
        "lightbox_description_src": "description"
      },
      "post": {
        "id": 14,
        "title": "Home%202%20%E2%80%93%20Rominal",
        "excerpt": "",
        "featuredImage": false
      }
    };
    var ElementorProFrontendConfig = {
      "ajaxurl": "https:\/\/demo2.wpopal.com\/rominal\/wp-admin\/admin-ajax.php",
      "nonce": "2a442b0e1f",
      "urls": {
        "assets": "https:\/\/demo2.wpopal.com\/rominal\/wp-content\/plugins\/elementor-pro\/assets\/"
      },
      "i18n": {
        "toc_no_headings_found": "No headings were found on this page."
      },
      "shareButtonsNetworks": {
        "facebook": {
          "title": "Facebook",
          "has_counter": true
        },
        "twitter": {
          "title": "Twitter"
        },
        "google": {
          "title": "Google+",
          "has_counter": true
        },
        "linkedin": {
          "title": "LinkedIn",
          "has_counter": true
        },
        "pinterest": {
          "title": "Pinterest",
          "has_counter": true
        },
        "reddit": {
          "title": "Reddit",
          "has_counter": true
        },
        "vk": {
          "title": "VK",
          "has_counter": true
        },
        "odnoklassniki": {
          "title": "OK",
          "has_counter": true
        },
        "tumblr": {
          "title": "Tumblr"
        },
        "digg": {
          "title": "Digg"
        },
        "skype": {
          "title": "Skype"
        },
        "stumbleupon": {
          "title": "StumbleUpon",
          "has_counter": true
        },
        "mix": {
          "title": "Mix"
        },
        "telegram": {
          "title": "Telegram"
        },
        "pocket": {
          "title": "Pocket",
          "has_counter": true
        },
        "xing": {
          "title": "XING",
          "has_counter": true
        },
        "whatsapp": {
          "title": "WhatsApp"
        },
        "email": {
          "title": "Email"
        },
        "print": {
          "title": "Print"
        }
      },
      "facebook_sdk": {
        "lang": "en_US",
        "app_id": ""
      },
      "lottie": {
        "defaultAnimationUrl": "https:\/\/demo2.wpopal.com\/rominal\/wp-content\/plugins\/elementor-pro\/modules\/lottie\/assets\/animations\/default.json"
      }
    };
  }, []);

    return (
      <div class="IndexContent">
        <LoadingBar 
            color="#ffe500"
            progress={progressBar}
            onLoaderFinished={() => setProgressBar(0)}
        />
        <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.75}}
        >
        <div id="content" className="site-content">
          <div className="col-full">
            <div id="primary" className="content-area">
              <main id="main" className="site-main">
                <div data-elementor-type="wp-page" data-elementor-id={14} className="elementor elementor-14" data-elementor-settings="[]">
                  <div className="elementor-section-wrap elementor-motion-effects-parent">
                    <section className="elementor-section elementor-top-section elementor-element elementor-element-3a32f8b elementor-section-full_width elementor-section-stretched elementor-section-height-default elementor-section-height-default" data-id="3a32f8b" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}" style={{width: '1090px', left: '-0.1px'}}>
                      <div className="elementor-container elementor-column-gap-no">
                        <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-fdab756" data-id="fdab756" data-element_type="column">
                          <div className="elementor-widget-wrap elementor-element-populated">
                            <div className="elementor-element elementor-element-7000547 elementor-widget elementor-widget-rominal-revslider" data-id={7000547} data-element_type="widget" data-widget_type="rominal-revslider.default">
                              <div className="elementor-widget-container">
                                <IndexSlider />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                    <IndexSearch />
                    <IndexIntroduction />
                    <IndexAboutUs />
                    <RestaurantCarousel />
                    <IndexBanner />
                    <IndexServices />
                    <IndexAssurance />
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </motion.div>
      </div>
    );
}
 
export default IndexContent;