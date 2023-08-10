import { prismaClient } from "../apps/database.js";
import { validate } from "../validations/validation.js";
import { createJadwalPertemuanValidation } from "../validations/jadwalPertemuan-validation.js";
import { getDosenValidation } from "../validations/dosen-validation.js";
import { getMataKuliahValidation } from "../validations/mataKuliah-validation.js";
import { getKelasValidation } from "../validations/kelas-validation.js";
import { ResponseError } from "../errors/response-error.js";

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

  const createdJadwalPertemuans = await prismaClient.jadwalPertemuan.create({
    data: {
      hari: jadwalPertemuans.hari,
      jam_mulai: jadwalPertemuans.jam_mulai,
      jam_akhir: jadwalPertemuans.jam_akhir,
      ruangan: jadwalPertemuans.ruangan,
      kelas_id: jadwalPertemuans.kelas_id,
      tahun_ajaran_id: jadwalPertemuans.tahun_ajaran_id,
      mata_kuliah_id: jadwalPertemuans.mata_kuliah_id,
      dosen_id: jadwalPertemuans.dosen_id,
    },
  });

  return createdJadwals;
};

// const get = async (jadwalId) => {
//   jadwalId = validate(getJadwalValidation, jadwalId);

//   const jadwal = await prismaClient.jadwal.findFirst({
//     where: {
//       id: jadwalId,
//     },
//     select: {
//       id: true,
//       hari: true,
//       jam_mulai: true,
//       jam_akhir: true,
//       ruangan: true,
//       kelas: {
//         select: {
//           nama_kelas: true,
//         },
//       },
//       tahunAjaran: {
//         select: {
//           nama: true,
//         },
//       },
//       mataKuliah: {
//         select: {
//           nama_mk: true,
//           kode_mk: true,
//         },
//       },
//       dosen: {
//         select: {
//           nama_dosen: true,
//         },
//       },
//     },
//   });

//   if (!jadwal) {
//     throw new ResponseError(404, "Jadwal is not found");
//   }

//   return {
//     id: jadwal.id,
//     hari: jadwal.hari,
//     jam_mulai: jadwal.jam_mulai,
//     jam_akhir: jadwal.jam_akhir,
//     ruangan: jadwal.ruangan,
//     kelas: jadwal.kelas.nama_kelas,
//     tahunAjaran: jadwal.tahunAjaran.nama,
//     mataKuliah: jadwal.mataKuliah.nama_mk,
//     kode_mk: jadwal.mataKuliah.kode_mk,
//     dosen: jadwal.dosen.nama_dosen,
//   };
// };

// const update = async (request) => {
//   const jadwal = validate(updateJadwalValidation, request);

//   const totalJadwalInDatabase = await prismaClient.jadwal.count({
//     where: {
//       id: jadwal.id,
//     },
//   });

//   if (totalJadwalInDatabase !== 1) {
//     throw new ResponseError(404, "Jadwal is not found");
//   }

//   const updatedJadwal = await prismaClient.jadwal.update({
//     where: {
//       id: jadwal.id,
//     },
//     data: {
//       hari: jadwal.hari,
//       jam_mulai: jadwal.jam_mulai,
//       jam_akhir: jadwal.jam_akhir,
//       ruangan: jadwal.ruangan,
//       kelas_id: jadwal.kelas_id,
//       tahun_ajaran_id: jadwal.tahun_ajaran_id,
//       mata_kuliah_id: jadwal.mata_kuliah_id,
//       dosen_id: jadwal.dosen_id,
//     },
//     select: {
//       id: true,
//       hari: true,
//       jam_mulai: true,
//       jam_akhir: true,
//       ruangan: true,
//       kelas: {
//         select: {
//           nama_kelas: true,
//         },
//       },
//       tahunAjaran: {
//         select: {
//           nama: true,
//         },
//       },
//       mataKuliah: {
//         select: {
//           nama_mk: true,
//           kode_mk: true,
//         },
//       },
//       dosen: {
//         select: {
//           nama_dosen: true,
//         },
//       },
//     },
//   });

//   return {
//     id: updatedJadwal.id,
//     hari: updatedJadwal.hari,
//     jam_mulai: updatedJadwal.jam_mulai,
//     jam_akhir: updatedJadwal.jam_akhir,
//     ruangan: updatedJadwal.ruangan,
//     kelas: updatedJadwal.kelas.nama_kelas,
//     tahunAjaran: updatedJadwal.tahunAjaran.nama,
//     mataKuliah: updatedJadwal.mataKuliah.nama_mk,
//     kode_mk: updatedJadwal.mataKuliah.kode_mk,
//     dosen: updatedJadwal.dosen.nama_dosen,
//   };
// };

// const remove = async (jadwalId) => {
//   jadwalId = validate(getJadwalValidation, jadwalId);

//   const totalInDatabase = await prismaClient.jadwal.count({
//     where: {
//       id: jadwalId,
//     },
//   });

//   if (totalInDatabase !== 1) {
//     throw new ResponseError(404, "Jadwal is not found");
//   }

//   return await prismaClient.jadwal.delete({
//     where: { id: jadwalId },
//   });
// };

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
  // get,
  create,
  // update,
  // remove,
  search,
};
