import React from 'react';
import PageHeader from './PageHeader';
import './ArchitectureHeader.css';

export default function ArchitectureHeader({ provider, count, services, references }) {
  return (
    <PageHeader title={`${provider} Developer Architectures`}
      description={provider === 'Kubernetes' ? 'Workloads, service routing, storage, identity, and application delivery.' : 'APIs, object storage, event-driven workers, compute, and data services.'}
      stats={[{ label: 'Implementation Profiles', value: count || '--' }, { label: 'Resource Families', value: services || '--' }, { label: 'Configuration Examples', value: references || '--' }]} />
  );
}
