module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const feedUrl = req.query.url;
  if (!feedUrl) return res.status(400).send('Missing "url" parameter');

  try {
    const response = await fetch(feedUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const xml = await response.text();
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=600');
    res.status(200).send(xml);
  } catch (e) {
    res.status(502).send('Fetch failed');
  }
};
