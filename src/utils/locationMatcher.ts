import { Tender } from '../types';

/**
 * Smart location matching function for Kabupaten, Kota, and Provinsi.
 */
export function matchesLocation(tender: Tender, selectedLocation: string | null | undefined): boolean {
  if (!selectedLocation || selectedLocation === 'ALL' || selectedLocation === 'Semua Lokasi') {
    return true;
  }

  const q = selectedLocation.toLowerCase().trim();
  const tLokasi = (tender.lokasi || '').toLowerCase();
  const tInstansi = (tender.instansi || '').toLowerCase();
  const tSatKer = (tender.satuanKerja || '').toLowerCase();
  const tJudul = (tender.judul || '').toLowerCase();
  const tDeskripsi = (tender.deskripsi || '').toLowerCase();

  // Direct substring check
  if (
    tLokasi.includes(q) ||
    tInstansi.includes(q) ||
    tSatKer.includes(q)
  ) {
    return true;
  }

  // Tokenize by stripping standard administrative prefixes
  const tokens = q
    .replace(/kabupaten/g, '')
    .replace(/kab\./g, '')
    .replace(/kota/g, '')
    .replace(/pemprov/g, '')
    .replace(/pemerintah/g, '')
    .replace(/provinsi/g, '')
    .replace(/prov\./g, '')
    .replace(/d\.i\./g, '')
    .replace(/dki/g, 'jakarta')
    .replace(/lpse/g, '')
    .replace(/node/g, '')
    .split(/[\s,]+/)
    .filter((w) => w.length >= 3);

  if (tokens.length === 0) return true;

  return tokens.some(
    (tok) =>
      tLokasi.includes(tok) ||
      tInstansi.includes(tok) ||
      tSatKer.includes(tok) ||
      tJudul.includes(tok) ||
      tDeskripsi.includes(tok)
  );
}
