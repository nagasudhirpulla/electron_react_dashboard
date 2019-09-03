import { randomBytes } from 'crypto';
import { request } from 'https';
import { parse } from 'fast-xml-parser';

// const measIds = [4924, 2642];

export class PmuMeasFetcher {
    username = "pdcAdmin";
    password = "p@ssw0rd";
    hostname = "";
    port = 24721;
    path = '/eterra-ws/HistoricalDataProvider';

    getNonce = (): string => {
        const nonce = randomBytes(16).toString('base64');
        return nonce;
    };

    addZero = (x: any, n: number) => {
        while (x.toString().length < n) {
            x = "0" + x;
        }
        return x;
    };

    addMilliZero = (x: any, n: number) => {
        while (x.toString().length < n) {
            x = x + "0";
        }
        return x;
    };

    getRequestUtcString = (timeObj: Date): string => {
        const str = `${timeObj.getFullYear()}-${this.addZero(timeObj.getMonth() + 1, 2)}-${this.addZero(timeObj.getDate(), 2)}T${this.addZero(timeObj.getHours(), 2)}:${this.addZero(timeObj.getMinutes(), 2)}:${this.addZero(timeObj.getSeconds(), 2)}.${this.addMilliZero(timeObj.getMilliseconds(), 3)}+05:30`;
        console.log(str);
        return str;
    };

    getWSSecurityHeaderStr = (): string => {
        const nonce = this.getNonce();
        const username = this.username;
        const password = this.password;
        const created = this.getRequestUtcString(new Date());
        const headerStr = `<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><wsse:UsernameToken wsu:Id="UsernameToken-8E76576A4977DCAABB14880910859781"><wsse:Username>${username}</wsse:Username><wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">${password}</wsse:Password><wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonce}</wsse:Nonce><wsu:Created>${created}</wsu:Created></wsse:UsernameToken></wsse:Security>`;
        return headerStr;
    };

    getDiscoverServerReqSoapBody = (): string => {
        const soapHeader = this.getWSSecurityHeaderStr();
        const soapBody = `<?xml version="1.0" encoding="UTF-8"?>
        <soap:Envelope
            xmlns:dat="http://www.eterra.com/public/services/data/dataTypes"
            xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
            <soap:Header>${soapHeader}</soap:Header>
            <soap:Body>
                <dat:DiscoverServerRequest>?</dat:DiscoverServerRequest>
            </soap:Body>
        </soap:Envelope>`;
        return soapBody;
    };

    fetchServerData = (post_options, postBody): Promise<any> => {
        return new Promise((resolve, reject) => {
            let resp_data = '';
            var post_req = request(post_options, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    resp_data += chunk;
                });
                res.on('end', function () {
                    // console.log(resp_data);
                    resolve({ statusCode: res.statusCode, data: resp_data });
                });
            });

            // post data
            post_req.write(postBody);
            post_req.end();
            post_req.on('error', (err) => {
                reject(err);
            });
        });
    };

    fetchSoapDiscoverServer = async (): Promise<string> => {
        const post_options = {
            hostname: this.hostname,
            port: this.port,
            path: this.path,
            method: 'POST',
            headers: { 'Content-Type': 'application/soap+xml; charset="utf-8"' }
        };
        const postBody = this.getDiscoverServerReqSoapBody();
        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
        let soapRespStr = await this.fetchServerData(post_options, postBody);
        return soapRespStr.data;
    };

    GetMeasXmlTree = (str: string) => {
        const res = str.split('\n')[5];
        var jsonObj = parse(res);
        return jsonObj;
    };    

    parseData = (str: string): [number, string, string, string, string, number, string][] => {
        const regionList = this.GetMeasXmlTree(str)['soap:Envelope']['soap:Body']['ns2:DiscoverServerResponse']['systemConfiguration']['regionList']['region'];
        let measList: [number, string, string, string, string, number, string][] = [];
        for (let regInd = 0; regInd < regionList.length; regInd++) {
            for (let ssInd = 0; ssInd < regionList[regInd]['substations']['substation'].length; ssInd++) {
                for (let devInd = 0; devInd < regionList[regInd]['substations']['substation'][ssInd]['devices']['device'].length; devInd++) {
                    const measurements = regionList[regInd]['substations']['substation'][ssInd]['devices']['device'][devInd]['measurements']['measurement']
                    if (measurements == undefined) {
                        continue;
                    }
                    for (let measInd = 0; measInd < measurements.length; measInd++) {
                        const meas = measurements[measInd];
                        const measId = meas['measurementID'];
                        const scadaStationName = meas['scadaId']['stationName'];
                        const devType = meas['scadaId']['deviceType'];
                        const scadaDevName = meas['scadaId']['deviceName'];
                        const scadaPntName = meas['scadaId']['pointName'];
                        const pmuId = meas['measurementSource']['pmuId'];
                        const pmuStationName = meas['measurementSource']['stationName'];
                        measList.push([measId, scadaStationName, devType, scadaDevName, scadaPntName, pmuId, pmuStationName]);
                    }
                }
            }
        }
        return measList;
    };

    getMeasIds = async (): Promise<[number, string, string, string, string, number, string][]> => {
        const resp = await this.fetchSoapDiscoverServer();
        const measIds = this.parseData(resp);
        return measIds;
    };
}