import React, { useState } from 'react';
import { Steps, Button, message, Spin, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import KycPersonalDetailsForm from './components/KycPersonalDetailsForm';
import KycDocumentUpload from './components/KycDocumentUpload';
import KycReview from './components/KycReview';
import { submitKycData } from '~/reducers/kycSlice';

const { Step } = Steps;

const steps = [
  { title: 'Personal Details' },
  { title: 'Document Upload' },
  { title: 'Review & Submit' },
];

const KycVerificationFlow = () => {
  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.kyc);

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setCurrent(current + 1);
  };

  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    for (const key in formData) {
      if (key === 'files') {
        Object.keys(formData.files).forEach(fileKey => {
            if (formData.files[fileKey] && formData.files[fileKey][0]) {
                data.append(fileKey, formData.files[fileKey][0].originFileObj);
            }
        })
      } else if (key === 'dateOfBirth') {
        data.append(key, formData[key].toISOString());
      } else {
        data.append(key, formData[key]);
      }
    }

    const resultAction = await dispatch(submitKycData(data));
    if (submitKycData.fulfilled.match(resultAction)) {
      message.success('KYC information submitted successfully for review.');
      navigate('/profile/settings'); // Or wherever the profile page is
    } else {
      message.error(resultAction.payload || 'Failed to submit KYC data.');
    }
  };

  const stepContent = [
    <KycPersonalDetailsForm onNext={handleNext} initialValues={formData} />,
    <KycDocumentUpload onNext={handleNext} onPrev={handlePrev} initialValues={formData} />,
    <KycReview formData={formData} onSubmit={handleSubmit} onPrev={handlePrev} isLoading={loading} />,
  ];

  return (
    <div className='p-4 sm:p-8 bg-[var(--bodyBg)] min-h-screen'>
      <Card title='Customer Verification (KYC)' className='max-w-4xl mx-auto'>
        <Steps current={current} className='mb-8'>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className='steps-content min-h-[300px]'>
          <Spin spinning={loading} tip='Submitting...'>
            {stepContent[current]}
          </Spin>
        </div>
      </Card>
    </div>
  );
};

export default KycVerificationFlow;
