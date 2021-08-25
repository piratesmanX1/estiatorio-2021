import { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";

const RestaurantList = ({restaurant_list, setProgressBar, progressBar}) => {
    useEffect(() => {
        setProgressBar(100);
    }, [])

    return (
        <div className="entry-content">
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
          <div data-elementor-type="wp-page" data-elementor-id={5323} className="elementor elementor-5323" data-elementor-settings="[]">
          <div className="elementor-section-wrap">
            <section className="elementor-section elementor-top-section elementor-element elementor-element-26ae3a4 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="26ae3a4" data-element_type="section">
              <div className="elementor-container elementor-column-gap-no">
                <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-7df5ea8" data-id="7df5ea8" data-element_type="column">
                  <div className="elementor-widget-wrap elementor-element-populated">
                    <div className="elementor-element elementor-element-bce50fc arrow-style-1 elementor-widget elementor-widget-babe-all-items" data-id="bce50fc" data-element_type="widget" data-widget_type="babe-all-items.default">
                      <div className="elementor-widget-container">
                        <div data-elementor-columns={1} data-elementor-columns-tablet={1} data-elementor-columns-mobile={1}>
                          <div className="babe_shortcode_block sc_all_items ">
                            <div className="babe_shortcode_block_bg_inner">
                              <div className="babe_shortcode_block_inner">

                                {restaurant_list.map((data) => (
                                    <div className="babe_items babe_items_3 column-item">
                                      <div className="babe_all_items_item_inner">
                                        <div className="item_img">
                                          <Link className="item-thumb" to={`/restaurant/${data.restaurant_id}`} ><img className="lazyload" src={data.restaurant_logo || "./assets/image/E01.png"} /></Link>
                                        </div>
                                        <div className="item_text">
                                          <div className="item_title"> <Link to={`/restaurant/${data.restaurant_id}`} >{data.restaurant_name}</Link></div>
                                          <div className="item-meta"> <span className="item-acreage">{data.seat_capacity} seat capacity</span> <span className="item-features" title="Balcony">{data.restaurant_address}</span></div>
                                          <div className="item_description"> {data.restaurant_description}</div>
                                          <div className="item-bottom">
                                            <div className="item_info_price">
                                              <label>Reservation fee</label> <span className="item_info_price_new"><span className="currency_amount" data-amount={data.reservation_fee}><span className="currency_symbol">RM</span>{data.reservation_fee}</span>
                                              </span>
                                            </div> <Link to={`/restaurant/${data.restaurant_id}`} className="read-more-item">See detail</Link></div>
                                        </div>
                                      </div>
                                    </div>
                                ))}
                                    {/* <div className="babe_items babe_items_3 column-item">
                                      <div className="babe_all_items_item_inner">
                                        <div className="item_img">
                                          <a className="item-thumb" href="https://demo2.wpopal.com/rominal/hotels/budget-room/"><img className="lazyload" src="data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%20210%20140%22%3E%3C/svg%3E" data-src="https://demo2wpopal.b-cdn.net/rominal/wp-content/uploads/2021/04/1-820x520.jpg" alt="Budget Room" /></a>
                                        </div>
                                        <div className="item_text">
                                          <div className="item_title"> <a href="https://demo2.wpopal.com/rominal/hotels/budget-room/">Budget Room</a></div>
                                          <div className="item-meta"> <span className="item-acreage">20 m2</span> <span className="item-features" title="Balcony">Balcony</span> <span className="item-features" title="Lake view">Lake view</span></div>
                                          <div className="item_description"> All our Deluxe rooms have big windows to help you take a broad view of the cityscape and nature. We offer bigger bed and every bathroom has bathtub and shower,...</div>
                                          <div className="item-bottom">
                                            <div className="item_info_price">
                                              <label>From</label> <span className="item_info_price_new"><span className="currency_amount" data-amount={65}><span className="currency_symbol">$</span>65</span>
                                              </span>
                                            </div> <a className="read-more-item" href="https://demo2.wpopal.com/rominal/hotels/budget-room/">See detail</a></div>
                                        </div>
                                      </div>
                                    </div> */}

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
              </div>
            </div>
        </motion.div>
      </div>
    );
}
 
export default RestaurantList;