import { Header } from '@/components/layout/Header'

const Home = () => {
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
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-5 font-500">
              <span>$409,661</span>
              <span>
                <span>Balance: </span>
                <span className="">0.208</span>
                <span>Max</span>
              </span>
            </div>
          </div>

          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex-col-center border-4 box-border border-solid border-white rounded-lg bg-#f9f9f9 cursor-pointer">
            <span className="i-lucide:arrow-down"></span>
          </span>

          <div className="px-4 py-4 space-y-2 rounded-lg border-transparent [&:has(input:focus)]:border-border border-1px border-solid bg-#f9f9f9">
            <div className="text-sm text-gray-5 font-500">You receive</div>
            <div className="flex justify-between">
              <Input
                placeholder="0"
                className="p-0 text-3xl border-none font-600 !shadow-[none] outline-none bg-transparent"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-gray-5 font-500">
              <span>$409,661</span>
              <span>
                <span>Balance: </span>
                <span className="">0.208</span>
                <span>Max</span>
              </span>
            </div>
          </div>
        </div>

        <button className="mt-1 w-full h-14 flex-col-center rounded-lg bg-#f9f9f9 active:bg-accent transition-all text-5 font-600 text-gray-4">
          Swap
        </button>
      </div>
    </>
  )
}

export default Home
