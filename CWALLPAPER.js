// link input
const btn_live_walllpaper = document.querySelector('#submit-live-wallpaper'); 
const inputWallpaper = document.getElementById('input-link');
// database
const btn_database = document.querySelector('#database-button');
const list_database = document.querySelector('#database');
const search_database = document.getElementById('search-database');
// setting
const setting = document.getElementById('setting');
const footer_setting = document.getElementById('footer-setting');
const setting_blur = document.getElementById('setting-blur');
const setting_cover_fit = document.getElementById('setting-cover-fit');


setting.addEventListener('click', () => { 
    let visibleSetting = document.getElementById('footerhide');
    if (visibleSetting.style.visibility === "hidden" || visibleSetting.style.visibility === "") {
        visibleSetting.style.visibility = "visible";
    } else {
        visibleSetting.style.visibility = "hidden";
    }4
});

footer_setting.addEventListener('click',() => {
    let visibleFoterSetting = document.getElementById('setting-ui-list');
    if (visibleFoterSetting.style.display === 'none'){
        visibleFoterSetting.style.display = "flex";
    } else {
        visibleFoterSetting.style.display = "none";
    }
});

setting_blur.addEventListener('click', () => {
    let blur_body = document.getElementById('live-wallpaper');
    if (blur_body.style.backdropFilter === "blur(1px)") {
        blur_body.style.backdropFilter = "blur(0px)";
        blur_body = "blur(0px)";
    } else {
        blur_body.style.backdropFilter = "blur(1px)";
        blur_body = "blur(1px)";
    }
    localStorage.setItem("settingBlur", blur_body)
});

setting_cover_fit.addEventListener('click', () => {
    let cover_fit = document.getElementById('live-wallpaper');
    if (cover_fit.style.backgroundSize === "cover") {
        cover_fit.style.backgroundSize = "contain";
        cover_fit = "contain";
    } else {
        cover_fit.style.backgroundSize = "cover";
        cover_fit = "cover";
    }
    localStorage.setItem("settingCover", cover_fit);
});

btn_database.addEventListener('click', () => {
    const linkSave = inputWallpaper.value.trim();
    if (!linkSave) {
        alert("cari walpaper terlebih dahulu");
        return;
    }
    const linkWallpapersave = JSON.parse(localStorage.getItem('linkWallpaper')) || [];
    const nomor = linkWallpapersave.length + 1;
    linkWallpapersave.push({nomor, linkSave});
    localStorage.setItem('linkWallpaper', JSON.stringify(linkWallpapersave));
    alert(`link sudah tersave sebagai nomor ${nomor}`);
});

search_database.addEventListener('click', () => {
    let userInputWallpaper = prompt("pilih no brp wallpapermu");
    let savedWallpaperUrl = JSON.parse(localStorage.getItem('linkWallpaper'));
    if(savedWallpaperUrl){
        let searchFInd = savedWallpaperUrl.find(item => item.nomor == userInputWallpaper);
        if (searchFInd) {
            let urlWallpaper = searchFInd.linkSave;
            updateWallpaperTexture(urlWallpaper);
            localStorage.setItem('activeWallpaper', urlWallpaper);
        } else {
            alert(`Nomor ${userInputWallpaper} tidak ditemukan!`);
        }
    } else {
        alert("Belum ada wallpaper yang tersimpan di database!");
    }
});


let bgNoRefresh = localStorage.getItem('activeWallpaper');
if (bgNoRefresh) {
    document.body.style.backgroundImage = `url('${bgNoRefresh}')`;
}

let blur_setting = localStorage.getItem("settingBlur");
if (blur_setting) {
    document.body.style.backdropFilter = blur_setting;
}

let cover_setting = localStorage.getItem("settingCover");
if (cover_setting) {
    document.body.style.backgroundSize = cover_setting;
}

btn_live_walllpaper.addEventListener('click',() => {
    let linkGambar = inputWallpaper.value.trim();

    if (linkGambar) {
        updateWallpaperTexture(linkGambar);
        localStorage.setItem('activeWallpaper', linkGambar);
    } else {
        alert("cari walpaper terlebih dahulu")
    }
});

function addShortcut() {
  const name = prompt("masukan nama web mu");
  let url = prompt("masukan urlnya");
  
  if(!url.startsWith('http')) url = 'https://' + url; 
  const shortcuts = JSON.parse(localStorage.getItem('myShortcuts')) || [];
  shortcuts.push({ name, url });
  localStorage.setItem('myShortcuts', JSON.stringify(shortcuts));
  displayShortcuts();
}

