import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Spin, Card, Typography } from "antd";

export default function Home(): JSX.Element {
  const router: NextRouter = useRouter();
  const [counter, setCounter] = useState<number>(2);

  useEffect(() => {
    const redirectTimeout: NodeJS.Timeout = setTimeout(() => {
      // Redirect when counter reaches 0
      if (counter === 0) {
        router.push("/login");
      } else {
        setCounter(counter - 1);
      }
    }, 1000);

    return () => clearTimeout(redirectTimeout);
  }, [counter, router]);

  return (
    <Card
      title="Welcome to Home Page"
      bordered={false}
      style={{
        fontSize: "30px",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography.Paragraph style={{ fontSize: "2em", padding: "30px" }}>
        Redirecting to Login Page in {counter}...
      </Typography.Paragraph>
      <Card
        style={{ display: "flex", justifyContent: "center" }}
        bordered={false}
      >
        <Spin size="large"></Spin>
      </Card>
    </Card>
  );
}
