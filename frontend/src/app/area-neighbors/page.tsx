"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  Form,
  Select,
  Space,
  Card,
  Typography,
  Table,
  Tooltip,
  message,
  Tabs,
  Divider,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import {
  Area,
  areaApi,
  AreaNeighbor,
  AreaNeighborHistoryEntry,
  areaNeighborApi,
  plantApi,
} from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import { PlusOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useSearchParams } from "next/navigation";
import { ApiErrorHandler } from "@/utils/apiErrorHandler";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

export default function AreaNeighborsPage() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const { user, isAuthenticated } = useAuth(); // Simulating current user ID
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const areaId = searchParams.get("areaId");

  // Fetch all areas
  const { data: areas, isLoading: areasLoading } = useQuery("areas", () =>
    areaApi.getAll().then((res) => res.data)
  );

  // Fetch area neighbors
  const { data: areaNeighbors, isLoading: neighborsLoading } = useQuery(
    ["areaNeighbors", selectedArea?.id],
    () =>
      selectedArea
        ? areaNeighborApi.getByAreaId(selectedArea.id).then((res) => res.data)
        : Promise.resolve([]),
    {
      enabled: !!selectedArea,
    }
  );

  // Fetch area neighbor history
  const { data: neighborHistory, isLoading: historyLoading } = useQuery(
    ["neighborHistory", selectedArea?.id],
    () =>
      selectedArea
        ? areaNeighborApi.getHistory(selectedArea.id).then((res) => res.data)
        : Promise.resolve([]),
    {
      enabled: !!selectedArea,
    }
  );

  // Set initial area if areaId is provided in URL
  useEffect(() => {
    if (areaId && areas) {
      const area = areas.find((a) => a.id === areaId);
      if (area) {
        setSelectedArea(area);
      }
    }
  }, [areaId, areas]);

  // Verificar se há um ID de área na URL e selecionar a área correspondente
  useEffect(() => {
    if (areaId && areas) {
      const area = areas.find((a) => a.id === areaId);
      if (area) {
        setSelectedArea(area);
      }
    }
  }, [areaId, areas]);

  // Create area neighbor relationship
  const createMutation = useMutation(
    (data: Omit<AreaNeighbor, "id" | "createdAt" | "updatedAt">) =>
      areaNeighborApi.create(data),
    {
      onSuccess: () => {
        // Invalidate both neighbors and history queries
        queryClient.invalidateQueries(["areaNeighbors", selectedArea?.id]);
        queryClient.invalidateQueries(["neighborHistory", selectedArea?.id]);
        message.success("Neighbor added successfully");
        setIsModalVisible(false);
        form.resetFields();
      },
      onError: (error: any) => {
        message.error(ApiErrorHandler.getErrorConfig(error));
      },
    }
  );

  // Função para verificar autenticação antes de adicionar vizinho
  const handleAddNeighbor = () => {
    if (!isAuthenticated) {
      setIsLoginModalVisible(true);
    } else {
      setIsModalVisible(true);
    }
  };

  // Função chamada após login bem-sucedido
  const handleLoginSuccess = () => {
    setIsLoginModalVisible(false);

    // Verificar se há uma operação de exclusão pendente
    const pendingDeleteId = sessionStorage.getItem("pendingDeleteNeighborId");
    if (pendingDeleteId) {
      sessionStorage.removeItem("pendingDeleteNeighborId");
      Modal.confirm({
        title: "Are you sure you want to remove this neighbor relationship?",
        onOk: () => deleteMutation.mutate(pendingDeleteId),
      });
    } else {
      // Se não houver exclusão pendente, abrir o modal de adição
      setIsModalVisible(true);
    }
  };

  // Delete area neighbor relationship
  const deleteMutation = useMutation(
    (id: string) => areaNeighborApi.delete(id),
    {
      onSuccess: () => {
        // Invalidate both neighbors and history queries
        queryClient.invalidateQueries(["areaNeighbors", selectedArea?.id]);
        queryClient.invalidateQueries(["neighborHistory", selectedArea?.id]);
        message.success("Area neighbor relationship deleted successfully");
      },
      onError: (error: any) => {
        message.error(ApiErrorHandler.getErrorConfig(error));
      },
    }
  );

  // Função para verificar autenticação antes de deletar vizinho
  const handleDeleteNeighbor = (id: string) => {
    if (!isAuthenticated) {
      setIsLoginModalVisible(true);
      // Armazenar o ID do vizinho a ser excluído após o login
      sessionStorage.setItem("pendingDeleteNeighborId", id);
    } else {
      Modal.confirm({
        title: "Are you sure you want to remove this neighbor relationship?",
        onOk: () => deleteMutation.mutate(id),
      });
    }
  };

  // Filter out areas that are already neighbors or the selected area itself
  const availableNeighbors = useMemo(() => {
    if (!selectedArea || !areas) return [];

    // Get all existing neighbor IDs for this area
    const existingNeighborIds =
      areaNeighbors
        ?.filter(
          (neighbor) =>
            neighbor.areaId === selectedArea.id ||
            neighbor.neighborAreaId === selectedArea.id
        )
        .map((neighbor) =>
          neighbor.areaId === selectedArea.id
            ? neighbor.neighborAreaId
            : neighbor.areaId
        ) || [];

    // Filter out the selected area itself, existing neighbors, and areas from different plants
    return areas.filter(
      (area) =>
        area.id !== selectedArea.id &&
        !existingNeighborIds.includes(area.id) &&
        area.plantId === selectedArea.plantId
    );
  }, [selectedArea, areas, areaNeighbors]);

  // Format neighbor data for display
  const getNeighborData = () => {
    if (!selectedArea || !areaNeighbors || !areas) return [];

    return areaNeighbors.map((neighbor) => {
      // Determine which area is the neighbor (the one that's not the selected area)
      const neighborAreaId =
        neighbor.areaId === selectedArea.id
          ? neighbor.neighborAreaId
          : neighbor.areaId;

      // Find the neighbor area object
      const neighborArea = areas.find((area) => area.id === neighborAreaId);

      // Format dates
      const createdAt = neighbor.createdAt
        ? new Date(neighbor.createdAt).toLocaleString()
        : "Unknown";
      const updatedAt = neighbor.updatedAt
        ? new Date(neighbor.updatedAt).toLocaleString()
        : "Unknown";

      return {
        id: neighbor.id,
        neighborId: neighborAreaId,
        neighborName: neighborArea?.name || "Unknown",
        plantName: neighborArea?.plant?.name || "Unknown",
        createdByUser: neighbor.createdByUser?.name || "Unknown",
        updatedByUser: neighbor.updatedByUser?.name || "Unknown",
        createdAt: createdAt,
        updatedAt: updatedAt,
      };
    });
  };

  // Format history data from the API
  const getHistoryData = () => {
    if (!selectedArea || !neighborHistory) return [];

    return neighborHistory.map((entry) => {
      // Format the event type for display
      let action = "";
      switch (entry.eventType) {
        case "created":
          action = "Created";
          break;
        case "updated":
          action = "Updated";
          break;
        case "deleted":
          action = "Deleted";
          break;
        default:
          action = entry.eventType;
      }

      // Format the timestamp
      const timestamp = entry.eventDate
        ? new Date(entry.eventDate).toLocaleString()
        : "Unknown";

      // Create details message based on event type
      let details = "";
      switch (entry.eventType) {
        case "created":
          details = `Added ${
            entry.neighborArea?.name || "Unknown"
          } as a neighbor`;
          break;
        case "updated":
          details = `Updated neighbor relationship with ${
            entry.neighborArea?.name || "Unknown"
          }`;
          break;
        case "deleted":
          details = `Removed ${
            entry.neighborArea?.name || "Unknown"
          } as a neighbor`;
          break;
        default:
          details = `${action} neighbor relationship with ${
            entry.neighborArea?.name || "Unknown"
          }`;
      }

      return {
        id: `${entry.eventType}-${entry.id}`,
        action,
        neighborName: entry.neighborArea?.name || "Unknown",
        plantName: entry.neighborArea?.plant?.name || "Unknown",
        performedBy: entry.eventUser?.name || "Unknown",
        timestamp,
        details,
      };
    });
  };

  // Columns for the neighbors table
  const neighborColumns: TableProps<any>["columns"] = [
    {
      title: "Neighbor Area",
      dataIndex: "neighborName",
      key: "neighborName",
      sorter: (a, b) => a.neighborName.localeCompare(b.neighborName),
    },
    {
      title: "Plant",
      dataIndex: "plantName",
      key: "plantName",
      sorter: (a, b) => a.plantName.localeCompare(b.plantName),
    },
    {
      title: "Created By",
      dataIndex: "createdByUser",
      key: "createdByUser",
      sorter: (a, b) => a.createdByUser.localeCompare(b.createdByUser),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: "Updated By",
      dataIndex: "updatedByUser",
      key: "updatedByUser",
      sorter: (a, b) => a.updatedByUser.localeCompare(b.updatedByUser),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => a.updatedAt.localeCompare(b.updatedAt),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDeleteNeighbor(record.id)}
        />
      ),
    },
  ];

  // Columns for the history table
  const historyColumns: TableProps<any>["columns"] = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 100,
    },
    {
      title: "Neighbor Area",
      dataIndex: "neighborName",
      key: "neighborName",
      sorter: (a, b) => a.neighborName.localeCompare(b.neighborName),
    },
    {
      title: "Performed By",
      dataIndex: "performedBy",
      key: "performedBy",
      sorter: (a, b) => a.performedBy.localeCompare(b.performedBy),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Date",
      dataIndex: "timestamp",
      key: "timestamp",
      sorter: (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    },
  ];

  const areasByPlant = useMemo(() => {
    if (!areas) return [];

    const areasByPlant: { [plantId: string]: { plant: any; areas: Area[] } } =
      {};

    areas.forEach((area) => {
      if (!areasByPlant[area.plantId]) {
        areasByPlant[area.plantId] = { plant: area.plant, areas: [] };
      }
      areasByPlant[area.plantId].areas.push(area);
    });

    return Object.values(areasByPlant);
  }, [areas]);

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      <Title level={2}>Area Neighbors Management</Title>

      <Card style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text strong>Select an area to manage its neighbors:</Text>
          <Form>
            <Form.Item
              name="areaId"
              label="Select Area"
              rules={[{ required: true, message: "Please select an area!" }]}
            >
              <Select
                placeholder="Select an area"
                onChange={(value) => {
                  const area = areas?.find((a) => a.id === value);
                  setSelectedArea(area || null);
                }}
                style={{ width: "100%" }}
                value={selectedArea?.id}
              >
                {areasByPlant.map((group) => (
                  <Select.OptGroup
                    key={group.plant.id}
                    label={`Plant: ${group.plant.name}`}
                  >
                    {group.areas.map((area) => (
                      <Select.Option key={area.id} value={area.id}>
                        {area.name}
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Space>
      </Card>

      {/* Modal de Login */}
      <LoginModal
        visible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onSuccess={handleLoginSuccess}
      />

      {selectedArea && (
        <>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Title level={4}>Neighbors for: {selectedArea.name}</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                handleAddNeighbor();
              }}
              disabled={availableNeighbors.length === 0}
            >
              Add Neighbor
            </Button>
          </div>

          <Table
            columns={neighborColumns}
            dataSource={getNeighborData()}
            loading={neighborsLoading}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            locale={{ emptyText: "No neighbor areas found" }}
          />
          <Divider />
          <Title level={4}>History</Title>
          <Table
            columns={historyColumns}
            dataSource={getHistoryData()}
            loading={historyLoading}
            rowKey="id"
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} items`,
            }}
            locale={{ emptyText: "No history found" }}
          />

          <Modal
            title="Add Neighbor"
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
            }}
            footer={null}
          >
            <Form
              form={form}
              onFinish={(values) => {
                if (!selectedArea || !user) return;

                const data = {
                  areaId: selectedArea.id,
                  neighborAreaId: values.neighborAreaId,
                };

                createMutation.mutate(data);
              }}
              layout="vertical"
            >
              <Form.Item
                name="neighborAreaId"
                label="Add Neighbor"
                rules={[
                  { required: true, message: "Please select a neighbor!" },
                ]}
              >
                <Select
                  placeholder="Select a neighbor"
                  style={{ width: "100%" }}
                  disabled={!selectedArea}
                >
                  {availableNeighbors.map((area) => (
                    <Select.Option key={area.id} value={area.id}>
                      {area.name} {area.plant && `(${area.plant.name})`}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<LinkOutlined />}
                  loading={createMutation.isLoading}
                >
                  Add Neighbor
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </>
      )}
    </div>
  );
}
