import { request } from 'http';
import { convertDateToWbesUrlStr } from './timeUtils';
import { SchType } from '../measurements/WbesMeasurement';
import { csvToArray } from './wbesCsvToArray';
import { registerAppState, getAppState } from '../appState';
import { initUtils } from '../utils'

export const baseUrl = "scheduling.wrldc.in";
const dcTypeStrDict: { [key: string]: string } = { 'sellerdc': 'TotalDc', 'dc': 'OnBarDc', 'combineddc': 'OnBarDc', 'onbardc': 'OnBarDc', 'offbardc': 'OffBarDc', 'total': 'TotalDc' };
const netSchMapDict: { [key: string]: string } = {
    'isgs': SchType.Isgs,
    'mtoa': SchType.Mtoa,
    'stoa': SchType.Stoa,
    'lta': SchType.Lta,
    'iex': SchType.Iex,
    'pxi': SchType.Px,
    'urs': SchType.Urs,
    'rras': SchType.Rras,
    'sced': SchType.Sced,
    'net total': SchType.NetSch
};
export const defaultRequestHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
    'Accept-Encoding': 'gzip, deflate'
};


export const registerUtilsInfoAppState = (obj: {}) => {
    registerAppState("utils_info", obj);
}

export const getUtilsInfoAppState = () => {
    return getAppState("utils_info") as { [key: string]: { utilId: string, name: string, isSeller: boolean } };
}

export const initUtilsObj = () => {
    registerUtilsInfoAppState(initUtils);
}

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
        respData = JSON.parse(respObj.data);
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

export const getUtils = async (): Promise<{ [key: string]: { name: string, utilId: string, isSeller: boolean } }> => {
    const options = { ...defaultRequestOptions, path: `/wbes/ReportNetSchedule/GetUtils?regionId=2` };
    const utilsObjStr = (await doGetRequestAsync(options)).data;
    //console.log(utilsObjStr);
    const utilsObj = JSON.parse(utilsObjStr) as { sellers: { UtilId: string, Acronym: string }[], buyers: { UtilId: string, Acronym: string }[] };
    let utils: { [key: string]: { name: string, utilId: string, isSeller: boolean } } = {};
    const sellersList = utilsObj.sellers;
    for (let sellerInd = 0; sellerInd < sellersList.length; sellerInd++) {
        const utilId = sellersList[sellerInd].UtilId
        utils[utilId] = { name: sellersList[sellerInd].Acronym, utilId: utilId, isSeller: true };
    }
    const buyersList = utilsObj.buyers;
    for (let buyerInd = 0; buyerInd < buyersList.length; buyerInd++) {
        const utilId = buyersList[buyerInd].UtilId
        utils[utilId] = { name: buyersList[buyerInd].Acronym, utilId: utilId, isSeller: false };
    }
    return utils;
};

export const getISGSDcForDate = async (dateObj: Date, rev: number, utilId: string, dcType: SchType): Promise<number[]> => {
    //check if the utility is a seller or buyer
    const util = getUtilsInfoAppState()[utilId];
    if (util == undefined) {
        return [];
    }
    // check if dc is being asked for buyers
    if (util.isSeller == false && [SchType.OnBarDc, SchType.OffBarDc, SchType.TotalDc].indexOf(dcType) != -1) {
        return [];
    }
    let urlRev = rev;
    if (rev == -1) {
        const revs = await getRevisionsForDate(dateObj);
        urlRev = Math.max(...revs);
    }
    const path = `/wbes/Report/GetDeclarationReport?regionId=2&date=${convertDateToWbesUrlStr(dateObj)}&revision=${urlRev}&utilId=${utilId}&isBuyer=0&byOnBar=1&byDCSchd=0`;
    console.log(`ISGS Declaration JSON fetch path = ${path}`);
    const dcMatrix: string[][] = (await getJSONAsync({ ...defaultRequestOptions, path: path })).data['jaggedarray'];
    // scan through dc types in second row to get the required column index
    const colInd = (dcMatrix[1]).findIndex((comp) => dcTypeStrDict[comp.toLowerCase()] == dcType);
    // console.log(`colIndex = ${colInd}`);
    if (colInd == -1) {
        return [];
    }
    let dcVals: number[] = []
    // extract the component values from matrix
    for (let rowNum = 2; rowNum <= 97; rowNum++) {
        dcVals.push(parseFloat(dcMatrix[rowNum][colInd]));
    }
    return dcVals;
};

