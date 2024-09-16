const NotificationCard = ({ type, message, time }) => {
  let bgColor, icon;

  switch (type) {
    case "success":
      bgColor = "bg-green-100 text-green-600";
      icon = "✅"; // You can replace this with an SVG or an icon from a library like FontAwesome
      break;
    case "error":
      bgColor = "bg-red-100 text-red-600";
      icon = "❌";
      break;
    case "info":
      bgColor = "bg-blue-100 text-blue-600";
      icon = "ℹ️";
      break;
    case "warning":
      bgColor = "bg-yellow-100 text-yellow-600";
      icon = "⚠️";
      break;
    default:
      bgColor = "bg-gray-100 text-gray-600";
      icon = "🔔";
  }
  return (
    <div className={`flex items-start p-4 mb-4 rounded-lg ${bgColor}`}>
      <span className="text-2xl mr-3">{icon}</span>
      <div>
        <p className="text-sm">{message}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

export default NotificationCard;
