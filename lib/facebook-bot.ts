import fs from 'fs'
import path from 'path'
import axios from 'axios'

export class FacebookBot {
  protected config: any
  protected baseURL: string
  protected headers: any
  protected delay: number

  constructor() {
    this.config = this.loadConfig()
    this.baseURL = 'https://graph.facebook.com/v19.0'
    this.headers = {
      'Cookie': this.config.cookie,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Content-Type': 'application/json'
    }
    this.delay = 200
  }

  private loadConfig() {
    try {
      const configPath = path.join(process.cwd(), 'config.json')
      const configData = fs.readFileSync(configPath, 'utf8')
      return JSON.parse(configData)
    } catch (error: any) {
      console.error('❌ Error loading config file:', error.message)
      throw error
    }
  }

  async makeRequest(method: string, url: string, data: any = null, headers: any = null) {
    try {
      const config: any = {
        method,
        url,
        headers: headers || this.headers,
        timeout: 30000
      }

      if (data) {
        config.data = data
      }

      const response = await axios(config)
      return response.data
    } catch (error: any) {
      console.error('❌ Request failed:', error.message)
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      throw error
    }
  }

  async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  setDelay(delayMs: number) {
    this.delay = delayMs
    console.log(`⏱️ Delay set to ${delayMs}ms`)
  }
}

