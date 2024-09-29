import axios from 'axios'
import { invokeNative } from '@/main/hook/hookIPC'

async function get_cookie(domain: string, clientKey: string) {
    const requestUrl = `https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=${uin}&clientkey=${clientKey}&u1=https%3A%2F%2F${domain}%2F${uin}%2Finfocenter&keyindex=19%27`
    const uin = app?.__vue_app__?.config?.globalProperties?.$store?.state?.common_Auth?.authData?.uin
    try {
      const response = await axios.get(requestUrl, {
        withCredentials: true
      })
      return response.headers['set-cookie'].join('; ')
    } catch (error) {
      console.error('Failed to fetch cookies:', error)
      throw error
    }
}

async function run() {
  try {
    const result = await invokeNative({
      cmdName: 'NodeIQQNTWrapperSession/create/getTicketService/forceFetchClientKey',
      args: ['']
    })
    const clientKey = result['clientKey']
    console.log('key',clientKey)
    const cookie = await get_cookie('club.docs.qq.com', clientKey)
    console.log('cookie',cookie)
  } catch (error) {
    console.error('Error:', error)
  }
}

export {run}