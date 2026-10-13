# The British Table — MongoDB-connected version

## 1. Configure MongoDB
Open `.env` and replace `PASTE_YOUR_MONGODB_CONNECTION_STRING_HERE` with your MongoDB Atlas connection string. Do not share this file publicly.

Example format (replace the placeholders):
`MONGO_URI=mongodb+srv://USERNAME:PASSWORD@YOUR-CLUSTER.mongodb.net/?retryWrites=true&w=majority`

Set `DB_NAME` to the database that contains your restaurant collection and `COLLECTION` to its collection name.

In MongoDB Atlas, ensure your current IP is allowed under Network Access and that your database user has read/write permissions.

## 2. Run
Open this folder in VS Code terminal:
```powershell
npm install
npm start
```
Open the exact localhost URL printed in the terminal (usually http://localhost:3000). Do not open `public/index.html` directly.

## 3. Verify
- Terminal should say `MongoDB connected successfully.`
- Visit `http://localhost:3000/api/restaurants` to check the API returns JSON.
- Use Add Restaurant and Delete from the website. The directory and management page now reload their records from `/api/restaurants`.

If the terminal says MongoDB URI not found, or connection failed, writes will not persist in MongoDB. Check `.env`, database name, collection name, Atlas IP access, and database user permissions.
