import { supplierList } from "./data/supplier.js";
import { checkerList } from "./data/checker.js";
import { pembayaranList } from "./data/pembayaran.js";

const supplierEl = document.getElementById("supplier");
const checkerEl = document.getElementById("checker");
const pembayaranEl = document.getElementById("pembayaran");

const generateBtn = document.getElementById("generateBtn");
const outputWa = document.getElementById("outputWa");
const outputSistem = document.getElementById("outputSistem");

function populateSelect(el, data) {
  el.innerHTML = `<option value="">-- PILIH --</option>`;
  data.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    el.appendChild(opt);
  });
}

populateSelect(supplierEl, supplierList);
populateSelect(checkerEl, checkerList);
populateSelect(pembayaranEl, pembayaranList);

function formatDate(dateStr) {
  const months = [
    "JANUARI","FEBRUARI","MARET","APRIL","MEI","JUNI",
    "JULI","AGUSTUS","SEPTEMBER","OKTOBER","NOVEMBER","DESEMBER"
  ];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function formatRupiah(angka) {
  return "Rp." + Number(angka).toLocaleString("id-ID");
}

generateBtn.addEventListener("click", () => {
  const supplier = supplierEl.value;
  const noNota = document.getElementById("noNota").value;
  const barang = document.getElementById("barang").value;
  const pembayaran = pembayaranEl.value;
  const tglNota = formatDate(document.getElementById("tglNota").value);
  const tglDatang = formatDate(document.getElementById("tglDatang").value);
  const tglTempo = formatDate(document.getElementById("tglTempo").value);
  const checker = checkerEl.value;
  const verifikator = document.getElementById("verifikator").value;
  const display = document.getElementById("display").value;
  const tanggalInput = formatDate(document.getElementById("tanggalInput").value);

  const sistem = `
(${supplier}) (NO.NOTA : ${noNota})
${barang}
(TGL NOTA : ${tglNota})
(BARANG DATANG : ${tglDatang})
(SISTEM PEMBAYARAN : ${pembayaran})
(TGL JATUH TEMPO : ${tglTempo})
CHECKER : ${checker}
VERIFIKATOR : ${verifikator}
PETUGAS DISPLAY : ${display}
`.trim();

  const wa = `
*MINIMARKET BANGUNAN PILAR*
*Jl. Sunan Kudus, Gatak, Rukeman, Tamantirto, Bantul, DIY*
*═══════════════*

*LAPORAN INPUT BARANG MASUK*

*Tanggal :* ${tanggalInput}

${sistem}
`.trim();

  outputWa.value = wa;
  outputSistem.value = sistem;
});

window.copyText = function(id) {
  const el = document.getElementById(id);
  el.select();
  document.execCommand("copy");
  alert("Teks berhasil disalin");
};
