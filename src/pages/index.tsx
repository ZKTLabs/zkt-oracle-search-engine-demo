import { formatAmount } from '@did-network/dapp-sdk'
import BigNumber from 'bignumber.js'
import { parseEther } from 'viem'
import { useAccount, useReadContract, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import { Header } from '@/components/layout/Header'
import { useTokenContract } from '@/hooks'

import abi from '../abi/PoolSwapTest.json'

const MockTokenA = '0x520A3474beAaE4AC406242aa74eF6D052dE8aaED'
const MockTokenB = '0x6BCCF17873Fe200962451E6824090b847DB1ACEb'
const PoolSwapTest = '0x92d3117268Bd580a748acbEE73162834443a3A17'
const ZKTUniswapV4Hook = '0x020951DEDa6928a0Eb297ed5e6a4132A01d800DD'

const Home = () => {
  const { address } = useAccount()
  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const [tokenPair, setTokenPair] = useState(['usdt', 'usdc'])
  const reverseTokenPair = useCallback(() => {
    setTokenPair([tokenPair[1], tokenPair[0]])
  }, [tokenPair])

  const [inAmount, setInAmount] = useState('')
  const outAmount = inAmount
  const usdcContract = useTokenContract(MockTokenA)
  const usdtContract = useTokenContract(MockTokenB)

  const { data: usdcBalance } = useReadContract({
    ...(usdcContract as any),
    functionName: 'balances',
    args: [address],
  })

  const { data: usdtBalance } = useReadContract({
    ...(usdtContract as any),
    functionName: 'balances',
    args: [address],
  })

  const approveMu = useWriteContract()
  const approveHandler = useCallback(async () => {
    await approveMu.writeContractAsync({
      abi: usdtContract.abi,
      address: usdtContract.address as any,
      functionName: 'approve',
      args: [ZKTUniswapV4Hook, BigInt(BigNumber(2).pow(256).minus(1).toString())],
    })
  }, [approveMu, usdtContract])

  const onSwap = useCallback(() => {
    writeContract({
      address: PoolSwapTest,
      abi,
      functionName: 'swap',
      args: [
        {
          currency0: MockTokenA,
          currency1: MockTokenB,
          fee: 3000,
          tickSpacing: 60,
          hooks: ZKTUniswapV4Hook,
        },
        {
          zeroForOne: true,
          amountSpecified: parseEther('0.1'),
          sqrtPriceLimitX96: '7922816251426433759354395033',
        },
        {
          withdrawTokens: true, // 允许转移token
          settleUsingTransfer: true, // 使用转账结算
          currencyAlreadySent: false, // 货币已经发送了
        },
        '0x0',
      ],
    })
  }, [writeContract])

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  console.log(isConfirmed, isConfirming, isPending, error)

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto mt-10 sm:px-8 lt-sm:px-4 font-$rk-fonts-body">
        <div className="flex items-center gap-4">
          <span className="py-1.5 px-4 flex-col-center bg-border/50 rounded-full font-600 cursor-pointer">Swap</span>
        </div>
        <div className="relative mt-5 space-y-1">
          <div className="px-4 py-4 space-y-2 rounded-lg border-transparent [&:has(input:focus)]:border-border border-1px border-solid bg-#f9f9f9">
            <div className="text-sm text-gray-5 font-500">You pay</div>
            <div className="flex justify-between">
              <Input
                placeholder="0"
                className="p-0 text-3xl border-none font-600 !shadow-[none] outline-none bg-transparent"
                value={inAmount}
                onChange={(e) => setInAmount(e.target.value)}
              />
              <div className="p-1 px-1.5 shadow-sm flex-center gap-1 bg-white rounded-full cursor-pointer">
                <span className="shrink-0 w-6 h-6 i-cryptocurrency-color:usdc"></span>
                <span className="font-600 text-xl uppercase">{tokenPair[0]}</span>
                <span className="w-5 h-5 i-lucide-chevron-down"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-5 font-500">
              <span>${inAmount}</span>
              <span>
                <span>Balance: </span>
                <span className="">{formatAmount(usdcBalance, 18)}</span>
              </span>
            </div>
          </div>

          <span
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex-col-center border-4 box-border border-solid border-white rounded-lg bg-#f9f9f9 cursor-pointer"
            onClick={reverseTokenPair}
          >
            <span className="i-lucide:arrow-down"></span>
          </span>

          <div className="px-4 py-4 space-y-2 rounded-lg border-transparent [&:has(input:focus)]:border-border border-1px border-solid bg-#f9f9f9">
            <div className="text-sm text-gray-5 font-500">You receive</div>
            <div className="flex justify-between">
              <Input
                disabled={true}
                placeholder="0"
                className="p-0 text-3xl border-none font-600 !shadow-[none] outline-none bg-transparent"
                value={outAmount}
              />

              <div className="p-1 px-1.5 shadow-sm flex-center gap-1 bg-white rounded-full cursor-pointer">
                <span className="shrink-0 w-6 h-6 i-cryptocurrency-color:usdt"></span>
                <span className="font-600 text-xl uppercase">{tokenPair[1]}</span>
                <span className="w-5 h-5 i-lucide-chevron-down"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-5 font-500">
              <span>${formatAmount(outAmount)}</span>
              <span>
                <span>Balance: </span>
                <span className="">{formatAmount(usdtBalance, 18)}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onSwap}
          disabled={!inAmount}
          className="mt-1 w-full h-14 flex-col-center rounded-lg transition-all text-5 font-600 text-white bg-primary active:bg-primary/80 disabled:bg-#f9f9f9 disabled:text-gray-4"
        >
          Swap
        </button>
      </div>
    </>
  )
}

export default Home