export const getISGSDcForDates = async (fromDate: Date, toDate: Date, rev: number, utilId: string, dcType: SchType): Promise<number[]> => {
    let dcVals: number[] = []
    for (let currDate = fromDate; currDate.getTime() <= toDate.getTime(); currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000)) {
        let vals = await getISGSDcForDate(currDate, rev, utilId, dcType);
        if (vals.length == 0) {
            return [];
        }
        // extract the component values from matrix
        dcVals.push(...vals);
    }
    return dcVals;
};

export const getNetSchForDate = async (dateObj: Date, rev: number, utilId: string, schType: SchType): Promise<number[]> => {
    let urlRev = rev;
    if (rev == -1) {
        const revs = await getRevisionsForDate(dateObj);
        urlRev = Math.max(...revs);
    }
    //check if the utility is a seller or buyer
    const util = getUtilsInfoAppState()[utilId];
    if (util == undefined) {
        return [];
    }
    // For buyer the sign convention is ok, but for seller the sign convention needs to be changed
    // const isgsNetSchFetchPath = `/wbes/ReportFullSchedule/ExportFullScheduleInjSummaryToPDF?scheduleDate=${convertDateToWbesUrlStr(dateObj)}&sellerId=${utilId}&revisionNumber=${urlRev}&getTokenValue=${(new Date()).getTime()}&fileType=csv&regionId=2&byDetails=0&isDrawer=0&isBuyer=0`;
    const netSchFetchPath = `/wbes/ReportNetSchedule/ExportNetScheduleSummaryToPDF?scheduleDate=${convertDateToWbesUrlStr(dateObj)}&sellerId=${utilId}&revisionNumber=${urlRev}&getTokenValue=${(new Date()).getTime()}&fileType=csv&regionId=2&byDetails=0&isBuyer=0`;
    const options = { ...defaultRequestOptions, path: netSchFetchPath };
    console.log(`Net Schedule JSON fetch path = ${netSchFetchPath}`);
    const respObj = await doGetRequestAsync(options);
    var isgsNetSchedulesArray = csvToArray(respObj.data.replace(/\0/g, '')) as string[][];

    //check if isgsNetSchedulesArray has at least 3 columns and 97 rows
    if (isgsNetSchedulesArray.length < 97) {
        return [];
    }
    if (isgsNetSchedulesArray[0].length < 12) {
        return [];
    }
    let schColInd: number = -1;

    //find the index of column that contains the required schedule type
    for (let colIter = 0; colIter < isgsNetSchedulesArray[0].length; colIter++) {
        if (netSchMapDict[isgsNetSchedulesArray[0][colIter].toLowerCase()] == schType) {
            schColInd = colIter;
            break;
        }
    }
    if (schColInd == -1) {
        return [];
    }
    const netSchVals: number[] = [];

    // time blocks start from row 1 (zero based index) and values are present in column 2 (zero based index)
    for (let matrixRowIter = 1; matrixRowIter <= 96; matrixRowIter++) {
        let schVal = parseFloat(isgsNetSchedulesArray[matrixRowIter][schColInd]);
        if (util.isSeller == true) {
            schVal = -1 * schVal;
        }
        netSchVals.push(schVal);
    }
    return netSchVals;
}

export const getNetSchForDates = async (fromDate: Date, toDate: Date, rev: number, utilId: string, schType: SchType): Promise<number[]> => {
    let schVals: number[] = []
    for (let currDate = fromDate; currDate.getTime() <= toDate.getTime(); currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000)) {
        let vals = await getNetSchForDate(currDate, rev, utilId, schType);
        if (vals.length == 0) {
            return [];
        }
        schVals.push(...vals);
    }
    return schVals;
}

export const getSchForDate = async (dateObj: Date, rev: number, utilId: string, schType: SchType): Promise<number[]> => {
    let schVals: number[] = []
    if ([SchType.OnBarDc, SchType.OffBarDc, SchType.TotalDc].indexOf(schType) != -1) {
        schVals = await getISGSDcForDate(dateObj, rev, utilId, schType);
    }
    else {
        schVals = await getNetSchForDate(dateObj, rev, utilId, schType);
    }
    return schVals;
}

export const getSchForDates = async (fromDate: Date, toDate: Date, rev: number, utilId: string, schType: SchType): Promise<number[]> => {
    let schVals: number[] = []
    let fetchFunc = getNetSchForDate;
    if ([SchType.OnBarDc, SchType.OffBarDc, SchType.TotalDc].indexOf(schType) != -1) {
        fetchFunc = getISGSDcForDate;
    }
    for (let currDate = fromDate; currDate.getTime() <= toDate.getTime(); currDate = new Date(currDate.getTime() + 24 * 60 * 60 * 1000)) {
        let vals = await fetchFunc(currDate, rev, utilId, schType);
        if (vals.length == 0) {
            return [];
        }
        schVals.push(...vals);
    }
    return schVals;
}