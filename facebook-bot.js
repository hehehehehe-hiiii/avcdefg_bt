const fs = require('fs');
const axios = require('axios');
const colors = require('colors');

class FacebookBot {
    constructor() {
        this.config = this.loadConfig();
        this.baseURL = 'https://graph.facebook.com/v19.0';
        this.headers = {
            'Cookie': this.config.cookie,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Content-Type': 'application/json'
        };
        this.delay = 200;
        this.groupsCache = null;
    }

    loadConfig() {
        try {
            const configData = fs.readFileSync('./config.json', 'utf8');
            return JSON.parse(configData);
        } catch (error) {
            console.error('❌'.red, 'Error loading config file:', error.message);
            process.exit(1);
        }
    }

    async makeRequest(method, url, data = null, headers = null) {
        try {
            const config = {
                method,
                url,
                headers: headers || this.headers,
                timeout: 30000
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error('❌'.red, 'Request failed:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            throw error;
        }
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    setDelay(delayMs) {
        this.delay = delayMs;
        console.log(`⏱️`.yellow, `Delay set to ${delayMs}ms`.yellow);
    }
}

module.exports = FacebookBot;