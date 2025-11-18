"use client";

import Link from "next/link";
import "./styles.css"
import { useEffect, useRef, useState } from "react";
import { addresssExists } from "./api";


export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (inputRef.current && inputRef.current.value !== search) {
      setSearch(inputRef.current.value);
    }
  }, [search]);
  
  function searchHandler() {
    addresssExists(search).then((res) => {
      if (res === true) {
        globalThis.location.href = "/board/" + search + "/workers"
      }
    })
  }
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
      overflow: "hidden"
    }}>
      <h1 style={{
        marginBottom: "2rem",
        fontWeight: 800,
      }}>Statistiques - Pool Chauffagistes</h1>
      <p style={{
        marginBottom: "5rem"
      }}>Vous êtes sur la page d&apos;accueil du dashboard de statistiques des Chauffagistes. Consultez les statistiques de votre user et de tous les workers connectés.</p>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px"
      }}>
        <input style={{
          padding: "5px 10px",
          fontSize: "1rem",
          borderRadius: "0.5rem",
          border: "1px solid var(--card-outline-color)",
          backgroundColor: "var(--input-background-color)",
        }} type="text" autoFocus={true} capture={"environment"} placeholder="Adresse Bitcoin"
        onChange={(e) => setSearch(e.target.value)} ref={inputRef} value={search}/>
        <button className="secondary" onClick={searchHandler} style={{color: "var(--orange)", fontWeight: 600}}>
          Rechercher
        </button>
      </div>
      <p>Ou</p>
      <Link href="board/bc1qh8ge36h2njrp2aqv5ddpyph4g22elzgkds52ae/workers" style={{
        marginBottom: "3rem"
      }}>
        <button className="primary" style={{
          fontSize: "1rem",
        }}>
          <p>Voir les stats de la pool communautaire</p>
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
