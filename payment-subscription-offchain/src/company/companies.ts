import express, { Request, Response } from 'express';
import { verifyEd25519Signature } from '../company/verify.js';

const router = express.Router();

interface RegisterCompanyRequestBody {
  companyName: string;
  email: string;
  phone?: string;
  walletAddress: string;
  message: string;
  signature: string;
  key: string;
  licenseUrl: string;
}

interface CompanyData {
  companyName: string;
  email: string;
  phone?: string;
  walletAddress: string;
  licenseUrl: string;
}

interface Metadata {
  [key: number]: {
    [key: string]: string | undefined;
  };
}

// Helper to build metadata from company data
function buildMetadataForCompany(company: CompanyData): Metadata {
  return {
    674: {
      companyName: company.companyName,
      email: company.email,
      phone: company.phone,
      walletAddress: company.walletAddress,
      licenseUrl: company.licenseUrl,
    },
  };
}

// Mock Blockfrost submit function — replace with real logic
async function submitTransactionToBlockfrost(
  walletAddress: string,
  metadata: Metadata
): Promise<string> {
  // TODO: Build, sign, and submit actual Cardano transaction here.
  // Return transaction hash on success.
  return 'mocked_tx_hash_123abc';
}

router.post(
  '/register',
  async (req: Request<{}, {}, RegisterCompanyRequestBody>, res: Response) => {
    const {
      companyName,
      email,
      phone,
      walletAddress,
      message,
      signature,
      key,
      licenseUrl,
    } = req.body;

    if (
      !companyName ||
      !email ||
      !walletAddress ||
      !message ||
      !signature ||
      !key ||
      !licenseUrl
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!verifyEd25519Signature(message, signature, key)) {
      return res.status(400).json({ message: 'Invalid wallet signature' });
    }

    try {
      new URL(licenseUrl);
    } catch {
      return res.status(400).json({ message: 'Invalid license URL' });
    }

    const company: CompanyData = {
      companyName,
      email,
      phone,
      walletAddress,
      licenseUrl,
    };

    const metadata = buildMetadataForCompany(company);

    try {
      const txHash = await submitTransactionToBlockfrost(walletAddress, metadata);

      return res.json({
        message: 'Company registered on blockchain successfully',
        company,
        metadata,
        txHash,
      });
    } catch (error) {
      console.error('Blockchain submit error:', error);
      return res.status(500).json({ message: 'Failed to submit to blockchain' });
    }
  }
);

export default router;
