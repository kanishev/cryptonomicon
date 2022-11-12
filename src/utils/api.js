const API_KEY =
  "33e6d879b6ad008ebf8fbbde4953d7f974c1d6927a3701560faed48f2479fea5";
const tickersHandlers = new Map();
const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);
const AGGREGATE_INDEX = "5";

socket.addEventListener("message", loadData => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    MESSAGE: message,
    PARAMETER: param
  } = JSON.parse(loadData.data);

  if (message == "INVALID_SUB") {
    const currency = param.split("~")[2];
    const handlers = tickersHandlers.get(currency);

    handlers.forEach(h =>
      h({
        newPrice: null,
        message: "Error"
      })
    );
    return;
  }

  if (type !== AGGREGATE_INDEX || !newPrice) {
    return;
  }


  const handlers = tickersHandlers.get(currency) || [];
  handlers.forEach(h => h({ newPrice, message: null }));
});

function sendTickersOnwS(message) {
  const stringyfiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringyfiedMessage);
    return;
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringyfiedMessage);
    },
    { once: true }
  );
}

function subscribeToTikersOnws(ticker) {
  sendTickersOnwS({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

function unsubscribeToTikersOnws(ticker) {
  sendTickersOnwS({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}

export const subscribeToTicker = function(ticker, fn) {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, fn]);
  subscribeToTikersOnws(ticker);
};

export const unsubscribeFromTicker = function(ticker) {
  tickersHandlers.delete(ticker);
  unsubscribeToTikersOnws(ticker);
};

window.tickers = tickersHandlers;
