function rupiah(n) {
  return "Rp. " + (Number(n) || 0).toLocaleString("id-ID");
}

// Menghindari eror tulisan 'NaN' jika tanggal kosong
function formatTanggal(date) {
  if (!date) return "-"; 
  const bulan = ["JANUARI","FEBRUARI","MARET","APRIL","MEI","JUNI","JULI","AGUSTUS","SEPTEMBER","OKTOBER","NOVEMBER","DESEMBER"];
  let d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.getDate() + " " + bulan[d.getMonth()] + " " + d.getFullYear();
}

// Fitur untuk memunculkan input supplier manual
document.getElementById("supplier").addEventListener("change", function() {
  const suplLainContainer = document.getElementById("supplierLainContainer");
  if (this.value === "LAINNYA") {
    suplLainContainer.style.display = "block";
  } else {
    suplLainContainer.style.display = "none";
  }
});

// Event listener keuangan
document.querySelectorAll("input[type=number]").forEach(el => {
  el.addEventListener("input", hitungKeuangan);
});

// Otomatis hitung jatuh tempo saat tanggal nota / sistem pembayaran diubah
function hitungJatuhTempo() {
  const sistem = document.getElementById("pembayaran").value;
  const tglNotaVal = document.getElementById("tanggalNota").value;
  const jatuhTempoEl = document.getElementById("jatuhTempo");

  if (!tglNotaVal) return;

  if (sistem === "CASH") {
    jatuhTempoEl.value = "LUNAS";
  } else {
    let nota = new Date(tglNotaVal);
    nota.setDate(nota.getDate() + parseInt(sistem));
    jatuhTempoEl.value = formatTanggal(nota);
  }
}

document.getElementById("pembayaran").addEventListener("change", hitungJatuhTempo);
document.getElementById("tanggalNota").addEventListener("input", hitungJatuhTempo);

function hitungKeuangan() {
  const vNota = Number(document.getElementById("nilaiNota").value) || 0;
  const vPpn = Number(document.getElementById("ppn").value) || 0;
  const vBiaya = Number(document.getElementById("biaya").value) || 0;
  const vReturR = Number(document.getElementById("returRusak").value) || 0;
  const vReturK = Number(document.getElementById("returKurang").value) || 0;
  const vDiskA = Number(document.getElementById("diskonA").value) || 0;
  const vDiskB = Number(document.getElementById("diskonB").value) || 0;
  const vDev = Number(document.getElementById("devFee").value) || 0;

  let netto = (vNota + vPpn + vBiaya) - (vReturR + vReturK + vDiskA + vDiskB);
  
  document.getElementById("notaNetto").value = rupiah(netto);
  document.getElementById("notaSistem").value = rupiah(netto + vDev);
}

function generateLaporan() {
  // Ambil elemen
  const elSup = document.getElementById("supplier");
  const elSupLain = document.getElementById("supplierLain");
  const elNomor = document.getElementById("nomorNota");
  const elTglInput = document.getElementById("tanggalInput");
  const elTglNota = document.getElementById("tanggalNota");
  const elTglDatang = document.getElementById("tanggalDatang");
  const elBayar = document.getElementById("pembayaran");
  const elJatuhTempo = document.getElementById("jatuhTempo");
  const elDetail = document.getElementById("detailBarang");
  const elChecker = document.getElementById("checker");
  const elVerif = document.getElementById("verifikator");
  const elDisp = document.getElementById("display");

  // Validasi supplier
  let sup = elSup.value === "LAINNYA" ? elSupLain.value : elSup.value;
  if (!sup) sup = "-";

  const laporanSistem = document.getElementById("laporanSistem");
  const laporanWA = document.getElementById("laporanWA");

  // FORMAT 1: LAPORAN SISTEM
  laporanSistem.value = 
`(${sup}) (NO.NOTA : ${elNomor.value || "-"}) ${elDetail.value.toUpperCase()} (TGL NOTA : ${formatTanggal(elTglNota.value)}) (BARANG DATANG : ${formatTanggal(elTglDatang.value)}) ( SISTEM PEMBAYARAN : ${elBayar.options[elBayar.selectedIndex].text}) (TGL JATUH TEMPO : ${elJatuhTempo.value || "-"}) CHECKER : ${elChecker.value}  VERIFIKATOR : ${elVerif.value} PETUGAS DISPLAY : ${elDisp.value})`.toUpperCase();

  // FORMAT 2: LAPORAN WHATSAPP (Sesuai dengan template yang diminta)
  laporanWA.value = 
`*MINIMARKET BANGUNAN PILAR*
*Jl. Sunan Kudus, Gatak, Rukeman, Tamantirto, Bantul, DIY*
*═══════════════*

*LAPORAN INPUT BARANG MASUK*
*TANGGAL :* ${formatTanggal(elTglInput.value)}

*DATA NOTA*
*Supplier:* ${sup}
*No.Nota:* ${elNomor.value || "-"}
*Tanggal Nota:* ${formatTanggal(elTglNota.value)}
*Barang Datang:* ${formatTanggal(elTglDatang.value)}
*Sistem Pembayaran:* ${elBayar.options[elBayar.selectedIndex].text}

*DATA PETUGAS PENERIMA BARANG*
*Checker:* ${elChecker.value}
*Verifikator:* ${elVerif.value}
*Petugas Display:* ${elDisp.value}

*DATA BARANG :*
*Barang sah diterima:*
${elDetail.value || "-"}

*DATA KEUANGAN*
*Nilai Nota :* ${rupiah(document.getElementById("nilaiNota").value)}
*PPN :* ${rupiah(document.getElementById("ppn").value)}
*Biaya Packing / Angkut / Bifast :* ${rupiah(document.getElementById("biaya").value)}
*Retur (Barang Tidak Sesuai):* ${rupiah(document.getElementById("returRusak").value)}
*Retur (Barang Kurang Lengkap):* ${rupiah(document.getElementById("returKurang").value)}
*Discount A:* ${rupiah(document.getElementById("diskonA").value)}
*Discount B:* ${rupiah(document.getElementById("diskonB").value)}
*Nilai Nota Netto:* ${document.getElementById("notaNetto").value || "Rp. 0"}
*Development Fee :* ${rupiah(document.getElementById("devFee").value)}

*Nilai Nota Terinput Sistem :* ${document.getElementById("notaSistem").value || "Rp. 0"}

*Jatuh Tempo:* ${elJatuhTempo.value || "-"}`;
}

function copyLaporan(id) {
  const textarea = document.getElementById(id);
  textarea.select();
  textarea.setSelectionRange(0, 99999); // Untuk perangkat mobile
  
  try {
    document.execCommand("copy");
    alert("✅ LAPORAN BERHASIL DISALIN");
  } catch (err) {
    alert("❌ Gagal menyalin teks.");
  }
}
