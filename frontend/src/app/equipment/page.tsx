"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import {
  equipmentApi,
  areaApi,
  equipmentAreaApi,
  areaNeighborApi,
  Equipment,
  Area,
  EquipmentArea,
} from "@/services/api";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  RightOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/components/LoginModal";
import { ApiErrorHandler } from "@/utils/apiErrorHandler";

export default function EquipmentPage() {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(
    null
  );
  const [filters, setFilters] = useState({
    name: "",
    areaId: "",
    manufacturer: "",
  });
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const areaId = searchParams.get("areaId");

  const { data: equipment, isLoading: equipmentLoading } = useQuery(
    "equipment",
    () => equipmentApi.getAll().then((res) => res.data)
  );

  const { data: areas, isLoading: areasLoading } = useQuery("areas", () =>
    areaApi.getAll().then((res) => res.data)
  );

  // Fetch equipment areas for each equipment
  const { data: equipmentAreas, isLoading: equipmentAreasLoading } = useQuery(
    "equipmentAreas",
    () => equipmentAreaApi.getAll().then((res) => res.data)
  );

  // Fetch area neighbors for finding available neighboring areas
  const { data: areaNeighbors, isLoading: areaNeighborsLoading } = useQuery(
    "areaNeighbors",
    () => areaNeighborApi.getAll().then((res) => res.data)
  );

  // Set initial area filter if areaId is provided
  useEffect(() => {
    if (areaId) {
      setFilters((prev) => ({ ...prev, areaId }));
    }
  }, [areaId]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    if (editingEquipment && equipmentAreas) {
      const filteredAreas = equipmentAreas.filter(
        (ea) => ea.equipmentId === editingEquipment.id
      );
      const areaIds = filteredAreas.map((ea) => ea.areaId) || [];
      setSelectedAreas(areaIds);
    }
  }, [editingEquipment, equipmentAreas]);

  const createMutation = useMutation(
    async (data: {
      equipment: Omit<Equipment, "id" | "createdAt" | "updatedAt">;
      areaIds: string[];
    }) => {
      // First create the equipment
      const equipmentResponse = await equipmentApi.create(data.equipment);
      const newEquipment = equipmentResponse.data;

      // Create equipment-area relationships sequentially to respect area neighborhood rules
      // This ensures each new area is properly validated against existing ones
      for (const areaId of data.areaIds) {
        await equipmentAreaApi.create({
          equipmentId: newEquipment.id,
          areaId,
        });
      }

      return newEquipment;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("equipment");
        queryClient.invalidateQueries("equipmentAreas");
        message.success("Equipment created successfully");
        setIsModalVisible(false);
        form.resetFields();
      },
      onError: (error: any) => {
        message.error(ApiErrorHandler.getErrorConfig(error));
      },
    }
  );

  const updateMutation = useMutation(
    async ({
      id,
      data,
      areaIds,
    }: {
      id: string;
      data: Partial<Equipment>;
      areaIds: string[];
    }) => {
      // First update the equipment
      const equipmentResponse = await equipmentApi.update(id, data);

      // Get current equipment-area relationships
      const currentAreas =
        equipmentAreas?.filter((ea) => ea.equipmentId === id) || [];

      // Areas to remove (in current but not in new selection)
      const areasToRemove = currentAreas.filter(
        (ea) => !areaIds.includes(ea.areaId)
      );

      // Areas to add (in new selection but not in current)
      const currentAreaIds = currentAreas.map((ea) => ea.areaId);
      const areasToAdd = areaIds.filter(
        (areaId) => !currentAreaIds.includes(areaId)
      );

      // Add new relationships first
      const addPromises = areasToAdd.map((areaId) =>
        equipmentAreaApi.create({
          equipmentId: id,
          areaId,
        })
      );

      // Wait for all additions to complete before removing
      await Promise.all(addPromises);

      // Then remove relationships
      const removePromises = areasToRemove.map((ea) =>
        equipmentAreaApi.delete(ea.id)
      );

      // Wait for all removals to complete
      await Promise.all(removePromises);

      return equipmentResponse.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("equipment");
        queryClient.invalidateQueries("equipmentAreas");
        message.success("Equipment updated successfully");
        setIsModalVisible(false);
        form.resetFields();
        setEditingEquipment(null);
      },
      onError: (error: any) => {
        message.error(ApiErrorHandler.getErrorConfig(error));
      },
    }
  );

  const deleteMutation = useMutation((id: string) => equipmentApi.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("equipment");
      message.success("Equipment deleted successfully");
    },
    onError: (error: any) => {
      message.error(ApiErrorHandler.getErrorConfig(error));
    },
  });

  // Helper function to get all areas for an equipment
  const getEquipmentAreas = (equipmentId: string) => {
    if (!equipmentAreas) return [];

    const eqAreas = equipmentAreas.filter(
      (ea) => ea.equipmentId === equipmentId
    );
    return eqAreas
      .map((ea) => {
        const area = areas?.find((a) => a.id === ea.areaId);
        return area;
      })
      .filter(Boolean) as Area[];
  };

  const filteredEquipment = equipment?.filter((eq) => {
    const nameMatch = eq.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());

    // Check if equipment has the filtered area
    const eqAreas = getEquipmentAreas(eq.id);
    const areaMatch =
      !filters.areaId || eqAreas.some((area) => area.id === filters.areaId);

    const manufacturerMatch = eq.manufacturer
      .toLowerCase()
      .includes(filters.manufacturer.toLowerCase());
    return nameMatch && areaMatch && manufacturerMatch;
  });

  const columns: TableProps<Equipment>["columns"] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
      sorter: (a, b) => a.manufacturer.localeCompare(b.manufacturer),
    },
    {
      title: "Serial Number",
      dataIndex: "serialNumber",
      key: "serialNumber",
    },
    {
      title: "Initial Operations Date",
      dataIndex: "initialOperationsDate",
      key: "initialOperationsDate",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
      sorter: (a, b) =>
        dayjs(a.initialOperationsDate).unix() -
        dayjs(b.initialOperationsDate).unix(),
    },
    {
      title: "Areas",
      key: "areas",
      render: (_, record) => {
        const equipmentAreas = getEquipmentAreas(record.id);
        return (
          <Space size="small" wrap>
            {equipmentAreas.map((area) => (
              <Tag key={area.id} color="blue">
                <Tooltip title={`Plant: ${area.plant?.name}`}>
                  {area.name}
                </Tooltip>
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingEquipment(record);
              // Get all areas associated with this equipment
              const equipmentAreas = getEquipmentAreas(record.id);
              const areaIds = equipmentAreas.map((area) => area.id);

              form.setFieldsValue({
                ...record,
                initialOperationsDate: dayjs(record.initialOperationsDate),
                areaIds,
              });
              setIsModalVisible(true);
            }}
          />
          <Button
            icon={<RightOutlined />}
            onClick={() => {
              router.push(`/parts?equipmentId=${record.id}`);
            }}
          >
            Parts
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => {
              Modal.confirm({
                title: "Are you sure you want to delete this equipment?",
                onOk: () => deleteMutation.mutate(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

  const handleAction = async (action: "create" | "edit") => {
    if (action === "create") {
      const { areaIds, ...equipmentData } = form.getFieldsValue();
      createMutation.mutate({ equipment: equipmentData, areaIds });
    } else {
      const { areaIds, ...equipmentData } = form.getFieldsValue();
      updateMutation.mutate({
        id: editingEquipment?.id,
        data: equipmentData,
        areaIds,
      });
    }
  };

  return (
    <div style={{ padding: 24, background: "#fff" }}>
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          <Input
            placeholder="Filter by name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            style={{ width: 200 }}
          />
          <Select
            style={{ width: 200 }}
            placeholder="Filter by area"
            allowClear
            value={filters.areaId || undefined}
            onChange={(value) => setFilters({ ...filters, areaId: value })}
          >
            {areas?.map((area) => (
              <Select.Option key={area.id} value={area.id}>
                {area.name}
              </Select.Option>
            ))}
          </Select>
          <Input
            placeholder="Filter by manufacturer"
            value={filters.manufacturer}
            onChange={(e) =>
              setFilters({ ...filters, manufacturer: e.target.value })
            }
            style={{ width: 200 }}
          />
          <Button
            type="primary"
            onClick={() => {
              setEditingEquipment(null);
              setSelectedAreas([]);
              form.resetFields();
              setIsModalVisible(true);
              if (!isAuthenticated) {
                setIsLoginModalVisible(true);
              }
            }}
          >
            Add Equipment
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredEquipment}
        loading={
          equipmentLoading ||
          areasLoading ||
          equipmentAreasLoading ||
          areaNeighborsLoading
        }
        rowKey="id"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
      />

      <Modal
        title={editingEquipment ? "Edit Equipment" : "Add Equipment"}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingEquipment(null);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAction} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: "Please input the equipment name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[
              { required: true, message: "Please input the manufacturer!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="serialNumber"
            label="Serial Number"
            rules={[
              { required: true, message: "Please input the serial number!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="initialOperationsDate"
            label="Initial Operations Date"
            rules={[
              {
                required: true,
                message: "Please select the initial operations date!",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="areaIds"
            label="Areas"
            rules={[
              { required: true, message: "Please select at least one area!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select areas"
              style={{ width: "100%" }}
              optionFilterProp="children"
              onChange={(selectedAreaIds) => {
                // If editing and there are already selected areas, ensure new selections are neighbors
                if (editingEquipment && selectedAreaIds.length > 1) {
                  const lastSelectedId = selectedAreaIds[
                    selectedAreaIds.length - 1
                  ] as string;
                  const previouslySelected = selectedAreaIds.slice(
                    0,
                    -1
                  ) as string[];

                  // Check if the new area is a neighbor of any previously selected area
                  const isNeighbor = previouslySelected.some((areaId) => {
                    return areaNeighbors?.some(
                      (neighbor) =>
                        (neighbor.areaId === areaId &&
                          neighbor.neighborAreaId === lastSelectedId) ||
                        (neighbor.areaId === lastSelectedId &&
                          neighbor.neighborAreaId === areaId)
                    );
                  });

                  if (!isNeighbor) {
                    message.error(
                      "You can only select neighboring areas for an equipment"
                    );
                    // Remove the last selection
                    form.setFieldsValue({
                      areaIds: previouslySelected,
                    });
                  }
                }
              }}
            >
              {/* When creating a new equipment, show all areas */}
              {!editingEquipment &&
                areas?.map((area) => (
                  <Select.Option key={area.id} value={area.id}>
                    {area.name}
                  </Select.Option>
                ))}

              {/* When editing, show only the currently selected areas and their neighbors */}
              {editingEquipment &&
                (() => {
                  // Get currently selected areas
                  const selectedAreaIds = form.getFieldValue("areaIds") || [];

                  // Get all areas that are neighbors of the selected areas
                  const neighborAreaIds = selectedAreaIds.flatMap((areaId) => {
                    return (
                      areaNeighbors
                        ?.filter(
                          (neighbor) =>
                            neighbor.areaId === areaId ||
                            neighbor.neighborAreaId === areaId
                        )
                        .map((neighbor) =>
                          neighbor.areaId === areaId
                            ? neighbor.neighborAreaId
                            : neighbor.areaId
                        ) || []
                    );
                  });

                  // Return all areas that are either selected or neighbors of selected areas
                  return areas
                    ?.filter(
                      (area) =>
                        selectedAreaIds.includes(area.id) ||
                        neighborAreaIds.includes(area.id)
                    )
                    .map((area) => (
                      <Select.Option key={area.id} value={area.id}>
                        {area.name}
                      </Select.Option>
                    ));
                })()}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isLoading || updateMutation.isLoading}
            >
              {editingEquipment ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal de Login */}
      <LoginModal
        visible={isLoginModalVisible}
        onCancel={() => setIsLoginModalVisible(false)}
        onSuccess={() => {
          setIsLoginModalVisible(false);
          setIsModalVisible(true);
        }}
      />
    </div>
  );
}
