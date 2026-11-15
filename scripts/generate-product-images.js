const fs = require("node:fs");
const path = require("node:path");
const products = require("../src/data/products");

const outputDirectory = path.join(__dirname, "..", "src", "assets", "generated-products");
const palette = [
    ["#dbeafe", "#2563eb"],
    ["#fce7f3", "#db2777"],
    ["#dcfce7", "#16a34a"],
    ["#ede9fe", "#7c3aed"],
    ["#ffedd5", "#ea580c"],
    ["#cffafe", "#0891b2"],
    ["#fef3c7", "#d97706"]
];

function escapeXml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function illustrationFor(product, accent) {
    const slug = product.slug;

    if (slug.includes("keyboard")) {
        let keys = "";
        for (let row = 0; row < 4; row += 1) {
            for (let column = 0; column < 10; column += 1) {
                const x = 155 + column * 30;
                const y = 185 + row * 31;
                const color = (row + column) % 7 === 0 ? accent : "#f8fafc";
                keys += `<rect x="${x}" y="${y}" width="24" height="23" rx="5" fill="${color}"/>`;
            }
        }
        return `<g filter="url(#shadow)"><rect x="125" y="165" width="350" height="160" rx="20" fill="#263449"/>${keys}<rect x="232" y="310" width="136" height="8" rx="4" fill="#94a3b8"/></g>`;
    }

    if (slug.includes("mouse")) {
        return `<g filter="url(#shadow)"><path d="M300 125c-62 0-95 43-95 105v38c0 52 38 82 95 82s95-30 95-82v-38c0-62-33-105-95-105Z" fill="#263449"/><path d="M300 128v93m-95 0h190" fill="none" stroke="#64748b" stroke-width="7"/><rect x="289" y="158" width="22" height="42" rx="11" fill="${accent}"/><path d="M221 296c21 20 48 30 79 30s58-10 79-30" fill="none" stroke="${accent}" stroke-width="8" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("headphones")) {
        return `<g filter="url(#shadow)"><path d="M195 275v-38c0-63 47-112 105-112s105 49 105 112v38" fill="none" stroke="#263449" stroke-width="28" stroke-linecap="round"/><rect x="170" y="245" width="70" height="112" rx="28" fill="${accent}"/><rect x="360" y="245" width="70" height="112" rx="28" fill="${accent}"/><rect x="185" y="260" width="40" height="78" rx="18" fill="#263449"/><rect x="375" y="260" width="40" height="78" rx="18" fill="#263449"/></g>`;
    }

    if (slug.includes("earbuds")) {
        return `<g filter="url(#shadow)"><rect x="190" y="225" width="220" height="120" rx="48" fill="#263449"/><path d="M210 257c46 22 134 22 180 0" fill="none" stroke="#64748b" stroke-width="7"/><circle cx="260" cy="210" r="36" fill="#f8fafc"/><circle cx="340" cy="210" r="36" fill="#f8fafc"/><path d="M260 210v55m80-55v55" stroke="${accent}" stroke-width="18" stroke-linecap="round"/><circle cx="260" cy="210" r="13" fill="${accent}"/><circle cx="340" cy="210" r="13" fill="${accent}"/></g>`;
    }

    if (slug.includes("monitor")) {
        return `<g filter="url(#shadow)"><rect x="145" y="120" width="310" height="200" rx="18" fill="#263449"/><rect x="160" y="135" width="280" height="170" rx="10" fill="#bfdbfe"/><path d="M175 275l75-75 50 42 46-58 79 91Z" fill="${accent}" opacity=".72"/><path d="M300 320v38m-65 12h130" stroke="#475569" stroke-width="16" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("chair")) {
        return `<g filter="url(#shadow)"><rect x="240" y="115" width="120" height="150" rx="36" fill="#263449"/><rect x="220" y="245" width="160" height="62" rx="25" fill="${accent}"/><path d="M235 280h-48v55m178-55h48v55M300 307v55m0 0-67 42m67-42 67 42m-67-42v48" fill="none" stroke="#475569" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    }

    if (slug.includes("webcam")) {
        return `<g filter="url(#shadow)"><rect x="170" y="205" width="260" height="82" rx="34" fill="#263449"/><circle cx="300" cy="246" r="36" fill="#0f172a"/><circle cx="300" cy="246" r="23" fill="${accent}"/><circle cx="300" cy="246" r="11" fill="#dbeafe"/><path d="M260 288v48h80v-48" fill="#475569"/><circle cx="205" cy="246" r="7" fill="#86efac"/></g>`;
    }

    if (slug.includes("microphone")) {
        return `<g filter="url(#shadow)"><rect x="260" y="125" width="80" height="155" rx="40" fill="#263449"/><path d="M275 160h50m-50 24h50m-50 24h50" stroke="${accent}" stroke-width="7" stroke-linecap="round"/><path d="M225 245v25c0 48 34 78 75 78s75-30 75-78v-25m-75 103v30m-55 0h110" fill="none" stroke="#475569" stroke-width="14" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("stand")) {
        return `<g filter="url(#shadow)"><path d="M175 185h250l-27 145H202Z" fill="#cbd5e1"/><path d="M205 203h190l-18 105H225Z" fill="#263449"/><path d="M185 340h230l25 24H160Z" fill="${accent}"/><path d="M300 330v27" stroke="#475569" stroke-width="10"/></g>`;
    }

    if (slug.includes("charger") && !slug.includes("power-bank")) {
        return `<g filter="url(#shadow)"><rect x="190" y="175" width="220" height="145" rx="34" fill="#263449"/><circle cx="300" cy="245" r="47" fill="#334155" stroke="${accent}" stroke-width="9"/><path d="M300 222v46m-23-23h46" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round"/><path d="M220 335h160" stroke="#475569" stroke-width="12" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("ssd") || slug.includes("hdd")) {
        return `<g filter="url(#shadow)"><rect x="185" y="165" width="230" height="155" rx="26" fill="#263449"/><rect x="205" y="185" width="190" height="115" rx="17" fill="#334155"/><circle cx="240" cy="222" r="10" fill="${accent}"/><path d="M230 265h150" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/><path d="M240 335h120" stroke="#475569" stroke-width="12" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("router")) {
        const mesh = slug.includes("mesh");
        return `<g filter="url(#shadow)"><path d="M205 248l20-60h150l20 60v72H205Z" fill="#263449"/><path d="M235 190l-18-70m166 70 18-70" stroke="#475569" stroke-width="12" stroke-linecap="round"/><circle cx="260" cy="280" r="7" fill="#86efac"/><circle cx="300" cy="280" r="7" fill="${accent}"/><circle cx="340" cy="280" r="7" fill="#86efac"/>${mesh ? `<rect x="118" y="267" width="48" height="65" rx="15" fill="#64748b"/><rect x="434" y="267" width="48" height="65" rx="15" fill="#64748b"/>` : ""}</g>`;
    }

    if (slug.includes("speaker")) {
        return `<g filter="url(#shadow)"><rect x="215" y="135" width="170" height="220" rx="55" fill="#263449"/><circle cx="300" cy="205" r="40" fill="#334155" stroke="${accent}" stroke-width="8"/><circle cx="300" cy="288" r="38" fill="#334155" stroke="#94a3b8" stroke-width="7"/><circle cx="300" cy="205" r="10" fill="${accent}"/></g>`;
    }

    if (slug.includes("smartwatch")) {
        return `<g filter="url(#shadow)"><path d="M265 110h70l18 80h-106Zm-18 170h106l-18 90h-70Z" fill="${accent}"/><rect x="220" y="180" width="160" height="120" rx="30" fill="#263449"/><rect x="240" y="200" width="120" height="80" rx="18" fill="#dbeafe"/><circle cx="300" cy="240" r="23" fill="${accent}"/><path d="M300 220v22l15 10" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("controller")) {
        return `<g filter="url(#shadow)"><path d="M190 210c12-28 37-42 68-34l42 12 42-12c31-8 56 6 68 34l24 72c11 34-13 57-42 43l-51-35h-82l-51 35c-29 14-53-9-42-43Z" fill="#263449"/><path d="M236 235v54m-27-27h54" stroke="${accent}" stroke-width="12" stroke-linecap="round"/><circle cx="362" cy="238" r="10" fill="#86efac"/><circle cx="388" cy="260" r="10" fill="#fda4af"/><circle cx="362" cy="282" r="10" fill="#93c5fd"/></g>`;
    }

    if (slug.includes("tablet")) {
        return `<g filter="url(#shadow)"><rect x="175" y="125" width="250" height="215" rx="22" fill="#263449"/><rect x="192" y="142" width="216" height="181" rx="12" fill="#dbeafe"/><path d="M230 280c38-87 86 13 145-80" fill="none" stroke="${accent}" stroke-width="11" stroke-linecap="round"/><path d="M430 120l18 9-91 187-18-9Z" fill="#475569"/><path d="M357 316l-10 21 22-12Z" fill="${accent}"/></g>`;
    }

    if (slug.includes("lamp")) {
        return `<g filter="url(#shadow)"><path d="M260 335h130" stroke="#475569" stroke-width="18" stroke-linecap="round"/><path d="M300 330l-15-100 80-80" fill="none" stroke="#263449" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/><path d="M340 132l90 18-29 55-90-18Z" fill="${accent}"/><path d="M357 212l-38 34" stroke="#475569" stroke-width="9"/></g>`;
    }

    if (slug.includes("dock")) {
        return `<g filter="url(#shadow)"><rect x="165" y="205" width="270" height="112" rx="25" fill="#263449"/><rect x="195" y="225" width="40" height="18" rx="5" fill="#94a3b8"/><rect x="252" y="225" width="40" height="18" rx="5" fill="${accent}"/><rect x="309" y="225" width="40" height="18" rx="5" fill="#94a3b8"/><rect x="366" y="225" width="40" height="18" rx="5" fill="#94a3b8"/><circle cx="205" cy="280" r="8" fill="#86efac"/><path d="M225 335h150" stroke="#475569" stroke-width="12" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("power-bank")) {
        return `<g filter="url(#shadow)"><rect x="225" y="120" width="150" height="235" rx="30" fill="#263449"/><rect x="246" y="145" width="108" height="38" rx="12" fill="#0f172a"/><text x="300" y="171" text-anchor="middle" fill="#dbeafe" font-size="18" font-family="Arial">88%</text><circle cx="300" cy="215" r="9" fill="${accent}"/><path d="M275 270h50m-25-25v50" stroke="#e2e8f0" stroke-width="8" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("smart-plug")) {
        return `<g filter="url(#shadow)"><rect x="215" y="130" width="170" height="215" rx="36" fill="#f8fafc" stroke="#cbd5e1" stroke-width="8"/><circle cx="270" cy="205" r="12" fill="#475569"/><circle cx="330" cy="205" r="12" fill="#475569"/><rect x="270" y="235" width="60" height="56" rx="18" fill="${accent}"/><circle cx="300" cy="263" r="10" fill="#fff"/><path d="M245 320h110" stroke="#cbd5e1" stroke-width="8" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("projector")) {
        return `<g filter="url(#shadow)"><path d="M175 190h250l28 105H147Z" fill="#263449"/><circle cx="365" cy="242" r="42" fill="#0f172a" stroke="${accent}" stroke-width="9"/><circle cx="365" cy="242" r="20" fill="#bfdbfe"/><rect x="195" y="210" width="90" height="20" rx="8" fill="#475569"/><path d="M205 315h190" stroke="#475569" stroke-width="12" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("desk")) {
        return `<g filter="url(#shadow)"><rect x="130" y="205" width="340" height="35" rx="12" fill="${accent}"/><path d="M165 240v115m270-115v115" stroke="#475569" stroke-width="18"/><rect x="250" y="130" width="100" height="72" rx="12" fill="#263449"/><rect x="263" y="143" width="74" height="46" rx="7" fill="#bfdbfe"/><path d="M300 202v22" stroke="#475569" stroke-width="8"/></g>`;
    }

    if (slug.includes("cable")) {
        return `<g filter="url(#shadow)"><path d="M195 200c0-65 95-65 95 0v92c0 65 115 65 115 0" fill="none" stroke="#263449" stroke-width="24" stroke-linecap="round"/><rect x="172" y="170" width="45" height="60" rx="10" fill="${accent}"/><rect x="383" y="270" width="45" height="60" rx="10" fill="${accent}"/><path d="M184 180v40m22-40v40m188 61v40m22-40v40" stroke="#e2e8f0" stroke-width="5"/></g>`;
    }

    if (slug.includes("flash-drive")) {
        return `<g filter="url(#shadow)"><path d="M190 205h178l42 44v70H190Z" fill="#263449"/><rect x="410" y="236" width="42" height="55" rx="5" fill="#cbd5e1"/><rect x="220" y="225" width="95" height="72" rx="12" fill="${accent}"/><circle cx="245" cy="320" r="7" fill="#94a3b8"/></g>`;
    }

    if (slug.includes("mini-pc")) {
        return `<g filter="url(#shadow)"><rect x="180" y="150" width="240" height="180" rx="30" fill="#263449"/><rect x="200" y="170" width="200" height="140" rx="20" fill="#334155"/><circle cx="365" cy="200" r="9" fill="${accent}"/><path d="M230 220h120m-120 25h120m-120 25h85" stroke="#64748b" stroke-width="8" stroke-linecap="round"/><path d="M245 345h110" stroke="#475569" stroke-width="12" stroke-linecap="round"/></g>`;
    }

    if (slug.includes("usb-c-hub")) {
        return `<g filter="url(#shadow)"><rect x="185" y="190" width="230" height="125" rx="26" fill="#263449"/><rect x="205" y="215" width="34" height="20" rx="5" fill="${accent}"/><rect x="252" y="215" width="34" height="20" rx="5" fill="#94a3b8"/><rect x="299" y="215" width="34" height="20" rx="5" fill="#94a3b8"/><rect x="346" y="215" width="34" height="20" rx="5" fill="#94a3b8"/><path d="M225 277h150" stroke="#64748b" stroke-width="8" stroke-linecap="round"/><path d="M185 250h-48" stroke="#475569" stroke-width="12" stroke-linecap="round"/></g>`;
    }

    return `<g filter="url(#shadow)"><rect x="190" y="155" width="220" height="175" rx="30" fill="#263449"/><rect x="215" y="180" width="170" height="125" rx="20" fill="${accent}"/><circle cx="300" cy="242" r="27" fill="#f8fafc" opacity=".85"/><path d="M260 350h80" stroke="#475569" stroke-width="12" stroke-linecap="round"/></g>`;
}

function createSvg(product) {
    const [background, accent] = palette[(product.id - 1) % palette.length];
    const title = escapeXml(product.name);
    const drawing = illustrationFor(product, accent);

    return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="480" viewBox="0 0 600 480" role="img" aria-labelledby="title description">
  <title id="title">${title}</title>
  <desc id="description">Original vector illustration of ${title}</desc>
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${background}"/>
      <stop offset="1" stop-color="#f8fafc"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" flood-color="#334155" flood-opacity=".18"/>
    </filter>
  </defs>
  <rect width="600" height="480" rx="36" fill="url(#background)"/>
  <circle cx="500" cy="90" r="90" fill="#fff" opacity=".28"/>
  <circle cx="95" cy="370" r="110" fill="#fff" opacity=".24"/>
  <path d="M90 374h420" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round" opacity=".65"/>
  ${drawing}
  <text x="300" y="430" text-anchor="middle" fill="#334155" font-size="21" font-family="Arial, sans-serif" font-weight="600">${title}</text>
</svg>
`;
}

fs.mkdirSync(outputDirectory, { recursive: true });

for (const product of products) {
    const outputPath = path.join(outputDirectory, `${product.slug}.svg`);
    fs.writeFileSync(outputPath, createSvg(product), "utf8");
}

console.log(`Generated ${products.length} product illustrations in ${outputDirectory}`);
