module.exports = function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json({ status: 'OK', message: 'Serverless function running' });
}


