import {useAccess, useIntl, history} from "umi";
import React, {useRef, useState} from "react";
import {Button, message, Modal, Space, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined, NodeIndexOutlined} from "@ant-design/icons";
import {ActionType, ProColumns, ProFormInstance, ProTable} from "@ant-design/pro-components";
import {PRIVILEGE_CODE} from "@/constant";
import {WsFlinkKubernetesDeploymentTemplate} from "@/services/project/typings";
import {
  WsFlinkKubernetesDeploymentTemplateService
} from "@/services/project/WsFlinkKubernetesDeploymentTemplateService";
import DeploymentTemplateForm from "@/pages/Project/Workspace/Kubernetes/Template/DeploymentTemplateForm";

const FlinkKubernetesDeploymentTemplateWeb: React.FC = () => {
  const intl = useIntl();
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [selectedRows, setSelectedRows] = useState<WsFlinkKubernetesDeploymentTemplate[]>([]);
  const [deploymentTemplateFormData, setDeploymentTemplateFormData] = useState<{
    visiable: boolean;
    data: WsFlinkKubernetesDeploymentTemplate;
  }>({visiable: false, data: {}});

  const tableColumns: ProColumns<WsFlinkKubernetesDeploymentTemplate>[] = [
    {
      title: intl.formatMessage({id: 'pages.project.flink.kubernetes.deployment.template.name'}),
      dataIndex: 'name',
      width: 200,
    },
    {
      title: intl.formatMessage({id: 'pages.project.flink.kubernetes.deployment.template.namespace'}),
      dataIndex: 'name.metadata.namespace',
      hideInSearch: true,
      width: 200,
      render: (dom, entity, index, action, schema) => {
        return entity.metadata?.namespace;
      }
    },
    {
      title: intl.formatMessage({id: 'app.common.data.remark'}),
      dataIndex: 'remark',
      hideInSearch: true,
      width: 180,
    },
    {
      title: intl.formatMessage({id: 'app.common.data.createTime'}),
      dataIndex: 'createTime',
      hideInSearch: true,
      width: 180,
    },
    {
      title: intl.formatMessage({id: 'app.common.data.updateTime'}),
      dataIndex: 'updateTime',
      hideInSearch: true,
      width: 180,
    },
    {
      title: intl.formatMessage({id: 'app.common.operate.label'}),
      dataIndex: 'actions',
      align: 'center',
      width: 120,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          {access.canAccess(PRIVILEGE_CODE.datadevProjectEdit) && (
            <Tooltip title={intl.formatMessage({id: 'app.common.operate.edit.label'})}>
              <Button
                shape="default"
                type="link"
                icon={<EditOutlined/>}
                onClick={() => {
                  setDeploymentTemplateFormData({visiable: true, data: record});
                }}
              />
            </Tooltip>
          )}
          {access.canAccess(PRIVILEGE_CODE.datadevJobEdit) && (
            <Tooltip title={intl.formatMessage({id: 'pages.project.flink.kubernetes.deployment.template.define'})}>
              <Button
                shape="default"
                type="link"
                icon={<NodeIndexOutlined/>}
                onClick={() => {
                  history.push("/workspace/flink/kubernetes/deployment/template/detail", record)
                }}
              />
            </Tooltip>
          )}
          {access.canAccess(PRIVILEGE_CODE.datadevDatasourceDelete) && (
            <Tooltip title={intl.formatMessage({id: 'app.common.operate.delete.label'})}>
              <Button
                shape="default"
                type="link"
                icon={<DeleteOutlined/>}
                onClick={() => {
                  Modal.confirm({
                    title: intl.formatMessage({id: 'app.common.operate.delete.confirm.title'}),
                    content: intl.formatMessage({id: 'app.common.operate.delete.confirm.content'}),
                    okText: intl.formatMessage({id: 'app.common.operate.confirm.label'}),
                    okButtonProps: {danger: true},
                    cancelText: intl.formatMessage({id: 'app.common.operate.cancel.label'}),
                    onOk() {
                      WsFlinkKubernetesDeploymentTemplateService.delete(record).then((d) => {
                        if (d.success) {
                          message.success(intl.formatMessage({id: 'app.common.operate.delete.success'}));
                          actionRef.current?.reload();
                        }
                      });
                    },
                  });
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (<div>
    <ProTable<WsFlinkKubernetesDeploymentTemplate>
      search={{
        labelWidth: 'auto',
        span: {xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 4},
      }}
      rowKey="id"
      actionRef={actionRef}
      formRef={formRef}
      options={false}
      columns={tableColumns}
      request={(params, sorter, filter) =>
        WsFlinkKubernetesDeploymentTemplateService.list({...params})
      }
      toolbar={{
        actions: [
          access.canAccess(PRIVILEGE_CODE.datadevResourceAdd) && (
            <Button
              key="new"
              type="primary"
              onClick={() => {
                setDeploymentTemplateFormData({visiable: true, data: {}});
              }}
            >
              {intl.formatMessage({id: 'app.common.operate.new.label'})}
            </Button>
          ),
          access.canAccess(PRIVILEGE_CODE.datadevResourceDelete) && (
            <Button
              key="del"
              type="default"
              disabled={selectedRows.length < 1}
              onClick={() => {
                Modal.confirm({
                  title: intl.formatMessage({id: 'app.common.operate.delete.confirm.title'}),
                  content: intl.formatMessage({id: 'app.common.operate.delete.confirm.content'}),
                  okText: intl.formatMessage({id: 'app.common.operate.confirm.label'}),
                  okButtonProps: {danger: true},
                  cancelText: intl.formatMessage({id: 'app.common.operate.cancel.label'}),
                  onOk() {
                    WsFlinkKubernetesDeploymentTemplateService.deleteBatch(selectedRows).then((d) => {
                      if (d.success) {
                        message.success(intl.formatMessage({id: 'app.common.operate.delete.success'}));
                        actionRef.current?.reload();
                      }
                    });
                  },
                });
              }}
            >
              {intl.formatMessage({id: 'app.common.operate.delete.label'})}
            </Button>
          )
        ],
      }}
      pagination={{showQuickJumper: true, showSizeChanger: true, defaultPageSize: 10}}
      rowSelection={{
        fixed: true,
        onChange(selectedRowKeys, selectedRows, info) {
          setSelectedRows(selectedRows);
        },
      }}
      tableAlertRender={false}
      tableAlertOptionRender={false}
    />
    {deploymentTemplateFormData.visiable && (
      <DeploymentTemplateForm
        visible={deploymentTemplateFormData.visiable}
        onCancel={() => {
          setDeploymentTemplateFormData({visiable: false, data: {}});
        }}
        onVisibleChange={(visiable) => {
          setDeploymentTemplateFormData({visiable: visiable, data: {}});
          actionRef.current?.reload();
        }}
        data={deploymentTemplateFormData.data}
      />
    )}
  </div>);
}

export default FlinkKubernetesDeploymentTemplateWeb;
