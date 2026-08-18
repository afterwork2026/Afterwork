require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policy');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/admin/policy', policyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'After Work API is running smoothly.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
