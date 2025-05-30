import express from 'express';
import cors from 'cors';
import companiesRoutes from './src/company/companies';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/companies', companiesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));