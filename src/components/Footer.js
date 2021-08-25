import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useSnackbar } from 'notistack';

// Material UI
import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
  }
}));

const Footer = () => {
    const classes = useStyles();

    // backdrop settings
    const [loadingOpen, setLoadingOpen] = useState(false);

    const[fullname, setFullname] = useState("");
    const[email, setEmail] = useState("");

    // Defining snackbar from MaterialUI
    const { enqueueSnackbar } = useSnackbar();

    // const handleClickVariant = (variant) => () => {
    //   // variant could be success, error, warning, info, or default
    //   enqueueSnackbar('News subscribed.', { variant });
    // };

    const handleSubmit = (e) => {
      e.preventDefault(); // preventing the form onsubmit automatically refresh the page

      let subscriptionForm = new FormData();
    
      subscriptionForm.append("fullName", fullname);
      subscriptionForm.append("email", email);
      subscriptionForm.append("subject", 6);
      
      const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/mail.php`; // direct it to the PHP folder

      setLoadingOpen(true);
      axios.post(API_PATH, subscriptionForm) // asynchronous, therefore promises
        .then((res) => {
          console.log(res.data);
          setLoadingOpen(false);
          // if POST is a success then output a snackbar from MaterialUI
          if (res.data == true) {
            enqueueSnackbar('News subscribed', {variant: 'success'});
          } else {
            enqueueSnackbar("Subscription failed, please try again", {variant: 'error'});
          }
        })
        .catch((err) =>  {
          setLoadingOpen(false);
          enqueueSnackbar(err, {variant: 'error'});
          throw Error("Error: News subscription failed for some reason. Error: " + err); // making a custom error message that will show in console
        });
    }

    return (
      <div id="contact" data-elementor-type="footer" data-elementor-id={676} className="elementor elementor-676 elementor-location-footer" data-elementor-settings="[]">
        <div className="elementor-section-wrap">
          <section className="elementor-section elementor-top-section elementor-element elementor-element-ee19c57 elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="ee19c57" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
            <div className="elementor-container elementor-column-gap-no">
              <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-58c2d54" data-id="58c2d54" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-05d9af6 elementor-widget elementor-widget-heading" data-id="05d9af6" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Sign Up For Exclusive <br /> Offers From Us</h2></div>
                  </div>
                  <div className="elementor-element elementor-element-fde6318 elementor-button-align-stretch elementor-widget elementor-widget-form" data-id="fde6318" data-element_type="widget" data-settings="{&quot;button_width&quot;:&quot;20&quot;,&quot;step_next_label&quot;:&quot;Next&quot;,&quot;step_previous_label&quot;:&quot;Previous&quot;,&quot;button_width_tablet&quot;:&quot;33&quot;,&quot;step_type&quot;:&quot;number_text&quot;,&quot;step_icon_shape&quot;:&quot;circle&quot;}" data-widget_type="form.default">
                    <div className="elementor-widget-container">
                      <form className="elementor-form" name="New Form" onSubmit={handleSubmit}>
                        <input type="hidden" name="post_id" defaultValue={676} />
                        <input type="hidden" name="form_id" defaultValue="fde6318" />
                        <input type="hidden" name="referer_title" defaultValue="Home 2" />
                        <input type="hidden" name="queried_id" defaultValue={14} />
                        <div className="elementor-form-fields-wrapper elementor-labels-">
                          <div className="elementor-field-type-text elementor-field-group elementor-column elementor-field-group-name elementor-col-40 elementor-md-33">
                            <label htmlFor="form-field-name" className="elementor-field-label elementor-screen-only">Name</label>
                            <input 
                              size={1} 
                              type="text" 
                              name="form_fields[name]" 
                              id="form-field-name" 
                              className="elementor-field elementor-size-sm  elementor-field-textual" 
                              required 
                              placeholder="Your name." 
                              value={fullname}
                              onChange = {(e) => setFullname(e.target.value)}
                            />
                          </div>
                          <div className="elementor-field-type-email elementor-field-group elementor-column elementor-field-group-email elementor-col-40 elementor-md-33 elementor-field-required">
                            <label htmlFor="form-field-email" className="elementor-field-label elementor-screen-only">Email</label>
                            <input 
                              size={1} 
                              type="email" 
                              name="form_fields[email]" 
                              id="form-field-email" 
                              className="elementor-field elementor-size-sm  elementor-field-textual" 
                              placeholder="Your email address " 
                              required="required" 
                              aria-required="true" 
                              value={email}
                              onChange = {(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="elementor-field-group elementor-column elementor-field-type-submit elementor-col-20 e-form__buttons elementor-md-33">
                            <button type="submit" className="elementor-button elementor-size-sm"> <span> <span className=" elementor-button-icon"> </span> <span className="elementor-button-text">SUBSCRIBE NOW</span> </span>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="elementor-section elementor-top-section elementor-element elementor-element-42cc610 elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="42cc610" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
            <div className="elementor-container elementor-column-gap-no">
              <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-4fab84e" data-id="4fab84e" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-d3e2ffb elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="d3e2ffb" data-element_type="widget" data-widget_type="divider.default">
                    <div className="elementor-widget-container">
                      <div className="elementor-divider"> <span className="elementor-divider-separator"> </span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="elementor-section elementor-top-section elementor-element elementor-element-1097891 elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id={1097891} data-element_type="section" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
            <div className="elementor-container elementor-column-gap-no">
              <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-c803001" data-id="c803001" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-b59f88a elementor-widget elementor-widget-image" data-id="b59f88a" data-element_type="widget" data-widget_type="image.default">
                    <div className="elementor-widget-container">
                      <Link to="/"> <img width={980} height={980} src="./assets/image/L00.png" className="lazyload attachment-large size-large" alt="Estiatorio" data-srcset="" data-sizes="(max-width: 980px) 100vw, 980px" /> </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-2b48b3e" data-id="2b48b3e" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-4022720 elementor-widget elementor-widget-heading" data-id={4022720} data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">QUICK LINKS</h2></div>
                  </div>
                  <div className="elementor-element elementor-element-0e27b36 elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="0e27b36" data-element_type="widget" data-widget_type="icon-list.default">
                    <div className="elementor-widget-container">
                      <ul className="elementor-icon-list-items">
                        <li className="elementor-icon-list-item">
                          <Link to="/"> <span className="elementor-icon-list-text">Home</span></Link>
                        </li>
                        <li className="elementor-icon-list-item">
                          <Link to="/"> <span className="elementor-icon-list-text">Terms &amp; Conditions</span> </Link>
                        </li>
                        <li className="elementor-icon-list-item">
                          <Link to="/"> <span className="elementor-icon-list-text">FAQ</span> </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-4d1445f" data-id="4d1445f" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-2ecb94e elementor-widget elementor-widget-heading" data-id="2ecb94e" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Address</h2></div>
                  </div>
                  <div className="elementor-element elementor-element-d187456 elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-id="d187456" data-element_type="widget" data-widget_type="icon-list.default">
                    <div className="elementor-widget-container">
                      <ul className="elementor-icon-list-items">
                        <li className="elementor-icon-list-item"> <span className="elementor-icon-list-text">62502 Putrajaya,</span></li>
                        <li className="elementor-icon-list-item"> <span className="elementor-icon-list-text">Perdana Putra,</span></li>
                        <li className="elementor-icon-list-item"> <span className="elementor-icon-list-text">Administrative Centre</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-5c20542" data-id="5c20542" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-0d106f9 elementor-widget elementor-widget-heading" data-id="0d106f9" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">Reservations</h2></div>
                  </div>
                  <div className="elementor-element elementor-element-538ba50 elementor-widget elementor-widget-text-editor" data-id="538ba50" data-element_type="widget" data-widget_type="text-editor.default">
                    <div className="elementor-widget-container"> (+60) 10 4583800</div>
                  </div>
                  <div className="elementor-element elementor-element-9b6a809 elementor-widget elementor-widget-text-editor" data-id="9b6a809" data-element_type="widget" data-widget_type="text-editor.default">
                    <div className="elementor-widget-container"> <span style={{color: '#bdbdbd'}}><a href="mailto:estiatorio4896@gmail.com" style={{color: '#bdbdbd'}}><span className="__cf_email__" data-cfemail="61121411110e1315210419000c110d044f020e0c">estiatorio4896@gmail.com</span></a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="elementor-column elementor-col-20 elementor-top-column elementor-element elementor-element-59b4a70" data-id="59b4a70" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-2150c1b elementor-widget elementor-widget-heading" data-id="2150c1b" data-element_type="widget" data-widget_type="heading.default">
                    <div className="elementor-widget-container">
                      <h2 className="elementor-heading-title elementor-size-default">follow us</h2></div>
                  </div>
                  <div className="elementor-element elementor-element-cba89f0 e-grid-align-left e-grid-align-center elementor-shape-rounded elementor-grid-0 elementor-widget elementor-widget-social-icons" data-id="cba89f0" data-element_type="widget" data-widget_type="social-icons.default">
                    <div className="elementor-widget-container">
                      <div className="elementor-social-icons-wrapper elementor-grid">
                        <div className="elementor-grid-item">
                          <a className="elementor-icon elementor-social-icon elementor-social-icon-facebook elementor-repeater-item-3aaa7b4" href="https://www.facebook.com/" target="_blank"> <span className="elementor-screen-only">Facebook</span> <i className="fab fa-facebook" /> </a>
                        </div>
                        <div className="elementor-grid-item">
                          <a className="elementor-icon elementor-social-icon elementor-social-icon-twitter elementor-repeater-item-12761ef" href="https://twitter.com/" target="_blank"> <span className="elementor-screen-only">Twitter</span> <i className="fab fa-twitter" /> </a>
                        </div>
                        <div className="elementor-grid-item">
                          <a className="elementor-icon elementor-social-icon elementor-social-icon-youtube elementor-repeater-item-9d3b0d7" href="https://www.youtube.com/" target="_blank"> <span className="elementor-screen-only">Youtube</span> <i className="fab fa-youtube" /> </a>
                        </div>
                        <div className="elementor-grid-item">
                          <a className="elementor-icon elementor-social-icon elementor-social-icon-wordpress elementor-repeater-item-1a4ae9e" href="https://wordpress.com/" target="_blank"> <span className="elementor-screen-only">Wordpress</span> <i className="fab fa-wordpress" /> </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="elementor-section elementor-top-section elementor-element elementor-element-e4e820e elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="e4e820e" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
            <div className="elementor-container elementor-column-gap-no">
              <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-8cd911f" data-id="8cd911f" data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-6fd5340 elementor-widget-divider--view-line elementor-widget elementor-widget-divider" data-id="6fd5340" data-element_type="widget" data-widget_type="divider.default">
                    <div className="elementor-widget-container">
                      <div className="elementor-divider"> <span className="elementor-divider-separator"> </span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="elementor-section elementor-top-section elementor-element elementor-element-47307b1 elementor-section-stretched elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="47307b1" data-element_type="section" data-settings="{&quot;stretch_section&quot;:&quot;section-stretched&quot;,&quot;background_background&quot;:&quot;classic&quot;}">
            <div className="elementor-container elementor-column-gap-no">
              <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-0248526" data-id={`0248526`} data-element_type="column">
                <div className="elementor-widget-wrap elementor-element-populated">
                  <div className="elementor-element elementor-element-09d5686 elementor-widget elementor-widget-text-editor" data-id="09d5686" data-element_type="widget" data-widget_type="text-editor.default">
                    <div className="elementor-widget-container">
                      <p>Copyright © 2021. All Rights Reserved.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <Backdrop className={classes.backdrop} open={loadingOpen}>
                <CircularProgress color="inherit" />
        </Backdrop>
      </div>
    );
}
 
export default Footer;