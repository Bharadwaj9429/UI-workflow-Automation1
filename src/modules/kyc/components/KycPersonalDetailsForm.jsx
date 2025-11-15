import React from 'react';
import { Form, Input, Button, DatePicker, Select, Row, Col } from 'antd';

const { Option } = Select;

const KycPersonalDetailsForm = ({ onNext, initialValues }) => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    onNext(values);
  };

  return (
    <Form form={form} layout='vertical' onFinish={onFinish} initialValues={initialValues}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name='firstName'
            label='Full Legal First Name'
            rules={[{ required: true, message: 'Please enter your first name' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name='lastName'
            label='Full Legal Last Name'
            rules={[{ required: true, message: 'Please enter your last name' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name='dateOfBirth'
            label='Date of Birth'
            rules={[{ required: true, message: 'Please select your date of birth' }]}
          >
            <DatePicker className='w-full' />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name='countryOfResidence'
            label='Country of Residence'
            rules={[{ required: true, message: 'Please select your country' }]}
          >
            <Select showSearch placeholder='Select a country'>
              <Option value='USA'>United States</Option>
              <Option value='CAN'>Canada</Option>
              <Option value='GBR'>United Kingdom</Option>
              {/* Add more countries as needed */}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name='streetAddress'
        label='Street Address'
        rules={[{ required: true, message: 'Please enter your street address' }]}
      >
        <Input />
      </Form.Item>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            name='city'
            label='City'
            rules={[{ required: true, message: 'Please enter your city' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            name='postalCode'
            label='Postal Code'
            rules={[{ required: true, message: 'Please enter your postal code' }]}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name='stateProvince'
        label='State/Province'
        rules={[{ required: true, message: 'Please enter your state or province' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type='primary' htmlType='submit'>
          Next
        </Button>
      </Form.Item>
    </Form>
  );
};

export default KycPersonalDetailsForm;
