
import http from 'http';

const url = 'http://localhost:5173/src/index.css';

http.get(url, (res) => {
    console.log('Status Code:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Response Body:');
        console.log(data);
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
