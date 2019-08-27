import { getUtils, getRevisionsForDate, fetchCookiesFromReportsUrl, getISGSDcForDate, getISGSDcForDates, getNetSchForDate, initUtilsObj } from '../utils/wbesUtils';
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

const testIsgsNetSch = async () => {
    initUtilsObj();
    const data = await getNetSchForDate( new Date(), -1, "f9b9e90c-1380-4eb1-bb00-8a0ea85f059c", SchType.Sced);
    console.log(data);
};

testIsgsNetSch();