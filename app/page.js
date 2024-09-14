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
        <Link href={'/Etcultra'} >Etcultra</Link>
      </button>
      <h1>My Swap and Bridge Site</h1>
            {/* <SwapComponent />
            <BridgeComponent /> */}
    </>
  );
}
