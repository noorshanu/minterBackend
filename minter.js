// import express from 'express';
// import { ethers } from 'ethers';
// import fs from 'fs';
// import path from 'path';
// import { run } from 'hardhat';

const express = require("express");
const fs = require("fs");
const path = require("path");
const { run , ethers, pkg } = require("hardhat");


const app = express();
app.use(express.json());

// Initialize provider based on RPC URL from request
function initializeSession(rpcUrl, privateKey) {
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  return { wallet, provider };
}

async function findTokenAddressFromTopic(provider, txHash, topicHash) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    for (const log of receipt.logs) {
      if (log.topics[0] === topicHash) {
        return log.address;
      }
    }
    return null;
  } catch (error) {
    throw new Error(`Error finding token address: ${error.message}`);
  }
}

async function verifyContract(address, constructorArguments) {
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: constructorArguments,
    });
    return true;
  } catch (error) {
    throw new Error(`Contract verification failed: ${error.message}`);
  }
}

// Endpoint to deploy token
app.post('/api/deploy-token', async (req, res) => {
  try {
    const {
      name,
      symbol,
      decimals,
      totalSupply,
      rpcUrl,
      privateKey,
      deployer,
      deployValue
    } = req.body;

    // Validate required fields
    if (!name || !symbol || !decimals || !totalSupply || !rpcUrl || !privateKey || !deployer) {
      return res.status(400).json({ 
        error: 'Missing required parameters' 
      });
    }

    // Initialize session with provided RPC URL
    const { wallet, provider } = initializeSession(rpcUrl, privateKey);

    // Parse values
    const parsedDecimals = parseInt(decimals);
    const parsedTotalSupply = ethers.parseUnits(totalSupply.toString(), parsedDecimals);
    const parsedDeployValue = ethers.parseEther(deployValue || '0.0001');

    // Get contract factory
    const StandardToken = await ethers.getContractFactory("StandardToken", wallet);

    // Deploy token
    const token = await StandardToken.deploy(
      name,
      symbol,
      parsedDecimals,
      parsedTotalSupply,
      deployer,
      parsedDeployValue,
      { value: parsedDeployValue }
    );

    const deployed = token.deploymentTransaction();

    // Save deployment transaction
    const standardToken = path.resolve("standard-token-deployments");
    if (!fs.existsSync(standardToken)) {
      fs.mkdirSync(standardToken, { recursive: true });
    }
    
    const deploymentLog = path.resolve(standardToken, `${deployed.hash}.json`);
    fs.writeFileSync(deploymentLog, JSON.stringify(deployed, null, 2), "utf-8");

    // Find token address

    
    // Return success response
    return res.status(200).json({
      success: true,
      deploymentHash: deployed.hash,
    });

  } catch (error) {
    console.error('Deployment error:', error);
    return res.status(500).json({
      error: 'Token deployment failed',
      message: error.message
    });
  }
});

// Endpoint to check deployment status
app.get('/api/deployment-status/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    const { rpcUrl } = req.query;

    if (!rpcUrl) {
      return res.status(400).json({ error: 'RPC URL is required' });
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const receipt = await provider.getTransactionReceipt(txHash);
    const topicHash = "0x56358b41df5fa59f5639228f0930994cbdde383c8a8fd74e06c04e1deebe3562";

    const tokenAddress = await findTokenAddressFromTopic(provider, txHash, topicHash);

    if (!receipt) {
      return res.status(200).json({ status: 'pending' });
    }
// Save token information
const tokenDirectory = path.resolve("standard");
if (!fs.existsSync(tokenDirectory)) {
  fs.mkdirSync(tokenDirectory, { recursive: true });
}

const completeLog = {
  tokenAddress,
  name,
  symbol,
  decimals: parsedDecimals,
  totalSupply: parsedTotalSupply.toString(),
  deploymentTransaction: deployed,
};

const tokenLog = path.resolve(tokenDirectory, `${tokenAddress}.json`);
fs.writeFileSync(tokenLog, JSON.stringify(completeLog, null, 2), "utf-8");

// Start verification process
setTimeout(async () => {
  try {
    await verifyContract(tokenAddress, [
      name,
      symbol,
      parsedDecimals,
      parsedTotalSupply,
      deployer,
      parsedDeployValue
    ]);
  } catch (error) {
    console.error('Verification error:', error);
  }
}, 15000);

    return res.status(200).json({
      status: receipt.status === 1 ? 'success' : 'failed',
      receipt
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Error checking deployment status',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Token deployment API server running on port ${PORT}`);
});
