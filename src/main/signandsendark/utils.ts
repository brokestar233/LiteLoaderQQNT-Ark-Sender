import http from 'http';
import https from 'https';
import { URL } from 'url';
import { NTcore } from '../hook/hookWrapper'
import axios from 'axios';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';


export class RequestUtil {
  // 适用于获取服务器下发cookies时获取，仅GET
  static async HttpsGetCookies(url: string): Promise<{ [key: string]: string }> {
    const client = url.startsWith('https') ? https : http;
    return new Promise<{ [key: string]: string }>((resolve, reject) => {
      client.get(url, (res: http.IncomingMessage) => {
        let cookies: { [key: string]: string } = {};
        const handleRedirect = (res: http.IncomingMessage) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            if (res.headers.location) {
              const redirectUrl = new URL(res.headers.location, url);
              RequestUtil.HttpsGetCookies(redirectUrl.href).then((redirectCookies) => {
                // 合并重定向过程中的cookies
                // console.log('redirectCookies', redirectCookies);
                cookies = { ...cookies, ...redirectCookies };
                resolve(cookies);
              });
            } else {
              resolve(cookies);
            }
          } else {
            resolve(cookies);
          }
        };

        res.on('data', () => {}); // Necessary to consume the stream
        res.on('end', () => {
          handleRedirect(res);
        });

        if (res.headers['set-cookie']) {
          // console.log('set-cookie', url, res.headers['set-cookie']);
          (res.headers['set-cookie'] as string[]).forEach((cookie) => {
            const parts = cookie.split(';')[0].split('=');
            const key = parts[0];
            const value = parts[1];
            if (key && value && key.length > 0 && value.length > 0) {
              cookies[key] = value;
            }
          });
        }
      }).on('error', (err: unknown) => {
        reject(err);
      });
    });
  }
}

async function get_cookie(domain: string, uin: string) {
  const result = await NTcore!.session!.getTicketService()!.forceFetchClientKey('')
  const clientKey = result!.clientKey
  const requestUrl = `https://ssl.ptlogin2.qq.com/jump?ptlang=1033&clientuin=${uin}&clientkey=${clientKey}&u1=https%3A%2F%2F${domain}%2F${uin}%2Finfocenter&keyindex=19%27`
  const cookies: { [key: string]: string } = await RequestUtil.HttpsGetCookies(requestUrl)
  return cookies
}

function extractValuesFromQueryString(queryString: string): { uid: string | null, uid_key: string | null } {
    // 定义一个正则表达式来匹配uid和uid_key的值
    const regex = /result\.uid=([^&]+)&result\.uid_key=([^&]+)/;
    const match = queryString.match(regex);

    if (match) {
        // 如果匹配成功，则返回提取到的值
        return {
            uid: match[1],
            uid_key: match[2]
        };
    }

    // 如果没有找到匹配项，则返回null
    return {
        uid: null,
        uid_key: null
    };
}


function getNonEmptyLinkFileId(jsonData: any): string | undefined {
  const listInfo = jsonData.list_info;
  for (const item of listInfo) {
    if (item.link_file_id) {  // 检查是否为空字符串
      return item.link_file_id;
    }
  }
  return undefined;
}


async function ark_sign(cookies, text) {
  // const data = JSON.stringify(JSON.parse(input))
  console.log(cookies)
  if ( /^文档签名(.*)$/.test(text)) {
    console.log('输入中包含 "文档签名"');
  } else {
    console.log('输入中不包含 "文档签名"');
    return null
  }
  const jsonStr = text.replace('文档签名', '');
  console.log(jsonStr)

  const url1 = "https://docs.qq.com/cgi-bin/online_docs/doclist"
  const url2 = "https://docs.qq.com/v2/push/ark_sig"
  const get_uid = "https://docs.qq.com/api/user/qq/login";

  const cookiestr = Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; ');
  console.log('Cookies:', cookiestr);
  if (!cookies.p_uin || !cookies.p_skey) {
    console.log('Missing required keys p_uin and p_skey in cookies');
    return null
  }
  // 发起请求，并处理响应
  const response = await axios.post(get_uid, null, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'cookie': cookiestr
    }
});

  // 解析响应数据
  const resultData = response.data;
  const { uid, uid_key} = extractValuesFromQueryString(resultData);


  // 更新Cookie
  const newCookies = `${cookiestr}; uid=${uid}; uid_key=${uid_key}`;
  console.log('New cookies:', newCookies);
  const headers1 = {
    "content-type": "application/x-www-form-urlencoded",
    "cookie": newCookies
  }
  const headers2 = {
    "content-type": "application/json",
    "cookie": newCookies
  }
  const data1 = {
    list_type: "6",
    xsrf: cookies.TOK
  }
  const response1 = await axios.post(url1, data1, { headers: headers1 })


  const object_id = getNonEmptyLinkFileId(response1.data)
  console.log(object_id)
  const data2 = {
    ark: jsonStr,
    type: 0,
    object_id,
    xsrf: cookies.TOK
  }
  console.log(data2)
  const response2 = await axios.post(url2, data2, { headers: headers2 })
  const re_result = response2.data
  console.log(re_result)
  const ark_sign = re_result.result.ark_with_sig
  const message = JSON.stringify(ark_sign)
  return message
}

export{get_cookie, ark_sign}