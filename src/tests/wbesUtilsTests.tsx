import { getUtils, getRevisionsForDate, fetchCookiesFromReportsUrl, getISGSDcForDate, getISGSDcForDates, getNetSchForDate, initUtilsObj, getSchForDates } from '../utils/wbesUtils';
import { SchType } from '../measurements/WbesMeasurement';

const testRevisionsForDate = async () => {
    const revs = await getRevisionsForDate(new Date());
    console.log(revs);
};

const testGetUtils = async () => {
    const genUtils = await getUtils();
    console.log(genUtils);
};

const testCookieFetch = async () => {
    const cookie = await fetchCookiesFromReportsUrl();
    console.log(cookie);
};

const testIsgsDc = async () => {
    const data = await getISGSDcForDates(new Date((new Date()).getTime() - 2 * 86400000), new Date(), -1, "6477e23c-660e-4587-92d2-8e3488bc8262", SchType.OnBarDc);
    console.log(data);
};

const testSch = async () => {
    initUtilsObj();
    const data = await getSchForDates(new Date((new Date()).getTime() - 2 * 86400000), new Date(), -1, "6477e23c-660e-4587-92d2-8e3488bc8262", SchType.Sced);
    console.log(data);
};

testSch();