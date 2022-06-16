export default async function handler(req, res) {
  if (req.method === 'POST') {

  } else if (req.method === 'DELETE') {

  } else {
    console.log('unsupported method');
    res.redirect('/');
  }
}