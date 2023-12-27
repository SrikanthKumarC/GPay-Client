import "./App.css";
import { Flex, Button, Text, TextField } from "@radix-ui/themes";
import { IconLock } from "@tabler/icons-react";
import { useState } from "react";
import axios from "./config/axios";
import { toast } from 'sonner'
import { useNavigate } from "react-router-dom";
import { Toaster } from "sonner";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const navigate = useNavigate();

  const handlePhone = (phone: string) => {
    // max length of phone number is 10
    if (phone.length > 10) return;
    // remove all non-digits
    const modifiedPhone: string = phone.replace(/\D/g, "");
    setPhoneNumber(modifiedPhone);
  };

  const handleDeposit = (amount: string) => {
    amount = amount.replace(/\D/g, "");
    const amountInt = parseInt(amount);
    if (amountInt < 0) return;
    if (amountInt > 100000) return;
    setDepositAmount(amountInt);
  };

  const handleSubmit = () => {
    axios
      .get(`/is-new-user/${phoneNumber}`)
      .then((res) => {
        setIsNewUser(res.data.isNewUser);
        toast(`${res.data.isNewUser ? "Welcome! Deposit cash to continue!" : "Welcome back!"}`, {
          style: {
            background: "black",
            color: "white",
          }
        })
        if (!res.data.isNewUser) {
          navigate(`/transfer/${phoneNumber}`);
        }
      });
  };

  const handleSignUp = () => {
    if (depositAmount <= 0) {
      toast("Amount cannot be zero or negative", {
        style: {
          background: "black",
          color: "white",
        }
      })
      return;
    }
    axios
      .post(`/create-user/`, {
        phoneNumber,
        availableCash: depositAmount,
      })
      .then((res) => {
        console.log(res.data);
        toast(`Welcome!`, {
          style: {
            background: "black",
            color: "white",
          }
        })
        navigate(`/transfer/${phoneNumber}`);
      });
  };

  return (
    <>
      <Toaster />
      <div className="mb-2 text-red-400">
        <div className="mt-2 text-blue-600">
          <form>
            <Text className="mt-2 text-blue-600" size={"8"}>
              GPay Clone
            </Text>
            <Flex
              mt={"8"}
              direction="column"
              gap="2"
              align={"start"}
              justify={"start"}
            >
              <label>
                <Text as="div" style={{ textAlign: "left" }} size="4" mb="1">
                  Phone Number
                </Text>
                <TextField.Root>
                  <TextField.Slot>
                    <IconLock size={"18"} />
                  </TextField.Slot>
                  <TextField.Input
                    value={phoneNumber}
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
              {isNewUser && (
                <label>
                  <Text as="div" style={{ textAlign: "left" }} size="4" mb="1">
                    Deposit Cash (you are a new user)
                  </Text>
                  <TextField.Root>
                    <TextField.Slot>
                      <IconLock size={"18"} />
                    </TextField.Slot>
                    <TextField.Input
                      value={depositAmount}
                      onChange={(e) => handleDeposit(e.target.value)}
                      type="number"
                      placeholder="2000"
                      title="deposit amount"
                      maxLength={10}
                      required
                      size={"3"}
                    />
                  </TextField.Root>
                </label>
              )}
              <Button type="button" mt={"4"} size={"3"} onClick={isNewUser ? handleSignUp : handleSubmit}>
                {!isNewUser ? "Login or Sign Up" : "Sign Up"}
              </Button>
            </Flex>
          </form>
        </div>
      </div>
    </>
  );
}

export default App;
