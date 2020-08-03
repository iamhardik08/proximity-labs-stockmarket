import React, { useState, useEffect } from 'react';
import './App.css';
const socket = new WebSocket('ws://stocks.mnet.website');
function App() {

  const [stocks, setStocks] = useState({});

  const [stockUpdates, setStockUpdates] = useState([]);

  useEffect(() => {
    socket.addEventListener('message', function (event: any) {
      const stockData = JSON.parse(event.data);
      let newList: any = [...stockUpdates, stockData]
      setStockUpdates(newList);

    });
  }, []);


  useEffect(() => {
    if (stockUpdates.length) {
      let stockData: any = stockUpdates.shift();
      let stockObj: any = { ...stocks }
      for (const stock of stockData) {
        let stockName = stock[0];
        let stockPrice = stock[1];
        if (stockObj.hasOwnProperty(stockName)) {
          for (let stockKey in stockObj) {
            if (stockKey === stockName) {
              if (stockObj[stockName].stockPrice > stockPrice) {
                stockObj[stockName].stockStatus = 'down';
              } else {
                stockObj[stockName].stockStatus = 'up';
              }
              stockObj[stockName].stockPrice = stockPrice;
            }
          }
        } else {
          stockObj[stockName] = {
            stockPrice,
            stockStatus: null,
          }
        }
      }
      setStocks(stockObj)
    }
  }, [stockUpdates, stocks]);

  function getRowClass(status: string): string {
    if (status === 'up') {
      return "GridRow GreenBorder";
    } else if (status === 'down') {
      return "GridRow RedBorder";
    } else {
      return "GridRow GrayBorder";
    }
  }

  function getRowItemClass(status: string): string {
    if (status === 'up') {
      return "GridRowItem GreenColor";
    } else if (status === 'down') {
      return "GridRowItem RedColor";
    } else {
      return "GridRowItem";
    }
  }

  function renderStockList() {
    let stockObj: any = { ...stocks }
    return JSON.stringify(stocks) !== '{}' ? Object.keys(stocks).map((stock) => {

      return <div className={getRowClass(stockObj[stock].stockStatus)} key={stock}>
        <div className="GridRowItem"> {stock} </div>
        <div className={getRowItemClass(stockObj[stock].stockStatus)}> {`$ ${stockObj[stock].stockPrice.toFixed(2)}`} </div>
        <div className="GridRowItem"> {stockObj[stock].stockStatus} </div>
      </div>
    }) : []
  }

  return (
    <div className="App">
      <div className="Grid">

        <div className="GridHead">
          <div className="GridHeadItem">Company</div>
          <div className="GridHeadItem">Price</div>
          <div className="GridHeadItem">Stock Status</div>
        </div>
        <div className="GridBody">
          {renderStockList()}
        </div>

      </div>
    </div>
  );
}
export default App;
