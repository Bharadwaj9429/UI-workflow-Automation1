import React from 'react';
import { Button, Descriptions, Card, List, Typography } from 'antd';

const { Text } = Typography;

const KycReview = ({ formData, onSubmit, onPrev, isLoading }) => {
  const personalItems = [
    { key: '1', label: 'Full Name', children: `${formData.firstName || ''} ${formData.lastName || ''}` },
    { key: '2', label: 'Date of Birth', children: formData.dateOfBirth ? formData.dateOfBirth.format('YYYY-MM-DD') : '' },
    { key: '3', label: 'Country of Residence', children: formData.countryOfResidence || '' },
    { key: '4', label: 'Residential Address', children: `${formData.streetAddress || ''}, ${formData.city || ''}, ${formData.stateProvince || ''}, ${formData.postalCode || ''}` },
  ];

  const documentTypeMap = {
    passport: 'Passport',
    drivers_license: "Driver's License",
    national_id: 'National ID Card'
  };

  const documentItems = [
    { key: '1', label: 'Document Type', children: documentTypeMap[formData.documentType] || '' },
  ];

  const uploadedFiles = [];
  if (formData.files?.idFront?.[0]) uploadedFiles.push(`ID Front: ${formData.files.idFront[0].name}`);
  if (formData.files?.idBack?.[0]) uploadedFiles.push(`ID Back: ${formData.files.idBack[0].name}`);
  if (formData.files?.proofOfAddress?.[0]) uploadedFiles.push(`Proof of Address: ${formData.files.proofOfAddress[0].name}`);

  return (
    <div>
      <Card title='Personal Details' className='mb-4'>
        <Descriptions items={personalItems} column={1} bordered />
      </Card>
      <Card title='Uploaded Documents'>
        <Descriptions items={documentItems} column={1} bordered className='mb-4' />
        <List
          header={<div>Files to be Submitted</div>}
          bordered
          dataSource={uploadedFiles}
          renderItem={(item) => <List.Item><Text>{item}</Text></List.Item>}
        />
      </Card>

      <div className='mt-8'>
        <Button onClick={onPrev} className='mr-2' disabled={isLoading}>
          Previous
        </Button>
        <Button type='primary' onClick={onSubmit} loading={isLoading}>
          Submit for Verification
        </Button>
      </div>
    </div>
  );
};

export default KycReview;
