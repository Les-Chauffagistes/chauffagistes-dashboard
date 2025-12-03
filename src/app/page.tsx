"use client";

import Link from "next/link";
import "./styles.css"
import { useEffect, useRef, useState } from "react";
import { addresssExists } from "./api";
import GoToCommunityPool from "./components/GoToCommunityPool";
import ThemeBody from "./ThemeBody";


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
    <ThemeBody className={""}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        minHeight: "100dvh",
        overflow: "auto",
        backgroundColor: "var(--background)"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          flex: "1 0 auto"
        }}>


          <h1 style={{
            fontWeight: 800,
            margin: "30px 0 30px"
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
              onChange={(e) => setSearch(e.target.value)} ref={inputRef} value={search} />
            <button className="secondary" onClick={searchHandler} style={{ color: "var(--orange)", fontWeight: 600 }}>
              Rechercher
            </button>
          </div>
          <p style={{ margin: 10 }}>Ou</p>
          <GoToCommunityPool />
          <p style={{
            marginBottom: "0.1rem"
          }}>Ce n&apos;est pas ce que vous cherchiez ?</p>
          <p >Rendez-vous sur la page d&apos;accueil de la pool</p>
          <Link href="https://chauffagistes-pool.fr">
            <div style={{
              borderTopLeftRadius: 50,
              borderBottomLeftRadius: 50,
              borderTopRightRadius: 30,
              borderBottomRightRadius: 30,
              width: "fit-content",
              margin: "10px auto",
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(180deg, #eda042ff 0%, var(--orange) 100%)",
              //border: "1px solid var(--orange)",
              gap: 10,
              paddingRight: 20,
            }}>
            <img src="/icon-round.png" style={{ width: "100px", height: "100px" }} />
            <div>
              <h2 style={{
                marginBottom: "0.2rem",
                color: "var(--background)"
              }}>Présentation générale de la Pool</h2>
              <p>Indépendant, et Français</p>
              <p>Solo mining — Mutualisé privé — Mutualisé communautaire</p>
            </div>
            </div>
          </Link>
        </div >
      </div >
    </ThemeBody>
  );
}
