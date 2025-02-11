import {NsGraph} from '@antv/xflow';
import {ModalFormProps} from '@/app.d';
import {BaseFileParams, S3FileParams, S3RedshiftParams, STEP_ATTR_TYPE} from '../../constant';
import {WsDiJobService} from '@/services/project/WsDiJob.service';
import {Form, message, Modal} from 'antd';
import {WsDiJob} from '@/services/project/typings';
import {getIntl, getLocale} from 'umi';
import {
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import {useEffect} from 'react';
import DataSourceItem from "@/pages/Project/Workspace/Job/DI/DiJobFlow/Dag/steps/dataSource";
import {InfoCircleOutlined} from "@ant-design/icons";
import {StepSchemaService} from "@/pages/Project/Workspace/Job/DI/DiJobFlow/Dag/steps/helper";

const SinkS3RedshiftStepForm: React.FC<ModalFormProps<{
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
          StepSchemaService.formatHadoopS3Properties(values)
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
          colProps={{span: 24}}
        />
        <DataSourceItem dataSource={"S3"}/>
        <ProFormText
          name={S3RedshiftParams.jdbcUrl}
          label={intl.formatMessage({id: 'pages.project.di.step.s3redshift.jdbcUrl'})}
          rules={[{required: true}]}
        />
        <ProFormText
          name={S3RedshiftParams.jdbcUser}
          label={intl.formatMessage({id: 'pages.project.di.step.s3redshift.jdbcUser'})}
          rules={[{required: true}]}
        />
        <ProFormText
          name={S3RedshiftParams.jdbcPassword}
          label={intl.formatMessage({id: 'pages.project.di.step.s3redshift.jdbcPassword'})}
          rules={[{required: true}]}
        />
        <ProFormText
          name={S3RedshiftParams.executeSql}
          label={intl.formatMessage({id: 'pages.project.di.step.s3redshift.executeSql'})}
          placeholder={intl.formatMessage({id: 'pages.project.di.step.s3redshift.executeSql.placeholoder'})}
          rules={[{required: true}]}
        />
        <ProFormGroup
          label={intl.formatMessage({id: 'pages.project.di.step.s3.hadoop_s3_properties'})}
          tooltip={{
            title: intl.formatMessage({id: 'pages.project.di.step.s3.hadoop_s3_properties.tooltip'}),
            icon: <InfoCircleOutlined/>,
          }}
        >
          <ProFormList
            name={S3FileParams.hadoopS3Properties}
            copyIconProps={false}
            creatorButtonProps={{
              creatorButtonText: intl.formatMessage({id: 'pages.project.di.step.s3.hadoop_s3_properties.list'}),
              type: 'text',
            }}
          >
            <ProFormGroup>
              <ProFormText
                name={S3FileParams.key}
                label={intl.formatMessage({id: 'pages.project.di.step.s3.hadoop_s3_properties.key'})}
                placeholder={intl.formatMessage({id: 'pages.project.di.step.s3.hadoop_s3_properties.key.placeholder'})}
                colProps={{span: 10, offset: 1}}
              />
              <ProFormText
                name={S3FileParams.value}
                label={intl.formatMessage({id: 'pages.project.di.step.s3.hadoop_s3_properties.value'})}
                placeholder={intl.formatMessage({id: 'pages.project.di.step.s3.hadoop_s3_properties.value.placeholder'})}
                colProps={{span: 10, offset: 1}}
              />
            </ProFormGroup>
          </ProFormList>
        </ProFormGroup>
        <ProFormText
          name={BaseFileParams.path}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.path'})}
          rules={[{required: true}]}
          colProps={{span: 24}}
        />
        <ProFormSelect
          name={'file_format'}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.fileFormat'})}
          colProps={{span: 24}}
          valueEnum={{
            json: 'json',
            parquet: 'parquet',
            orc: 'orc',
            text: 'text',
            csv: 'csv',
          }}
        />
        <ProFormDependency name={['file_format']}>
          {({file_format}) => {
            if (file_format == 'text' || file_format == 'csv') {
              return (
                <ProFormGroup>
                  <ProFormText
                    name={BaseFileParams.fieldDelimiter}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.baseFile.fieldDelimiter',
                    })}
                    rules={[{required: true}]}
                    colProps={{span: 12}}
                  />
                  <ProFormText
                    name={BaseFileParams.rowDelimiter}
                    label={intl.formatMessage({
                      id: 'pages.project.di.step.baseFile.rowDelimiter',
                    })}
                    rules={[{required: true}]}
                    colProps={{span: 12}}
                  />
                </ProFormGroup>
              );
            }
            return <ProFormGroup/>;
          }}
        </ProFormDependency>
        <ProFormText
          name={BaseFileParams.fileNameExpression}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.fileNameExpression'})}
          colProps={{span: 12}}
        />
        <ProFormText
          name={BaseFileParams.filenameTimeFormat}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.filenameTimeFormat'})}
          colProps={{span: 12}}
        />
        <ProFormText
          name={BaseFileParams.partitionBy}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.partitionBy'})}
          colProps={{span: 12}}
        />
        <ProFormText
          name={BaseFileParams.partitionDirExpression}
          label={intl.formatMessage({
            id: 'pages.project.di.step.baseFile.partitionDirExpression',
          })}
        />
        <ProFormSwitch
          name={BaseFileParams.isPartitionFieldWriteInFile}
          label={intl.formatMessage({
            id: 'pages.project.di.step.baseFile.isPartitionFieldWriteInFile',
          })}
        />
        <ProFormText
          name={BaseFileParams.sinkColumns}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.sinkColumns'})}
        />
        <ProFormSwitch
          name={BaseFileParams.isEnableTransaction}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.isEnableTransaction'})}
          initialValue={true}
          disabled
        />
        <ProFormDigit
          name={BaseFileParams.batchSize}
          label={intl.formatMessage({id: 'pages.project.di.step.baseFile.batchSize'})}
          initialValue={1000000}
          fieldProps={{
            step: 10000,
            min: 0,
          }}
        />
      </ProForm>
    </Modal>
  );
};

export default SinkS3RedshiftStepForm;
