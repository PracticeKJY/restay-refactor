import { useRecoilValue } from "recoil"
import { nameAtom } from "./@recoil/store/state"

export default function Home() {
  const test = useRecoilValue(nameAtom)
  return (
    <>
      <div>안녕? 나는{test}야</div>
    </>
  )
}
