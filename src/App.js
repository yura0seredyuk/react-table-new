import React, { useMemo, useState } from "react";
import styled from "styled-components";
import { useTable, useSortBy, usePagination } from "react-table";
import { format } from "date-fns";
import payments from "./payments";

const newPayment = [];
payments.map((payment) =>
  newPayment.push({
    id: payment.id,
    date: format(payment.date, "MM/dd/yy"),
    time: format(payment.date, "HH:MM"),
    type: payment.type,
    psychologist: payment.psychologist,
    price: payment.price + " ₴"
  })
);

const Styles = styled.div`
  table {
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    thead > tr {
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.25px;
      color: rgba(28, 33, 53, 0.5);
      text-align: left;

      :first-of-type {
        display: none;
      }
    }

    td {
      font-size: 13px;
      line-height: 16px;
      color: rgba(28, 33, 53, 0.5);
    }

    tr {
      :nth-of-type(2n - 1) {
        background: #f0f1f7;
        border-radius: 3px;
      }
    }

    /* td {
      :last-of-type {

        ::after {
          content: '';
        }
      }
    } */

    th,
    td {
      margin: 0;
      padding: 8px 17px;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setPageSize
  } = useTable(
    {
      columns,
      data
    },
    useSortBy,
    usePagination
  );

  const [defPageSize, setDefPageSize] = useState(10);

  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? "" : "") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.value === "offline" ? (
                        <div>offline +</div>
                      ) : (
                        cell.render("Cell")
                      )}
                      {cell.column.Header === "Details" && <div>details</div>}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onMouseDown={() => setDefPageSize((prevVal) => prevVal + 10)}
          onClick={() => {
            setPageSize(defPageSize);
          }}
        >
          Show more
        </button>
      </div>
    </>
  );
}

function App() {
  const columns = useMemo(
    () => [
      {
        Header: "Header",
        columns: [
          {
            Header: "Date",
            accessor: "date"
          },
          {
            Header: "Time",
            accessor: "time"
          },
          {
            Header: "Type",
            accessor: "type"
          },
          {
            Header: "Psychologist",
            accessor: "psychologist"
          },
          {
            Header: "Price",
            accessor: "price"
          },
          {
            Header: "Details"
          }
        ]
      }
    ],
    []
  );

  return (
    <Styles>
      <Table columns={columns} data={newPayment} />
    </Styles>
  );
}

export default App;
