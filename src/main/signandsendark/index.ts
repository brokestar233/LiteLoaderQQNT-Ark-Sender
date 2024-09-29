import { get_cookie, ark_sign } from './utils'

// 'club.docs.qq.com'
const domain = 'club.docs.qq.com'
async function run(uin: string, text: string) {
    const cookies = await get_cookie(domain, uin)
    const message = await ark_sign(cookies, text)
    console.log(message)
}



export {run}