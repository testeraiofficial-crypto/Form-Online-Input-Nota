function rupiah(n) {
  return "Rp. " + (Number(n)||0).toLocaleString("id-ID");
}

function formatTanggal(date) {
  const bulan = ["JANUARI","FEBRUARI","MARET","APRIL","MEI","JUNI","JULI","AGUSTUS","SEPTEMBER","OKTOBER","NOVEMBER","DESEMBER"];
  let d = new Date(date);
  return d.getDate()+" "+bulan[d.getMonth()]+" "+d.getFullYear();
}

document.querySelectorAll("input").forEach(el=>{
  el.addEventListener("input", hitungKeuangan);
});

document.getElementById("pembayaran").addEventListener("change", ()=>{
  let sistem = pembayaran.value;
  let nota = new Date(tanggalNota.value);
  if(sistem==="CASH"){
    jatuhTempo.value = "LUNAS";
  } else {
    nota.setDate(nota.getDate()+parseInt(sistem));
    jatuhTempo.value = formatTanggal(nota);
  }
});

function hitungKeuangan(){
  let netto = (+nilaiNota.value + +ppn.value + +biaya.value)
            - (+returRusak.value + +returKurang.value + +diskonA.value + +diskonB.value);
  notaNetto.value = rupiah(netto);
  notaSistem.value = rupiah(netto + (+devFee.value||0));
}

function generateLaporan(){
  let sup = supplier.value==="LAINNYA" ? supplierLain.value : supplier.value;

  laporanSistem.value = 
`${sup}
NOMOR NOTA : ${nomorNota.value}
${detailBarang.value}
TANGGAL NOTA : ${formatTanggal(tanggalNota.value)}
BARANG DATANG : ${formatTanggal(tanggalDatang.value)}
SISTEM PEMBAYARAN : ${pembayaran.options[pembayaran.selectedIndex].text}
JATUH TEMPO : ${jatuhTempo.value}
CHECKER : ${checker.value}
VERIFIKATOR : ${verifikator.value}
PETUGAS DISPLAY : ${display.value}`.toUpperCase();

  laporanWA.value =
`*MINIMARKET BANGUNAN PILAR*
*Jl. Sunan Kudus, Gatak, Rukeman, Tamantirto, Bantul, DIY*
*═══════════════*

*LAPORAN INPUT BARANG MASUK*
*TANGGAL :* ${formatTanggal(tanggalInput.value)}

${laporanSistem.value}

*Nilai Nota :* ${rupiah(nilaiNota.value)}
*PPN :* ${rupiah(ppn.value)}
*Biaya Packing / Angkut / Bifast :* ${rupiah(biaya.value)}
*Retur (Barang Tidak Sesuai):* ${rupiah(returRusak.value)}
*Retur (Barang Kurang Lengkap):* ${rupiah(returKurang.value)}
*Discount A:* ${rupiah(diskonA.value)}
*Discount B:* ${rupiah(diskonB.value)}
*Nilai Nota Netto:* ${notaNetto.value}
*Development Fee :* ${rupiah(devFee.value)}

*Nilai Nota Terinput Sistem :* ${notaSistem.value}

*Jatuh Tempo:* ${jatuhTempo.value}`;
}
