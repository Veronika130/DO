// Element.js
import React from "react";
import { useLocation } from "react-router-dom";
import "./Element.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Element = () => {
  const location = useLocation();
  const { extremumRow = [], rows = [] } = location.state || {}; // Додано дефолтні значення

  return (
    <div className="frame">
      <div className="header"></div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th></th>
              {extremumRow.map((col, index) => (
                <th key={index}>X{index + 1}</th>
              ))}
              <th>Ві</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>
                  {rowIndex === rows.length - 1 ? "Оцінки" : `U${rowIndex + 1}`}
                </td>
                {row.data.map((cell, colIndex) => (
                  <td key={colIndex}>{cell}</td>
                ))}
                <td>{row.data[row.data.length - 1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="input-group">
        <label>Обрати рядок для опорного елементу</label>
        <select>
          <option value="U1">U₁</option>
          <option value="U2">U₂</option>
          <option value="U3">U₃</option>
        </select>
      </div>
      <div className="input-group">
        <label>Обрати стовпчик для опорного елементу</label>
        <select>
          <option value="x1">x₁</option>
          <option value="x2">x₂</option>
          <option value="U1">U₁</option>
          <option value="U2">U₂</option>
          <option value="U3">U₃</option>
        </select>
      </div>

      <div className="button-container_2">
        <button className="btn-back">
          <FaChevronLeft />
          <span>Повернутись</span>
        </button>
        <button className="btn-next">
          <span>Продовжити</span>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Element;
