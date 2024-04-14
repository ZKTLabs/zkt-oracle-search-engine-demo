import { formatAmount } from '@did-network/dapp-sdk'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import BigNumber from 'bignumber.js'
import { CopyBlock, dracula } from 'react-code-blocks'
import { toast, Toaster } from 'sonner'
import { parseEther, zeroAddress } from 'viem'
import { useAccount, useBalance, useBlockNumber, useWaitForTransactionReceipt, useWriteContract } from 'wagmi'

import { Header } from '@/components/layout/Header'
import { frontEndCode } from '@/constants/code'

import abi from '../abi/PoolSwapTest.json'

const MockTokenB = '0x6BCCF17873Fe200962451E6824090b847DB1ACEb'
const PoolSwapTest = '0x92d3117268Bd580a748acbEE73162834443a3A17'
const ZKTUniswapV4Hook = '0x020951DEDa6928a0Eb297ed5e6a4132A01d800DD'

const Home = () => {
  const { address, isConnected } = useAccount()
  const { data: blockNumber } = useBlockNumber({
    watch: true,
  })
  const { openConnectModal } = useConnectModal()
  const {
    data: hash,
    writeContractAsync,
    isPending,
    error,
  } = useWriteContract({
    mutation: {
      onError() {
        toast.error(
          'Error: Access Denied. Your address has been identified as a blacklisted address and cannot access this protocol.'
        )
      },
    },
  })

  const [tokenPair, setTokenPair] = useState(['eth', 'usdt'])
  const reverseTokenPair = useCallback(() => {
    setTokenPair([tokenPair[1], tokenPair[0]])
  }, [tokenPair])

  const [inAmount, setInAmount] = useState('0.01')
  const outAmount = useMemo(
    () =>
      BigNumber(inAmount || 0)
        .times(25000)
        .toString(),
    [inAmount]
  )

  const { data: ethBalance, refetch: usdcBalanceRefetch } = useBalance({
    address,
  })
  const { data: usdtBalance, refetch: usdtBalanceRefetch } = useBalance({
    address,
    token: MockTokenB,
  })

  const onSwap = useCallback(async () => {
    await writeContractAsync({
      address: PoolSwapTest,
      abi,
      functionName: 'swap',
      args: [
        [zeroAddress, MockTokenB, 50000, 60, ZKTUniswapV4Hook],
        [true, parseEther('200'), '429512873900'],
        [true, true, false],
        '0x',
      ],
      value: parseEther(inAmount),
    })
  }, [inAmount, writeContractAsync])

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  console.log(isConfirming, isConfirmed, hash, error)

  useEffect(() => {
    console.log('[blockNumber]', blockNumber)
    usdcBalanceRefetch()
    usdtBalanceRefetch()
  }, [blockNumber, usdcBalanceRefetch, usdtBalanceRefetch])

  const clickHandler = useCallback(async () => {
    if (!isConnected) {
      openConnectModal?.()
      return
    }

    await onSwap()
  }, [isConnected, onSwap, openConnectModal])

  const btnDisabled = useMemo(() => !inAmount || isConfirming || isPending, [inAmount, isConfirming, isPending])

  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto mt-10 sm:px-8 lt-sm:px-4 font-$rk-fonts-body">
        <div className="flex items-center gap-4 justify-between">
          <span className="py-1.5 px-4 flex-col-center bg-border/50 rounded-full font-600 cursor-pointer">Swap</span>
          {isConfirming && <span className="i-lucide:loader-circle w-5 h-5 text-gray-5 animate-spin"></span>}
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
                readOnly
              />
              <div className="p-1 px-1.5 shadow-sm flex-center gap-1 bg-white rounded-full cursor-pointer">
                <span className="shrink-0 w-6 h-6 i-cryptocurrency-color:eth"></span>
                <span className="font-600 text-xl uppercase">{tokenPair[0]}</span>
                <span className="w-5 h-5 i-lucide-chevron-down"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-5 font-500">
              <span>${formatAmount(outAmount)}</span>
              <span>
                <span>Balance: </span>
                <span className="">{formatAmount(ethBalance?.value, ethBalance?.decimals)}</span>
              </span>
            </div>
          </div>

          <button
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex-col-center border-4 box-border border-solid border-white rounded-lg bg-#f9f9f9 cursor-pointer"
            onClick={reverseTokenPair}
            disabled
          >
            <span className="i-lucide:arrow-down"></span>
          </button>

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
              <span>${formatAmount(outAmount, 0, 2)}</span>
              <span>
                <span>Balance: </span>
                <span className="">{formatAmount(usdtBalance?.value, usdtBalance?.decimals)}</span>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={clickHandler}
          disabled={btnDisabled}
          className="mt-1 w-full h-14 flex-center gap-1 rounded-lg transition-all text-5 font-600 text-white bg-primary active:bg-primary/80 disabled:bg-primary/50"
        >
          {(isPending || isConfirming) && (
            <span className="i-lucide:loader-circle w-5 h-5 text-white animate-spin"></span>
          )}
          {!isConnected ? 'Connect' : 'Swap'}
        </button>
      </div>

      <div className="mt-10 max-w-6xl mx-auto sm:px-8 lt-sm:px-4 text-lg font-bold">Code demo</div>
      <div className="mt-4 mb-20 max-w-6xl mx-auto sm:px-8 lt-sm:px-4 [&>div]:px-5 [&>div]:overflow-auto overflow-auto text-sm">
        <CopyBlock
          text={frontEndCode}
          language="sol"
          wrapLongLines
          theme={dracula}
          showLineNumbers
          highlight="3,13-18,35-43"
        />
      </div>
      <Toaster richColors position="top-right" />
    </>
  )
}

export default Home
