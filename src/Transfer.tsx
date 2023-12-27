import { Text, TextField, Button } from "@radix-ui/themes";
import { Icon123, IconCash } from "@tabler/icons-react";
import axios from "./config/axios";
import { toast, Toaster } from "sonner";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ResponseType = {
  response: {
    data: {
      message: string;
    };
  };
};

const Transfer = () => {
  const [toPhoneNumber, setToPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [availableCash, setAvailableCash] = useState(0);
  const { fromPhoneNumber } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/user/${fromPhoneNumber}`).then((res) => {
      setAvailableCash(res.data.userDetails.availableCash);
    });
  }, [fromPhoneNumber]);

  const handlePhone = (phone: string) => {
    // max length of phone number is 10
    if (phone.length > 10) return;
    // remove all non-digits
    const modifiedPhone: string = phone.replace(/\D/g, "");
    setToPhoneNumber(modifiedPhone);
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(`/transfer-money`, {
        from: fromPhoneNumber,
        to: toPhoneNumber,
        amount: Number(amount),
      })
      .then((res) => {
        if (res.status === 200) {
          toast("Transfer success!", {
            style: {
              background: "lightgreen",
              color: "black",
            },
          });
          toast(res.data.cashback)
          setAvailableCash(res.data.sender.availableCash);
          setAmount("");
          setToPhoneNumber("");
        }
      })
      .catch((err) => {
        const error = err as ResponseType;
        //    toast (error.response?.data.message);
        toast(`Transfer failed: ${error.response?.data.message}`, {
          style: {
            background: "black",
            color: "white",
          },
        });
      });
  };

  return (
    <div>
      <Toaster />
      <h1>Transfer</h1>
      <p>
        Available money: ${(Math.round(availableCash * 100) / 100).toFixed(2)}
      </p>
      <form onSubmit={handleSubmit}>
        <label>
          <Text as="div" style={{ textAlign: "left" }} size="4" mb="1">
            To Phone Number
          </Text>
          <TextField.Root>
            <TextField.Slot>
              <Icon123 size={"18"} />
            </TextField.Slot>
            <TextField.Input
              value={toPhoneNumber}
              onChange={(e) => handlePhone(e.target.value)}
              type="tel"
              name="telphone"
              placeholder="0123456789"
              pattern="[0-9]{10}"
              title="Ten digits code"
              maxLength={10}
              required
              size={"3"}
            />
          </TextField.Root>
        </label>
        <label>
          <Text as="div" mt={"4"} style={{ textAlign: "left" }} size="4" mb="1">
            Amount
          </Text>
          <TextField.Root>
            <TextField.Slot>
              <IconCash size={"18"} />
            </TextField.Slot>
            <TextField.Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              placeholder="1200"
              pattern="[0-9]{10}"
              title="Ten digits code"
              maxLength={10}
              required
              size={"3"}
            />
          </TextField.Root>
        </label>
        <Button variant="classic" style={{ cursor: "pointer" }} mt={"4"}>
          Transfer Money
        </Button>
      </form>
      <Button
        mt={"4"}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
        variant="outline"
      >
        Logout
      </Button>
      <Button mt={"4"} style={{ cursor: "pointer" }} ml={"4"} onClick={() => navigate(`/transaction-history/${fromPhoneNumber}`)}>View Transaction History</Button>
    </div>
  );
};

export default Transfer;
