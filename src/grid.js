import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';

const columns = [
  { key: "side", name: "Trade side" },
  { key: "price", name: "Trade price" },
  { key: "volume", name: "Trade volume" },
  { key: "time", name: "Trade time" },
];


const RenderGrid = (props) => {
  return (
    <>
      <h2>Bitcoin live trades (BTC/USDT)</h2>
      <DataGrid columns={columns} rows={props.rows} />
    </>
  );
}

export default RenderGrid;
