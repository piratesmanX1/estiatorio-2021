import axios from 'axios';
import { useState } from "react";
import { Component } from 'react';

// CSS
import '../assets/css/default.css';
// Hooks
import useFetch from "../../hooks/prototype/useFetch";
// Components
import TestView from './TestView';

const App = () => {
  const [ text, setText ] = useState('');
  const [ desc, setDesc ] = useState('');

  Component.handleSubmit = (e) => {
    // using axios to send it to PHP server
    e.preventDefault(); // preventing the form from refreshing the page

    console.log(text, desc);

    let formData = new FormData();
    
    formData.append("text", text);
    formData.append("desc", desc);

    const API_PATH = `http://localhost:80/APU/FYP/estiatorio/src/api/testedit.php`; // direct it to the PHP folder

    axios.post(API_PATH, formData) // asynchronous, therefore promises
      .then((res) => {
        console.log(res.data)
      })
      .catch((err) =>  {
        console.log(err)
      });
  }

    // useEffect() that import the data is now being moved into a custom hook file: useFetch.js. The related use state also moved into the file as well
    // destructuring the properties from the custom hook
    // P.S: data: blogs mean taking the data property from useEffect of custom hook then name it as blogs
    const { data, isLoading, error } = useFetch("http://localhost:80/APU/FYP/estiatorio/src/api/testview.php");
  
  return (
    <div className="App">
      <form onSubmit={Component.handleSubmit}>
        <input 
          type="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input 
          type="text"
          id="desc"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <br />
        <button id="submit">Submit</button>
      </form>

      <br/>
      {data && <TestView data={data}/>}
    </div>
  );
}
 
export default App;