import Link from "next/link";
import "./styles.css"

export default function Home() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "1rem",
      height: "100dvh",
      padding: "2rem",
      backgroundColor: "var(--background)",
    }}>
      <h1 style={{
        marginBottom: "2rem",
        fontWeight: 800,
      }}>Minage mutualisé des Chauffagistes</h1>
      <p style={{
        marginBottom: "5rem"
      }}>Vous êtes sur la page d&apos;accueil du dashboard de statistiques des Chauffagistes. Consultez les statistiques de votre user et de tous les workers connectés.</p>
      <Link href="board/workers" style={{
        marginBottom: "3rem"
      }}>
        <button className="primary" style={{
          fontSize: "1rem",
        }}>
          <p>Voir les stats de la pool</p>
        </button>
      </Link>
      <p style={{
        marginBottom: "0.1rem"
      }}>Ce n&apos;est pas ce que vous cherchiez ?</p>
      <p >Rendez-vous sur la page d&apos;accueil de la pool</p>
      <Link href="https://chauffagistes-pool.fr">
        <div style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: 20,
          width: "fit-content",
          margin: "0 auto"
        }}>
          <h3>Présentation générale de la Pool</h3>
          <p>Indépendant, et Français</p>
          <p>Solo mining ou mutualisé</p>
        </div>
      </Link>
    </div>
  );
}
