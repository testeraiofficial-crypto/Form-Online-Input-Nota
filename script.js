import { supplierList } from "./data/supplier.js";
import { checkerList } from "./data/checker.js";
import { pembayaranList } from "./data/pembayaran.js";

document.addEventListener("DOMContentLoaded", () => {

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
    if (!dateStr) return "-";
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
  
function autoResizeTextarea(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

  // =========================
  // HITUNG NILAI NOTA NETTO
  // =========================
  function hitungNilaiNotaNetto() {
    const nilaiNota = Number(document.getElementById("nilaiNota")?.value) || 0;
    const ppn = Number(document.getElementById("ppn")?.value) || 0;
    const biayaLain = Number(document.getElementById("biayaLain")?.value) || 0;

    const retur = Number(document.getElementById("returTidakSesuai")?.value) || 0;
    const diskonA = Number(document.getElementById("discountA")?.value) || 0;
    const diskonB = Number(document.getElementById("discountB")?.value) || 0;

    const netto =
      (nilaiNota + ppn + biayaLain) -
      (retur + diskonA + diskonB);

    const nettoEl = document.getElementById("nilaiNotaNetto");
    if (nettoEl) {
      nettoEl.value = formatRupiah(netto);
    }

    return netto;
  }

  // =========================
  // EVENT REALTIME (SATU KALI, AMAN)
  // =========================
  [
    "nilaiNota",
    "ppn",
    "biayaLain",
    "returTidakSesuai",
    "discountA",
    "discountB"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", hitungNilaiNotaNetto);
    }
  });

  // =========================
  // GENERATE LAPORAN
  // =========================
  generateBtn.addEventListener("click", () => {

    const supplier = supplierEl.value;
    const noNota = document.getElementById("noNota").value;
    const barang = document.getElementById("barang").value;
    const pembayaran = pembayaranEl.value;

    const tglNota = formatDate(document.getElementById("tglNota").value);
    const tglDatang = formatDate(document.getElementById("tglDatang").value);
    const tglTempo = formatDate(document.getElementById("tglTempo").value);
    const tanggalInput = formatDate(document.getElementById("tanggalInput").value);

    const checker = checkerEl.value;
    const verifikator = document.getElementById("verifikator").value;
    const display = document.getElementById("display").value;

    const nilaiNota = Number(document.getElementById("nilaiNota").value) || 0;
    const ppn = Number(document.getElementById("ppn").value) || 0;
    const biayaLain = Number(document.getElementById("biayaLain").value) || 0;
    const returTidakSesuai = Number(document.getElementById("returTidakSesuai").value) || 0;
    const discountA = Number(document.getElementById("discountA").value) || 0;
    const discountB = Number(document.getElementById("discountB").value) || 0;
    const developmentFee = Number(document.getElementById("developmentFee").value) || 0;

    // 🔒 PAKAI HASIL HITUNG SISTEM (TIDAK HITUNG ULANG)
    const nilaiNotaNetto = hitungNilaiNotaNetto();
    const nilaiTerinputSistem = nilaiNotaNetto + developmentFee;

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

*Nilai Nota :* ${formatRupiah(nilaiNota)}
*PPN :* ${formatRupiah(ppn)}
*Biaya Packing/ Angkut/ Bifast :* ${formatRupiah(biayaLain)}
*Retur (Barang Tidak Sesuai):* ${formatRupiah(returTidakSesuai)}
*Discount A:* ${formatRupiah(discountA)}
*Discount B:* ${formatRupiah(discountB)}
*Nilai Nota Netto:* ${formatRupiah(nilaiNotaNetto)}
*Development Fee :* ${formatRupiah(developmentFee)}

*Nilai Nota Terinput Sistem :* ${formatRupiah(nilaiTerinputSistem)}

*Jatuh Tempo:* *${tglTempo}*
`.trim();

    outputWa.value = wa;
outputSistem.value = sistem;

autoResizeTextarea(outputWa);
autoResizeTextarea(outputSistem);

  });

  window.copyText = function(id) {
    const el = document.getElementById(id);
    el.select();
    document.execCommand("copy");
    alert("Teks berhasil disalin");
  };

});
