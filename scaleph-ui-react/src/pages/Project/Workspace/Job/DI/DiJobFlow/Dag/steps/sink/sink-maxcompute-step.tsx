import {NsGraph} from '@antv/xflow';
import {ModalFormProps} from '@/app.d';
import {MaxComputeParams, STEP_ATTR_TYPE} from '../../constant';
import {WsDiJobService} from '@/services/project/WsDiJob.service';
import {Form, message, Modal} from 'antd';
import {WsDiJob} from '@/services/project/typings';
import {getIntl, getLocale} from 'umi';
import {ProForm, ProFormSwitch, ProFormText,} from '@ant-design/pro-components';
import {useEffect} from 'react';
import DataSourceItem from "@/pages/Project/Workspace/Job/DI/DiJobFlow/Dag/steps/dataSource";

const SinkMaxComputeStepForm: React.FC<ModalFormProps<{
  node: NsGraph.INodeConfig;
  graphData: NsGraph.IGraphData;
  graphMeta: NsGraph.IGraphMeta;
}>> = ({data, visible, onCancel, onOK}) => {
  const nodeInfo = data.node.data;
  const jobInfo = data.graphMeta.origin as WsDiJob;
  const jobGraph = data.graphData;
  const intl = getIntl(getLocale(), true);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue(STEP_ATTR_TYPE.stepTitle, nodeInfo.data.displayName);
  }, []);

  return (
    <Modal
      open={visible}
      title={nodeInfo.data.displayName}
      width={780}
      bodyStyle={{overflowY: 'scroll', maxHeight: '640px'}}
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={() => {
        form.validateFields().then((values) => {
          let map: Map<string, any> = new Map();
          map.set(STEP_ATTR_TYPE.jobId, jobInfo.id);
          map.set(STEP_ATTR_TYPE.jobGraph, JSON.stringify(jobGraph));
          map.set(STEP_ATTR_TYPE.stepCode, nodeInfo.id);
          map.set(STEP_ATTR_TYPE.stepAttrs, values);
          WsDiJobService.saveStepAttr(map).then((resp) => {
            if (resp.success) {
              message.success(intl.formatMessage({id: 'app.common.operate.success'}));
              onCancel();
              onOK ? onOK(values) : null;
            }
          });
        });
      }}
    >
      <ProForm form={form} initialValues={nodeInfo.data.attrs} grid={true} submitter={false}>
        <ProFormText
          name={STEP_ATTR_TYPE.stepTitle}
          label={intl.formatMessage({id: 'pages.project.di.step.stepTitle'})}
          rules={[{required: true}, {max: 120}]}
        />
        <DataSourceItem dataSource={"MaxCompute"}/>
        <ProFormText
          name={MaxComputeParams.project}
          label={intl.formatMessage({id: 'pages.project.di.step.maxcompute.project'})}
          rules={[{required: true}]}
        />
        <ProFormText
          name={MaxComputeParams.tableName}
          label={intl.formatMessage({id: 'pages.project.di.step.maxcompute.tableName'})}
          rules={[{required: true}]}
        />
        <ProFormText
          name={MaxComputeParams.partitionSpec}
          label={intl.formatMessage({id: 'pages.project.di.step.maxcompute.partitionSpec'})}
        />
        <ProFormSwitch
          name={MaxComputeParams.overwrite}
          label={intl.formatMessage({id: 'pages.project.di.step.maxcompute.overwrite'})}
          initialValue={false}
        />
      </ProForm>
    </Modal>
  );
};

export default SinkMaxComputeStepForm;
