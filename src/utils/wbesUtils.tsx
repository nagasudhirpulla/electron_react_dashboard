import { request } from 'http';
import { convertDateToWbesUrlStr } from './timeUtils';
export const baseUrl = "scheduling.wrldc.in";
export const defaultRequestHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
    'Accept-Encoding': 'gzip, deflate'
};

export const defaultRequestOptions = {
    path: "",
    method: 'GET',
    headers: defaultRequestHeaders,
    hostname: baseUrl
};

const doGetRequestAsync = (options): Promise<{ statusCode: number, data: any, headers: any }> => {
    return new Promise((resolve, reject) => {
        let output = '';
        const req = request(options, (res) => {
            // console.log(`${options.hostname} : ${res.statusCode}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                output += chunk;
            });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, data: output, headers: res.headers });
            });
        });
        req.on('error', (err) => {
            // res.send('error: ' + err.message);
            reject(err);
        });
        req.end();
    });
}

const getJSONAsync = async (options): Promise<{ statusCode: number, data: any }> => {
    const respObj = await doGetRequestAsync(options);
    let respData = {};
    if (respObj.statusCode == 200) {
        respData = JSON.stringify(respObj.data);
    }
    return { statusCode: respObj.statusCode, data: respData }
}

export const fetchCookiesFromReportsUrl = async (): Promise<string> => {
    var options = defaultRequestOptions;
    options.path = "/wbes/Account/Login?ReturnUrl=%2fwbes%2f";
    // get the cookies from response header
    const respObj = (await doGetRequestAsync(options));
    return respObj.headers['set-cookie'][0] as string;
};

export const getRevisionsForDate = async (dateObj: Date): Promise<number[]> => {
    const options = { ...defaultRequestOptions, path: `/wbes/Report/GetNetScheduleRevisionNoForSpecificRegion?regionid=2&ScheduleDate=${convertDateToWbesUrlStr(dateObj)}` };
    const revsArrayStr = (await doGetRequestAsync(options)).data;
    //console.log(revsArrayStr);
    const revsList = JSON.parse(revsArrayStr) as number[];
    return revsList;
};

export const getDeclarationGenUtils = async (): Promise<{ name: string, utilId: string }[]> => {
    const options = { ...defaultRequestOptions, path: `/wbes/Report/GetUtils?regionId=2` };
    const utilsObjStr = (await doGetRequestAsync(options)).data;
    //console.log(utilsObjStr);
    const utilsObj = JSON.parse(utilsObjStr) as { sellers: { UtilId: string, Acronym: string }[], buyers: [] };
    const sellersList = utilsObj.sellers;
    let sellers: { name: string, utilId: string }[] = [];
    for (let sellerInd = 0; sellerInd < sellersList.length; sellerInd++) {
        sellers.push({ name: sellersList[sellerInd].Acronym, utilId: sellersList[sellerInd].UtilId });
    }
    return sellers;
};
