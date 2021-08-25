import { useState, useEffect } from "react";

const useFetch = (API_URL) => {
    // fetching the JSON data via useState()
    const [data, setData] = useState(null);

    // as when fetching the data via the below fetch() API it will take some time, we will need to show the conditional loading message to the user that the data is still loading via useState()
    const [isLoading, setIsLoading] = useState(true);

    // outputing the error of res.ok into the web via useState()
    const [error, setError] = useState(null);

    // fetching data via useEffect() with the endpoint
    useEffect(() => {
        const abortCont = new AbortController(); // defined to associate specific fetch request such as the signal of the fetch

        fetch(API_URL, { signal: abortCont.signal })
            .then((res) => {
                if (!res.ok) {
                    throw Error("Data couldn't be fetched."); // making a custom error message that will show in console
                }
                
                return res.json();
            })
            .then((data) => {
                    // console.log(data);
                    setData(data); // setting the data if the data has obtained
                    setIsLoading(false); // this will set the loading message as false (hiding it) when the data has loaded
                    setError(null); // getting rid the error message if its successful
            })
            .catch(err => { //catch any error occured such as connection error
                // but if the server is reachable but other types of error such as request denied by the server, the error message wont be catched as the server is still reachable and responding, even tho the respond didnt contain the data
                // therefore, we will add an If-Check on the .then clause of res
                if (err.name === "AbortError") { // set an if-else statement to show the error specifically (ignore the error presented when fetch aborted)
                    console.log("Fetch aborted");
                } else {
                    setError(err.message);
                }
            })

            // P.S: if we eventually used Router Link, we need to apply useEffect Cleanups to prevent errors related to memory leak occured when quickly clicking around the Router Links due to the data attempt to deliver/fetch to the respective page
            // therefore we need to stop the fetch when the component goes unmounted via useEffect cleanup in the custom hook useFetch.js, where data fetch occurred
            // return the cleanup function in useEffect
            // return () => console.log('clean-up'); // this will be triggered even if you quickly switch to another JSX page by clicking the router link quickly, despite the data yet to be fetched
            return () => abortCont.abort(); // to abort any fetch associated
            
    }, [API_URL]); // making the data fetch only run once by applying dependencies []

    return { data, isLoading, error };
}
 
export default useFetch;