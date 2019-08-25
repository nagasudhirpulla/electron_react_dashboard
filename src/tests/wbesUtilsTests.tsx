import { getDeclarationGenUtils, getRevisionsForDate, fetchCookiesFromReportsUrl } from '../utils/wbesUtils';

getRevisionsForDate(new Date()).then((revs) => {
    console.log(revs);
});

getDeclarationGenUtils().then((genUtils) => {
    console.log(genUtils);
});

fetchCookiesFromReportsUrl().then((cookie) => { console.log(cookie) });