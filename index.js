const colorScheme = {
    seedColor: '24B1E0',
    schemeMode: ['monochrome', 'monochrome-dark', 'monochrome-light', 'analogic', 'complement', 'analogic-complement', 'triad', 'quad'],
    mode: 'triad',
    count: 6
}

function getScheme(colorScheme, addNav = false) {
    const {seedColor, mode, count} = colorScheme;
    fetch(`https://www.thecolorapi.com/scheme?hex=${seedColor}&mode=${mode}&count=${count}`)
        .then(res => res.json())
        .then(data => render(data, addNav))
}    

function render(data, addNav) {
    const optionsHtml = colorScheme.schemeMode
        .reduce( (acc, scheme) => acc + `<option>${scheme}</option>`,'');
    const colorsArr = data.colors.map(color => color.hex.value); 
    const colorsHtml = colorsArr.reduce((acc, color) => acc + `
        <div class="color" style="background-color: ${color};">
            <div class="hex">${color}</div>
        </div>`, '');
    
    if (addNav) { 
        document.getElementById('color-scheme').innerHTML = `
            <nav>
                <h1>Get Your Color Scheme</h1>
                <form id="colors-form">
                    <input id="color-seed" type="color" value="${data.seed.hex.value}">
                    <select id="color-select">${optionsHtml}</select>
                    <input id="color-count" type="number" value="${colorScheme.count}" min="0" max="20">
                    <!--<button id="get-scheme">Get color scheme</button>-->
                </form>
            </nav>
            <div id="colors"></div>
            <div id="message"></div> 
        `;
        
    }
    document.getElementById('colors').innerHTML = colorsHtml;
    
    addEventHandlers();
}


function addEventHandlers() {
    const {seedColor, mode, count} = colorScheme;
    document.getElementById('colors-form').addEventListener('change', () => {
        // e.preventDefault();
        colorScheme.mode = document.getElementById('color-select').value;
        colorScheme.seedColor = document.getElementById('color-seed').value.slice(1);
        colorScheme.count = document.getElementById('color-count').value;        
        getScheme(colorScheme);
    })
    document.querySelector('#colors').addEventListener('click', (e) => {
        if (e.target.classList == 'color' || 'hex') {
            const hex = e.target.textContent;
            const message = document.getElementById('message');
            
            navigator.clipboard.writeText(hex);
            message.innerHTML = `<div>Copied to clipboard:</div><b>${hex}</b>`;
            message.style.display = 'block';    
            setTimeout(() => message.style.display = 'none', 1000);        
        }
    })
}

getScheme(colorScheme, true);