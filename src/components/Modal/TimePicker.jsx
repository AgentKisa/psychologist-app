import React, { useState, useRef, useEffect } from "react";
import styles from "./TimePicker.module.css";

const TimePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(
    value || { hour: 0, minute: 0 },
  );
  const timePickerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        timePickerRef.current &&
        !timePickerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      dropdownRef.current.scrollTop = calculateScrollTop(selectedTime);
    }
  }, [isOpen, selectedTime]);

  const calculateScrollTop = (time) => {
    const index = generateTimeOptions().findIndex(
      (t) => t.hour === time.hour && t.minute === time.minute,
    );
    if (index !== -1) {
      return index * 30;
    }
    return 0;
  };

  const handleTimeClick = (newTime) => {
    setSelectedTime(newTime);
    onChange(newTime);
    setIsOpen(false);
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        options.push({ hour: h, minute: m });
      }
    }
    return options;
  };

  const formatTime = (time) => {
    const formattedHour = String(time.hour).padStart(2, "0");
    const formattedMinute = String(time.minute).padStart(2, "0");
    return (
      <>
        <span className={styles.timePart}>{formattedHour}</span>
        <span className={styles.timeSeparator}>:</span>
        <span className={styles.timePart}>{formattedMinute}</span>
      </>
    );
  };

  return (
    <div className={styles.timePickerContainer} ref={timePickerRef}>
      <div className={styles.timeInput} onClick={() => setIsOpen(!isOpen)}>
        {formatTime(selectedTime)}
        <svg width="20" height="20" className={styles.icon}>
          <use href="/sprite.svg#icon-clock"></use>
        </svg>
      </div>
      {isOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <div className={styles.dropdownHeader}>Meeting time</div>
          <div className={styles.dropdownContent}>
            {generateTimeOptions().map((time) => (
              <div
                key={`${time.hour}-${time.minute}`}
                onClick={() => handleTimeClick(time)}
                className={`${styles.timeOption} ${
                  selectedTime.hour === time.hour &&
                  selectedTime.minute === time.minute
                    ? styles.focusedTimeOption
                    : ""
                }`}
              >
                {formatTime(time)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
