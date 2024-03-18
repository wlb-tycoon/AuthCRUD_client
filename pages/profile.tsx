import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { NextRouter, useRouter } from "next/router";
import axios from "axios";
import { Table, Button, Card, Typography, Flex } from "antd";
import mocks from "../mocks.json";
const { Text } = Typography;

export default function ProfilePage() {
  const router: NextRouter = useRouter();
  const [users, setUsers] = useState<any>([]); // origin value: null
  const [user, setUser] = useState<any>({ name: "", email: "" });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          // Redirect to the login page if token is not found
          router.push("/login");
        } else {
          const res = axios.get(
            process.env.NEXT_PUBLIC_BACKEND_API + "/api/checkAuth",
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const data = (await res).data;
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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = axios.get(
          process.env.NEXT_PUBLIC_BACKEND_API + "/api/users"
        );
        const _data = (await res).data;
        setUsers(_data.users);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = axios.post(
        process.env.NEXT_PUBLIC_BACKEND_API + "/api/logout"
      );
      if ((await response).status === 200) {
        localStorage.removeItem("token");
        router.push("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
  ];

  const data = users.map((user, index) => ({
    key: index,
    name: user.name,
    email: user.email,
  }));

  return (
    <Card style={{ height: "100vh" }}>
      <Card
        type="inner"
        // style={{
        //   display: "flex",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        // }}
      >
        <Button
          onClick={() => router.push("/chatBot")}
          style={{ margin: "20px" }}
        >
          To ChatBot Page
        </Button>
        <Button onClick={handleLogout} style={{ margin: "20px" }}>
          Log out
        </Button>

        <Table
          style={{ margin: "20px", border: "2px solid grey", width: "100vh" }}
          columns={columns}
          dataSource={data}
        />
      </Card>
    </Card>
  );
}
