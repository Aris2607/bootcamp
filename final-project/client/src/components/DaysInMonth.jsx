import React from "react";

const DaysInMonth = () => {
  // Fungsi untuk mendapatkan jumlah hari dalam bulan ini
  const getDaysInCurrentMonth = () => {
    const now = new Date(); // Tanggal saat ini
    const year = now.getFullYear(); // Tahun saat ini
    const month = now.getMonth(); // Bulan saat ini (dimulai dari 0)

    console.log(month);

    // Membuat tanggal pada bulan berikutnya dengan hari ke-0 (akan menghasilkan hari terakhir dari bulan saat ini)
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return daysInMonth;
  };

  return getDaysInCurrentMonth();
};

export default DaysInMonth;
