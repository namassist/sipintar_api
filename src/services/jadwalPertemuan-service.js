import { prismaClient } from "../apps/database.js";
import qrcode from "qrcode";
import pkg from "jsonwebtoken";
import { validate } from "../validations/validation.js";
import { getDosenValidation } from "../validations/dosen-validation.js";
import { getMataKuliahValidation } from "../validations/mataKuliah-validation.js";
import { getKelasValidation } from "../validations/kelas-validation.js";
import { ResponseError } from "../errors/response-error.js";
import {
  createJadwalPertemuanValidation,
  getJadwalPertemuanValidation,
} from "../validations/jadwalPertemuan-validation.js";
const { sign } = pkg;

const checkDosenMustExists = async (dosenId) => {
  dosenId = validate(getDosenValidation, dosenId);

  const totalDosentInDatabase = await prismaClient.dosen.count({
    where: {
      id: dosenId,
    },
  });

  if (totalDosentInDatabase !== 1) {
    throw new ResponseError(404, "dosen is not found");
  }

  return dosenId;
};

const checkMataKuliahMustExists = async (mataKuliahId) => {
  mataKuliahId = validate(getMataKuliahValidation, mataKuliahId);

  const totalDosentInDatabase = await prismaClient.mataKuliah.count({
    where: {
      id: mataKuliahId,
    },
  });

  if (totalDosentInDatabase !== 1) {
    throw new ResponseError(404, "dosen is not found");
  }

  return mataKuliahId;
};

const checkKelasMustExists = async (kelasId) => {
  kelasId = validate(getKelasValidation, kelasId);

  const totalDosentInDatabase = await prismaClient.kelas.count({
    where: {
      id: kelasId,
    },
  });

  if (totalDosentInDatabase !== 1) {
    throw new ResponseError(404, "dosen is not found");
  }

  return kelasId;
};

const create = async (request) => {
  const jadwalPertemuans = validate(createJadwalPertemuanValidation, request);
  const secretKey = "rifkasyantik";

  const createdJadwalPertemuan = await prismaClient.jadwalPertemuan.create({
    data: {
      hari: jadwalPertemuans.hari,
      jam_mulai: jadwalPertemuans.jam_mulai,
      jam_akhir: jadwalPertemuans.jam_akhir,
      waktu_realisasi: jadwalPertemuans.waktu_realisasi,
      ruangan: jadwalPertemuans.ruangan,
      topik_perkuliahan: jadwalPertemuans.topik_perkuliahan,
      kelas_mk_dosen_id: jadwalPertemuans.kelas_mk_dosen_id,
      qr_code: "",
      status: true,
    },
    select: {
      id: true,
      hari: true,
      jam_mulai: true,
      jam_akhir: true,
      waktu_realisasi: true,
      ruangan: true,
      topik_perkuliahan: true,
      kelas_mk_dosen_id: true,
    },
  });

  const encryptedData = sign(createdJadwalPertemuan, secretKey);

  qrcode.toDataURL(encryptedData, async (err, url) => {
    if (err) {
      throw new ResponseError(500, "cant generate qrCode, error");
    }
    await prismaClient.jadwalPertemuan.update({
      where: {
        id: createdJadwalPertemuan.id,
      },
      data: {
        qr_code: url,
      },
    });
  });

  return createdJadwalPertemuan;
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
  search,
  jadwalPertemuanMahasiswa,
};