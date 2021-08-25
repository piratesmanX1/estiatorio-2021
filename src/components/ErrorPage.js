import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from 'framer-motion';
import LoadingBar from "react-top-loading-bar";

const ErrorPage = (message) => {
    // obtaining any possible message
    const {status} = useParams();
    // defining the message context of the error page
    let errTopic = "Error";
    let errContext = "";

    // if the parameter is empty then its indicating 404 error, hence deliver the related image and context
    if ((status == true) && (message)) {
        errTopic = `Looks like something went wrong`;
        errContext = message;
        document.title = ' Whoops! | Estiatorio ';
    } else {
        errTopic = `404 Error`;
        errContext = `Whoops! <br /> Looks like the link is either broken or not exist in the first place. <br />`;
        document.title = ' 404 Not Found | Estiatorio ';
    }

    const [progressBar, setProgressBar] = useState(0);
    
    useEffect(() => {
        setProgressBar(100);
        document.getElementById("estiatorio-header").classList.add("inverted");
        document.getElementById("navbar").classList.remove("hidden");
        document.getElementById("contact").classList.remove("hidden");
        document.getElementById("navbar").classList.remove("removed");
        document.getElementById("contact").classList.remove("removed");
    }, []);

    return (
        <div className="ErrorContent">
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
                <div className="error-container">
                    <img className="error-page-img" src={(status == true) ? `./assets/image/E01.png` : `./assets/image/404.gif`} />
                    {(status == true) && <h1 
                        className="error-page-topic"
                        dangerouslySetInnerHTML={{__html: errTopic}}
                    ></h1>}
                    <p 
                        className="error-page-context"
                        dangerouslySetInnerHTML={{__html: errContext}
                    }></p>
                    <br />
                    <Link className="default-button error-page-btn" to="/">Return to Homepage</Link>
                </div>
            </motion.div>
        </div>
    );
}
 
export default ErrorPage;