import { useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import { Typography, Card, Button } from "antd";
const { Text, Title, Paragraph } = Typography;
import axios, { AxiosResponse } from "axios";

export default function DashboardPage(): JSX.Element {
  const router: NextRouter = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      try {
        const token: string = localStorage.getItem("token");
        if (!token) {
          // Redirect to the login page if token is not found
          console.error("token not exist");
          router.push("/login");
        } else {
          const res: Promise<AxiosResponse<any, any>> = axios.get(
            process.env.NEXT_PUBLIC_BACKEND_API + "/api/checkAuth",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data: any = (await res).data;

          if ((await res).status !== 200) {
            // Redirect to the login page if the token is invalid
            router.push("/login");
          } else {
            // Set the user data
            setUser(data.user);
          }
        }
      } catch (error: any) {
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

  return (
    <Card style={{ height: "100vh" }}>
      <Title>
        <Text>
          <Card style={{ border: "0" }}>
            <Button href="/profile" style={{ margin: "10px" }}>
              View Profile
            </Button>
            <Button
              onClick={handleLogout}
              style={{ margin: "10px", color: "red" }}
            >
              Log Out
            </Button>
          </Card>
        </Text>
      </Title>
      <Card
        type="inner"
        className="card text-center bg-transparent p-5 shadow-lg"
      >
        <Text className="card-header">Featured</Text>
        <Card type="inner" className="card-body">
          <Title className="card-title">Special title treatment</Title>
          <Paragraph className="card-text">
            With supporting text below as a natural lead-in to additional
            content.
          </Paragraph>
          <Button data-bs-toggle="modal" data-bs-target="#staticBackdrop">
            Do Something
          </Button>
        </Card>
        <div className="card-footer text-muted">2 days ago</div>
      </Card>
    </Card>
  );
}
