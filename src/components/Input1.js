import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Input1.css";

const Input1 = () => {
  const [rowCount, setRowCount] = useState(localStorage.getItem("rowCount") || "");
  const [columnCount, setColumnCount] = useState(localStorage.getItem("columnCount") || "");
  const [errorCount, setErrorCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Validate and update row input
  const handleRowChange = (event) => {
    const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setRowCount(value);
  };

  // Validate and update column input
  const handleColumnChange = (event) => {
    const value = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
    setColumnCount(value);
  };

  // Save rowCount and columnCount to localStorage
  useEffect(() => {
    localStorage.setItem("rowCount", rowCount);
    localStorage.setItem("columnCount", columnCount);
  }, [rowCount, columnCount]);

  // Check input and navigate to Input2
  const handleContinue = () => {
    if (!rowCount || !columnCount) {
      // If either input is empty
      if (errorCount < 3) {
        setErrorMessage("Будь ласка, введіть кількість рядків та стовпчиків");
        setShowError(true);
        setErrorCount((prev) => prev + 1);
        setTimeout(() => setShowError(false), 3000);
      }
    } else if (rowCount === "0" || columnCount === "0") {
      // If either input is zero
      if (errorCount < 3) {
        setErrorMessage("Введена кількість значень не може дорівнювати 0");
        setShowError(true);
        setErrorCount((prev) => prev + 1);
        setTimeout(() => setShowError(false), 3000);
      }
    } else {
      // Navigate to Input2 with rowCount and columnCount as state
      navigate("/input2", {
        state: {
          rowCount: parseInt(rowCount, 10),
          columnCount: parseInt(columnCount, 10),
        },
      });
    }
  };

  return (
    <div className="frame">
      <div className="header"></div>

      {showError && <div className="error-popup">{errorMessage}</div>}

      <div className="input-group">
        <label>Введіть кількість рядків</label>
        <input
          type="number"
          value={rowCount}
          onChange={handleRowChange}
          min="1"
          className="input-field"
        />
      </div>
      <div className="input-group">
        <label>Введіть кількість стовпчиків</label>
        <input
          type="number"
          value={columnCount}
          onChange={handleColumnChange}
          min="1"
          className="input-field"
        />
      </div>

      <div className="button-container_2">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <FaChevronLeft />
          <span>Повернутись</span>
        </button>
        <button className="btn-next" onClick={handleContinue}>
          <span>Продовжити</span>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Input1;
