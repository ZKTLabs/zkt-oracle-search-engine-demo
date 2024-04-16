import { createPublicClient, createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
})

export const wallet = createWalletClient({
  chain: sepolia,
  transport: http(),
})

export const readDataFromContract = async (
  contractAddress: `0x${string}`,
  abi: any[],
  method: string,
  args?: any[]
) => {
  return await publicClient.readContract({
    address: contractAddress,
    abi,
    functionName: method,
    args: args ?? [],
  })
}
