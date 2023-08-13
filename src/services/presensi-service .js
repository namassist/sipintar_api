import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { ResponseError } from "../errors/response-error.js";
import { getJadwalPertemuanValidation } from "../validations/jadwalPertemuan-validation.js";

import { createPresensiValidation } from "../validations/presensi-validation.js";

const create = async (request) => {
  const presensi = validate(createPresensiValidation, request);

  const mahasiswa = await prismaClient.mahasiswa.findUnique({
    where: {
      id: presensi.mahasiswa_id,
    },
    select: {
      kelas_id: true,
    },
  });

  const isAvailable = await prismaClient.jadwalPertemuan.findFirst({
    where: {
      kelasMataKuliahDosen: {
        kelas_id: mahasiswa.kelas_id,
      },
      qr_code: presensi.qr_code,
    },
    select: {
      id: true,
    },
  });

  if (isAvailable.id === undefined) {
    throw new ResponseError(404, "presensi tidak valid");
  }

  const isPresensi = await prismaClient.presensiMahasiswa.count({
    where: {
      jadwalPertemuan_id: isAvailable.id,
      mahasiswa_id: presensi.mahasiswa_id,
    },
  });

  if (isPresensi === 1) {
    throw new ResponseError(404, "kamu sudah presensi");
  }

  const createdPresensi = await prismaClient.presensiMahasiswa.create({
    data: {
      jadwalPertemuan_id: isAvailable.id,
      mahasiswa_id: presensi.mahasiswa_id,
      waktu_presensi: presensi.waktu_presensi,
      status_presensi: "Hadir",
    },
    select: {
      id: true,
      waktu_presensi: true,
      status_presensi: true,
    },
  });

  return {
    id: createdPresensi.id,
    waktu: createdPresensi.waktu_presensi,
    status: createdPresensi.status_presensi,
  };
};

const get = async (aktivasiId) => {
  aktivasiId = validate(getJadwalPertemuanValidation, aktivasiId);

  const jadwalPertemuan = await prismaClient.jadwalPertemuan.findFirst({
    where: {
      id: aktivasiId,
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      waktu_realisasi: true,
      ruangan: true,
      qr_code: true,
      status: true,
      topik_perkuliahan: true,
      kelas_mk_dosen_id: true,
    },
  });

  if (!jadwalPertemuan) {
    throw new ResponseError(404, "Jadwal Pertemuan is not found");
  }

  return {
    id: jadwalPertemuan.id,
    hari: jadwalPertemuan.hari,
    jam_mulai: jadwalPertemuan.jam_mulai,
    jam_akhir: jadwalPertemuan.jam_akhir,
    waktu_realisasi: jadwalPertemuan.waktu_realisasi,
    ruangan: jadwalPertemuan.ruangan,
    qr_code: jadwalPertemuan.qr_code,
    status: jadwalPertemuan.status,
    topik_perkuliahan: jadwalPertemuan.topik_perkuliahan,
    kelas_mk_dosen_id: jadwalPertemuan.kelas_mk_dosen_id,
  };
};

const jadwalPertemuanMahasiswa = async (mahasiswaId, listPertemuanId) => {
  mahasiswaId = validate(getJadwalPertemuanValidation, mahasiswaId);
  listPertemuanId = validate(getJadwalPertemuanValidation, listPertemuanId);

  const mahasiswa = await prismaClient.mahasiswa.findFirst({
    where: {
      id: mahasiswaId,
    },
    select: {
      kelas_id: true,
    },
  });

  const jadwalPertemuans = await prismaClient.jadwalPertemuan.findMany({
    where: {
      kelasMataKuliahDosen: {
        kelas_id: mahasiswa.kelas_id,
      },
      kelas_mk_dosen_id: listPertemuanId,
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
      waktu_realisasi: true,
      topik_perkuliahan: true,
      qr_code: true,
      status: true,
      kelasMataKuliahDosen: {
        select: {
          kelas: {
            select: {
              nama_kelas: true,
            },
          },
          dosen: {
            select: {
              nama_dosen: true,
            },
          },
          mataKuliah: {
            select: {
              nama_mk: true,
              kode_mk: true,
            },
          },
        },
      },
    },
  });

  if (!jadwalPertemuans || jadwalPertemuans.length === 0) {
    throw new ResponseError(404, "Jadwal Pertemuan is not found");
  }

  const results = jadwalPertemuans.map((item) => ({
    id: item.id,
    hari: item.hari,
    jam_mulai: item.jam_mulai,
    jam_akhir: item.jam_akhir,
    ruangan: item.ruangan,
    waktu_realisasi: item.waktu_realisasi,
    topik_perkuliahan: item.topik_perkuliahan,
    qr_code: item.qr_code,
    kelas: item.kelasMataKuliahDosen.kelas.nama_kelas,
    dosen: item.kelasMataKuliahDosen.dosen.nama_dosen,
    mataKuliah: item.kelasMataKuliahDosen.mataKuliah.nama_mk,
    kode_mk: item.kelasMataKuliahDosen.mataKuliah.kode_mk,
  }));

  return results;
};

const search = async (mataKuliahId, kelasId, dosenId) => {
  mataKuliahId = await checkMataKuliahMustExists(mataKuliahId);
  kelasId = await checkKelasMustExists(kelasId);
  dosenId = await checkDosenMustExists(dosenId);

  const jadwalPertemuan = await prismaClient.jadwalPertemuan.findMany({
    where: {
      mata_kuliah_id: mataKuliahId,
      kelas_id: kelasId,
      dosen_id: dosenId,
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      ruangan: true,
      waktu_realisasi: true,
      topik_perkuliahan: true,
      qr_code: true,
      status: true,
      kelas: {
        select: {
          nama_kelas: true,
        },
      },
      mataKuliah: {
        select: {
          nama_mk: true,
          kode_mk: true,
        },
      },
      dosen: {
        select: {
          nama_dosen: true,
        },
      },
    },
  });

  const formattedJadwalPertemuan = jadwalPertemuan.map((item) => ({
    id: item.id,
    hari: item.hari,
    jam_mulai: item.jam_mulai,
    jam_akhir: item.jam_akhir,
    ruangan: item.ruangan,
    waktu: item.waktu_realisasi,
    topik: item.topik_perkuliahan,
    qr_code: item.qr_code,
    status: item.status,
    kelas: item.kelas.nama_kelas,
    tahunAjaran: item.tahunAjaran.nama,
    mataKuliah: item.mataKuliah.nama_mk,
    kode_mk: item.mataKuliah.kode_mk,
    dosen: item.dosen.nama_dosen,
  }));

  return {
    data: formattedJadwalPertemuan,
  };
};

export default {
  create,
  get,
  search,
  jadwalPertemuanMahasiswa,
};
