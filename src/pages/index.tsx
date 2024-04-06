import { Header } from '@/components/layout/Header'

const Home = () => {
  const [tokenPair, setTokenPair] = useState(['eth', 'usdt'])

  const reverseTokenPair = useCallback(() => {
    setTokenPair([tokenPair[1], tokenPair[0]])
  }, [tokenPair])

  const [inAmount, setInAmount] = useState('')
  const [outAmount, setOutAmount] = useState('')

  const [inBalance, setInBalance] = useState('')
  const [outBalance, setOutBalance] = useState('')

  const btnError = useMemo(() => {
    if (!inAmount) return true
    return false
  }, [inAmount])

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
                <span className="shrink-0 w-6 h-6 i-cryptocurrency-color:eth"></span>
                <span className="font-600 text-xl uppercase">{tokenPair[0]}</span>
                <span className="w-5 h-5 i-lucide-chevron-down"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-5 font-500">
              <span>${inAmount}</span>
              <span>
                <span>Balance: </span>
                <span className="">{inBalance}</span>
                <span>Max</span>
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
                placeholder="0"
                className="p-0 text-3xl border-none font-600 !shadow-[none] outline-none bg-transparent"
                value={outAmount}
                onChange={(e) => setOutAmount(e.target.value)}
              />

              <div className="p-1 px-1.5 shadow-sm flex-center gap-1 bg-white rounded-full cursor-pointer">
                <span className="shrink-0 w-6 h-6 i-cryptocurrency-color:usdt"></span>
                <span className="font-600 text-xl uppercase">{tokenPair[1]}</span>
                <span className="w-5 h-5 i-lucide-chevron-down"></span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-5 font-500">
              <span>${outAmount}</span>
              <span>
                <span>Balance: </span>
                <span className="">{outBalance}</span>
                <span>Max</span>
              </span>
            </div>
          </div>
        </div>

        <button
          disabled={btnError}
          className="mt-1 w-full h-14 flex-col-center rounded-lg transition-all text-5 font-600 text-white bg-primary active:bg-primary/80 disabled:bg-#f9f9f9 disabled:text-gray-4"
        >
          Swap
        </button>
      </div>
    </>
  )
}

export default Home
