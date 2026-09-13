import React from 'react';
import Badge from './Badge';

const StatusBadge = ({ status, ...rest }) => {
  if (!status) return null;

  const normalizedStatus = status.toLowerCase();

  let variant = 'gray';
  let label = status;

  if (['open', 'available', 'active', 'published'].includes(normalizedStatus)) {
    variant = 'emerald';
  } else if (['pending', 'in_progress', 'draft', 'review'].includes(normalizedStatus)) {
    variant = 'orange';
  } else if (['completed', 'approved', 'resolved', 'hired'].includes(normalizedStatus)) {
    variant = 'indigo';
  } else if (['cancelled', 'rejected', 'closed', 'suspended'].includes(normalizedStatus)) {
    variant = 'red';
  }

  // Capitalize first letter and replace underscores with space
  label = status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <Badge variant={variant} {...rest}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
