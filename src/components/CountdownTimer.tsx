import { useState, useEffect, useCallback } from "react";

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: Date;
}

export const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const calculateTimeLeft = useCallback((): TimeLeft => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // Calculate time components
    const seconds = Math.floor((difference / 1000) % 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const hours = Math.floor((difference / 1000 / 60 / 60) % 24);

    // Calculate remaining days
    const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));

    // Calculate months and remaining days
    const months = Math.floor(totalDays / 30);
    const days = totalDays % 30;

    return { months, days, hours, minutes, seconds };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const timeUnits = [
    { label: "Months", value: timeLeft.months },
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="countdown-timer bg-amber-100 py-3">
      <div className="flex gap-4 justify-center items-center flex-wrap">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="flex items-center gap-30">
            <div className="flex flex-col items-center">
              <div className="text-7xl font-bold tabular-nums">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-600 mt-1">{unit.label}</div>
            </div>
            {index < timeUnits.length - 1 && (
              <span className="text-2xl font-bold mx-2"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
