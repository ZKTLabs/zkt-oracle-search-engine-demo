import { ConnectButton } from '@rainbow-me/rainbowkit'
import { ReactNode } from 'react'

import Zkt from '~icons/zkt-icons/zkt'

export const Header = ({ action }: { action?: ReactNode }) => {
  return (
    <div className="h-16 border-b-1 border-white box-border">
      <div className="container m-auto h-full flex justify-between items-center sm:px-8 lt-sm:px-4">
        <div className="flex-center gap-2">
          <Zkt className="w-8 h-8" />
          <span className="capitalize text-xl font-600">swap hook</span>
        </div>

        <ConnectButton />
      </div>
    </div>
  )
}
