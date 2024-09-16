import NotificationCard from "../components/NotificationCard";

const NotificationPage = () => {
  const notifications = [
    {
      type: "success",
      message: "Your account has been successfully created!",
      time: "2 minutes ago",
    },
    {
      type: "error",
      message: "Failed to process your payment. Please try again.",
      time: "10 minutes ago",
    },
    {
      type: "info",
      message: "New updates are available for your software.",
      time: "1 hour ago",
    },
    {
      type: "warning",
      message: "Your subscription is about to expire in 3 days.",
      time: "2 days ago",
    },
  ];

  return (
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      {notifications.map((notification, index) => (
        <NotificationCard
          key={index}
          type={notification.type}
          message={notification.message}
          time={notification.time}
        />
      ))}
    </div>
  );
};

export default NotificationPage;
