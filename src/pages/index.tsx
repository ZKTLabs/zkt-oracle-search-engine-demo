import { useMutation } from '@tanstack/react-query'
import { toast, Toaster } from 'sonner'

import { ENGINE_ABI } from '@/abi/zkt'
import { Header } from '@/components/layout/Header'
import { JsonViewer } from '@/components/layout/JsonViewer'
import { cn } from '@/lib/utils'
import { readDataFromContract } from '@/utils/viem'

const ENGINE_ADDRESS = '0xFfE315080888256671d88639D2F14064946bea5f' as const

const Home = () => {
  const [address, setAddress] = useState('')
  const [isBlack, setIsBlack] = useState<boolean>()
  const [loading, setLoading] = useState(false)
  const searchMu = useMutation({
    mutationKey: [address],
    mutationFn: async (search: string) => {
      const res = await fetch(`https://api.gopluslabs.io/api/v1/address_security/${search}`)
      return await res.json()
    },
  })

  const searchHandler = useCallback(async () => {
    if (!address) {
      toast.error('Please enter an address')
      return
    }

    if (searchMu.isPending) return

    if (loading) return

    setIsBlack(undefined)
    setLoading(true)

    try {
      const res = (await readDataFromContract(ENGINE_ADDRESS, ENGINE_ABI, 'isBlacklist', [
        address,
      ])) as unknown as boolean
      setIsBlack(res)
      if (res === false) {
        setLoading(false)
        return
      }
    } catch (error: any) {
      toast.error(error)
      setLoading(false)
      return
    }

    await searchMu.mutateAsync(address)
    setLoading(false)
  }, [address, loading, searchMu])

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto mt-10 sm:px-8 lt-sm:px-4 font-$rk-fonts-body">
        <div className="max-w-2xl mx-auto flex-center border-input border-1 border-solid rounded-lg overflow-hidden">
          <Input
            className="mr-4 h-10 text-base border-none !shadow-[none] outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Select defaultValue="evm">
            <SelectTrigger className="w-36 h-10 border-y-none border-r-none rounded-none !shadow-[none] outline-none">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="evm">Ethereum</SelectItem>
                <SelectItem value="sol">Solana</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <div
            className={cn('h-10 px-3 flex-col-center bg-primary cursor-pointer', loading && 'bg-primary/70')}
            onClick={searchHandler}
          >
            {loading ? (
              <span className="w-4 h-4 text-white animate-spin i-lucide:loader-circle"></span>
            ) : (
              <span className="w-4 h-4 text-white i-lucide-search"></span>
            )}
          </div>
        </div>
        {typeof isBlack === 'boolean' && (
          <div className="mt-4">
            {isBlack ? (
              <JsonViewer data={searchMu.data ?? {}} />
            ) : (
              <div className="text-center text-gray-5 font-bold"> This address is not in the blacklist.</div>
            )}
          </div>
        )}
      </div>

      <Toaster richColors position="top-right" />
    </>
  )
}

export default Home
