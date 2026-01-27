import { supplierList } from "./data/supplier.js";
import { checkerList } from "./data/checker.js";
import { pembayaranList } from "./data/pembayaran.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     ELEMENT
  ====================== */
  const supplierEl = document.getElementById("supplier");
  const checkerEl = document.getElementById("checker");
  const pembayaranEl = document.getElementById("pembayaran");

  const generateBtn = document.getElementById("generateBtn");
  const outputWa = document.getElementById("outputWa");
  const outputSistem = document.getElementById("outputSistem");

  /* ======================
     HELPER
  ====================== */
  function populateSelect(el, data) {
    el.innerHTML = `<option value="">-- PILIH --</option>`;
    data.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      el.appendChild(opt);
    });
  }

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

  function toNumber(id) {
    return Number(document.getElementById(id)?.value) || 0;
  }

  function autoResizeTextarea(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  /* ======================
     POPULATE DATA
  ====================== */
  populateSelect(supplierEl, supplierList);
  populateSelect(checkerEl, checkerList);
  populateSelect(pembayaranEl, pembayaranList);

  /* ======================
     HITUNG NILAI (GLOBAL)
  ====================== */
  function hitungNilaiNotaNetto() {
    return (
      toNumber("nilaiNota") +
      toNumber("ppn") +
      toNumber("biayaLain")
    ) - (
      toNumber("returTidakSesuai") +
      toNumber("discountA") +
      toNumber("discountB")
    );
  }

  function hitungNilaiTerinputSistem() {
    return hitungNilaiNotaNetto() + toNumber("developmentFee");
  }

  function updateNilaiOtomatis() {
    const netto = hitungNilaiNotaNetto();
    const sistem = hitungNilaiTerinputSistem();

    document.getElementById("nilaiNotaNetto").value =
      formatRupiah(netto >= 0 ? netto : 0);

    document.getElementById("nilaiTerinputSistem").value =
      formatRupiah(sistem >= 0 ? sistem : 0);
  }

  /* ======================
     EVENT REALTIME (WAJIB)
  ====================== */
  [
    "nilaiNota",
    "ppn",
    "biayaLain",
    "returTidakSesuai",
    "discountA",
    "discountB",
    "developmentFee"
  ].forEach(id => {
    document.getElementById(id)
      .addEventListener("input", updateNilaiOtomatis);
  });

  /* ======================
     GENERATE LAPORAN
  ====================== */
  generateBtn.addEventListener("click", () => {

    updateNilaiOtomatis();

    const nilaiNotaNetto = hitungNilaiNotaNetto();
    const nilaiTerinputSistem = hitungNilaiTerinputSistem();

    const wa = `
const wa = `
*MINIMARKET BANGUNAN PILAR*
*JL Sunan Kudus, Gatak, Rukeman, Tamantirto, Bantul, DIY*
═══════════════════════════════════════════════════
*LAPORAN INPUT BARANG MASUK*
*Tanggal :* ${tanggalInput}


(${supplier}) (NO.NOTA : ${noNota})
${barang}
(TGL NOTA : ${tglNota})
(BARANG DATANG : ${tglDatang})
(SISTEM PEMBAYARAN : ${pembayaran})
(TGL JATUH TEMPO : ${pembayaran === "CASH" ? "LUNAS" : tglTempo})
CHECKER : ${checker}
VERIFIKATOR : ${verifikator}
PETUGAS DISPLAY : ${display}


*Nilai Nota :* ${formatRupiah(nilaiNota)}
*PPN :* ${formatRupiah(ppn)}
*Biaya Packing/ Angkut/ Bifast :* ${formatRupiah(biayaLain)}
*Retur (Barang Tidak Sesuai):* ${formatRupiah(returTidakSesuai)}
*Retur (Barang Kurang Lengkap):* Rp.0
*Discount A:* ${formatRupiah(discountA)}
*Discount B:* 26% = ${formatRupiah(discountB)}
*Nilai Nota Netto:* ${formatRupiah(nilaiNotaNetto)}


*Development Fee :* ${formatRupiah(developmentFee)}


*Nilai Nota Terinput Sistem :* ${formatRupiah(nilaiTerinputSistem)}


*Jatuh Tempo:* *${pembayaran === "CASH" ? "LUNAS" : tglTempo}*


*Keterangan:*
`.trim();


    if (
      formatRupiah(nilaiTerinputSistem) !==
      document.getElementById("nilaiTerinputSistem").value
    ) {
      alert("⚠️ Nilai tidak sesuai dengan laporan WhatsApp");
      return;
    }

    outputWa.value = wa;
    autoResizeTextarea(outputWa);
  });

});
