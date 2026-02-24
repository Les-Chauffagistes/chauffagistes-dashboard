"use client";

import { useRef } from "react";

export default function CreateAccount({ continueHandler }: { continueHandler: (username: string) => void }) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="create-account">
            <div className="create-account-inner">
                <h2>Bienvenue chez les <span>Chauffagistes</span></h2>
                <p>Choisissez un pseudo pour votre compte. Il sera visible publiquement sur le pool.</p>
                <div className="create-account-field">
                    <label htmlFor="pseudo-input">Pseudo public</label>
                    <input
                        id="pseudo-input"
                        type="text"
                        placeholder="Heatman"
                        ref={inputRef}
                    />
                    <p className="create-account-hint">Conseil : utilisez un pseudo qui ne permet pas de vous identifier.</p>
                    <button
                        className="primary"
                        onClick={() => {
                            if (inputRef.current) continueHandler(inputRef.current.value);
                        }}
                    >
                        Continuer
                    </button>
                </div>
            </div>
        </div>
    );
}
