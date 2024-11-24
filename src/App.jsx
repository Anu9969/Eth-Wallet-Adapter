// import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [posts, setPosts] = useState([])

//   async function getPosts(){
//     const res = await fetch('https://jsonplaceholder.typicode.com/posts')
//     const json = await res.json()
//     setPosts(json)
//   }

//   useEffect(() => {
//     getPosts()
//   }, [])

//   return (
//  <>
//     <div className="App">
//       {/* {JSON.stringify(posts)} */}
//       {posts.map(post => <div key={post.id}>{post.title} </div>)}
//     </div>

//  </>
//   )
// }

// export default App

// import { createPublicClient, http } from 'viem'
// import { mainnet, sepolia } from 'viem/chains'
// import './App.css'

// const client = createPublicClient({ 
//   chain: sepolia, 
//   transport: http(), 
// }) 

// function App(){

//     async function getBalance(){
//         const res = await client.getBalance({ address: "0x4D3C86568FcAc2a3aCF0F6db1C9379b766126600" })
//         const balanceInEth = Number(res) / Math.pow(10, 18)
//         console.log(res)
//         console.log(balanceInEth.toFixed(2))
        
//     }

//   return(
//     <div>
//       <button onClick = {getBalance}> Get Balance </button>
//     </div>
//   )
// }

// export default App




///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


// import React from 'react'
// import { http, createConfig } from 'wagmi'
// import { mainnet, sepolia } from 'wagmi/chains'

// export const config = createConfig({
//   chains: [mainnet, sepolia],
//   transports: {
//     [mainnet.id]: http(),
//     [sepolia.id]: http(),
//   },
// })


// function App() {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <WalletConnector/>
//         <EthSend />
//       </QueryClientProvider>
//     </WagmiProvider>
//   )
// }

// function WalletConnector(){
// const { connectors, connect} = useConnect()

//   return(
//     connectors.map((connector) => (
//       <button key= {connector.uid} onClick ={() => connect({connector})}>
//         {connector.name}
//       </button>
//     ))
//   )
// }

// function EthSend(){
//   return(
//     <div>
//       <input type="text" placeholder="Enter Address" />
//       <button>Send 0.1 ETH</button>
//     </div>
//   )
// }

// export default App



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useConnect, useAccount, useBalance, useSendTransaction } from 'wagmi'
import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

const queryClient = new QueryClient()

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

function WalletConnector() {
  const { connectors, connect } = useConnect()

  return (
    <div className="flex gap-2 mb-6">
      {connectors.map((connector) => (
        <button 
          key={connector.uid} 
          onClick={() => connect({ connector })}
          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
        >
          {connector.name}
        </button>
      ))}
    </div>
  )
}

function EthSend() {
  const [toAddress, setToAddress] = React.useState('')
  const { data: hash, sendTransaction } = useSendTransaction()

  function sendEth() {
    sendTransaction({
      to: toAddress,
      value: "100000000000000000" // 17 0s = 0.1 ETH
    })
  }

  return (
    <div className="flex flex-col gap-3 mb-6">
      <input 
        type="text" 
        placeholder="Enter Address" 
        value={toAddress}
        onChange={(e) => setToAddress(e.target.value)}
        className="border border-gray-700 bg-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400"
      />
      <button 
        onClick={sendEth}
        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl font-semibold"
      >
        Send 0.1 ETH
      </button>
    </div>
  )
}

function MyAddress() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({
    address: address
  })

  if (!isConnected) {
    return <p className="text-red-400 text-center font-medium">Connect your wallet first</p>
  }

  return (
    <div className="bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700 backdrop-blur-sm">
      <h1 className="text-2xl font-bold mb-4 text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 inline-block text-transparent bg-clip-text">My Wallet</h1>
      <p className="text-gray-400 break-all mb-4">{address}</p>
      <p className="text-xl font-semibold">
        <span className="text-gray-400">Balance: </span>
        <span className="bg-gradient-to-r from-cyan-500 to-blue-500 inline-block text-transparent bg-clip-text">
          {balance?.formatted} {balance?.symbol}
        </span>
      </p>
    </div>
  )
}

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="container mx-auto max-w-2xl p-8">
            <h1 className="text-4xl font-bold text-center mb-12 text-white">
              Web3 <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 inline-block text-transparent bg-clip-text">Wallet</span>
            </h1>
            <WalletConnector />
            <EthSend />
            <MyAddress />
          </div>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App