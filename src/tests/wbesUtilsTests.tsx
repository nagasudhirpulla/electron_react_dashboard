import { getDeclarationGenUtils, getRevisionsForDate, fetchCookiesFromReportsUrl, getISGSDcForDate, getISGSDcForDates, getNetSchForDate } from '../utils/wbesUtils';
import { SchType } from '../measurements/WbesMeasurement';

const testRevisionsForDate = async () => {
    const revs = await getRevisionsForDate(new Date());
    console.log(revs);
};

const testDeclarationGenUtils = async () => {
    const genUtils = await getDeclarationGenUtils();
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
    const data = await getNetSchForDate( new Date(), -1, "6477e23c-660e-4587-92d2-8e3488bc8262", SchType.OnBarDc);
    console.log(data);
};

testIsgsNetSch();