import React from 'react';
import './Element.css';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

function App() {
  return (
    <div className="frame">
      <div className="header"></div>
      <div className="container">
        <TableContainer />
        <MathButtons />
        <ButtonContainer />
      </div>
    </div>
  );
}

function TableContainer() {
  return (
    <div className="table-container">
      <Table />
      <div className="placeholder-box"></div>
      <Table />
    </div>
  );
}

function Table() {
  return (
    <table className="big-table">
      <thead>
        <tr>
          <th></th>
          <th>x₁</th>
          <th>x₂</th>
          <th>U₁</th>
          <th>U₂</th>
          <th>U₃</th>
          <th>Bi</th>
        </tr>
      </thead>
      <tbody>
        {['U₁', 'U₂', 'U₃', 'Оцінки'].map((label, index) => (
          <tr key={index}>
            <td>{label}</td>
            {[...Array(6)].map((_, idx) => (
              <td key={idx}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MathButtons() {
  return (
    <div className="math-btn-container">
      <button className="math-btn">:</button>
      <button className="math-btn">
        <div className="icon-container">
          <span className="icon">*</span>
        </div>
        <input type="text" className="input-field" placeholder="" />
      </button>
      <button className="math-btn">
        <span className="icon_2">+</span>
      </button>
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="button-container">
      <button className="btn-back">
        <FaAngleLeft />Повернутись
      </button>
      <button className="btn-next">
        Продовжити<FaAngleRight />
      </button>
    </div>
  );
}

export default Element;

