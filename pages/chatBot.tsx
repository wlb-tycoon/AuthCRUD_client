import { NextRouter, useRouter } from "next/router";
import { Button, Card, Input } from "antd";
import { useState, useEffect } from "react";
import axios, { AxiosResponse } from "axios";

const { TextArea } = Input;

export default function chatBotPage(): JSX.Element {
  const router: NextRouter = useRouter();

  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<any>("");
  const [user, setUser] = useState<any>(null);

  // const [histoires, setHistories] = useState(data.histories);

  useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      try {
        const token: string = localStorage.getItem("token");

        if (!token) {
          // Redirect to the login page if token is not found
          router.push("/login");
        } else {
          const res: Promise<AxiosResponse<any, any>> = axios.get(
            process.env.NEXT_PUBLIC_BACKEND_API + "/api/checkAuth",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data: any = (await res).data;
          if ((await res).status !== 200) {
            router.push("/login");
          } else {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    checkAuthentication();
  }, []);

  const handleLogout = async (): Promise<void> => {
    try {
      const response: Response = await fetch(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/logout",
        {
          method: "POST",
        }
      );

      if (response.ok) {
        // Clear token and redirect to the login page
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const chatHandler = async (): Promise<void> => {
    try {
      const res: AxiosResponse<any, any> = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/chat",
        { message }
      );
      setResponse(res.data.response);
      // setResponse(res.data.choices[0])
    } catch (error) {
      console.error("An error occurred while sending the message: ", error);
    }
  };

  return (
    <Card
      style={{
        height: "100vh",
        border: "5px solid red",
        position: "relative",
      }}
    >
      <Card>
        <Button onClick={handleLogout} style={{ margin: "20px" }}>
          Log Out
        </Button>
        <Button style={{ margin: "20px" }} onClick={chatHandler}>
          Send
        </Button>
      </Card>
      <Card>
        <TextArea value={response} />
      </Card>
      <Input
        style={{ width: "93%", margin: "10px" }}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            chatHandler();
          }
        }}
        placeholder="Type your query whatever you want to ask..."
        value={message}
      ></Input>
    </Card>
  );
}
