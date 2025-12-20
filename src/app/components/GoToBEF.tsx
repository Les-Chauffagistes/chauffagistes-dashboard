import Link from "next/link";


export default function GoToBEF() {
    return (
        <Link href={`/board/bc1qhj2qnsw9f9wwkpru4rvkccxe5k2k80t8s7wd0md5h5tu5ew8ag2qlfamel/workers`} style={{
            width: "100%"
        }}>
            <button className="secondary" style={{
                fontSize: "1rem",
                width: "100%"
            }}>
                <p>Voir les stats du BEF</p>
            </button>
        </Link>
    )
}