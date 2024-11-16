import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Input2.css";

const Input2 = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { rowCount, columnCount } = location.state || {
    rowCount: 2,
    columnCount: 2,
  };

  const [upperTableColumns, setUpperTableColumns] = useState([]);
  const [upperRow, setUpperRow] = useState([]);
  const [lowerTableColumns, setLowerTableColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [extremum, setExtremum] = useState("min");
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
  const [selectedTableName, setSelectedTableName] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null); // Зберігаємо обраний індекс рядка
  const [showError, setShowError] = useState(false);
  const [emptyCells, setEmptyCells] = useState([]);

  useEffect(() => {
    const upperCols = Array.from(
      { length: columnCount },
      (_, i) => `X${i + 1}`
    ).concat("Екстремум");
    const lowerCols = Array.from(
      { length: columnCount },
      (_, i) => `X${i + 1}`
    ).concat("Знак", "Значення");
    const initialRows = Array.from({ length: rowCount }, (_, i) => ({
      id: i + 1,
      data: Array(columnCount + 2).fill(""),
    }));
    const initialUpperRow = Array(columnCount).fill("");

    setUpperTableColumns(upperCols);
    setUpperRow(initialUpperRow);
    setLowerTableColumns(lowerCols);
    setRows(initialRows);
  }, [rowCount, columnCount]);

  const handleColumnSelect = (index, tableName) => {
    if (tableName === "upper" && index === upperTableColumns.length - 1) {
      return; // Заборонити вибір "Екстремум"
    }

    if (
      tableName === "lower" &&
      ["Знак", "Значення"].includes(lowerTableColumns[index])
    ) {
      return; // Заборонити вибір "Знак" і "Значення"
    }

    setSelectedColumnIndex(index);
    setSelectedTableName(tableName);
  };

  const handleRowSelect = (rowIndex) => {
    setSelectedRowIndex(rowIndex); // Зберігаємо обраний індекс рядка
  };

  const addColumn = () => {
    const newUpperIndex = upperTableColumns.length;
    const newLowerIndex = lowerTableColumns.length - 2;

    const newUpperCol = `X${newUpperIndex}`;
    const newLowerCol = `X${newLowerIndex + 1}`;

    setUpperTableColumns((prev) => [
      ...prev.slice(0, -1),
      newUpperCol,
      "Екстремум",
    ]);

    setLowerTableColumns((prev) => [
      ...prev.slice(0, -2),
      newLowerCol,
      "Знак",
      "Значення",
    ]);

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        data: [...row.data.slice(0, -2), "", ...row.data.slice(-2)],
      }))
    );
  };

  const removeSelectedColumn = () => {
    if (selectedColumnIndex !== null && selectedTableName !== null) {
      if (selectedTableName === "upper" && upperTableColumns.length > 1) {
        const updatedUpperColumns = upperTableColumns.filter(
          (_, idx) => idx !== selectedColumnIndex
        );
        const updatedUpperRow = upperRow.filter(
          (_, idx) => idx !== selectedColumnIndex
        );

        setUpperTableColumns(updatedUpperColumns);
        setUpperRow(updatedUpperRow);
      } else if (selectedTableName === "lower" && lowerTableColumns.length > 3) {
        const updatedLowerColumns = lowerTableColumns.filter(
          (_, idx) => idx !== selectedColumnIndex
        );
        const updatedRows = rows.map((row) => ({
          ...row,
          data: row.data.filter((_, idx) => idx !== selectedColumnIndex),
        }));

        setLowerTableColumns(updatedLowerColumns);
        setRows(updatedRows);
      }

      setSelectedColumnIndex(null);
      setSelectedTableName(null);
    }
  };

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        id: prevRows.length + 1,
        data: Array(lowerTableColumns.length).fill(""),
      },
    ]);
  };

  const removeRow = () => {
    if (selectedRowIndex !== null && rows.length > 1) {
      const updatedRows = rows
        .filter((_, idx) => idx !== selectedRowIndex)
        .map((row, idx) => ({ ...row, id: idx + 1 })); // Оновлюємо індекси рядків
      setRows(updatedRows);
      setSelectedRowIndex(null); // Скидаємо вибір рядка після видалення
    }
  };

  const handleUpperInputChange = (e, index) => {
    const value = e.target.value;
    const regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      const newUpperRow = [...upperRow];
      newUpperRow[index] = value;
      setUpperRow(newUpperRow);
      setEmptyCells((prev) =>
        prev.filter((cell) => cell.row !== 0 || cell.col !== index)
      );
    }
  };

  const handleLowerInputChange = (e, rowIndex, colIndex) => {
    const value = e.target.value;
    const regex = /^-?\d*\.?\d*$/;
    if (regex.test(value)) {
      const newRows = [...rows];
      newRows[rowIndex].data[colIndex] = value;
      setRows(newRows);
      setEmptyCells((prev) =>
        prev.filter((cell) => cell.row !== rowIndex || cell.col !== colIndex)
      );
    }
  };

  const handleContinue = () => {
    const emptyCellsFound = [];

    upperRow.forEach((cell, index) => {
      if (cell === "") {
        emptyCellsFound.push({ row: 0, col: index });
      }
    });

    rows.forEach((row, rowIndex) => {
      row.data.forEach((cell, colIndex) => {
        if (
          cell === "" &&
          lowerTableColumns[colIndex] !== "Знак"
        ) {
          emptyCellsFound.push({ row: rowIndex + 1, col: colIndex });
        }
      });
    });

    if (emptyCellsFound.length > 0) {
      setEmptyCells(emptyCellsFound);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } else {
      navigate("/element", {
        state: { upperTableColumns, upperRow, lowerTableColumns, rows },
      });
    }
  };

  const handleSaveStateToLocalStorage = () => {
    localStorage.setItem("upperTableColumns", JSON.stringify(upperTableColumns));
    localStorage.setItem("upperRow", JSON.stringify(upperRow));
    localStorage.setItem("lowerTableColumns", JSON.stringify(lowerTableColumns));
    localStorage.setItem("rows", JSON.stringify(rows));
    localStorage.setItem("extremum", extremum);
  };

  return (
    <div className="frame">
      <div className="header"></div>

      {showError && (
        <div className="error-popup">
          Будь ласка, заповніть всі комірки перед продовженням
        </div>
      )}

      <div className="table-container">
        {/* Upper Table */}
        <table>
          <thead>
            <tr>
              {upperTableColumns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => handleColumnSelect(index, "upper")}
                  className={
                    index === selectedColumnIndex &&
                    selectedTableName === "upper"
                      ? "selected-column"
                      : ""
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {upperTableColumns.slice(0, -1).map((_, index) => (
                <td
                  key={index}
                  className={
                    selectedColumnIndex === index &&
                    selectedTableName === "upper"
                      ? "selected-cell"
                      : ""
                  }
                >
                  <input
                    type="text"
                    value={upperRow[index] || ""}
                    onChange={(e) => handleUpperInputChange(e, index)}
                    className={
                      emptyCells.some(
                        (cell) => cell.row === 0 && cell.col === index
                      )
                        ? "input-error"
                        : ""
                    }
                  />
                </td>
              ))}
              <td>
                <select
                  value={extremum}
                  onChange={(e) => setExtremum(e.target.value)}
                >
                  <option value="min">min</option>
                  <option value="max">max</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Lower Table */}
        <table>
          <thead>
            <tr>
              <th>№</th>
              {lowerTableColumns.map((col, index) => (
                <th
                  key={index}
                  onClick={() => handleColumnSelect(index, "lower")}
                  className={
                    index === selectedColumnIndex &&
                    selectedTableName === "lower"
                      ? "selected-column"
                      : ""
                  }
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={row.id}
                onClick={() => handleRowSelect(rowIndex)}
                className={
                  selectedRowIndex === rowIndex ? "selected-row" : ""
                }
              >
                <td>{row.id}</td>
                {row.data.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={
                      selectedColumnIndex === colIndex &&
                      selectedTableName === "lower"
                        ? "selected-cell"
                        : ""
                    }
                  >
                    {lowerTableColumns[colIndex] === "Знак" ? (
                      <select
                        value={cell}
                        onChange={(e) => {
                          const newRows = [...rows];
                          newRows[rowIndex].data[colIndex] = e.target.value;
                          setRows(newRows);
                        }}
                      >
                        <option value="≥">≥</option>
                        <option value="≤">≤</option>
                        <option value="=">=</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) =>
                          handleLowerInputChange(e, rowIndex, colIndex)
                        }
                        className={
                          emptyCells.some(
                            (cell) =>
                              cell.row === rowIndex + 1 && cell.col === colIndex
                          )
                            ? "input-error"
                            : ""
                        }
                      />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="button-row">
        <div className="button-container">
          <button className="button btn-green" onClick={addColumn}>
            Додати змінну (стовпчик)
          </button>
          <button className="button btn-red" onClick={removeSelectedColumn}>
            Видалити обраний стовпчик
          </button>
        </div>
        <div className="button-container">
          <button className="button btn-green" onClick={addRow}>
            Додати змінну (рядок)
          </button>
          <button className="button btn-red" onClick={removeRow}>
            Видалити обраний рядок
          </button>
        </div>
      </div>

      <div className="button-container_2">
        <button
          className="btn-back"
          onClick={() => {
            handleSaveStateToLocalStorage();
            navigate(-1);
          }}
        >
          <FaChevronLeft />
          <span>Повернутись</span>
        </button>
        <button
          className="btn-next"
          onClick={() => {
            handleSaveStateToLocalStorage();
            handleContinue();
          }}
        >
          <span>Продовжити</span>
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default Input2;
