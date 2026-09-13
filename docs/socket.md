# Workstation — Socket.io Real-Time Collaboration Architecture

## Connection Lifecycle
Clients establish WebSocket connections via `io()` authenticated using their in-memory JWT accessToken.

```javascript
const socket = io('http://localhost:9005', {
  auth: { token: accessToken },
  reconnection: true,
  reconnectionAttempts: 15,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});
```

---

## Socket Events

### 1. Connection & Presence
| Event | Direction | Payload | Description |
|---|---|---|---|
| `connection` | Client $\rightarrow$ Server | `auth.token` | Authenticates socket and joins user to private room `user_${userId}` |
| `online_users` | Server $\rightarrow$ Client | `string[]` | Array of online user IDs dispatched upon connection |
| `user_online` | Server $\rightarrow$ Client | `userId` | Broadcast when a user connects |
| `user_offline` | Server $\rightarrow$ Client | `userId` | Broadcast when a user disconnects |

---

### 2. Private Messaging
| Event | Direction | Payload | Description |
|---|---|---|---|
| `join_chat` | Client $\rightarrow$ Server | `conversationId` | Joins socket to the conversation room |
| `leave_chat` | Client $\rightarrow$ Server | `conversationId` | Leaves conversation room |
| `send_message` | Client $\rightarrow$ Server | `{ conversationId, content }` | Sends message and broadcasts to room |
| `new_message` | Server $\rightarrow$ Client | `MessageObject` | Emitted to participants in the conversation room |
| `typing` | Client $\rightarrow$ Server | `{ conversationId }` | Emitted when user types |
| `stop_typing` | Client $\rightarrow$ Server | `{ conversationId }` | Emitted when typing stops |

---

### 3. Notifications & Marketplace Events
| Event | Direction | Payload | Description |
|---|---|---|---|
| `new_notification` | Server $\rightarrow$ Client | `{ message, type, link }` | Emitted to recipient's private user room (`user_${userId}`) |
| `proposal_received` | Server $\rightarrow$ Client | `ProposalObject` | Notifies client when a freelancer bids on their project |
| `proposal_accepted` | Server $\rightarrow$ Client | `ContractObject` | Notifies freelancer when their proposal is accepted |