function displayShortcuts() {
  const container = document.getElementById('shortcutlist');
  container.innerHTML = '';
  const shortcuts = JSON.parse(localStorage.getItem('myShortcuts')) || [];
  
  shortcuts.forEach(item => {
    container.innerHTML += `
    <br>
    <a href="${item.url}" target="_blank" style="border-radius: 10px; margin:0; display:inline-block;text-decoration: none; color: black; border: 1px solid black; width: fit-content; padding: 0.7rem; background: white;">${item.name}</a>
    `;
  });
}

function deleteShortCut() {
    localStorage.getItem("myShortcuts", )
}

function UpdateJam() {
    const monthH = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

    const jam = document.getElementById('jam-sekarang');
    const date = new Date();
    date.toLocaleDateString('id-ID');
    const year = date.getFullYear();
    const monthN = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const ms = date.getSeconds();

    const htmlKonten = `
        <div style="display: flex; gap:5px">
            <h1>${hour}:${minute}</h1><h4>${ms}</h4>
        </div>
        <h3 style="margin: 0; height">${year},${monthH[monthN]} ${day} </h3>
    `
    jam.innerHTML = htmlKonten;
}

setInterval(UpdateJam, 1000);
UpdateJam();
displayShortcuts();

// Global variables untuk three.js
let glState = null;

function updateWallpaperTexture(imageUrl) {
  if (!glState || !glState.loader) {
    console.error("Three.js belum siap");
    return;
  }
  
  glState.loader.load(imageUrl, (texture) => {
    glState.uniforms.texture1.value = texture;
    console.log("Wallpaper updated with:", imageUrl);
  }, undefined, (error) => {
    console.error("Error loading texture:", error);
    alert("Gagal load gambar. Pastikan URL valid.");
  });
}

const init = () => {
  const content = document.querySelector(".content-canvas");
  const s = {
    w: innerWidth,
    h: innerHeight
  };

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const camera = new THREE.PerspectiveCamera(75, s.w / s.h, 0.1, 100);
  const scene = new THREE.Scene();
  const loader = new THREE.TextureLoader();

  renderer.setClearColor(0x000000, 0);
  renderer.setSize(s.w, s.h);
  renderer.setPixelRatio(devicePixelRatio);
  content.appendChild(renderer.domElement);

  camera.position.set(0, 0, 1);
  scene.add(camera);

  let time = 0;

  // Default wallpaper
  const activeWallpaper = localStorage.getItem('activeWallpaper') || "https://media-cdn-zspms.kurogame.net/pnswebsite/website2.0/images/1760112000000/poyfabk4vg56so00hy-1760180358276%E6%B4%81%E5%A1%94%E8%96%87cg%E6%94%B9%E5%88%98%E6%B5%B7.jpg";

  const uniforms = {
    time: { type: "f", value: 0 },
    resolution: {
      type: "v2",
      value: new THREE.Vector2(innerWidth, innerHeight)
    },
    mouse: { type: "v2", value: new THREE.Vector2(0, 0) },
    waveLength: { type: "f", value: 1.2 },
    texture1: {
      value: loader.load(activeWallpaper)
    }
  };

  // Simpan state global
  glState = {
    renderer,
    camera,
    scene,
    loader,
    uniforms,
    mesh: null,
    geometry: null,
    material: null,
    time: 0
  };

  const getGeom = () => new THREE.PlaneGeometry(1, 1, 64, 64);

  const getMaterial = () => {
    return new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      blending: THREE.NormalBlending,
      uniforms: uniforms,
      vertexShader: document.querySelector("#vertex-shader").textContent,
      fragmentShader: document.querySelector("#fragment-shader").textContent
    });
  };

  glState.geometry = getGeom();
  glState.material = getMaterial();
  glState.mesh = new THREE.Mesh(glState.geometry, glState.material);
  scene.add(glState.mesh);

  const render = () => renderer.render(scene, camera);

  const update = () => {
    glState.time += 0.05;
    glState.material.uniforms.time.value = glState.time;
    render();
    requestAnimationFrame(update);
  };

  const resize = () => {
    const w = innerWidth;
    const h = innerHeight;
 
    camera.aspect = w / h;
    renderer.setSize(w, h);

    const dist = camera.position.z - glState.mesh.position.z;
    const height = 1;
    
    camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

    if (w / h > 1) glState.mesh.scale.x = glState.mesh.scale.y = 1.05 * w / h;
    
    camera.updateProjectionMatrix();
  };

  update();
  resize();
  window.addEventListener("resize", resize);
};

init();
