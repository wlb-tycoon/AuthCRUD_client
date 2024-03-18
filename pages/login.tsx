import { useState, useEffect } from "react";
import { NextRouter, useRouter } from "next/router";
import { Button, Input, Typography, Card, Form } from "antd";
import axios, { AxiosResponse } from "axios";

const { Text } = Typography;

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [serverState, setServerState] = useState<string | null>(null);
  const router: NextRouter = useRouter();

  useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      try {
        const token: string = localStorage.getItem("tokens");

        if (!token) {
          // Redirect to the login page if token is not found
          router.push("/login");
        } else {
          const response: AxiosResponse<any, any> = await axios.get(
            process.env.NEXT_PUBLIC_BACKEND_API + "/api/checkAuth",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status !== 200) {
            // Redirect to the login page if the token is invalid
            router.push("/login");
          } else {
            router.push("/profile");
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    checkAuthentication();
  }, []);

  const handleSubmit = async (): Promise<void> => {
    try {
      const res: AxiosResponse<any, any> = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { token }: any = res.data;

      localStorage.setItem("token", token);

      if (res.status === 200) {
        setServerState("Redirecting . . . .");
        router.push("/profile");
      } else {
        setServerState(res.data.message);
      }
    } catch (error) {
      console.error("error", error);
      setServerState("Server error");
    }
  };

  return (
    <Card
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
      bordered={false}
    >
      <Card title="Login" style={{ border: "2px solid gray", width: "40vw" }}>
        <Form onFinish={handleSubmit} className="was-validated">
          {serverState && <Text role="alert">{serverState}</Text>}
          <Form.Item className="mb-3">
            <Input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Text className="invalid-feedback">{}</Text>
          </Form.Item>
          <Form.Item className="mb-3">
            <Input.Password
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Text className="invalid-feedback">{}</Text>
          </Form.Item>
          <Card bordered={false} style={{ width: "100%" }}>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              style={{ width: "30%" }}
              className="m-2"
            >
              Log in
            </Button>
            <Button
              href="/signup"
              type="default"
              htmlType="button"
              style={{ width: "30%", backgroundColor: "orange" }}
              className="m-2"
            >
              Sign Up
            </Button>
          </Card>
        </Form>
      </Card>
    </Card>
  );
};

export default Login;
