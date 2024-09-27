// src/utils/alerts.js
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// Reusable function for success alert
export const showSuccessAlert = (
  title = "Success",
  text = "Operation successful"
) => {
  return Swal.fire({
    icon: "success",
    title,
    text,
    confirmButtonColor: "#38bdf8", // Tailwind cyan-400
  });
};

// Reusable function for error alert
export const showErrorAlert = (
  title = "Error",
  text = "Something went wrong"
) => {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonColor: "#f87171", // Tailwind red-400
  });
};

// Reusable function for warning alert with confirmation
export const showWarningConfirmAlert = async (
  title = "Are you sure?",
  text = "This action is irreversible"
) => {
  return Swal.fire({
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonColor: "#facc15", // Tailwind yellow-400
    cancelButtonColor: "#9ca3af", // Tailwind gray-400
    confirmButtonText: "Yes, confirm it!",
    cancelButtonText: "Cancel",
  });
};

// Reusable function for info alert
export const showInfoAlert = (
  title = "Info",
  text = "This is an info alert"
) => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    confirmButtonColor: "#3b82f6", // Tailwind blue-500
  });
};

export const showToastAlertWithProgressBar = (
  title = "Info",
  text = "This is a non-blocking alert",
  timer = 3000
) => {
  return Swal.fire({
    icon: "info",
    title,
    text,
    timer, // Timer in milliseconds
    timerProgressBar: true, // Enable progress bar
    toast: true, // Make it a toast (non-blocking)
    position: "top-end", // Position of the toast (top-end is default)
    showConfirmButton: false, // Hide the confirm button
    showCloseButton: true, // Optionally, add a close button
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer); // Pause timer on hover
      toast.addEventListener("mouseleave", Swal.resumeTimer); // Resume timer when hover stops
    },
  });
};

// Reusable function for toast alert with custom animation
export const showToastAlertWithCustomAnimation = (
  title = "Info",
  icon = "info",
  text = "",
  timer = 3000
) => {
  return MySwal.fire({
    icon,
    title,
    text,
    timer,
    timerProgressBar: true,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    showCloseButton: true,
    customClass: {
      popup: "mt-14", // Tailwind margin-top
    },
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    // Custom animation for show
    showClass: {
      popup: "animate__animated animate__fadeInDown animate__faster", // Using Animate.css or custom classes
    },
    // Custom animation for hide
    hideClass: {
      popup: "animate__animated animate__fadeOutUp animate__faster",
    },
  });
};
