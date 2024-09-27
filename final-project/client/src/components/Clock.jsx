import { useState, useEffect } from "react";

const Clock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setDate(new Date()), 60000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

  return (
    <div>
      <p className="text-slate-900 text-3xl dark:text-white">Time</p>
      <h2 className="clock text-2xl tetxt-slate-900 dark:text-white">
        {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </h2>
    </div>
  );
};

export default Clock;
