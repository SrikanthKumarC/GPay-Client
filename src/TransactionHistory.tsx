import axios from "./config/axios";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table, Button } from "@radix-ui/themes";

interface ITransaction {
  id: string;
  senderPhoneNumber: string;
  receiverPhoneNumber: string;
  amount: number;
  createdAt: string;
}

const TransactionHistory = () => {
  const { phoneNumber } = useParams();
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/transactions/${phoneNumber}`)
      .then((res) => {
        setTransactions(res.data.transactions);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [phoneNumber]);
  return (
    <div>
      <h3>Transaction History</h3>
      <Button onClick={() => navigate(`/transfer/${phoneNumber}`)}>Go back</Button>
      <ul>
        {transactions.length === 0 && (
          <p style={{ display: "flex", justifyContent: "center" }}>
            No transactions yet!
          </p>
        )}
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>From</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>To</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Amount</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {transactions.map((transaction: ITransaction) => {
              return (
                <Table.Row key={transaction.id}>
                  <Table.Cell>
                    {transaction.senderPhoneNumber === phoneNumber
                      ? <span style={{color: "red"}}>Money Out</span>
                      : <span style={{color: "green"}}>Money In</span>}
                  </Table.Cell>
                  <Table.Cell>{transaction.senderPhoneNumber}</Table.Cell>
                  <Table.Cell>{transaction.receiverPhoneNumber}</Table.Cell>
                  <Table.Cell>{transaction.amount}</Table.Cell>
                  <Table.Cell>
                    {new Date(transaction.createdAt).toDateString()}
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </ul>
    </div>
  );
};

export default TransactionHistory;
