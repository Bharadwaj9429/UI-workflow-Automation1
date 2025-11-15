import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Tag, Button, Spin, Alert } from 'antd';
import { getKycStatus } from '~/reducers/kycSlice';

const KycStatusBadge = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, loading, error } = useSelector((state) => state.kyc);

  useEffect(() => {
    if (!status || status === 'Not Verified') {
      dispatch(getKycStatus());
    }
  }, [dispatch, status]);

  const getStatusTag = () => {
    switch (status) {
      case 'Verified':
        return <Tag color='green'>Verified</Tag>;
      case 'Pending':
        return <Tag color='blue'>Pending Review</Tag>;
      case 'Rejected':
        return <Tag color='red'>Rejected</Tag>;
      case 'Not Verified':
      default:
        return <Tag color='orange'>Not Verified</Tag>;
    }
  };

  const handleStartVerification = () => {
    navigate('/kyc/verification');
  };

  if (loading) {
    return <Spin size='small' />;
  }

  if (error) {
    return <Alert message={error} type='error' showIcon />;
  }

  return (
    <div className='p-4 border rounded-lg bg-[var(--background-1)]'>
      <h3 className='text-lg font-semibold mb-2 text-[var(--text-primary)]'>Verification Status</h3>
      <div className='flex items-center justify-between'>
        <div>{getStatusTag()}</div>
        {(status === 'Not Verified' || status === 'Rejected') && (
          <Button type='primary' onClick={handleStartVerification}>
            Start Verification
          </Button>
        )}
      </div>
    </div>
  );
};

export default KycStatusBadge;
