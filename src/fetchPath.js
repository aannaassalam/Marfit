
var link="";
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // dev code
    link='http://localhost:5000';
} else {
    // production code
    link="https://asia-south1-marfit-ea7ba.cloudfunctions.net/app";
}
export default link;