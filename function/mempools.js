const request = require("request");
const axios = require("axios");

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;

const headers = {
    "content-type": "text/plain;"
};
module.exports = {
    getRawMempools: async () => {
        try {
            const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawmempool","params":[]}`;
            const options = {
                url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
                method: "POST",
                headers: headers,
                data: dataString
            };
            const data = await axios(options);
            //console.log(data.data.result);
            return data.data.result;
        } catch (error) {
            console.log(error);
        }

    },

    getAddresByTxid: async (txid) => {
        try {
            const dataString = `{"jsonrpc":"1.0","id":"curltext","method":"getrawtransaction","params":["${txid}",true]}`; //txid 들어갈곳
            const options = {
                url: `http://${USER}:${PASS}@127.0.0.1:18332/`,
                method: "POST",
                headers: headers,
                data: dataString
            };
            const data = await axios(options);
            //console.log(data);
            return data.data.result.vout;
        } catch (error) {
            return "asda";
        }

    }
}
