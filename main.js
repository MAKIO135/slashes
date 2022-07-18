console.clear()

function slugify(string) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìıİłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return string.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

fetch('https://makio135.com/slashes-exports/slashes.csv')
  .then(r => r.text())
  .then(t => {
    let data = t.replaceAll('\"','').replaceAll(',-1','_-1').split('\n').filter(d => d)
    const keys = data.shift().split(',')
    const slugs = keys.map(slugify)
    console.log(slugs)
    
    const gallery = document.querySelector('#gallery')

    let html = ''

    for(let i = 1; i <= 1024; i++) {
      let tokenTitle = i.toString()
      tokenTitle = tokenTitle[tokenTitle.length - 1].repeat(tokenTitle.length)
      if(i%4 === 1) html += '<div class="row gx-2">'
      html += `<div class="col-6 col-md-3">
  <div class="card" data-bs-toggle="modal" data-bs-target="#slashModal" data-tokenid="${i}" style="cursor:pointer;">
    <img src="https://makio135.com/slashes-exports/png/${i}.png" class="card-img-top" loading="lazy">
    <div class="card-body">
      <h5 class="card-title" style="margin-bottom:0">Slashes ${i}/1024 <small style="color:#ccc">#${tokenTitle}</small></h5>
    </div>
  </div>
</div>`
      if(i%4 === 0) html += '</div>'
    }

    gallery.innerHTML = html
  
    document.querySelectorAll('#gallery .card').forEach(img => img.addEventListener('click', e => {
      const tokenId = parseInt(img.dataset.tokenid)
      let tokenTitle = tokenId.toString()
      tokenTitle = tokenTitle[tokenTitle.length - 1].repeat(tokenTitle.length)
      const d = data[tokenId - 1].split(',')
      d[keys.length-1] = d[keys.length-1].replace('_-1',',-1')
      
      document.querySelector('#slashModal h5').innerHTML = `Slashes ${tokenId}/1024 <small style="color:#ccc">#${tokenTitle}</small>`
      document.querySelector('#slashModal .modal-body').innerHTML = `<img src="https://makio135.com/slashes-exports/png/${tokenId}.png" style="width:100%" />
<div class="row" style="margin-top:10px;">
  <div class="col">
    <h5>Features:</h5>
    <p>token ID: <strong>${tokenId}</strong><br>${keys.map((k, j) => `${k.split(' ').join('&nbsp;')}:&nbsp;<strong>${d[j]}</strong>`).join('<br>')}</p>
  </div>
  <div class="col">
    <a href="https://makio135.com/slashes-exports/png/${tokenId}.png" class="btn btn-primary btn-sm" target="_blank" style="width:100%;margin-top: 35px">Download PNG</a>
    <a href="https://makio135.com/slashes-exports/svg/${tokenId}.svg" class="btn btn-primary btn-sm" target="_blank" style="width:100%;margin-top: 5px">Download SVG</a>
    <a href="https://opensea.io/assets/ethereum/0x7150cd8593670341121eee513538108029298cf7/${tokenId}" class="btn btn-warning btn-sm" target="_blank" style="width:100%;margin-top: 5px">See on OpenSea</a>
  </div>
</div>`
    }))
  })
  .catch(e => console.log(e))