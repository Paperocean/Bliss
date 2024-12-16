import './Table.css';

const Table = ({ columns, data }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column, colIndex) => (
            <th key={colIndex}>{column.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => (
              <td key={colIndex}>
                {typeof column.accessor === 'function'
                  ? column.accessor(row)
                  : column.render
                  ? column.render(row)
                  : row[column.accessor]}{' '}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
