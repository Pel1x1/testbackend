const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const crypto = require('crypto');
const Wallet = require('./Wallet.js');
const { EthWallet, MessageTypes } = require("@okxweb3/coin-ethereum");

const app = express();
const port = 3333;


app.use(cors());
app.use(bodyParser.json());

app.post('/api/gen-wallet', async (req, res) => {
    
    try {
        
        let chainIndex = "evm";

        let now = new Date();
        let timestamp = now.getTime();
        let timestamp_isos = now.toISOString();
        let timestamp_str = timestamp.toString();

        req.body = { chainIndex , timestamp };
        
        const wallet = new Wallet();
        let ethWallet = new EthWallet();
        

        const walletCreds = await wallet.GenWallet(ethWallet, chainIndex, timestamp);
        
        const accountCreds = await wallet.createAccount(walletCreds, timestamp_str, timestamp_isos);
        
        const creationCreds = {
            "walletCreds": walletCreds,
            "accountCreds": accountCreds,
        }

        res.json(creationCreds);
    
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Gen Wallet Error' });
    
    }
});

app.post('/api/get-supported-chains', async (req, res) => {
    
    let now = new Date();
    
    const { chainIndex = "evm", timestamp=now.getTime() } = req.body;
    
    try {
        
        let timestamp_isos = now.toISOString();
        let timestamp_str = timestamp.toString();
        
        const wallet = new Wallet();
        let ethWallet = new EthWallet();
        
        const supportedChains = await wallet.getSupportedChains(timestamp_isos);


        res.json(supportedChains);
    
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Get supported chains Error' });
    
    }
});


//TODO : WRITE LOGIC VUE GET TOKEN ADDR
app.post('/api/get-current-token-price', async (req, res) => {
 
    try {
        
        let timestamp_isos = now.toISOString();
        let timestamp_str = timestamp.toString();
        
        const wallet = new Wallet();
        let ethWallet = new EthWallet();
        
        const currentTokenAddr = await wallet.getCurrentTokenPrice(chainIndexes, tokenAddress, timestamp_str, timestamp_isos);


        res.json(currentTokenAddr);
    
    } catch (error) {

        console.error(error);
        res.status(500).json({ error: 'Get current token price Error' });
    
    }
});


app.post('/api/save-mnemonics', async(req, res) => {
    const { mnemonics } = req.body;
    console.log('Received mnemonics:', mnemonics);
    
    // Здесь вы можете сохранить mnemonics в базе данных или выполнить другие действия


        try {
            let now = new Date();
            let timestamp = now.getTime();
            let timestamp_isos = now.toISOString();
            let timestamp_str = timestamp.toString();
            
            const wallet = new Wallet();
            let ethWallet = new EthWallet();
            
            const importedWalletCreds = await wallet.importWallet(mnemonics, ethWallet, timestamp_isos, timestamp_str);
    
    
            res.json(importedWalletCreds);
        
        } catch (error) {
    
            console.error(error);
            res.status(500).json({ error: 'Improt wallet Error' });
        
        }


});




app.post('/api/get-accountId', async (req, res) => {
    
    const { accountId } = req.body;
    console.log('Received accountID:', accountId);
    

    res.status(200).send({ message: 'AccountId saved successfully!' });

})

app.post('/api/get-history-by-account', async (req, res) => {
    const {accountId1} = req.body;
    try {
        let now = new Date();
        let timestamp = now.getTime();
        let timestamp_isos = now.toISOString();
        let timestamp_str = timestamp.toString();
        
        const wallet = new Wallet();
        let ethWallet = new EthWallet();
        
        const history = await wallet.getTxHistoryByAccount(accountId1, timestamp_isos);


        res.json(history);
    
    } catch (error) {


        console.error(error);
        res.status(500).json({ error: 'Get history Error' });
    
    }
});

app.post('get-specific-tx-info', (req, res) => {

})




// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
