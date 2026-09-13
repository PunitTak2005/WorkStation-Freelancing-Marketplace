export const generateNotifications = (userIds) => {
  const notifications = [];
  const validTypes = ['bid_received', 'proposal_accepted', 'payment_completed', 'new_message', 'review_received', 'system'];
  
  for (let i = 0; i < 50; i++) {
    notifications.push({
      receiver: userIds[Math.floor(Math.random() * userIds.length)],
      type: validTypes[Math.floor(Math.random() * validTypes.length)],
      title: 'WorkStation Notification',
      message: 'You have a new update regarding your recent activity on the platform.',
      read: Math.random() > 0.5,
      linkUrl: '/dashboard'
    });
  }

  return notifications;
};
