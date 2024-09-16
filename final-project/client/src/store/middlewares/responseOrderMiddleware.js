import attendanceSlice from "../slices/attendanceSlice";

const responseOrderMiddleware = (storeAPI) => (next) => (action) => {
  const { pendingActions } = storeAPI.getState().attendance;

  if (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")) {
    const actionType = action.meta.arg.typePrefix; // Menggunakan meta dari action untuk mendapatkan tipe tindakan

    // Hapus tindakan yang sudah selesai dari pendingActions
    const updatedPendingActions = pendingActions.filter(
      (pendingAction) => pendingAction !== actionType
    );

    // Perbarui state pendingActions tanpa dispatch tambahan
    next(attendanceSlice.actions.updatePendingActions(updatedPendingActions));
  }

  return next(action);
};

export default responseOrderMiddleware;
