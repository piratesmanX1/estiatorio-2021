import CarouselItem from "./CarouselItem"
import Carousel from 'react-tiny-slider'

const RestaurantCarousel = () => {
    return (
        <section className="elementor-section elementor-top-section elementor-element elementor-element-50bfd20 elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="50bfd20" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;}" style={{width: '1090px', left: '-0.1px'}}>
            <div className="elementor-container elementor-column-gap-no">
                <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-83c9925" data-id="83c9925" data-element_type="column">
                    <div className="elementor-widget-wrap elementor-element-populated">
                    <div className="elementor-element elementor-element-ab84a05 animated-fast elementor-view-default elementor-widget elementor-widget-icon animated opal-move-up" data-id="ab84a05" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;opal-move-up&quot;}" data-widget_type="icon.default">
                        <div className="elementor-widget-container">
                        <div className="elementor-icon-wrapper">
                            <div className="elementor-icon"> <i aria-hidden="true" className="rominal-icon- rominal-icon-dots" /></div>
                        </div>
                        </div>
                    </div>
                    <div className="elementor-element elementor-element-de47c55 animated-fast elementor-widget elementor-widget-heading animated opal-move-up" data-id="de47c55" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;opal-move-up&quot;}" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                        <h4 className="elementor-heading-title elementor-size-default">Discover</h4></div>
                    </div>
                    <div className="elementor-element elementor-element-fec988e animated-fast elementor-widget elementor-widget-heading animated opal-move-up" data-id="fec988e" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;opal-move-up&quot;}" data-widget_type="heading.default">
                        <div className="elementor-widget-container">
                        <h2 className="elementor-heading-title elementor-size-default">Restaurant &amp; Beverages</h2></div>
                    </div>
                    <div className="elementor-element elementor-element-beb6df1 animated-fast arrow-style-1 elementor-widget elementor-widget-babe-all-items animated opal-move-up" data-id="beb6df1" data-element_type="widget" data-settings="{&quot;_animation&quot;:&quot;opal-move-up&quot;}" data-widget_type="babe-all-items.default">
                        <div className="elementor-widget-container">
                        <div className="rominal-carousel-items" data-carousel="{&quot;navigation&quot;:&quot;dots&quot;,&quot;autoplayHoverPause&quot;:true,&quot;autoplay&quot;:true,&quot;autoplaySpeed&quot;:5000,&quot;items&quot;:2,&quot;items_tablet&quot;:2,&quot;items_mobile&quot;:1,&quot;loop&quot;:true}">
                            <div className="babe_shortcode_block sc_all_items ">
                                <div className="babe_shortcode_block_bg_inner">
                                    <div className="babe_shortcode_block_inner slick-initialized slick-slider slick-dotted">
                                        <div className="slick-list draggable">
                                            <div className="slick-track">
                                            {/* <Carousel
                                                swipeAngle={false}
                                                items={3}
                                                mouseDrag
                                                ref={carousel}
                                                controls={false}
                                                nav={false}
                                            >
                                                {slides.map((slide) => {
                                                    return <div>
                                                        <div className={'slide'}>{slide}</div>
                                                        <CarouselItem />
                                                    </div>
                                                })}
                                            </Carousel> */} 
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
 
export default RestaurantCarousel;