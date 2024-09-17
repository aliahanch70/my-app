import Link from "next/link";
// import BridgeComponent from "../components/BridgeComponent";
// import SwapComponent from "../components/SwapComponent";

export default function Home() {
  return (
    <>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Arb'} >Arb</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Etc'} >Etc</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Etcp'} >Etcp</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/FindEth'} >FindEth</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Eth2'} >Eth2</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Eth3'} >Eth3</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Eth4'} >Eth4</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Eth5'} >Eth5</Link>
      </button>
      <button className="bg-gray-100 m-4 p-2">
        <Link href={'/Eth5turbo'} >Eth5turbo</Link>
      </button>
      <h1>My Swap and Bridge Site</h1>
            {/* <SwapComponent />
            <BridgeComponent /> */}
    </>
  );
}
