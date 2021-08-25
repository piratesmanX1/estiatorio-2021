import { Link } from 'react-router-dom';

// Import Fontawesome
import { faSearchPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const IndexBanner = () => {
    return (
        <section className="elementor-section elementor-top-section elementor-element elementor-element-b8ecc10 elementor-section-height-min-height elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-items-middle elementor-motion-effects-element elementor-motion-effects-element-type-background" data-id="b8ecc10" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;,&quot;background_motion_fx_motion_fx_scrolling&quot;:&quot;yes&quot;,&quot;background_motion_fx_translateY_effect&quot;:&quot;yes&quot;,&quot;background_motion_fx_translateY_speed&quot;:{&quot;unit&quot;:&quot;px&quot;,&quot;size&quot;:3,&quot;sizes&quot;:[]},&quot;background_motion_fx_devices&quot;:[&quot;desktop&quot;],&quot;background_motion_fx_translateY_affectedRange&quot;:{&quot;unit&quot;:&quot;%&quot;,&quot;size&quot;:&quot;&quot;,&quot;sizes&quot;:{&quot;start&quot;:0,&quot;end&quot;:100}}}" style={{width: '1090px', left: '-0.1px'}}><div className="elementor-motion-effects-container"><div className="elementor-motion-effects-layer" style={{width: '100%', height: '130%', translate: '-161.791px', transform: 'translateY(var(--translateY))'}} /></div>
            <div className="elementor-background-overlay" />
                <div className="elementor-container elementor-column-gap-no">
                    <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-89802aa" data-id="89802aa" data-element_type="column">
                    <div className="elementor-widget-wrap elementor-element-populated">
                        <div className="elementor-element elementor-element-b031796 animated-fast elementor-widget elementor-widget-rominal-video-popup animated opal-move-up" data-id="b031796" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;opal-move-up&quot;}" data-widget_type="rominal-video-popup.default">
                        <div className="elementor-widget-container">
                            <div className="elementor-video-wrapper rominal-video-popup">
                            <Link to="/browse" className="elementor-video-popup" href="" data-effect="mfp-zoom-in"> 
                                <span className="elementor-video-icon">
                                    <FontAwesomeIcon icon={faSearchPlus} />
                                </span>
                            </Link>
                            </div>
                        </div>
                        </div>
                        <div className="elementor-element elementor-element-f47d421 animated-fast elementor-widget elementor-widget-text-editor animated opal-move-up" data-id="f47d421" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;opal-move-up&quot;}" data-widget_type="text-editor.default">
                        <div className="elementor-widget-container"> Explore. Wander. Enjoy.</div>
                        </div>
                        <div className="elementor-element elementor-element-0be54d6 elementor-widget-tablet__width-initial animated-fast elementor-widget elementor-widget-heading animated opal-move-up" data-id="0be54d6" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;opal-move-up&quot;}" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                            <h2 className="elementor-heading-title elementor-size-default">Discover A Place Where Magic Starts</h2></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
 
export default IndexBanner;