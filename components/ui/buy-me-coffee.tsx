'use client'

import { Coffee } from 'lucide-react'
import { Button } from './button'

export function BuyMeCoffee() {
  const handleClick = () => {
    window.open('https://buymeacoffee.com/lhbmdjk', '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      onClick={handleClick}
      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
      size="lg"
    >
      <Coffee className="w-5 h-5 mr-2" />
      Buy me a coffee
    </Button>
  )
}

export function BuyMeCoffeeFloating() {
  const handleClick = () => {
    window.open('https://buymeacoffee.com/lhbmdjk', '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleClick}
        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-full"
        size="lg"
      >
        <Coffee className="w-5 h-5 mr-2" />
        후원하기
      </Button>
    </div>
  )
} 