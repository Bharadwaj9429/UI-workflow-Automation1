import React, { useState } from 'react';
import { Form, Button, Select, Upload, Checkbox, Row, Col, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Dragger } = Upload;

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const KycDocumentUpload = ({ onNext, onPrev, initialValues }) => {
  const [form] = Form.useForm();
  const documentType = Form.useWatch('documentType', form);

  const onFinish = (values) => {
    const files = {
        idFront: values.idFront,
        idBack: values.idBack,
        proofOfAddress: values.proofOfAddress
    }
    const otherData = { ...values, files };
    delete otherData.idFront;
    delete otherData.idBack;
    delete otherData.proofOfAddress;
    onNext(otherData);
  };

  const draggerProps = {
    name: 'file',
    multiple: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'application/pdf';
      if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG/PDF file!');
      }
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        message.error('Image must smaller than 5MB!');
      }
      return false; // Prevent auto-upload
    },
    listType: 'picture',
  };

  return (
    <Form form={form} layout='vertical' onFinish={onFinish} initialValues={initialValues}>
      <Form.Item
        name='documentType'
        label='Document Type'
        rules={[{ required: true, message: 'Please select a document type' }]}
      >
        <Select placeholder='Select a document type'>
          <Option value='passport'>Passport</Option>
          <Option value='drivers_license'>Driver's License</Option>
          <Option value='national_id'>National ID Card</Option>
        </Select>
      </Form.Item>

      <Row gutter={16}>
        <Col xs={24} sm={documentType === 'passport' ? 24 : 12}>
          <Form.Item
            name='idFront'
            label={documentType === 'passport' ? 'Document Upload' : 'Front-Side Upload'}
            valuePropName='fileList'
            getValueFromEvent={normFile}
            rules={[{ required: true, message: 'Please upload the front of your document' }]}
          >
            <Dragger {...draggerProps}><p className='ant-upload-drag-icon'><InboxOutlined /></p><p className='ant-upload-text'>Click or drag file to this area to upload</p></Dragger>
          </Form.Item>
        </Col>
        {(documentType === 'drivers_license' || documentType === 'national_id') && (
          <Col xs={24} sm={12}>
            <Form.Item
              name='idBack'
              label='Back-Side Upload'
              valuePropName='fileList'
              getValueFromEvent={normFile}
              rules={[{ required: true, message: 'Please upload the back of your document' }]}
            >
              <Dragger {...draggerProps}><p className='ant-upload-drag-icon'><InboxOutlined /></p><p className='ant-upload-text'>Click or drag file to this area to upload</p></Dragger>
            </Form.Item>
          </Col>
        )}
      </Row>

      <Form.Item
        name='proofOfAddress'
        label='Proof of Address (Utility Bill, Bank Statement)'
        valuePropName='fileList'
        getValueFromEvent={normFile}
        rules={[{ required: true, message: 'Please upload proof of address' }]}
      >
        <Dragger {...draggerProps}><p className='ant-upload-drag-icon'><InboxOutlined /></p><p className='ant-upload-text'>Click or drag file to this area to upload</p></Dragger>
      </Form.Item>

      <Form.Item
        name='certifyAge'
        valuePropName='checked'
        rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('You must certify the document age')) }]}
      >
        <Checkbox>I certify this document is less than 3 months old.</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button onClick={onPrev} className='mr-2'>
          Previous
        </Button>
        <Button type='primary' htmlType='submit'>
          Next
        </Button>
      </Form.Item>
    </Form>
  );
};

export default KycDocumentUpload;
