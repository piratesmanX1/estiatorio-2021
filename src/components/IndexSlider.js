import { Link } from 'react-router-dom';

import makeCarousel from 'react-reveal/makeCarousel';
import Slide from 'react-reveal/Slide';
import Fade from 'react-reveal/Fade';

// Fontawesome imports
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styled, { css } from 'styled-components';

const IndexSlider = () => {
    const Container = styled.div`
        background: transparent;
        padding: 0px;
        margin: 0px auto;
        width: 100%;
        height: 806px;
        visibility: visible;
        overflow: visible;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    `;
    const Arrow = styled.div`
      text-shadow: 1px 1px 1px #fff;
      z-index: 100;
      text-align: center;
      position: absolute;
      width: 10%;
      font-size: 2em;
      cursor: pointer;
      user-select: none;
      // opacity: 0.3;
      transition: 0.3s ease-in-out;
      ${props => props.right ? css`left: 90%;` : css`left: 0%;`}
    `;
    const CarouselUI = ({ position, handleClick, children }) => (
      <Container>
          {children}
          <Arrow onClick={handleClick} data-position={position - 1}><FontAwesomeIcon icon={faChevronLeft} /></Arrow>
          <Arrow right onClick={handleClick} data-position={position + 1}><FontAwesomeIcon icon={faChevronRight} /></Arrow>
      </Container>
    );
    const Carousel = makeCarousel(CarouselUI);

    return (
        <Carousel defaultWait={7500}>
            <Slide right>
                <div className="slider-container" style={{backgroundImage: "url('./assets/image/B01.jpg')"}}>
                    <Fade right cascade>
                        <h4 class="slider-title">ESTIATORIO</h4>
                        <p>A platform for all kinds of user in restaurant management</p>
                    </Fade>
                    <Fade bottom>
                        <Link to="/login" className="elementor-button-link elementor-button elementor-size-sm"> 
                            <span className="elementor-button-content-wrapper"> <span className="elementor-button-text">Start Now</span></span>
                        </Link>
                    </Fade>
                </div>
            </Slide>
            <Slide right>
                <div className="slider-container" style={{backgroundImage: "url('./assets/image/B02.jpg')"}}>
                    <Fade right cascade>
                        <h4>Start</h4><h4> with Estiatorio</h4>
                        <p>To enjoy the first platform with a perfect reservation management system</p>
                    </Fade>
                    <Fade bottom>
                        <Link to="/login" className="elementor-button-link elementor-button elementor-size-sm"> 
                            <span className="elementor-button-content-wrapper"> <span className="elementor-button-text">Start Now</span></span>
                        </Link>
                    </Fade>                
                </div>
            </Slide>
            <Slide right>
                <div className="slider-container" style={{backgroundImage: "url('./assets/image/B03.jpg')"}}>
                    <Fade right cascade>
                        <h4>Uniqueness</h4><h4> of services</h4>
                        <p>Will leave your impression out of this world</p>
                    </Fade>
                    <Fade bottom>
                        <Link to="/login" className="elementor-button-link elementor-button elementor-size-sm"> 
                            <span className="elementor-button-content-wrapper"> <span className="elementor-button-text">Start Now</span></span>
                        </Link>
                    </Fade>
                </div>
            </Slide>
        </Carousel>
    );
}
 
export default IndexSlider;