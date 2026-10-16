async function check() {
  const r = await fetch('https://www.itechperu.shop');
  const html = await r.text();
  console.log('HTML length:', html.length);
  const idx = html.indexOf('id="featured-products"');
  if (idx !== -1) {
    console.log(html.slice(idx, idx + 1200));
  } else {
    console.log('Not found featured-products');
  }
}
check().catch(console.error);
