import './List.css';

const List = ({ columns, data }) => {
  return (
    <div className="custom-list">
      {data.map((item, itemIndex) => (
        <div key={itemIndex} className="list-item">
          {columns.map((column, colIndex) => (
            <div key={colIndex} className="list-row">
              <span className="list-label">{column.header}:</span>
              <span className="list-value">
                {typeof column.accessor === 'function'
                  ? column.accessor(item)
                  : column.render
                  ? column.render(item)
                  : item[column.accessor]}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default List;
