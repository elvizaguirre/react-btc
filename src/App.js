import './App.css';
import 'react-data-grid/lib/styles.css';

import React, { useEffect, useState } from 'react';

import RenderGrid from './grid';

function App() {
  const initialRows = [{ side: "", price: "", volume: null, time: "" }];
  const [rows, setRows] = useState(initialRows);
  const [bid, setBid] = useState("27,000");
  const [ask, setAsk] = useState("27,001");

  useEffect(() => {
    const wsbook = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@bookTicker"
    );

    wsbook.onmessage = (event) => {
      const dataBA = JSON.parse(event.data);
      setAsk(dataBA["a"]);
      setBid(dataBA["b"]);
    };

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let newRows = rows;
      let date = new Date(data["E"]);
      const time =
        date.getDay() +
        "/" +
        date.getMonth() +
        "/" +
        date.getFullYear() +
        " " +
        date.getHours() +
        "H" +
        date.getMinutes();
      newRows.unshift({
        side: data["m"] ? "SELL" : "BUY",
        price: data["p"],
        volume: data["q"],
        time: time,
      });
      if (newRows.length > 50) {
        newRows = newRows.slice(0, 50);
      }
      setRows(newRows);
    };

    return () => {
      ws.close();
      wsbook.close();
    };
  });

  useEffect(() => {
    window.addEventListener("error", (e) => {
      if (e.message === "ResizeObserver loop limit exceeded") {
        const resizeObserverErrDiv = document.getElementById(
          "webpack-dev-server-client-overlay-div"
        );
        const resizeObserverErr = document.getElementById(
          "webpack-dev-server-client-overlay"
        );
        if (resizeObserverErr) {
          resizeObserverErr.setAttribute("style", "display: none");
        }
        if (resizeObserverErrDiv) {
          resizeObserverErrDiv.setAttribute("style", "display: none");
        }
      }
    });
  }, [] );

  return (
    <div className="App">
      <h2>Bitcoin Infos (BTC/USDT)</h2>
      <table>
        <thead>
          <tr>
            <td>Bid</td>
            <td>Ask</td>
          </tr>
        </thead>
        <tbody>
          <tr className="txt-red">
            <td className="spaced">{bid}</td>
            <td>{ask}</td>
          </tr>
        </tbody>
      </table>

      <RenderGrid rows={rows} />
    </div>
  );
}

export default App;
