const express = require("express");
const router = express.Router();
var request = require("request");

const dotenv = require("dotenv");
dotenv.config();

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;

const headers = {
  "content-type": "text/plain;"
};

const mempoolController = require("../function/mempools")

router.get("/getConfirmations/:txid", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":["${req.params.txid}",true]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.send({ confirmations: data.result.confirmations });
      console.log(data.result.confirmations);
      //console.log(data.result.vout[1].scriptPubKey.addresses);
      //console.log(data.result.vin[0].txid);
    }
  }; request(options, callback);
});

router.get("/validtx/:addr/:val", (req, res) => {
  let count = 0;
  mempoolController.getRawMempools().then(async (e) => {
    for (let i = 0; i < e.length; i++) {
      const vouts = await mempoolController.getAddresByTxid(e[i]);
      //console.log("txid : ", e[i], "address : ", addr);
      vouts.forEach(element => {
        if (element.value > 0 && element.scriptPubKey.addresses[0] === req.params.addr && element.value === parseFloat(req.params.val)) {
          count += 1;
          res.send({
            valid: true,
            valtxid: e[i],
          });
          return false;
        }
      });
    }
    if (count === 0) {
      res.send({
        valid: false,
      })
    }
  });
});


router.get("/", (req, res) => {
  res.send("hi");
})

router.get("/getrawmempool", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawmempool","params":[]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };

  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.send(data);
      console.log(data);
    }
  };
  request(options, callback);
});
/*
router.get("/getrawtransaction", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":["b6703d5bb7af1aee906a9ff3011f924b59950932187b6036d1c70dd457ad0d98",true]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };

  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.send(data);
    }
  };
  request(options, callback);

});

router.get("/listwallets", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"listwallets","params":[]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };

  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.send(data);
      console.log(data.result[0]);
    }
  };
  request(options, callback);
});

router.get("/loadwallet/:name", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"loadwallet","params":["${req.params.name}"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.send(data);
      console.log(data.result[0]);
    }
  };
  request(options, callback);
});

router.get("/unloadwallet/:name", (req, res) => {
  var dataString = `{"jsonrpc":"1.0","id":"curltext","method":"unloadwallet","params":["${req.params.name}"]}`;
  var options = {
    url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
    method: "POST",
    headers: headers,
    body: dataString
  };
  callback = (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const data = JSON.parse(body);
      res.send(data);
      console.log(data.result[0]);
    }
  };
  request(options, callback);
});
*/

router.get("/test", mempoolController.getRawMempools);

module.exports = router;