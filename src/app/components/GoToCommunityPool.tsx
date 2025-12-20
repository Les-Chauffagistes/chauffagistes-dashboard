import Link from "next/link";
import { COMMUNITY_POOL_ADDRESS } from "../constants/columns";


export default function GoToCommunityPool() {
    return (
        <Link href={`/board/${COMMUNITY_POOL_ADDRESS}/workers`} style={{
        }}>
            <button className="primary" style={{
                fontSize: "1rem",
            }}>
                <p>Voir les stats de la pool communautaire</p>
            </button>
        </Link>
    )
}