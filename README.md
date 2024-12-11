# VultiConnect Integration Example

This repository provides an example of how to integrate the **VultiConnect** extension into a React application. VultiConnect enables users to connect to multiple blockchain networks and send transactions using the Vultisig wallet.

---

## **Installation**

1. Install dependencies using **npm** (or your preferred package manager):

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open the app in your browser at `http://localhost:3000/`.

---

## **Usage**

1. **Select a Chain**: Use the dropdown to select the blockchain network you want to connect to.
2. **Connect Wallet**: Click the "Connect" button to establish a connection with the Vultisig wallet via VultiConnect.
3. **Send Transaction**: Fill in the **Receiver Address**, **Memo**, and **Amount** fields, then click "Submit Transaction".
4. **Transaction Status**: Upon successful submission, the transaction hash will be displayed on the screen.

---

## **Features**

- **Multi-Chain Support**: Supports multiple blockchains like Bitcoin, Cosmos, and others.
- **Wallet Connection**: Connects to Vultisig wallet via the VultiConnect extension.
- **Transaction Submission**: Send transactions to any supported chain.



---

## **Project Structure**

```
├── public/         # Static files (images, icons, etc.)
├── src/            # Source files for the React app
│   ├── App.tsx     # Main component containing the logic for wallet connection and transaction submission
│   ├── index.tsx   # Application entry point
│   └── constans.ts # Contains supported chains and configuration
├── package.json    # Project configuration and dependencies
```

---

## **API Methods**

### **Connection Methods**

| Method                | Description                                        |
| --------------------- | -------------------------------------------------- |
| `request_accounts`    | Requests wallet addresses for the selected chain.  |
| `wallet_switch_chain` | Switches to a different blockchain network.        |
| `chain_id`            | Gets the chain ID of the currently selected chain. |

### **Transaction Methods**

| Method                    | Description                            |
| ------------------------- | -------------------------------------- |
| `send_transaction`        | Sends a transaction to the blockchain. |
| `get_transaction_by_hash` | Retrieves a transaction by its hash.   |
