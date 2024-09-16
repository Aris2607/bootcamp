const pullOutPlugin = {
  id: "pullOutPlugin",
  beforeDraw(chart) {
    const { ctx, data } = chart;
    const meta = chart.getDatasetMeta(0);

    // Menggeser potongan pertama (index 0) keluar dari pusat
    meta.data.forEach((arc, index) => {
      if (index === 0) {
        arc.options.offset = 100; // Ubah nilai untuk menyesuaikan jarak
      }
    });
  },
};

export default pullOutPlugin;
