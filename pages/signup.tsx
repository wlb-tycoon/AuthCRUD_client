import { useState, FormEvent } from "react";
import { NextRouter, useRouter } from "next/router";
import { Button, Form, Input, Typography, Card } from "antd";
import axios, { AxiosResponse } from "axios";

const { Text } = Typography;

const Signup = (): JSX.Element => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [serverState, setServerState] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const router: NextRouter = useRouter();

  const validateForm = (): boolean => {
    let isValid = true;

    if (!name) {
      setNameError("Please enter your name");
      isValid = false;
    } else {
      setNameError("");
    }

    if (!/^[a-zA-Z\s]*$/.test(name)) {
      setNameError("Name can only contain letters and spaces");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Please enter a password");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!/(?=.*\d)(?=.*[A-Z]).{6,}/.test(password)) {
      setPasswordError(
        "Password must be at least 6 characters long and contain at least one capital letter and one number"
      );
      isValid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      const res: AxiosResponse<any, any> = await axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/signup",
        {
          name,
          email,
          password,
        }
      );

      if (res.status === 201) {
        const { token } = res.data;
        setServerState("Redirecting...");
        localStorage.setItem("token", token);
        router.push("/profile");
      } else {
        console.error(res.data.message);
        setServerState(res.data.message);
      }
    } catch (error) {
      console.error("error:", error);
      setServerState("Server error");
      setEmailError(error.response.data.message);
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
      <Card title="Sign Up" style={{ border: "2px solid gray", width: "40vw" }}>
        <Form onFinish={handleSubmit} className="was-validated">
          {serverState && <Text role="alert">{serverState}</Text>}
          <Form.Item className="mb-3">
            <Input
              type="text"
              className={`${nameError ? "is-invalid" : ""}`}
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {nameError && <Text className="invalid-feedback">{nameError}</Text>}
          </Form.Item>
          <Form.Item className="mb-3">
            <Input
              type="email"
              className={`${emailError ? "is-invalid" : ""}`}
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && (
              <Text className="invalid-feedback">{emailError}</Text>
            )}
          </Form.Item>
          <Form.Item className="mb-3">
            <Input
              type="password"
              className={`${passwordError ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {passwordError && (
              <Text className="invalid-feedback">{passwordError}</Text>
            )}
          </Form.Item>
          <Form.Item className="mb-3">
            <Input
              type="password"
              className={`${confirmPasswordError ? "is-invalid" : ""}`}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPasswordError && (
              <Text className="invalid-feedback">{confirmPasswordError}</Text>
            )}
          </Form.Item>
          <Card bordered={false} style={{ width: "100%" }}>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              style={{ width: "30%" }}
              className="m-2"
            >
              Sign Up
            </Button>
            <Button
              href="/login"
              type="default"
              htmlType="button"
              style={{ width: "30%", backgroundColor: "orange" }}
              className="m-2"
            >
              Log In
            </Button>
          </Card>
        </Form>
      </Card>
    </Card>
  );
};

export default Signup;
