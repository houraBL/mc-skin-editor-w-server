import "./App1.css";
import axios from "axios";
import { useEffect, useState } from "react";

function App1() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [bases, setBases] = useState([]);
  const clothesTypeId = 3;

  useEffect(() => {
    axios.get(`http://localhost:3001/clothes`).then((response) => {
      setListOfPosts(response.data);
    });

    axios.get(`http://localhost:3001/bases/${clothesTypeId}`).then((response) => {
      setBases(response.data);
    });

  }, []);

  return (
    <div className="App1">
      {listOfPosts.map((value, key) => {
        return (
          <span key={key} className="raw">
            <div className="type"> {value.type} </div>
            <div className="title">{value.title}</div>

          </span>
        );
      })}

      <div >
        {bases.map((base, key) => {
          return (
            <div key={key} className="">
              <div className="type"> {base.typeTitle} </div>
              <div className="title">{base.baseTitle}</div>
              <div className="base"> {base.src} </div>
              <div className="base"> {base.author} </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default App1;